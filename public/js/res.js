// dias permitidos
const dias_permitidos = [6,7,1]
document.getElementById("calendario").addEventListener("change", function (event) {
    const fecha_select = new Date(event.target.value)
    const dia_semana = fecha_select.getDay()+1
    const hoy = new Date()
    if(fecha_select<hoy){
        alert("no se puede reservar fechas pasadas")
        this.value=""
    }

    if (!dias_permitidos.includes(dia_semana)) {
        alert("SOLO SE PUEDEN ESCOGER VIERNES, SABADOS Y DOMINGO PORFAVOR ESCOGER OTRA FECHA")
        event.target.value = ""
    }
})
// fechas reservadas
async function obtenerFechasReservadas() {
    try {
        const response = await fetch("/fechas-reservadas"); // Realiza la solicitud al endpoint
        if (!response.ok) throw new Error("Error al obtener las fechas reservadas");
        return await response.json(); // Devuelve las fechas como array
    } catch (error) {
        console.error("Error al obtener fechas reservadas:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}

// Usar las fechas reservadas al cambiar el calendario
document.getElementById("calendario").addEventListener("change", async function () {
    const fechasReservadas = await obtenerFechasReservadas(); // Obtiene las fechas desde el servidor
    const fechaSeleccionada = this.value; // Obtén la fecha seleccionada por el usuario

    if (fechasReservadas.includes(fechaSeleccionada)) {
        alert("Esta fecha ya está reservada.");
        this.value = ""; // Limpia el campo
    } else {
        console.log("Fecha válida:", fechaSeleccionada);
    }
});
