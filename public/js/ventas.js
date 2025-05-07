document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".btn-mesa"); // Botones de las mesas

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const mesaID = boton.getAttribute("data-id");
            const modal = document.getElementById(`modal-${mesaID}`); // Buscar el modal único
            modal.style.display = "flex"; // Mostrar el modal
        });
    });

    // Manejar el cierre de cada modal
    const botonesCerrar = document.querySelectorAll(".cerrar");
    botonesCerrar.forEach(boton => {
        boton.addEventListener("click", () => {
            const modal = boton.closest(".modal"); // Buscar el modal más cercano
            modal.style.display = "none"; // Ocultar el modal
        });
    });

    // Opcional: Cerrar el modal al hacer clic fuera del contenido
    const modales = document.querySelectorAll(".modal");
    modales.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const botonesPagar = document.querySelectorAll(".btn-pagar");
    botonesPagar.forEach(boton => {
        boton.addEventListener("click", function () {
            const mesaId = this.dataset.id;
            const modal = document.getElementById(`modal-pagar-${mesaId}`);
            modal.style.display = "block";
        });
    });

    const botonesCerrar = document.querySelectorAll(".cerrar");
    botonesCerrar.forEach(boton => {
        boton.addEventListener("click", function () {
            const modal = this.parentElement.parentElement;
            modal.style.display = "none";
        });
    });
});

document.getElementById("abrirModal-ventas").addEventListener("click", function() {
    document.getElementById("modal-ventas-res").style.display = "flex";
  });
  
  document.getElementById("cerrarModal").addEventListener("click", function() {
    document.getElementById("modal-ventas-res").style.display = "none";
  });
  
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("modal-ventsa-res");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  })