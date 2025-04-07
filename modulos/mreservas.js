import db from "../config/db.js";
const mres ={
    insertardatos: async({fecha_hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser})=>{
        try {
            await db.query("insert into reservas(fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser) values (?,?,?,?,?,?,?,?,?)",
                [fecha_hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser]
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };
        }
    },
    mosttipo: async()=>{
        try {
            const [results]= await db.query("select tipo,nombre from tipo_re")
            return results
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    mostmesa: async()=>{
        try {
            const disponible = 'disponible'
            const [results] = await db.query("select ID from mesa where estado = ?",
                [disponible]
            )
            return results
        } catch (err) {
            throw {status:500,message:"error al cargar datos DE MESA"}  
        }
    }


}
export default mres