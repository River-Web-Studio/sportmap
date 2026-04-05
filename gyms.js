const router = require('express').Router();
const pool   = require('../../config/db');
const { optionalAuth } = require('../middleware/auth');

// GET /api/gyms?city=duzce&services=Sauna,Fitness
router.get('/', async (req, res) => {
  try {
    const { city, services } = req.query;
    let query = `
      SELECT g.id, g.name, g.owner_name, g.address, g.phone, g.lat, g.lng,
             g.google_rating, g.google_count, g.working_hours, g.services,
             g.photos, g.discount_pct, c.name AS city_name, c.slug AS city_slug
      FROM gyms g
      JOIN cities c ON c.id = g.city_id
      WHERE g.is_active = true`;
    const params = [];

    if (city) {
      params.push(city);
      query += ` AND c.slug = $${params.length}`;
    }

    if (services) {
      const list = services.split(',').map(s => s.trim());
      params.push(list);
      query += ` AND g.services && $${params.length}::text[]`;
    }

    query += ' ORDER BY g.google_rating DESC NULLS LAST';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Spor merkezleri alınamadı.' });
  }
});

// GET /api/gyms/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT g.*, c.name AS city_name, c.slug AS city_slug
       FROM gyms g JOIN cities c ON c.id=g.city_id
       WHERE g.id=$1 AND g.is_active=true`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Spor merkezi bulunamadı.' });

    const gym = rows[0];

    // Yorumları da getir
    const reviews = await pool.query(
      `SELECT r.id, r.author, r.rating, r.comment, r.source, r.created_at
       FROM reviews r
       WHERE r.gym_id=$1
       ORDER BY r.created_at DESC
       LIMIT 20`,
      [gym.id]
    );
    gym.reviews = reviews.rows;

    res.json(gym);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Spor merkezi detayı alınamadı.' });
  }
});

// POST /api/gyms/:id/reviews — yorum ekle (üye girişi zorunlu)
const { requireAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.post('/:id/reviews',
  requireAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').trim().isLength({ min: 5, max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // Kullanıcı zaten yorum yapmış mı?
      const exists = await pool.query(
        'SELECT id FROM reviews WHERE gym_id=$1 AND user_id=$2',
        [req.params.id, req.user.id]
      );
      if (exists.rows.length) return res.status(409).json({ error: 'Bu merkez için zaten yorum yaptınız.' });

      const { rows: userRows } = await pool.query('SELECT full_name FROM users WHERE id=$1', [req.user.id]);
      const { rating, comment } = req.body;

      await pool.query(
        `INSERT INTO reviews (gym_id, user_id, author, rating, comment, source)
         VALUES ($1,$2,$3,$4,$5,'app')`,
        [req.params.id, req.user.id, userRows[0].full_name, rating, comment]
      );
      res.status(201).json({ message: 'Yorum eklendi.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Yorum eklenemedi.' });
    }
  }
);

module.exports = router;
