// public/js/main.js
// Logic hamburger menu (FR-03): buka/tutup nav menu di layar mobile
// pakai vanilla JS (addEventListener + toggle class), bukan cuma CSS show/hide.

document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      // Update atribut aria-expanded supaya lebih aksesibel (screen reader tahu status menu)
      hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Tutup menu otomatis kalau salah satu link menu diklik (biar UX mobile enak)
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Tombol Logout ada di navbar, tapi cuma muncul kalau user sudah login
  // (lihat views/partials/navbar.ejs)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        const data = await res.json();
        if (data.status === "success") {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Gagal logout:", err);
      }
    });
  }
});
