const router = require('express').Router();
const pool   = require('../../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const codeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 saat
  max: 5,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Saatte en fazla 5 kod üretebilirsiniz.' },
});

// Benzersiz kod üretici: SPT + 6 alfanümerik
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SPT';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/codes/generate
// Body: { gym_id }
router.post('/generate', requireAuth, codeLimiter, async (req, res) => {
  const { gym_id } = req.body;
  if (!gym_id) return res.status(400).json({ error: 'gym_id gerekli.' });

  try {
    // Gym var mı ve indirim var mı?
    const { rows: gymRows } = await pool.query(
      'SELECT id, name, discount_pct FROM gyms WHERE id=$1 AND is_active=true',
      [gym_id]
    );
    if (!gymRows.length) return res.status(404).json({ error: 'Spor merkezi bulunamadı.' });
    const gym = gymRows[0];
    if (gym.discount_pct === 0) return res.status(400).json({ error: 'Bu merkez için indirim mevcut değil.' });

    // Kullanıcının bu gym için kullanılmamış aktif kodu var mı?
    const ttl = parseInt(process.env.DISCOUNT_CODE_TTL_HOURS || '24');
    const existing = await pool.query(
      `SELECT code, expires_at FROM discount_codes
       WHERE user_id=$1 AND gym_id=$2 AND is_used=false AND expires_at > NOW()`,
      [req.user.id, gym_id]
    );
    if (existing.rows.length) {
      // Mevcut kodu döndür
      return res.json({
        code: existing.rows[0].code,
        discount_pct: gym.discount_pct,
        gym_name: gym.name,
        expires_at: existing.rows[0].expires_at,
        is_new: false,
      });
    }

    // Yeni kod üret (çakışma ihtimaline karşı döngü)
    let code, attempts = 0;
    do {
      code = generateCode();
      attempts++;
      const check = await pool.query('SELECT id FROM discount_codes WHERE code=$1', [code]);
      if (!check.rows.length) break;
    } while (attempts < 10);

    const expiresAt = new Date(Date.now() + ttl * 3600 * 1000);
    await pool.query(
      `INSERT INTO discount_codes (user_id, gym_id, code, discount_pct, expires_at)
       VALUES ($1,$2,$3,$4,$5)`,
      [req.user.id, gym_id, code, gym.discount_pct, expiresAt]
    );

    res.status(201).json({
      code,
      discount_pct: gym.discount_pct,
      gym_name: gym.name,
      expires_at: expiresAt,
      is_new: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kod üretilemedi.' });
  }
});

// GET /api/codes/my — kullanıcının tüm kodları
router.get('/my', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT dc.code, dc.discount_pct, dc.is_used, dc.used_at, dc.expires_at, dc.created_at,
              g.name AS gym_name, g.address AS gym_address
       FROM discount_codes dc
       JOIN gyms g ON g.id = dc.gym_id
       WHERE dc.user_id=$1
       ORDER BY dc.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Kodlar alınamadı.' });
  }
});

// POST /api/codes/redeem — kodu kullan (spor merkezi personeli / admin)
router.post('/redeem', requireAdmin, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Kod gerekli.' });

  try {
    const { rows } = await pool.query(
      `SELECT dc.*, g.name AS gym_name, u.full_name AS user_name, u.email AS user_email
       FROM discount_codes dc
       JOIN gyms g ON g.id=dc.gym_id
       JOIN users u ON u.id=dc.user_id
       WHERE dc.code=$1`,
      [code.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ error: 'Kod bulunamadı.' });
    const dc = rows[0];

    if (dc.is_used) return res.status(409).json({ error: 'Bu kod daha önce kullanılmış.', used_at: dc.used_at });
    if (new Date(dc.expires_at) < new Date()) return res.status(410).json({ error: 'Kodun süresi dolmuş.' });

    await pool.query(
      'UPDATE discount_codes SET is_used=true, used_at=NOW() WHERE id=$1',
      [dc.id]
    );

    res.json({
      message: 'Kod başarıyla kullanıldı.',
      discount_pct: dc.discount_pct,
      gym_name: dc.gym_name,
      user_name: dc.user_name,
      user_email: dc.user_email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kod kullanılamadı.' });
  }
});

module.exports = router;
