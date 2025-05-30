
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
            const [results] = await db.query("select id,nombre,cantidad from producto where cantidad > 0")
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
    duplicar_orden: async ({id}) => {
        const coneccion = await db.getConnection()
        try {
            await coneccion.beginTransaction()
            const [orden]= await coneccion.query(`select mesa_id,id_prod,cantidad from detalles_p where id = ?`, [id])
            const {mesa_id,id_prod,cantidad}=orden[0]
            await coneccion.query(`insert into detalles_p(mesa_id,id_prod,cantidad) values (?,?,?)`,[mesa_id,id_prod,cantidad])
            await coneccion.commit()
        } catch (error) {
            console.error("Error al duplicar orden:", error);
            throw { status: 500, message: "Error al duplicar datos" };
    
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
            const[ordenes]= await coneccion.query(`
                select  HORA,id,mesa_id,id_prod,producto,precio_u,cantidad,total_p from detalles_p
                where mesa_id = ?
                `,[mesa])
            
            // insertar en ventas realizadas
            const[result_hora]= await coneccion.query(`
                select min(HORA) as hora_inicial
                from detalles_p
                where mesa_id = ?
                `,[mesa])
            const [result_total]= await coneccion.query(`
                select sum(total_p) as total_pagado
                from detalles_p
                where mesa_id = ? `,[mesa])
            const hora_inicial= result_hora[0]?.hora_inicial
            const total_pagado = result_total[0]?.total_pagado
            
            await coneccion.query(`
                insert into pagos(mesa,fecha_inicio,metodo_pago,total) values (?,?,?,?)`,[mesa,hora_inicial,pago,total_pagado]
            )
             
            for (const orden of ordenes) {
                await coneccion.query(`
                    INSERT INTO ventas_res (id_orden, hora, mesa, id_prod, producto, precio_u, cantidad, total_p, pago) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [orden.id, orden.HORA, orden.mesa_id, orden.id_prod, orden.producto, orden.precio_u, orden.cantidad, orden.total_p, pago]);
            }
    
            
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
    mostventas: async()=>{
        try {
            const [result]= await db.query("select id,mesa,fecha_inicio,fecha_fin,metodo_pago,total from pagos")
            return result
        } catch (error) {
            throw new error("no ingreso de datos");
            
        }
    },
    mostventau: async () => {
        try {
            const[result] = await db.query("select id,id_orden,hora,mesa,id_prod,producto,precio_u,cantidad,total_p,pago from ventas_res")
            return result
        } catch (error) {
            throw new error("no muestra datos")
        }
    },
    // filtro de ventas
    obtenerVentas: async({ inicio, fin, mes, dia, pago } = {})=> {
        let query = "SELECT id, id_orden, hora, mesa, id_prod, producto, precio_u, cantidad, total_p, pago FROM ventas_res WHERE 1=1";
        const params = [];

        if (inicio && fin) {
            query += " AND hora BETWEEN ? AND ?";
            params.push(inicio, fin);
        }

        if (mes) {
            query += " AND MONTH(hora) = ?";
            params.push(mes);
        }

        if (dia) {
            query += " AND DAYOFWEEK(hora) = ?";
            params.push(dia);
        }

        if (pago) {
            query += " AND pago = ?";
            params.push(pago);
        }

        query += " ORDER BY hora";

        try {
            const [result] = await db.query(query, params);
            return result;
        } catch (error) {
            console.error("Error en la consulta SQL:", error);
            throw { status: 500, message: "Error al cargar datos de la base de datos." };
        }

    },
    lowstock: async()=>{
        try {
           const [resultsmin_prod]= await db.query("select * from producto where cantidad < minimo_cant")
           return resultsmin_prod
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos"};
        }
    }
}
export default mventas