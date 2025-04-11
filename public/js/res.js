

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
