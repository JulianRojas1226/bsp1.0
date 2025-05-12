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
    }
}
export default msesion 