const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"), // Botón para colapsar/expandir
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    modeText.innerText = "Light Mode";
}
modeSwitch.addEventListener("click", () => {
        
    body.classList.toggle("dark");

    // Guardar la preferencia en localStorage
    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        modeText.innerText = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        modeText.innerText = "Dark Mode";
    }

    });

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 JS cargado con límite de tiempo");

  const modalEl = document.getElementById("stockMinimoModal");
  if (!modalEl) return;

  const currentLowStockIds = Array.from(
    document.querySelectorAll('input[name="producto_aceptado"]')
  ).map(el => el.value.toString());

  const stored = JSON.parse(localStorage.getItem("lowstockAceptadosV2") || "null");

  let expired = true;
  let acceptedIds = [];

  if (stored && stored.timestamp && stored.ids) {
    const now = Date.now();
    const hoursPassed = (now - stored.timestamp) / (1000 * 60 * 60);
    if (hoursPassed < 5) {
      expired = false;
      acceptedIds = stored.ids;
    }
  }

  const nuevos = currentLowStockIds.some(id => !acceptedIds.includes(id));

  console.log("IDs actuales:", currentLowStockIds);
  console.log("IDs aceptados válidos:", acceptedIds);
  console.log("¿Expiró?", expired);
  console.log("¿Hay nuevos?", nuevos);

  if (!nuevos || expired === false) return;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const confirmarBtn = document.getElementById("confirmar-productos");
  if (confirmarBtn) {
    confirmarBtn.addEventListener("click", () => {
      const aceptados = Array.from(
        document.querySelectorAll('input[name="producto_aceptado"]:checked')
      ).map(el => el.value.toString());

      document.querySelectorAll('select[name="producto"]').forEach(select => {
        Array.from(select.options).forEach(option => {
          const isLowStock = option.dataset.lowstock === "true";
          option.hidden = isLowStock && !aceptados.includes(option.value);
        });
      });

      localStorage.setItem(
        "lowstockAceptadosV2",
        JSON.stringify({ ids: aceptados, timestamp: Date.now() })
      );
      modal.hide();
    });
  }
});