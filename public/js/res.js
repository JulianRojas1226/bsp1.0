

document.addEventListener("DOMContentLoaded", async () => {
    // Función para obtener las fechas reservadas desde el backend
    async function obtenerFechasReservadas() {
        try {
            const response = await fetch("/fechas-reservadas"); // Endpoint del backend
            if (!response.ok) throw new Error("Error al obtener las fechas reservadas");
            console.log(response)
            return await response.json(); // Devuelve un array de fechas
        } catch (error) {
            console.error("Error al obtener fechas reservadas:", error);
            return []; // Devuelve un array vacío en caso de error
        }
    }

    // Obtener fechas y configurar Flatpickr
    const fechasReservadas = await obtenerFechasReservadas();
    console.log("Fechas reservadas:", fechasReservadas);

    flatpickr("#calendario", {
        dateFormat: "Y-m-d", // Formato de fecha (año-mes-día)
        minDate: "today", // Bloquea fechas pasadas
        disable: fechasReservadas, // Deshabilita las fechas reservadas
        disable: [
            function(date) {
                // Bloquea días que no sean viernes (5), sábado (6) o domingo (0)
                const dia = date.getDay();
                if (dia !== 5 && dia !== 6 && dia !== 0) {
                    return true; // Bloquea el día si no coincide
                }
    
                // Bloquea fechas reservadas (comparando con `fechasReservadas`)
                return fechasReservadas.includes(date.toISOString().split("T")[0]);
            }
        ]   
    });
});
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
    
    ;
document.addEventListener("DOMContentLoaded", () => {
    const productos = document.querySelectorAll(".cartares");

    productos.forEach((producto, index) => {
        setTimeout(() => {
            producto.classList.add("show");
        }, index * 100); // Efecto cascada
    });
});

document.querySelector("#eliminarreserva").addEventListener("submit", (event) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        event.preventDefault();
    }
})