// routes/api.js
// Semua route REST API. Endpoint publik (GET) tidak pakai middleware auth,
// endpoint mutasi (POST/PUT/DELETE produk) dipasangi requireLoginApi.

const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const { requireLoginApi } = require("../middleware/auth");

// ---- Auth ----
router.post("/login", authController.login);
router.post("/logout", requireLoginApi, authController.logout);

// ---- Produk (publik: GET, terproteksi: POST/PUT/DELETE) ----
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", requireLoginApi, productController.createProduct);
router.put("/products/:id", requireLoginApi, productController.updateProduct);
router.delete("/products/:id", requireLoginApi, productController.deleteProduct);

// ---- Chat dummy (publik) ----
router.post("/chat", chatController.chat);

module.exports = router;
