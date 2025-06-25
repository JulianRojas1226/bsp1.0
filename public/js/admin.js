



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
const fp = flatpickr("#fecha", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "es",
    showMonths: 2,
    maxDate:'today',
    defaultDate: [
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
    ],
    onChange: aplicarFiltrosEgresos
});

document.getElementById('categoria').addEventListener('change', aplicarFiltrosEgresos);
document.getElementById('busqueda').addEventListener('input', aplicarFiltrosEgresos);

async function aplicarFiltrosEgresos() {
    const fechas = fp.selectedDates;
    if (fechas.length !== 2) return;

    const fechaInicio = fechas[0].toISOString().split('T')[0];
    const fechaFin = fechas[1].toISOString().split('T')[0];
    const categoria = document.getElementById('categoria').value;
    const nombre = document.getElementById('busqueda').value.trim();

    try {
        const res = await fetch("/admin/filtrar_egresos", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                categoria: categoria,
                nombre: nombre
            })
        });

        const data = await res.json();
        if (data.success) {
            actualizarTablaEgresos(data.datos);
        } else {
            alert('Error al filtrar egresos');
        }

    } catch (error) {
        console.error('Error en la petición:', error);
        alert('No se pudo conectar con el servidor.');
    }
}

function actualizarTablaEgresos(egresos) {
    const tbody = document.getElementById('productosTable');
    tbody.innerHTML = '';

    if (egresos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron egresos</td></tr>`;
        return;
    }

    egresos.forEach(e => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${e.hora.split('T')[0]}</td>
            <td class="text-center">${e.nombre}</td>
            <td class="text-end">${e.tipo}</td>
            <td class="text-end">$${parseFloat(e.costo).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
            <td class="text-center">${e.empleado}</td>
        `;
        tbody.appendChild(fila);
    });
}
document.getElementById("limpiarFiltros").addEventListener("click",limpiarFiltros)
function limpiarFiltros() {
    // Limpiar el campo de búsqueda
    document.getElementById('busqueda').value = '';
    
    // Resetear la categoría al primer valor (usualmente "Todas" o vacío)
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.selectedIndex = 0;
    
    // Resetear las fechas a los valores por defecto (últimos 30 días)
    const fechaFin = new Date();
    const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    fp.setDate([fechaInicio, fechaFin]);
    
    // Aplicar los filtros limpiados
    aplicarFiltrosEgresos();
    
    // Opcional: mostrar mensaje de confirmación
    console.log('Filtros limpiados y aplicados');
}

document.addEventListener('DOMContentLoaded', aplicarFiltrosEgresos);

const fpv = flatpickr("#fechas_ventas",{
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "es",
    showMonths: 2,
    maxDate: 'today',
    defaultDate: [
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
    ],
    onChange: aplicarFiltrosVentas
})
document.getElementById('empleado_input').addEventListener('change',aplicarFiltrosVentas)
document.getElementById('metodo_pago').addEventListener('change',aplicarFiltrosVentas)
document.getElementById('limpiarFiltrosv').addEventListener('click',limpiarFiltrosv)
async function aplicarFiltrosVentas() {
    const fechas = fpv.selectedDates
    if(fechas.length!==2) return
    const fechaInicio = fechas[0].toISOString().split('T')[0];
    const fechaFin = fechas[1].toISOString().split('T')[0];
    const metodo_pago = document.getElementById('metodo_pago').value;
    const empleado = document.getElementById('empleado_input').value;
    try {
        const res = await fetch("/admin/filtrar_ventas",{
           method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fecha_inicio_v: fechaInicio,
                fecha_fin_v: fechaFin,
                metodo: metodo_pago,
                empleado: empleado
            }) 
        })
        const data = await res.json()
        if(data.success){
            actualizarTablaVentas(data.datos)
        } else {
            alert('error al filtrar ventas')
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        alert('No se pudo conectar con el servidor.');
    }
}
function actualizarTablaVentas(ventas){
    const tbody = document.getElementById('Ventas_table')
    tbody.innerHTML = ''
    if (ventas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron egresos</td></tr>`;
        return;
    }
    ventas.forEach(e=>{
        const fila = document.createElement('tr')
        fila.innerHTML=`
        <td>${e.fecha_inicio.split('T')[0]}</td>
        <td class="text-center">${e.fecha_fin.split('T')[0]}</td>
        <td class="text-center">${e.metodo_pago}</td>
        <td class="text-center">$${parseFloat(e.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
        <td class="text-center">${e.empleado}</td>
        `
        tbody.appendChild(fila);
    })

}
function limpiarFiltrosv() {
    // Resetear el select de empleado al primer valor (normalmente "Todos" o vacío)
    const selectEmpleado = document.getElementById('empleado_input');
    selectEmpleado.selectedIndex = 0;
    
    // Resetear el método de pago al primer valor
    const selectMetodoPago = document.getElementById('metodo_pago');
    selectMetodoPago.selectedIndex = 0;
    
    // Resetear las fechas a los valores por defecto (últimos 30 días)
    const fechaFin = new Date();
    const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    fpv.setDate([fechaInicio, fechaFin]);
    
    // Aplicar los filtros limpiados
    aplicarFiltrosVentas();
    
    // Opcional: mostrar mensaje de confirmación
    console.log('Filtros de ventas limpiados y aplicados');
    
    // Opcional: mostrar notificación visual
    mostrarNotificacion('Filtros limpiados correctamente', 'success');
}
document.addEventListener('DOMContentLoaded',aplicarFiltrosVentas)
let empleados_existentes = []

async function cargar_empleado() {
    try {
        const response = await fetch('/admin/empleado_duplicado')
        const data = await response.json()
        console.log("js ", data)
        // Corregido: usar return en el map para transformar los datos
        empleados_existentes = data.map(p => ({
            nombre: p.nombre.toLowerCase(),
            correo: p.correo.toLowerCase()
        }))
    } catch (error) {
        console.error("No se trajeron los datos", error);
    }
}

function verificarDuplicado(nombre, correo) {
    return empleados_existentes.some(empleado => 
        empleado.nombre === nombre.toLowerCase() || 
        empleado.correo === correo.toLowerCase()
    )
}

function obtenerTipoDuplicado(nombre, correo) {
    const nombreDuplicado = empleados_existentes.some(empleado => 
        empleado.nombre === nombre.toLowerCase()
    )
    const correoDuplicado = empleados_existentes.some(empleado => 
        empleado.correo === correo.toLowerCase()
    )
    
    if (nombreDuplicado && correoDuplicado) {
        return "nombre y correo"
    } else if (nombreDuplicado) {
        return "nombre"
    } else if (correoDuplicado) {
        return "correo"
    }
    return null
}

document.addEventListener('DOMContentLoaded', () => {
    const empleado_input = document.getElementById("nombre_empleado")
    const correo_input = document.getElementById("correo_empleado") // Asegúrate de que este ID exista
    const mensaje = document.getElementById("mensaje");
    const botonGuardar = document.getElementById("btnGuardar");
    const form = document.getElementById("formEmpleado");
    
    cargar_empleado()
    setInterval(cargar_empleado, 30000)
    
    function validarCampos() {
        const nombre = empleado_input.value.trim()
        const correo = correo_input.value.trim()
        
        // Limpiar mensaje si ambos campos están vacíos
        if (nombre === "" && correo === "") {
            mensaje.textContent = ""
            botonGuardar.disabled = false
            return
        }
        
        // Validar solo si ambos campos tienen contenido
        if (nombre !== "" && correo !== "") {
            if (verificarDuplicado(nombre, correo)) {
                const tipoDuplicado = obtenerTipoDuplicado(nombre, correo)
                mensaje.textContent = `⚠️ Ya existe un empleado con este ${tipoDuplicado}`
                botonGuardar.disabled = true;
            } else {
                mensaje.textContent = ""
                botonGuardar.disabled = false
            }
        } else {
            // Si solo uno de los campos tiene contenido, limpiar mensaje
            mensaje.textContent = ""
            botonGuardar.disabled = false
        }
    }
    
    // Agregar event listeners a ambos campos
    empleado_input.addEventListener('input', validarCampos)
    correo_input.addEventListener('input', validarCampos)
    
    form.addEventListener('submit', (e) => {
        const nombre = empleado_input.value.trim()
        const correo = correo_input.value.trim()
        
        if (verificarDuplicado(nombre, correo)) {
            e.preventDefault()
            const tipoDuplicado = obtenerTipoDuplicado(nombre, correo)
            alert(`No puedes guardar un empleado con ${tipoDuplicado} duplicado.`)
        }
    })
})
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form.form-eliminar").forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // prevenir envío inmediato

            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Cambiar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit(); // enviar si se confirma
                }
            });
        });
    });
});

  const dateRangeInput = document.getElementById('fechas_ventas_pdf');

        // Configurar Flatpickr para rango de fechas en un solo campo
        const fp_pdf = flatpickr(dateRangeInput, {
            mode: 'range',
            locale: 'es',
            dateFormat: 'd/m/Y',
            placeholder: 'Seleccionar rango de fechas',
            rangeSeparator: ' hasta ',
            showMonths: 2,
            maxDate: 'today',
            onChange: function(selectedDates, dateStr, instance) {
                // Actualizar campos ocultos cuando cambie el rango
                if (selectedDates.length === 2) {
                    const fechaInicio = selectedDates[0];
                    const fechaFin = selectedDates[1];
                    
                    // Llenar campos ocultos con formato YYYY-MM-DD para el backend
                    document.getElementById('fechaInicioHidden').value = fechaInicio.toISOString().split('T')[0];
                    document.getElementById('fechaFinHidden').value = fechaFin.toISOString().split('T')[0]
                }
            }
        });