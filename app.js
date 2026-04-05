require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');

const cityRoutes    = require('./routes/cities');
const gymRoutes     = require('./routes/gyms');
const authRoutes    = require('./routes/auth');
const codeRoutes    = require('./routes/codes');
const adminRoutes   = require('./routes/admin');

const app = express();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json());

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Çok fazla istek. Lütfen bekleyin.' },
}));

// Routes
app.use('/api/cities',  cityRoutes);
app.use('/api/gyms',    gymRoutes);
app.use('/api/auth',    authRoutes);
app.use('/api/codes',   codeRoutes);
app.use('/api/admin',   adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Endpoint bulunamadı.' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Sunucu hatası.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`SportMap API → http://localhost:${PORT}`));
