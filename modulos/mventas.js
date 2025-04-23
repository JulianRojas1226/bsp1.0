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
    },
    mostorden: async()=>{
        try {
            const [result]= await db.query("select id,mesa_id,id_prod,producto,precio_u,cantidad,total_p from detalles_p")
            return result
        } catch (error) {
            throw {status:500,message:"error al cargar datos"}  
        }
    }, 
    totalmesa: async()=>{
        try {
            const [result] = await db.query (`select mesa_id, sum(total_p) as total_mesa 
                from detalles_p group by mesa_id` )
            return result
        } catch (error) {
            throw {status:500,message:"error al cargar total "}
        }
    },
    eliminarorden: async({id})=>{
        try {
            const [rewsult]= await db.query("delete from detalles_p where id = ?",[id])
        } catch (error) {
            throw {status:500,message:"error al borrar datosd"}
        }
    }
}
export default mventas