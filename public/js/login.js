// public/js/login.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageBox = document.getElementById("loginMessage");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // FR-17: cegah reload halaman biasa

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validasi dasar di frontend sebelum request dikirim
    if (!username || !password) {
      showMessage("Username dan password wajib diisi.", "error");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        showMessage("Login berhasil, mengalihkan ke dashboard...", "success");
        window.location.href = "/dashboard";
      } else {
        showMessage(data.message || "Login gagal.", "error");
      }
    } catch (err) {
      showMessage("Terjadi kesalahan koneksi ke server.", "error");
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = "form-message " + type;
  }
});
