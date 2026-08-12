// routes/web.js
// Route untuk halaman (server-rendered EJS). Logic-nya sudah dipindah ke
// controllers/pageController.js -- file ini cuma "peta" URL ke controller.

const express = require("express");
const router = express.Router();

const pageController = require("../controllers/pageController");
const { requireLoginPage } = require("../middleware/auth");

router.get("/", pageController.renderBeranda);
router.get("/produk", pageController.renderProdukPage);
router.get("/produk/:id", pageController.renderProdukDetail);
router.get("/tanya-ai", pageController.renderTanyaAI);

router.get("/login", pageController.renderLogin);

// Dashboard dilindungi: kalau belum login, requireLoginPage akan
// redirect ke /login sebelum sempat masuk ke renderDashboard
router.get("/dashboard", requireLoginPage, pageController.renderDashboard);

module.exports = router;
