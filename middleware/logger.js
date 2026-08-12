// middleware/logger.js
// Middleware custom sederhana (FR-08).
// Setiap request yang masuk akan dicatat di terminal: waktu, method, dan url-nya.
// Middleware di Express itu fungsi yang punya akses ke (req, res, next).
// Wajib panggil next() supaya request lanjut ke handler berikutnya (kalau lupa, request akan "menggantung").

function requestLogger(req, res, next) {
  const waktu = new Date().toLocaleString("id-ID");
  console.log(`[${waktu}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
