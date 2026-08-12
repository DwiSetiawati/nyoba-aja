// public/js/produk.js
// Halaman /produk sekarang murni mengambil data lewat Fetch API,
// bukan data hardcode/server-render, sesuai requirement Sprint 2.

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("productContainer");
  const filterForm = document.getElementById("filterForm");
  const kategoriSelect = document.getElementById("kategori");
  const searchInput = document.getElementById("search");
  const resetBtn = document.getElementById("resetFilterBtn");

  // FIX: baca ?kategori= & ?search= dari URL saat halaman pertama dibuka,
  // supaya link seperti /produk?kategori=sembako tetap langsung ter-filter
  // (requirement ini dari Sprint 1 / FR-06, harus tetap jalan walau
  // sekarang datanya diambil lewat Fetch API, bukan server-render).
  const urlParams = new URLSearchParams(window.location.search);
  const kategoriDariUrl = urlParams.get("kategori") || "";
  const searchDariUrl = urlParams.get("search") || "";
  searchInput.value = searchDariUrl;

  // Muat daftar kategori (buat dropdown) dari seluruh produk tanpa filter,
  // lalu muat produk sesuai filter aktif (termasuk filter dari URL di atas)
  loadKategoriOptions(kategoriDariUrl).then(() => {
    loadProducts();
  });

  async function loadKategoriOptions(kategoriAktif) {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const kategoriUnik = [...new Set(data.data.map((p) => p.category))];

      kategoriUnik.forEach((k) => {
        const option = document.createElement("option");
        option.value = k;
        option.textContent = k;
        if (k === kategoriAktif) option.selected = true;
        kategoriSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  }

  async function loadProducts() {
    container.innerHTML = '<p class="empty-state">Memuat produk...</p>';

    const kategori = kategoriSelect.value;
    const search = searchInput.value.trim();

    // Filter dikirim sebagai query string ke API, logic filter tetap di server
    const params = new URLSearchParams();
    if (kategori) params.set("kategori", kategori);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      renderProducts(data.data);

      // Sinkronkan URL browser dengan filter aktif (tanpa reload halaman),
      // supaya URL tetap bisa di-share/bookmark dan mencerminkan filter saat ini
      const newUrl = params.toString() ? `/produk?${params.toString()}` : "/produk";
      window.history.replaceState({}, "", newUrl);
    } catch (err) {
      container.innerHTML =
        '<p class="empty-state">Gagal memuat produk. Coba refresh halaman.</p>';
    }
  }

  function renderProducts(products) {
    if (products.length === 0) {
      container.innerHTML =
        '<p class="empty-state">Tidak ada produk yang cocok dengan filter kamu.</p>';
      return;
    }

    container.innerHTML = products
      .map(
        (p) => `
        <article class="product-card">
          <div class="product-icon">📦</div>
          <h3>${escapeHtml(p.name)}</h3>
          <p class="product-category">${escapeHtml(p.category)}</p>
          <p class="product-price">Rp ${p.price.toLocaleString("id-ID")}</p>
          <p class="product-stock">Stok: ${p.stock}</p>
          <a href="/produk/${p.id}" class="btn-secondary">Lihat Detail</a>
        </article>
      `
      )
      .join("");
  }

  filterForm.addEventListener("submit", function (e) {
    e.preventDefault(); // FR-17: cegah reload halaman
    loadProducts();
  });

  resetBtn.addEventListener("click", function () {
    filterForm.reset();
    loadProducts();
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
