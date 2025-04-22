import db from "../config/db.js"
const mventas = {
    mostmesa: async()=>{
        try {
            const [results]= await db.query("select ID,estado from mesa")
            return results
        } catch (error) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    mostprod: async()=>{
        try {
            const [results] = await db.query("select id,nombre from producto where cantidad > minimo_cant")
            return results
        } catch (error) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    insorden: async({id,producto,cantidad})=>{
        try {
            console.log("📡 Datos recibidos en el modelo:", { id, producto, cantidad }); // Debugging
            await db.query("insert into detalles_p(mesa_id,id_prod,cantidad) values (?,?,?)",
                [id,producto,cantidad] 
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos"};
        }
    }
}
export default mventas