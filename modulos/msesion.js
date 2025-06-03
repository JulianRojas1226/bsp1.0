import db from "../config/db.js";
const msesion ={
    costo_mes: async () => {
        try {
            const[results]= await db.query("select monthname(hora) as mes,year(hora) as año, sum(costo) as costos_mensual from egresos group by year(hora), month(hora) order by año,mes")
            return results
        } catch (error) {
             console.error("Error en la consulta SQL:", error);
        throw { status: 500, message: "Error al cargar datos." };
        }
    },
    ventas_meses: async()=> {
        try {
        const[result]= await db.query(`select month(hora) as mes
        ,monthname(hora) as nombre_mes, sum(total_p) as total_mensual
        from ventas_res
        group by month(hora)
        order by mes`)
        return result
        } catch (error) {
        console.error("Error en la consulta SQL:", error);
        throw { status: 500, message: "Error al cargar datos." };
        }
    },
    progresion_ventas: async () => {
            try {
            const [result]= await db.query(`select monthname(hora) as mes,

            year(hora) as año, sum(total_p) as totales

            from ventas_res
            group by year(hora), month(hora)
            order by año,mes`)
            return result
            } catch (error) {
            console.error("Error en la consulta SQL:", error);

            throw { status: 500, message: "Error al cargar datos." };
            }
    },
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
    }
    
}
export default msesion 