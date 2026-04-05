// Admin kullanıcısı oluşturma scripti
// Çalıştır: node src/utils/seedAdmin.js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const pool   = require('../../config/db');

async function seed() {
  try {
    const email    = process.env.ADMIN_EMAIL    || 'admin@sportmap.tr';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';
    const name     = 'SportMap Admin';

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1,$2,$3,'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash=$3`,
      [name, email, hash]
    );
    console.log(`✅ Admin oluşturuldu: ${email} / ${password}`);
    console.log('⚠️  Lütfen production ortamında şifreyi değiştirin!');
  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
