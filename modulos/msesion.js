import db from "../config/db.js";
const msesion ={
    grafico_masvendidos: async()=>{
        try {
            const [result]= await db.query(`select producto, sum(cantidad) as total_vendido
                from ventas_res group by producto order by total_vendido desc limit 6`)
            return result
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
    }
}
export default msesion 