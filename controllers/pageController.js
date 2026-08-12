// controllers/pageController.js
//
// Controller untuk route yang me-render HALAMAN (bukan JSON).
// Data selalu diambil lewat productModel, supaya sinkron dengan data
// yang dipakai endpoint API.

const productModel = require("../models/productModel");

function renderBeranda(req, res) {
  const previewProducts = productModel.getAll().slice(0, 3);
  res.render("index", {
    title: "Beranda - Toko Sembako Ariesta",
    previewProducts,
  });
}

// Halaman /produk sekarang cuma "cangkang" -- datanya diisi lewat Fetch API
// di sisi client (public/js/produk.js), sesuai requirement Sprint 2.
function renderProdukPage(req, res) {
  res.render("produk", {
    title: "Produk - Toko Sembako Ariesta",
  });
}

function renderProdukDetail(req, res) {
  const id = Number(req.params.id);
  const produk = productModel.getById(id);

  res.render("produk-detail", {
    title: produk ? produk.name : "Produk Tidak Ditemukan",
    produk,
  });
}

function renderTanyaAI(req, res) {
  res.render("tanya-ai", { title: "Tanya AI - Toko Sembako Ariesta" });
}

function renderLogin(req, res) {
  // Kalau sudah login, tidak perlu lihat halaman login lagi
  if (req.session && req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  }
  res.render("login", { title: "Login Admin - Toko Sembako Ariesta" });
}

function renderDashboard(req, res) {
  res.render("dashboard", {
    title: "Dashboard Admin - Toko Sembako Ariesta",
    username: req.session.username,
  });
}

module.exports = {
  renderBeranda,
  renderProdukPage,
  renderProdukDetail,
  renderTanyaAI,
  renderLogin,
  renderDashboard,
};
