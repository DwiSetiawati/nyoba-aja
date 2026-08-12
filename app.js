// app.js
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const requestLogger = require("./middleware/logger");
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View Engine ----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---- Middleware bawaan Express ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- Session (untuk fitur login) ----
// express-session akan mengirim cookie "connect.sid" ke browser. Selama
// cookie itu valid, req.session akan otomatis berisi data yang sama
// yang kita simpan waktu login (lihat controllers/authController.js).
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 jam
    },
  })
);

// Supaya semua view (termasuk partial navbar) tahu status login user,
// tanpa harus manual passing di tiap res.render()
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!(req.session && req.session.isLoggedIn);
  next();
});

// ---- Middleware custom (logger) ----
app.use(requestLogger);

// ---- Static files ----
app.use(express.static(path.join(__dirname, "public")));

// ---- Routing ----
app.use("/", webRoutes);
app.use("/api", apiRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).send("404 - Halaman tidak ditemukan");
});

app.listen(PORT, () => {
  console.log(`Server Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
