
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
            const [result]= await db.query("select HORA,id,mesa_id,id_prod,producto,precio_u,cantidad,total_p from detalles_p")
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
        const coneccion = await db.getConnection()
        try {
            await coneccion.beginTransaction()
            const [orden] = await coneccion.query(`
                select id_prod, cantidad from detalles_p where id = ?
                `,[id])
            const {id_prod,cantidad}=orden[0]
            // actualiza cantidad
            await coneccion.query(`
                update producto
                set cantidad = cantidad + ?
                where id =  ?
                `,[cantidad,id_prod])
            // eliminar
            await coneccion.query(`
                delete from detalles_p
                where id = ?`,
            [id])
            await coneccion.commit()
        } catch (error) {
            throw {status:500,message:"error al borrar datosd"}
        }
    },
    metodo_pago: async()=>{
        try {
            const [result]= await db.query("select id,nombre from tipo_pago")
            return result
        } catch (error) {
            console.error("Error en metodo_pago:", error);
            throw { status: 500, message: "Error al obtener métodos de pago" };

        }
    },
    pagar: async({mesa,pago})=>{
        const coneccion = await db.getConnection()
        try {
            console.log("📡 Datos recibidos en el modelo:", { mesa,pago});
            await coneccion.beginTransaction()
            const[orden]= await coneccion.query(`
                select  HORA,id,mesa_id,id_prod,producto,precio_u,cantidad,total_p from detalles_p
                where mesa_id = ?
                `,[mesa])
            const {HORA,id,mesa_id,id_prod,producto,precio_u,cantidad,total_p}=orden[0]
            // insertar en ventas realizadas
            await coneccion.query(`
                insert into ventas_res(id_orden,hora,mesa,id_prod,producto,precio_u,cantidad,total_p,pago) values(?,?,?,?,?,?,?,?,?)`,
                [id,HORA,mesa_id,id_prod,producto,precio_u,cantidad,total_p,pago])
            // ELIMINAR
            await coneccion.query(`
                delete from detalles_p
                where mesa_id = ?`,[mesa])
            await coneccion.commit()
        } catch (error) {
            
            console.error("Error en pagar:", error);
            throw { status: error.status || 500, message: error.message || "Error al procesar el pago" }
        }
    },
    
}
export default mventas