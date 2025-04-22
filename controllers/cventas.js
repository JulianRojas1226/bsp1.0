import error from "../middwlare/err.js"
import mventas from "../modulos/mventas.js";
const cventas = {
    getventas: async(req,res)=>{
        try {
            const productos = await  mventas.mostprod()
            const mesas = await mventas.mostmesa()
            res.render("ventas", {mesas,productos})
        } catch (err) {
            error.e500(req, res, err);  
        }
    },
    insorden: async(req,res)=>{
        try {
            const {id} = req.params
            const {producto,cantidad}= req.body
            console.log("✅ Datos recibidos en el controlador:", { id, producto, cantidad }); // Depuración  b v  
            await mventas.insorden({id,producto,cantidad})
            res.redirect("/ventas")
        } catch (err) {
            console.error("❌ Error en el controlador:", err.message);
            res.status(500).send("Error al borrar el producto.");
        }
    }

}
export default cventas