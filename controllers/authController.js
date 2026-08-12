// controllers/authController.js
const userModel = require("../models/userModel");

function login(req, res) {
  const { username, password } = req.body;

  // Validasi dasar: field tidak boleh kosong (validasi juga ada di
  // frontend, tapi backend WAJIB validasi ulang -- jangan percaya client)
  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username dan password wajib diisi",
    });
  }

  const valid = userModel.validateCredentials(username, password);

  if (!valid) {
    return res.status(401).json({
      status: "error",
      message: "Username atau password salah",
    });
  }

  // Simpan status login di session. express-session otomatis mengirim
  // cookie session id ke browser, jadi request berikutnya dari browser
  // yang sama akan otomatis "dikenali" sudah login.
  req.session.isLoggedIn = true;
  req.session.username = username;

  res.status(200).json({
    status: "success",
    message: "Login berhasil",
  });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal logout, coba lagi",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({
      status: "success",
      message: "Logout berhasil",
    });
  });
}

module.exports = { login, logout };
