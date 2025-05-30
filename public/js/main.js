


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
async function cargaralertadestock() {
    try {
        const response= await fetch("/lowstock")
        const productos =  await response.json()
        productos.forEach(p=>{
            const   message =`⚠️ ${p.nombre} tiene bajo stock (${p.cantidad})`
            mostrarAlerta(message)
        })

    } catch (error) {
        console.error('Error al cargar alertas:', error);
    mostrarAlerta('❌ Error al obtener productos del servidor');
    }
}
function mostrarAlerta(message, tiempo = 4000) {
    const alerta = document.createElement('div')
        alerta.classList.add('alerta')
        alerta.textContent=message
    const container = document.getElementById('alert-container')
    container.appendChild(alerta)
    setTimeout(()=>{
        alerta.classList.add('termino')
        setTimeout(()=> alerta.remove(), 500)
    }, tiempo)        
    
}
document.addEventListener("DOMContentLoaded",()=>{
    cargaralertadestock()
})
async function actualizarnotificacion() {
    try {
            const response = await fetch("/notificacion")
            const data = await response.json()
            const badge = document.getElementById('badge-noti')
            if (data.total>0){
                badge.textContent = data.total
                badge.style.display = 'inline-block'
            }else{
                badge.style.display = 'none'
            }
    } catch (error) {
        console.error("no se pudo cargar las notificaciones", error)
    }
}
document.addEventListener("DOMContentLoaded",()=>{
    actualizarnotificacion()
    setInterval(actualizarnotificacion,10000)
})
function mostrarnotificaciones() {
    alert('Aquí podrías mostrar los detalles de las notificaciones.')
}