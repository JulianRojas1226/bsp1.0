import db from "../config/db.js";
const mprod={
    tipo: async()=>{
        try {
            console.log("📌 Ejecutando consulta en la BD...");
            const [results] = await db.query("SELECT id, nombre FROM tipo_pr");
            console.log("🟢 Resultados obtenidos de la BD:", results)
            return results;
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    proveedor: async()=>{
        try {
            const [resultspro] = await db.query("SELECT NID, nombre from proveedor")
            console.log("🟢 Resultado   s obtenidos de la BD:", resultspro)
            return resultspro
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    insertdatos: async({ruta,nombre,tipo,cantidad,proveedor,precio})=>{
        try {
            await db.query("Insert into producto (nombre,tipo,cantidad,proveedor,precio,dir) values (?,?,?,?,?,?)",
                [nombre,tipo,cantidad,proveedor,precio,ruta]
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };
        }
    },
    mostpod: async()=>{
        try {
            const [resultprod] = await db.query("SELECT id,nombre,tipo,cantidad,proveedor,precio,dir FROM producto")
            console.log("🟢 Resultados obtenidos de la BD:", resultprod)
            return resultprod
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    cantadd: async({producto,cantidad,proveedor})=>{
        try {
            await db.query("insert into producto_add(id,cantidad,proveedor) values (?,?,?)",
                [producto,cantidad,proveedor]
            )
            
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };            
        }
    }
}

export default mprod