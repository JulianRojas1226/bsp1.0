import db from "../config/db.js";
const msesion ={
    mostres: async()=>{
        try {
            const [results] = await db.query("select id_re,fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser from reservas")
            return results
        } catch (err) {
            throw {status:500,message:"error al cargar datos de reserva"} 
        }
    },
     most_prod: async () => {
        try {
            const [result] = await db.query(`select v.id_prod, v.producto, sum(v.cantidad) as total_vendido, p.dir 
                from ventas_res v
                join producto p on v.id_prod = p.id
                group by v.id_prod, v.producto, p.dir
                order by total_vendido desc
                `)
            return result            
        } catch (error) {
            console.error("Error en la consulta SQL:", error);
            throw { status: 500, message: "Error al cargar datos." };
        }
    },
    ventashoy: async () => {
        try {
            const [result] = await db.query("select count(*) as total, coalesce(sum(total_p),0) as total_pago from ventas_res where date(hora) = curdate()")
            console.log("datos traidos",result)    
            return result 
        } catch (error) {
            console.error("se ha producido un error", error)
        }
    },
    ventasemana: async () => {
        try {
            const [result] = await db.query("SELECT COUNT(*) AS total, COALESCE(SUM(total_p), 0) AS total_pago FROM ventas_res WHERE hora >= NOW() - INTERVAL 7 DAY")
            console.log("datos traidos meses",result)    
            return result || { total: 0, total_pago: 0 }
        } catch (error) {
            console.error("se ha producido un error", error)
        }
    },
    ventasmes:async () => {
        try {
            const [result] = await db.query("select count(*) as total, coalesce(sum(total_p),0) as total_pago from ventas_res where date(hora) >= CURDATE() - INTERVAL 30 DAY")
            console.log("datos traidos",result)    
            return result || { total: 0, total_pago: 0 }
        } catch (error) {
            console.error("se ha producido un error", error)
        }
    },
    ticketPromedio: async () => {
        try {
            const [result]=await  db.query("select avg(total_p) as promedio from ventas_res where date(hora) >= NOW() - INTERVAL 30 DAY")
            console.log("datos traidos", result)
            return result [0]
        } catch (error) {
            console.error("se ha producido un error: ",error)
        }
    },
    productosVendidos : async () => {
        try {
            const [row] = await db.query(`
                SELECT SUM(cantidad) AS total 
                FROM ventas_res
                WHERE hora >= NOW() - INTERVAL 30 DAY
            `);
            console.log("total vendido", row)
            return row
        } catch (error) {
            throw new Error("Error al obtener el total de productos vendidos");
        }
    },
    lowstock: async()=>{
        try {
           const [resultsmin_prod]= await db.query("select nombre, cantidad from producto where cantidad < minimo_cant")
           return resultsmin_prod
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos"};
        }
    },
    analisisProductos: async () => {
        try {
            const [productos] = await db.query(`
               SELECT 
                    p.id,
                    p.nombre,
                    p.precio,
                    p.Costo as costo,
                    p.cantidad as stock,
                    p.minimo_cant as stock_minimo,
                    COALESCE(SUM(vr.cantidad), 0) as total_vendido,
                    COALESCE(SUM(vr.cantidad * vr.precio_u), 0) as ingresos,
                    COALESCE(SUM((vr.cantidad * vr.precio_u)) - p.Costo, 0) as ganancia,
                    CASE 
                        WHEN p.cantidad <= p.minimo_cant THEN 'BAJO'
                        WHEN p.cantidad <= p.minimo_cant * 2 THEN 'MEDIO'
                        ELSE 'ALTO'
                    END as estado_stock,
                    ROUND(((SUM(vr.cantidad * vr.precio_u) - p.Costo) / p.Costo) * 100, 2) as margen_porcentaje
                FROM producto p
                LEFT JOIN ventas_res vr ON p.id = vr.id_prod 
                    AND DATE(vr.hora) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY p.id, p.nombre, p.precio, p.Costo, p.cantidad, p.minimo_cant, p.tipo, p.proveedor, p.empleado
                ORDER BY total_vendido DESC;
            `);
            console.log("productos vendidos", productos)
            return productos;
        } catch (error) {
            console.error("Error al obtener análisis de productos:", error);
            throw error;
        }
    },

    ventasDiarias: async () => {
        try {
            const [datos] = await db.query(`
                SELECT 
                    DATE(hora) as fecha,
                    sum(cantidad) as cantidad_ventas,
                    SUM(total_p) as total_ventas
                FROM ventas_res 
                WHERE DATE(hora) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY DATE(hora)
                ORDER BY fecha
            `);
            return datos;
        } catch (error) {
            console.error("Error al obtener ventas diarias:", error);
            throw error;
        }
    },

    ventasPorCategoria: async () => {
        try {
            const [datos] = await db.query(`
                SELECT 
                    tp.nombre AS categoria,
                    SUM(vr.cantidad) AS cantidad_vendida,
                    SUM(vr.total_p) AS total_ingresos
                FROM ventas_res vr
                JOIN tipo_pr tp ON vr.tipo = tp.id
                WHERE DATE(vr.hora) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY tp.nombre
                ORDER BY total_ingresos DESC
            `);
            console.log("datos categoria", datos)
            return datos;
        } catch (error) {
            console.error("Error al obtener ventas por categoría:", error);
            throw error;
        }
    },

    comparativoAnual: async () => {
        try {
            const [datos] = await db.query(`
                SELECT 
                    DATE_FORMAT(hora, '%Y-%m') as mes,
                    COUNT(*) as cantidad_ventas,
                    SUM(total_p) as total_ventas,
                    AVG(total_p) as ticket_promedio
                FROM ventas_res 
                WHERE DATE(hora) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(hora, '%Y-%m')
                ORDER BY mes
            `);
            console.log("dastos anuales", datos)
            return datos;
        } catch (error) {
            console.error("Error al obtener comparativo anual:", error);
            throw error;
        }
    }
}
export default msesion 