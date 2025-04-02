import error from "../middwlare/err.js";
import mprod from "../modulos/mproductos.js"

const cprod ={
    getprod: async (req,res) => {
      try {
        const tipos = await mprod.tipo(); // Llamamos al modelo
        const proveedores = await mprod.proveedor()
        const productos = await mprod.mostpod()
        res.render("prod", { tipos, proveedores, productos }); // Enviamos los datos a la vista
    } catch (err) {
        console.error("❌ Error en el controlador:", err);
        res.status(500).send("Error al obtener los tipos"); // Enviamos una respuesta de error
    }
  },
  adddatos: async (req,res)=>{
    try {
      if (!req.file) {
        return res.status(400).send("no se subio ninguna imagen.")
      }
      const ruta = `/productos/${req.file.filename}`
      const {nombre,cantidad,tipo,proveedor,precio}=req.body  
      await mprod.insertdatos({ruta,nombre,tipo,cantidad,proveedor,precio})
      res.redirect("/prod"); 
    } catch (err) {
      console.error("❌ Error al guardar los datos:", err);
      res.status(500).send("Error al guardar los datos.");
    }
  },
  addcantidad: async (req,res)=>{
    try {
      const {producto,cantidad,proveedor}=req.body
      await mprod.cantadd({producto,cantidad,proveedor})
      res.redirect("/prod"); 
    } catch (err) {
      console.error("❌ Error al guardar los datos:", err);
      res.status(500).send("Error al guardar los datos.");
    }
  } 


}
export default cprod