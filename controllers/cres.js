import error from "../middwlare/err.js";
import mres from "../modulos/mreservas.js"
const cres ={
    getres: async (req,res)=>{
        try {
            const tipos = await mres.mosttipo()
            const mesas = await mres.mostmesa()
            res.render("res",{tipos, mesas})
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
    }
}
export default cres 