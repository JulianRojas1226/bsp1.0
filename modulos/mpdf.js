import db from "../config/db.js"

const mpdf ={
        egresos: async ({fecha_inicio, fecha_fin, empleado, categoria_e}) => {
            console.log("Parámetros recibidos:", {fecha_inicio, fecha_fin, empleado, categoria_e});
        let query = "SELECT * FROM egresos WHERE 1=1";
        const params = [];
        
        if(fecha_inicio && fecha_fin){
            query += " AND date(hora) BETWEEN ? AND ?";
            params.push(fecha_inicio, fecha_fin);
        }
        
        if(categoria_e){
            query += " AND tipo = ?";
            params.push(categoria_e);
        }
        
        if(empleado){
            query += " AND empleado LIKE ?";
            params.push(`%${empleado}%`); // ← ESTE ERA EL PROBLEMA
        }
        
        try {
            console.log("Query:", query);
            console.log("Params:", params);
            
            const [result] = await db.query(query, params);
            console.log("datos egresos: ", result);
            return result;
        } catch (error) {
            console.error("No se pudieron traer los datos:", error);
            throw error; // Agregué throw para propagar el error
        }
        },
        egresos_d: async({fecha_inicio,fecha_fin,empleado,categoria_e})=>{
            let query = "select sum(costo) as total_e, COUNT(id) as cantidad_e from egresos where 1=1"
            const params = []
            if(fecha_inicio && fecha_fin){
                 query += " AND date(hora) BETWEEN ? AND ?";
                params.push(fecha_inicio, fecha_fin);
            }
            if(empleado){
            query += " AND empleado LIKE ?";
            params.push(`%${empleado}%`); // ← ESTE ERA EL PROBLEMA
            }
            if(categoria_e){
            query += " AND tipo = ?";
            params.push(categoria_e);
            }
            try {
                 console.log("Query:", query);
                console.log("Params:", params);
                const [result] = await db.query(query, params);
                console.log("datos egresos: ", result);
                return result;
            } catch (error) {
                console.error("No se pudieron traer los datos:", error);
                throw error;
            }
        },
    ventasDiarias: async (filtros) => {
        const {fecha_inicio, fecha_fin, empleado,metodo_p} = filtros || {};
    try {
        let query = `
            SELECT 
                DATE(hora) as fecha,
                sum(cantidad) as cantidad_ventas,
                SUM(total_p) as total_ventas
            FROM ventas_res 
            WHERE 1=1
        `;
        
        const params = [];
        
        // Agregar filtros dinámicos
        if(fecha_inicio && fecha_fin){
            query += " AND date(hora) BETWEEN ? AND ?";
            params.push(fecha_inicio, fecha_fin);
        }
        
        if(metodo_p){
            query += " AND pago = ?";
            params.push(metodo_p);
        }
        
        if(empleado){
            query += " AND empleado LIKE ?";
            params.push(`%${empleado}%`);
        }
        
        query += `
            GROUP BY DATE(hora)
            ORDER BY fecha
        `;
        console.log("parametros para grafico: ", params)
        const [datos] = await db.query(query, params);
        return datos;
    } catch (error) {
        console.error("Error al obtener ventas diarias:", error);
        throw error;
    }
},

ventasPorCategoria: async (filtros) => {
    const {fecha_inicio, fecha_fin, empleado,tipo_pr} = filtros || {};
    try {
        let query = `
            SELECT 
                tp.nombre AS categoria,
                SUM(vr.cantidad) AS cantidad_vendida,
                SUM(vr.total_p) AS total_ingresos
            FROM ventas_res vr
            JOIN tipo_pr tp ON vr.tipo = tp.id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Agregar filtros dinámicos
        if(fecha_inicio && fecha_fin){
            query += " AND date(vr.hora) BETWEEN ? AND ?";
            params.push(fecha_inicio, fecha_fin);
        }
        
        if(tipo_pr){
            query += " AND tp.id = ?";
            params.push(tipo_pr);
        }
        
        if(empleado){
            query += " AND vr.empleado LIKE ?";
            params.push(`%${empleado}%`);
        }
        
        query += `
            GROUP BY tp.nombre
            ORDER BY total_ingresos DESC
        `;
        
        const [datos] = await db.query(query, params);
        console.log("datos categoria", datos);
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
            return datos;
        } catch (error) {
            console.error("Error al obtener comparativo anual:", error);
            throw error;
        }
    },
ventas: async ({fecha_inicio, fecha_fin, empleado,metodo_p}) => {
        
        
        let query = "SELECT * FROM ventas_res WHERE 1=1";
        const params = [];
        
        // Filtro por rango de fechas
        if(fecha_inicio && fecha_fin){
            query += " AND DATE(hora) BETWEEN ? AND ?";
            params.push(fecha_inicio, fecha_fin);
        }
        if(metodo_p){
            query += " and pago = ?";
            params.push(metodo_p);
        }
        
        // Ordenar por fecha más reciente
        query += " ORDER BY hora DESC";
        
        try {
            console.log("Query ventas:", query);
            console.log("Params ventas:", params);
            
            const [result] = await db.query(query, params);
            console.log("Datos ventas:", result);
            return result;
        } catch (error) {
            console.error("No se pudieron traer los datos de ventas:", error);
            throw error;
        }
    },
    pagos: async ({fecha_inicio, fecha_fin, metodo_p, empleado}) => {
        
        
        let query = "SELECT * FROM pagos WHERE 1=1";
        const params = [];
        
        // Filtro por rango de fechas
        if(fecha_inicio && fecha_fin){
            query += " AND DATE(fecha_inicio)<= ? AND ?<=date(fecha_fin)";
            params.push(fecha_inicio, fecha_fin);
        }
        
        // Filtro por método de pago
        if(metodo_p){
            query += " AND metodo_pago = ?";
            params.push(metodo_p);
        }
        
        // Filtro por total mínimo
        if(empleado){
            query += " AND empleado like ?";
            params.push(empleado);
        }
        // Ordenar por fecha más reciente
        query += " ORDER BY fecha_inicio DESC";
        
        try {
            console.log("Query pagos:", query);
            console.log("Params pagos:", params);
            
            const [result] = await db.query(query, params);
            console.log("Datos pagos:", result);
            return result;
        } catch (error) {
            console.error("No se pudieron traer los datos de pagos:", error);
            throw error;
        }
    },
    pagos_d: async ({fecha_inicio, fecha_fin, metodo_p, empleado}) => {
        

        let query = "SELECT sum(total) as total_p, count(id) as cantidad_p FROM pagos WHERE 1=1";
        const params = [];
        
        // Filtro por rango de fechas
        if(fecha_inicio && fecha_fin){
            query += " AND DATE(fecha_inicio)<= ? AND ?<=date(fecha_fin)";
            params.push(fecha_inicio, fecha_fin);
        }
        
        // Filtro por método de pago
        if(metodo_p){
            query += " AND metodo_pago = ?";
            params.push(metodo_p);
        }
        
        // Filtro por total mínimo
        if(empleado){
            query += " AND empleado like ?";
            params.push(empleado);
        }
        // Ordenar por fecha más reciente
        query += " ORDER BY fecha_inicio DESC";
        
        try {
            console.log("Query pagos:", query);
            console.log("Params pagos:", params);
            
            const [result] = await db.query(query, params);
            console.log("Datos pagos:", result);
            return result;
        } catch (error) {
            console.error("No se pudieron traer los datos de pagos:", error);
            throw error;
        }
    },
    obtenerMargen: async ({ fecha_inicio, fecha_fin, empleado, metodo_p,categoria_e }) => {
  const params = [];

  // Filtros para pagos
  let wherePagos = 'WHERE 1=1';
  if (fecha_inicio && fecha_fin) {
    wherePagos += ' AND DATE(p.fecha_inicio) BETWEEN ? AND ?';
    params.push(fecha_inicio, fecha_fin);
  }
  if (empleado) {
    wherePagos += ' AND p.empleado LIKE ?';
    params.push(`%${empleado}%`);
  }
  if (metodo_p) {
    wherePagos += ' AND p.metodo_pago = ?';
    params.push(metodo_p);
  }

  // Filtros para egresos
  let whereEgresos = 'WHERE 1=1';
  if (fecha_inicio && fecha_fin) {
    whereEgresos += ' AND DATE(e.hora) BETWEEN ? AND ?';
    params.push(fecha_inicio, fecha_fin);
  }
  if (empleado) {
    whereEgresos += ' AND e.empleado LIKE ?';
    params.push(`%${empleado}%`);
  }
  if(categoria_e){
    whereEgresos += ' and e.tipo = ?'
    params.push(categoria_e)
  }

  const query = `
    SELECT 
      total_ventas,
      total_costos,
      ROUND((total_ventas - total_costos), 2) AS ganancia_neta,
      ROUND(((total_ventas - total_costos) / total_ventas) * 100, 2) AS margen_porcentaje
    FROM (
      SELECT 
        (SELECT SUM(p.total) FROM pagos p ${wherePagos}) AS total_ventas,
        (SELECT SUM(e.costo) FROM egresos e ${whereEgresos}) AS total_costos
    ) AS resumen;
  `;

  try {
    const [rows] = await db.query(query, params);
    return rows[0]; // Un solo resultado
  } catch (error) {
    console.error("❌ Error al obtener el margen de ganancia:", error);
    throw error;
  }
}

}
export default mpdf