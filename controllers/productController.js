// controllers/productController.js
const productModel = require("../models/productModel");

// GET /api/products (+ opsional ?kategori= & ?search=) -- Publik
function getAllProducts(req, res) {
  const { kategori, search } = req.query;
  const data = productModel.getAll({ kategori, search });

  res.status(200).json({
    status: "success",
    data,
  });
}

// GET /api/products/:id -- Publik
function getProductById(req, res) {
  const id = Number(req.params.id);
  const produk = productModel.getById(id);

  if (!produk) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    data: produk,
  });
}

// POST /api/products -- Wajib login
function createProduct(req, res) {
  const { name, category, price, stock } = req.body;

  // Validasi dasar di backend: field wajib ada & tipe angka masuk akal.
  // Ini validasi "penjaga terakhir" -- validasi di frontend cuma buat UX,
  // yang benar-benar menentukan aman/tidaknya data adalah validasi di sini.
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field name, category, price, dan stock wajib diisi",
    });
  }

  if (isNaN(Number(price)) || isNaN(Number(stock))) {
    return res.status(400).json({
      status: "error",
      message: "Price dan stock harus berupa angka",
    });
  }

  const produkBaru = productModel.create({ name, category, price, stock });

  res.status(201).json({
    status: "success",
    message: "Produk ditambahkan",
    data: produkBaru,
  });
}

// PUT /api/products/:id -- Wajib login
function updateProduct(req, res) {
  const id = Number(req.params.id);
  const { name, category, price, stock } = req.body;

  const priceInvalid = price !== undefined && isNaN(Number(price));
  const stockInvalid = stock !== undefined && isNaN(Number(stock));

  if (priceInvalid || stockInvalid) {
    return res.status(400).json({
      status: "error",
      message: "Price dan stock harus berupa angka",
    });
  }

  const produk = productModel.update(id, { name, category, price, stock });

  if (!produk) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Produk diperbarui",
    data: produk,
  });
}

// DELETE /api/products/:id -- Wajib login
function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const berhasil = productModel.remove(id);

  if (!berhasil) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Produk dihapus",
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
