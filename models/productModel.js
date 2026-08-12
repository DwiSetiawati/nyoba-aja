// models/productModel.js
//
// Ini "Model" di pola MVC: satu-satunya tempat data produk hidup & diubah.
// Baik halaman publik (GET) maupun dashboard admin (POST/PUT/DELETE) WAJIB
// lewat fungsi-fungsi di file ini, supaya datanya selalu konsisten
// (tidak ada dua sumber data terpisah seperti yang dilarang di PRD).

let products = [
  { id: 1, name: "Beras Pandan Wangi 5kg", category: "sembako", price: 65000, stock: 20 },
  { id: 2, name: "Minyak Goreng Sania 2L", category: "minyak", price: 34000, stock: 15 },
  { id: 3, name: "Gula Pasir Gulaku 1kg", category: "sembako", price: 16000, stock: 30 },
  { id: 4, name: "Telur Ayam Negeri 1kg", category: "protein", price: 28000, stock: 25 },
  { id: 5, name: "Tepung Terigu Segitiga Biru 1kg", category: "sembako", price: 13000, stock: 18 },
  { id: 6, name: "Kopi Bubuk ABC 165gr", category: "minuman", price: 12500, stock: 40 },
  { id: 7, name: "Mie Instan Indomie Goreng (1 dus)", category: "makanan", price: 110000, stock: 10 },
];

// Penghitung id berikutnya, supaya id produk baru selalu unik & bertambah.
let nextId = products.length + 1;

// Ambil semua produk, dengan filter opsional kategori & search (dipakai
// baik oleh halaman server-render maupun endpoint API).
function getAll({ kategori, search } = {}) {
  let hasil = products;

  if (kategori) {
    hasil = hasil.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }
  if (search) {
    hasil = hasil.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return hasil;
}

function getById(id) {
  return products.find((p) => p.id === id) || null;
}

function getKategoriList() {
  return [...new Set(products.map((p) => p.category))];
}

function create({ name, category, price, stock }) {
  const produkBaru = {
    id: nextId++,
    name,
    category,
    price: Number(price),
    stock: Number(stock),
  };
  products.push(produkBaru);
  return produkBaru;
}

function update(id, { name, category, price, stock }) {
  const produk = getById(id);
  if (!produk) return null;

  if (name !== undefined) produk.name = name;
  if (category !== undefined) produk.category = category;
  if (price !== undefined) produk.price = Number(price);
  if (stock !== undefined) produk.stock = Number(stock);

  return produk;
}

function remove(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  getKategoriList,
  create,
  update,
  remove,
};
