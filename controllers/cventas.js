import error from "../middwlare/err.js"
import mventas from "../modulos/mventas.js";
const cventas = {
    getventas: async(req,res)=>{
        try {
            const productos = await  mventas.mostprod()
            const mesas = await mventas.mostmesa()
            const totales = await mventas.totalmesa()
            const ordenes = await mventas.mostorden()
            res.render("ventas", {mesas,productos,ordenes,totales})
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
    },
    eliminarorden: async(req,res)=>{
        try {
            const {id} = req.params
            const result =await mventas.eliminarorden({id})
            res.redirect("/ventas")
        } catch (error) {
            throw {status:500,message:"error al borrar datosd"}
        }
    }

}
export default cventas