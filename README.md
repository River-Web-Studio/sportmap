# SportMap TR — Spor Merkezi Rehberi
 
Düzce'den başlayarak tüm Türkiye'ye yayılacak spor merkezi rehberi uygulaması.  
Harita üzerinde merkez keşfi, üye girişi ve indirim kodu sistemi içerir.
 
---
 
## Proje Yapısı
 
```
sportmap/
├── backend/          → Node.js + Express API
├── frontend/         → React uygulaması
└── docs/             → Veritabanı şeması ve API dokümantasyonu
```
 
---
 
## Hızlı Başlangıç
 
### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn
 
### 1. Veritabanı Kurulumu
```bash
psql -U postgres -c "CREATE DATABASE sportmap;"
psql -U postgres -d sportmap -f docs/schema.sql
psql -U postgres -d sportmap -f docs/seed.sql
```
 
### 2. Backend
```bash
cd backend
cp .env.example .env        # .env dosyasını düzenle
npm install
npm run dev                 # http://localhost:3001
```
 
### 3. Frontend
```bash
cd frontend
cp .env.example .env        # .env dosyasını düzenle
npm install
npm run dev                 # http://localhost:5173
```
 
---
 
## Özellikler
 
- 🗺️ Harita üzerinde spor merkezi görüntüleme (Leaflet.js)
- 🏋️ Merkez detayları: sahip, hizmetler, çalışma saatleri, yorumlar, Google puanı
- 👤 Kullanıcı kayıt & giriş (JWT)
- 🎟️ Tek kullanımlık indirim kodu üretme
- 📍 Google Maps yönlendirme linki
- 🏙️ Çok şehir desteği (admin panelden şehir eklenebilir)
- 🔐 Admin paneli (merkez yönetimi, kod takibi)
 
---
 
## Teknoloji Yığını
 
| Katman | Teknoloji |
|--------|-----------|
| Backend | Node.js, Express, JWT, bcrypt |
| Veritabanı | PostgreSQL, node-postgres (pg) |
| Frontend | React 18, Vite, React Router |
| Harita | Leaflet.js + OpenStreetMap |
| Stil | CSS Modules |
| Deploy | Railway / Render (backend), Vercel (frontend) |
 
