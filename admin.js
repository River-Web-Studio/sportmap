const router = require('express').Router();
const pool   = require('../../config/db');
const { requireAdmin } = require('../middleware/auth');

// Tüm admin route'ları için admin yetkisi zorunlu
router.use(requireAdmin);

// --- ŞEHİRLER ---

// GET /api/admin/cities
router.get('/cities', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM cities ORDER BY name');
  res.json(rows);
});

// POST /api/admin/cities
router.post('/cities', async (req, res) => {
  const { name, slug, lat, lng } = req.body;
  if (!name || !slug || !lat || !lng) return res.status(400).json({ error: 'Tüm alanlar gerekli.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO cities (name,slug,lat,lng) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, slug, lat, lng]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Bu slug zaten kullanımda.' });
    res.status(500).json({ error: 'Şehir eklenemedi.' });
  }
});

// PATCH /api/admin/cities/:id
router.patch('/cities/:id', async (req, res) => {
  const { name, slug, lat, lng, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE cities SET
         name=COALESCE($1,name), slug=COALESCE($2,slug),
         lat=COALESCE($3,lat), lng=COALESCE($4,lng),
         is_active=COALESCE($5,is_active)
       WHERE id=$6 RETURNING *`,
      [name, slug, lat, lng, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Şehir bulunamadı.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Şehir güncellenemedi.' });
  }
});

// --- SPOR MERKEZLERİ ---

// GET /api/admin/gyms
router.get('/gyms', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT g.*, c.name AS city_name FROM gyms g JOIN cities c ON c.id=g.city_id ORDER BY g.id`
  );
  res.json(rows);
});

// POST /api/admin/gyms
router.post('/gyms', async (req, res) => {
  const { city_id, name, owner_name, description, address, phone, website,
          lat, lng, google_rating, google_count, google_place_id,
          working_hours, services, discount_pct } = req.body;

  if (!city_id || !name || !address || !lat || !lng) {
    return res.status(400).json({ error: 'city_id, name, address, lat, lng zorunlu.' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO gyms
         (city_id, name, owner_name, description, address, phone, website,
          lat, lng, google_rating, google_count, google_place_id,
          working_hours, services, discount_pct)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [city_id, name, owner_name, description, address, phone, website,
       lat, lng, google_rating, google_count, google_place_id,
       JSON.stringify(working_hours || {}), services || [], discount_pct || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Spor merkezi eklenemedi.' });
  }
});

// PUT /api/admin/gyms/:id
router.put('/gyms/:id', async (req, res) => {
  const { name, owner_name, description, address, phone, website,
          lat, lng, google_rating, google_count, working_hours,
          services, discount_pct, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE gyms SET
         name=COALESCE($1,name), owner_name=COALESCE($2,owner_name),
         description=COALESCE($3,description), address=COALESCE($4,address),
         phone=COALESCE($5,phone), website=COALESCE($6,website),
         lat=COALESCE($7,lat), lng=COALESCE($8,lng),
         google_rating=COALESCE($9,google_rating), google_count=COALESCE($10,google_count),
         working_hours=COALESCE($11,working_hours), services=COALESCE($12,services),
         discount_pct=COALESCE($13,discount_pct), is_active=COALESCE($14,is_active)
       WHERE id=$15 RETURNING *`,
      [name, owner_name, description, address, phone, website,
       lat, lng, google_rating, google_count,
       working_hours ? JSON.stringify(working_hours) : null,
       services, discount_pct, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Spor merkezi bulunamadı.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Güncelleme başarısız.' });
  }
});

// DELETE /api/admin/gyms/:id (soft delete)
router.delete('/gyms/:id', async (req, res) => {
  await pool.query('UPDATE gyms SET is_active=false WHERE id=$1', [req.params.id]);
  res.json({ message: 'Spor merkezi pasife alındı.' });
});

// --- İSTATİSTİKLER ---

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [users, gyms, cities, codes, usedCodes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role=\'user\''),
      pool.query('SELECT COUNT(*) FROM gyms WHERE is_active=true'),
      pool.query('SELECT COUNT(*) FROM cities WHERE is_active=true'),
      pool.query('SELECT COUNT(*) FROM discount_codes'),
      pool.query('SELECT COUNT(*) FROM discount_codes WHERE is_used=true'),
    ]);
    res.json({
      total_users:       parseInt(users.rows[0].count),
      total_gyms:        parseInt(gyms.rows[0].count),
      total_cities:      parseInt(cities.rows[0].count),
      total_codes:       parseInt(codes.rows[0].count),
      used_codes:        parseInt(usedCodes.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
});

module.exports = router;
