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
    const productos = document.querySelectorAll(".cartaprod");

    productos.forEach((producto, index) => {
        setTimeout(() => {
            producto.classList.add("show");
        }, index * 100); // Efecto cascada
    });
});

document.querySelector("#eliminarproducto").addEventListener("submit", (event) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        event.preventDefault();
    }
})