-- SportMap TR — Örnek Veriler (Düzce)

INSERT INTO cities (name, slug, lat, lng) VALUES
  ('Düzce', 'duzce', 40.8438, 31.1565),
  ('İstanbul', 'istanbul', 41.0082, 28.9784),
  ('Ankara', 'ankara', 39.9334, 32.8597);

INSERT INTO gyms (city_id, name, owner_name, description, address, phone, lat, lng,
  google_rating, google_count, google_place_id, working_hours, services, discount_pct) VALUES

(1, 'NF Gym', 'NF Grup A.Ş.',
 'Düzce''nin en büyük spor salonu. Geniş ekipman yelpazesi ve sauna ile hizmetinizdeyiz.',
 'Kiremitocağı Mah. İstanbul Cd. No:123, 81010 Düzce',
 '+90 380 524 77 07',
 40.8402, 31.1437, 4.5, 269, 'ChIJU8D0k1B1nUARV-0SRzXIqF8',
 '{"mon":"00:00-23:59","tue":"00:00-23:59","wed":"00:00-23:59","thu":"00:00-23:59","fri":"00:00-23:59","sat":"00:10-21:30","sun":"10:30-21:30"}',
 ARRAY['Fitness','Sauna','Ağırlık','Kardio','Duş'], 15),

(1, 'RD Gym', 'Recep Demir',
 'Birebir kişisel antrenman ve diyet programlarıyla sonuç odaklı çalışıyoruz. Tertemiz, hijyenik ortam.',
 'Yeni Mah. Hürriyet Cad. 16/C, 81100 Düzce',
 '+90 553 849 65 81',
 40.8507, 31.1547, 5.0, 118, 'ChIJ4QkbEHKfnUARLO75bVqXyXQ',
 '{"mon":"06:00-23:30","tue":"06:00-23:30","wed":"06:00-23:30","thu":"06:00-23:30","fri":"06:00-23:30","sat":"06:00-23:30","sun":"Kapalı"}',
 ARRAY['Birebir PT','Diyet Programı','Pilates','Fitness','Grup Dersleri'], 20),

(1, 'ProFit Club', 'Haktan Yılmaz',
 'Lüks ortam, güler yüzlü ekip. Kickboks ve grup dersleri de mevcuttur.',
 'Kültür Mah. 765. Sk., 81320 Düzce',
 '+90 530 681 78 87',
 40.8427, 31.1580, 5.0, 50, 'ChIJx1jOLg51nUAR0NrTXv8SnXY',
 '{"mon":"08:00-23:00","tue":"08:00-23:00","wed":"08:00-23:00","thu":"08:00-23:00","fri":"08:00-23:00","sat":"08:00-22:00","sun":"10:00-20:00"}',
 ARRAY['Fitness','Kickboks','Grup Dersleri','Beslenme Danışmanlığı','Dükkan'], 10),

(1, 'Düzce Sports Academy', 'Spor Akademisi Ltd.',
 'Geniş spor alanı, profesyonel eğitmenler. Beslenme danışmanlığı dahil.',
 'Şerefiye Mah. Gaziantep Cad. Kavaoğlu İş Merkezi, 81010 Düzce',
 '+90 506 649 75 00',
 40.8395, 31.1604, 3.9, 87, 'ChIJzcohxVp1nUARWRXNWcpUK5U',
 '{"mon":"08:30-22:30","tue":"08:30-22:30","wed":"08:30-22:30","thu":"08:30-22:30","fri":"08:30-22:30","sat":"11:30-20:30","sun":"13:00-18:00"}',
 ARRAY['Fitness','Grup Dersleri','Beslenme Danışmanlığı'], 25),

(1, 'Goldfit 81 Fitness', 'Goldfit Spor Ltd.',
 'Aile dostu, dövüş sanatları ve fitness bir arada. Her kata farklı ekipman.',
 'Çay Mah. Saatçigil Cd. No:35/A, 81020 Düzce',
 '+90 541 472 10 31',
 40.8372, 31.1561, 4.8, 85, 'ChIJJ8zQIVh1nUARZg0Dqn20FZc',
 '{"mon":"08:30-23:00","tue":"08:30-23:00","wed":"08:30-23:00","thu":"08:30-23:00","fri":"08:30-23:00","sat":"08:30-23:00","sun":"10:00-19:30"}',
 ARRAY['Fitness','Dövüş Sanatları','Aile Üyeliği','Kardio'], 15),

(1, 'Düzce Gençlik Merkezi', 'T.C. Gençlik ve Spor Bakanlığı',
 'Gençlere yönelik spor ve kültürel etkinlikler. Taekwondo, halk dansları ve daha fazlası.',
 'Kiremitocağı Mah. 693. Sk. No:1, 81020 Düzce',
 '+90 380 512 20 13',
 40.8375, 31.1454, 4.1, 103, 'ChIJx9KWjF91nUARZLG2X5utEvE',
 '{"mon":"08:30-17:30","tue":"08:30-17:30","wed":"08:30-17:30","thu":"08:30-17:30","fri":"08:30-17:30","sat":"Kapalı","sun":"Kapalı"}',
 ARRAY['Gençlik Aktiviteleri','Taekwondo','Halk Dansları','Kurslar'], 0),

(1, 'GH Fitness Club', 'Gökhan Hakan Yıldız',
 '25 yıllık tecrübe ile Düzce''nin en köklü fitness kulübü. Sauna ve özel soyunma kabinleri.',
 'Camikebir Mah. İstanbul Cd. No:49/1, 81010 Düzce',
 '+90 380 502 00 22',
 40.8402, 31.1539, 4.4, 34, 'ChIJA2HSKtp1nUARfW6DQ8G2Cro',
 '{"mon":"08:00-23:00","tue":"08:00-23:00","wed":"08:00-23:00","thu":"08:00-23:00","fri":"08:00-23:00","sat":"10:00-20:00","sun":"10:00-20:00"}',
 ARRAY['Fitness','Sauna','Kişisel Antrenör','Duş & Soyunma'], 20);

-- Google yorumları (örnek)
INSERT INTO reviews (gym_id, author, rating, comment, source) VALUES
(1, 'Ahmet K.', 5, 'Şehrin en büyük salonu, ekipmanlar yeterli. Sauna harika.', 'google'),
(1, 'Mehmet Y.', 4, 'Dost canlısı personel, rahat ortam.', 'google'),
(2, 'Fatma S.', 5, 'Recep hoca 5 yıldır antrenörüm, çok memnunum.', 'google'),
(2, 'Ali R.', 5, 'Tertemiz, aile ortamı var. 12 kg verdim.', 'google'),
(3, 'Zeynep A.', 5, 'Haktan beyin ilgisi harikaydı.', 'google'),
(4, 'Osman T.', 4, 'Ekipmanlar kaliteli, eğitmenler ilgili.', 'google'),
(5, 'Hüseyin B.', 5, 'Aile ortamı var, dövüş antrenmanları muhteşem.', 'google'),
(6, 'Elif D.', 4, 'Taekwondo dersleri harika.', 'google'),
(7, 'Murat G.', 5, 'Düzce''nin en profesyonel ekibi. 25 yıllık tecrübe yansıyor.', 'google');

-- Admin kullanıcısı (şifre: Admin123!)
-- bcrypt hash üretmek için: node -e "const b=require('bcrypt');b.hash('Admin123!',10).then(console.log)"
-- Aşağıdaki hash örnek amaçlıdır, gerçek hash'i npm run seed ile üretin
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Admin', 'admin@sportmap.tr', '$2b$10$example_hash_replace_with_real', 'admin');
