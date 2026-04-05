-- SportMap TR — Veritabanı Şeması
-- PostgreSQL 14+

-- Şehirler
CREATE TABLE cities (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  slug      VARCHAR(100) NOT NULL UNIQUE,
  lat       DECIMAL(9,6) NOT NULL,
  lng       DECIMAL(9,6) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spor merkezleri
CREATE TABLE gyms (
  id            SERIAL PRIMARY KEY,
  city_id       INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  owner_name    VARCHAR(200),
  description   TEXT,
  address       TEXT NOT NULL,
  phone         VARCHAR(30),
  website       VARCHAR(300),
  lat           DECIMAL(9,6) NOT NULL,
  lng           DECIMAL(9,6) NOT NULL,
  google_rating DECIMAL(2,1),
  google_count  INTEGER DEFAULT 0,
  google_place_id VARCHAR(200),
  working_hours JSONB,           -- { "mon":"06:00-23:00", "sun":"Kapalı", ... }
  services      TEXT[],          -- ['Fitness','Sauna','Pilates']
  photos        TEXT[],          -- URL dizisi
  discount_pct  INTEGER DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Kullanıcılar
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  full_name    VARCHAR(200) NOT NULL,
  email        VARCHAR(300) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  phone        VARCHAR(30),
  role         VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user','admin')),
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- İndirim kodları
CREATE TABLE discount_codes (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id     INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  code       VARCHAR(20) NOT NULL UNIQUE,
  discount_pct INTEGER NOT NULL,
  is_used    BOOLEAN DEFAULT false,
  used_at    TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Yorumlar (uygulama içi)
CREATE TABLE reviews (
  id         SERIAL PRIMARY KEY,
  gym_id     INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  author     VARCHAR(200),
  rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  source     VARCHAR(20) DEFAULT 'app' CHECK (source IN ('app','google')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refresh token'ları
CREATE TABLE refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_gyms_city    ON gyms(city_id);
CREATE INDEX idx_gyms_latng   ON gyms(lat, lng);
CREATE INDEX idx_codes_user   ON discount_codes(user_id);
CREATE INDEX idx_codes_gym    ON discount_codes(gym_id);
CREATE INDEX idx_codes_code   ON discount_codes(code);
CREATE INDEX idx_reviews_gym  ON reviews(gym_id);

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gyms_updated_at
  BEFORE UPDATE ON gyms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
