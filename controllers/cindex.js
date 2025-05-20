import mindex from "../modulos/mindex.js";

const cindex ={
    get_index: async (req,res) => {
        try {
            const tipos = await mindex.mosttipo()
            const mesas = await mindex.mostmesa()
            res.render("index",{tipos,mesas})
        } catch (error) {
             console.error("Error:", error);
            res.status(500).send("Error interno del servidor");

        }
    },
    insertdatos: async(req,res)=>{
        try {
            const{fecha_hora,hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser}=req.body
            await mindex.insertardatos({fecha_hora,hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser})
            res.redirect("/")
        } catch (err) {
            console.error("❌ Error al guardar los datos:", err);
            res.status(500).send("Error al guardar los datos.");  
        }
    },
    
    getFechasReservadas: async (req, res) => {
        try {
            const fechareservada = await mindex.dia(); // Obtén las fechas reservadas desde tu modelo
            console.log("NADA DE NADA",fechareservada)
            res.json(fechareservada); // Envía las fechas al frontend como JSON
        } catch (err) {
            console.error("Error al obtener fechas reservadas:", err);
            res.status(500).json({ mensaje: "Error al obtener fechas reservadas" });
        }
    },
}
export default cindex