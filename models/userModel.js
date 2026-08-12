// models/userModel.js
//
// Model akun admin/kasir. Sesuai PRD: tidak perlu registrasi publik,
// cukup 1 akun admin yang di-seed lewat .env. Password disimpan sebagai
// HASH bcrypt (bukan plain text) baik di .env maupun di memori.

const bcrypt = require("bcryptjs");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Mengecek apakah username & password yang dikirim user cocok dengan admin.
// bcrypt.compareSync akan hash ulang password yang diinput lalu
// membandingkannya dengan hash yang tersimpan -> password asli tidak
// pernah dibandingkan sebagai teks polos.
function validateCredentials(username, password) {
  if (username !== ADMIN_USERNAME) return false;
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

module.exports = { validateCredentials };
