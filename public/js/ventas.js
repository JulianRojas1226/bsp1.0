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
  const modalEl = document.getElementById("stockMinimoModal");
  if (!modalEl) return;

  // Obtener los IDs actuales de productos con bajo stock (desde inputs del modal)
  const currentLowStockIds = Array.from(
    document.querySelectorAll('input[name="producto_aceptado"]')
  ).map(el => el.value);

  // Leer del localStorage los productos aceptados previamente
  const acceptedIds = JSON.parse(localStorage.getItem("lowstockAceptados") || "[]");

  // Verificar si hay algún producto nuevo en bajo stock
  const nuevos = currentLowStockIds.some(id => !acceptedIds.includes(id));

  if (!nuevos) return;

  // Mostrar el modal
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const confirmarBtn = document.getElementById("confirmar-productos");

  if (confirmarBtn) {
    confirmarBtn.addEventListener("click", () => {
      const aceptados = Array.from(document.querySelectorAll('input[name="producto_aceptado"]:checked'))
        .map(el => el.value.toString());

      // Ocultar opciones que no fueron aceptadas (solo las de lowstock)
      document.querySelectorAll('select[name="producto"]').forEach(select => {
        Array.from(select.options).forEach(option => {
          const isLowStock = option.dataset.lowstock === "true";
          if (isLowStock) {
            option.hidden = !aceptados.includes(option.value);
          } else {
            option.hidden = false;
          }
        });
      });

      // Guardar los productos aceptados
      localStorage.setItem("lowstockAceptados", JSON.stringify(aceptados));
      modal.hide();
    });
  }
})
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(`select[name="producto"]`).forEach(select=>{
    const inputCantidad = select.closest('form').querySelector('input[name="cantidad"]')
    const actualuizarMax = ()=>{
      const selectedOption = select.options[select.selectedIndex]
      const max =selectedOption.getAttribute('data-max')
      inputCantidad.max = max
    }
    select.addEventListener('change', actualuizarMax)
    actualuizarMax()
  })
})