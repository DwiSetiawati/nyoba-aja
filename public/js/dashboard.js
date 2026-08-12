// public/js/dashboard.js
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("productTableBody");
  const form = document.getElementById("productForm");
  const formTitle = document.getElementById("formTitle");
  const productIdInput = document.getElementById("productId");
  const nameInput = document.getElementById("name");
  const categoryInput = document.getElementById("category");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const messageBox = document.getElementById("dashboardMessage");

  loadProducts();

  // ---- Load & render tabel produk ----
  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      renderTable(data.data);
    } catch (err) {
      showMessage("Gagal memuat data produk.", "error");
    }
  }

  function renderTable(products) {
    tableBody.innerHTML = "";

    if (products.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6" class="empty-state">Belum ada produk.</td></tr>';
      return;
    }

    products.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>Rp ${p.price.toLocaleString("id-ID")}</td>
        <td>${p.stock}</td>
        <td class="table-actions">
          <button class="btn-secondary btn-edit" data-id="${p.id}">Edit</button>
          <button class="btn-danger btn-delete" data-id="${p.id}">Hapus</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Pasang event listener ke tombol Edit & Hapus yang baru dibuat
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => startEdit(Number(btn.dataset.id), products));
    });
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteProduct(Number(btn.dataset.id)));
    });
  }

  // ---- Mode edit: isi form dengan data produk yang dipilih ----
  function startEdit(id, products) {
    const produk = products.find((p) => p.id === id);
    if (!produk) return;

    productIdInput.value = produk.id;
    nameInput.value = produk.name;
    categoryInput.value = produk.category;
    priceInput.value = produk.price;
    stockInput.value = produk.stock;

    formTitle.textContent = `Edit Produk: ${produk.name}`;
    submitBtn.textContent = "Simpan Perubahan";
    cancelEditBtn.classList.remove("hidden");
    window.scrollTo({ top: form.offsetTop - 20, behavior: "smooth" });
  }

  function resetForm() {
    form.reset();
    productIdInput.value = "";
    formTitle.textContent = "Tambah Produk Baru";
    submitBtn.textContent = "Tambah Produk";
    cancelEditBtn.classList.add("hidden");
  }

  cancelEditBtn.addEventListener("click", resetForm);

  // ---- Submit form: tambah ATAU edit, tergantung productIdInput ----
  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // FR-17: wajib, supaya tidak reload halaman

    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const price = priceInput.value;
    const stock = stockInput.value;

    // Validasi dasar sebelum request dikirim
    if (!name || !category || price === "" || stock === "") {
      showMessage("Semua field wajib diisi.", "error");
      return;
    }
    if (Number(price) < 0 || Number(stock) < 0) {
      showMessage("Harga dan stok tidak boleh negatif.", "error");
      return;
    }

    const id = productIdInput.value;
    const payload = { name, category, price: Number(price), stock: Number(stock) };

    try {
      const res = await fetch(id ? `/api/products/${id}` : "/api/products", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        showMessage("Sesi login habis, silakan login ulang.", "error");
        setTimeout(() => (window.location.href = "/login"), 1200);
        return;
      }

      if (data.status !== "success") {
        showMessage(data.message || "Gagal menyimpan produk.", "error");
        return;
      }

      showMessage(data.message, "success");
      resetForm();
      loadProducts(); // refresh tabel tanpa reload halaman
    } catch (err) {
      showMessage("Terjadi kesalahan koneksi ke server.", "error");
    }
  });

  // ---- Hapus produk ----
  async function deleteProduct(id) {
    const konfirmasi = confirm("Yakin ingin menghapus produk ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 401) {
        showMessage("Sesi login habis, silakan login ulang.", "error");
        setTimeout(() => (window.location.href = "/login"), 1200);
        return;
      }

      showMessage(data.message, data.status === "success" ? "success" : "error");
      loadProducts();
    } catch (err) {
      showMessage("Terjadi kesalahan koneksi ke server.", "error");
    }
  }

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = "form-message " + type;
    setTimeout(() => {
      messageBox.textContent = "";
      messageBox.className = "form-message";
    }, 3500);
  }

  // Mencegah XSS sederhana saat menampilkan nama/kategori produk di tabel
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
