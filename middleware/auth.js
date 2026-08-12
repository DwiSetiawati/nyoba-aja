// middleware/auth.js
//
// Dua middleware auth untuk dua konteks berbeda:
// 1. requireLoginPage -> dipakai di route HALAMAN (dashboard). Kalau belum
//    login, user di-redirect ke /login (karena ini request browser biasa).
// 2. requireLoginApi -> dipakai di route API (POST/PUT/DELETE produk).
//    Kalau belum login, balas JSON 401 (karena ini dipanggil lewat fetch,
//    bukan navigasi browser, jadi tidak masuk akal untuk redirect).

function requireLoginPage(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
}

function requireLoginApi(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  return res.status(401).json({
    status: "error",
    message: "Unauthorized, silakan login terlebih dahulu",
  });
}

module.exports = { requireLoginPage, requireLoginApi };
