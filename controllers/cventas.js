import error from "../middwlare/err.js"
import mventas from "../modulos/mventas.js";
const cventas = {
    getventas: async(req,res)=>{
        try {
            const productos = await  mventas.mostprod()
            const mesas = await mventas.mostmesa()
            const totales = await mventas.totalmesa()
            const ordenes = await mventas.mostorden()
            const tipo_pagos = await mventas.metodo_pago()
            const pagos = await mventas.mostventas()
            const ventasu = await mventas.mostventau()
            res.render("ventas", {mesas,productos,ordenes,totales,tipo_pagos,pagos,ventasu})
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
            console.log("✅ Datos recibidos en el controlador:", { id});
            res.redirect("/ventas")
        } catch (error) {
            throw {status:500,message:"error al borrar datosd"}
        }
    },
    duplicar: async(req,res) => {
      try {
        const {id} = req.params
        const result =await mventas.duplicar_orden({id})
        console.log("✅ Datos recibidos en el controlador:", { id});
        res.redirect("/ventas")  
      } catch (error) {
        console.error("❌ Error al duplicar datos:", error);
        res.status(500).json({ message: "Error al duplicar datos", error })
      }
    },
    pagar: async(req,res)=>{
        try {
            const{mesa}= req.params
            const{pago}= req.body
            console.log("✅ Datos recibidos en el controlador:", { mesa,pago})
            const result = await mventas.pagar({mesa,pago})
            res.redirect("/ventas")
        } catch (error) {
            console.error("❌ Error en pagar:", error);
        
        // Manejo del error con respuesta al cliente
            res.status(500).json({
                message: "Ocurrió un error al procesar el pago",
                error: error.message || "Error desconocido"
            })
        }
    }

}
export default cventas