import error from "../middwlare/err.js";
import mres from "../modulos/mreservas.js"
const cres ={
    getres: async (req,res)=>{
        try {
            const dia = req.query.dia
            const mes =req.query.mes
            const query = req.query.query
            let reservas
            if (dia && mes && query) {
                reservas = await mres.totalbuscar({dia,mes,query})                
            } else if (dia && mes) {
                reservas = await mres.filtroD_M({dia,mes})
            }else if (dia) {
                reservas = await mres.filtroD({dia})
            }else if (mes) {
                reservas = await mres.filtroM({mes})
            }else if (query) {
                reservas = await mres.buscar({query})
            }else{
                reservas = await mres.mostres()
            }
            const tipos = await mres.mosttipo()
            const mesas = await mres.mostmesa()
            const fechareservada = await mres.dia()
            res.render("res",{tipos, mesas, reservas,fechareservada})
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    insertdatos: async(req,res)=>{
        try {
            const{fecha_hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser}=req.body
            await mres.insertardatos({fecha_hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser})
            res.redirect("/res")
        } catch (err) {
            console.error("❌ Error al guardar los datos:", err);
            res.status(500).send("Error al guardar los datos.");  
        }
    },
    getFechasReservadas: async (req, res) => {
        try {
            const fechareservada = await mres.dia(); // Obtén las fechas reservadas desde tu modelo
            console.log("NADA DE NADA",fechareservada)
            res.json(fechareservada); // Envía las fechas al frontend como JSON
        } catch (err) {
            console.error("Error al obtener fechas reservadas:", err);
            res.status(500).json({ mensaje: "Error al obtener fechas reservadas" });
        }
    }
    



    
}
export default cres 