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
            const [results] = await db.query("select ID from mesa")
            return results
        } catch (err) {
            throw {status:500,message:"error al cargar datos DE MESA"}  
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
    filtroD_M: async({dia,mes}={})=>{
        try {
            const queryselect =" select id_re,fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser from reservas where dayofweek(fecha_hora) = ? and month(fecha_hora)=?"
            const params=[dia,mes]
            const [results]= await db.query(queryselect,params)
            return results
        } catch (error) {
            throw {status:500,message:"error al cargar datos"} 
        }
    },
    filtroD: async({dia}={})=>{
        try {
            const queryselect =" select id_re,fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser from reservas where dayofweek(fecha_hora) = ? "
            const params=[dia]
            const [results]= await db.query(queryselect,params)
            return results
        } catch (error) {
            throw {status:500,message:"error al cargar datos"} 
        }
    },
    filtroM: async({mes}={})=>{
        try {
            const queryselect =" select id_re,fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser from reservas where month(fecha_hora) = ? "
            const params=[mes]
            const [results]= await db.query(queryselect,params)
            return results
        } catch (error) {
            throw {status:500,message:"error al cargar datos"} 
        }
    },
    buscar: async({query}={})=>{
        try {
            const termino_busqueda = `%${query}%`
            const [result] = await db.query("select id_re,fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser from reservas where nombre like ? ",[termino_busqueda])
            return result
        } catch (error) {
            throw {status:500,message:"error al cargar datos"} 
        }
    },
    totalbuscar: async({dia,mes,query}={})=>{
        try {
            const termino_busqueda = `%${query}%`
            const queryselect =" select id_re,fecha_hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser from reservas where dayofweek(fecha_hora) = ? and month(fecha_hora)=? and nombre like ?"
            const params=[dia,mes,termino_busqueda]
            const [results]= await db.query(queryselect,params)
            return results
        } catch (error) {
            throw {status:500,message:"error al cargar datos"} 
        }
    },
    dia: async () => {
        try {
            // Ejecuta el query y selecciona las fechas formateadas
            const [fechareservada] = await db.query("select date_FORMAT(fecha_hora, '%Y-%m-%d') as fecha from reservas");
            // Mapea el campo "fecha" correctamente
            console.log(fechareservada)
            return fechareservada.map(row => row.fecha);
        } catch (error) {
            throw { status: 500, message: "Error al cargar datos" };
        }
    },
    borrar: async({id})=>{
        try {
            const [result] = await db.query("delete from reservas where id_re = ?", [id])
           
            console.log("Producto eliminado:", result)
        } catch (err) {
            console.error("❌ Error al eliminar la reserva:", err.message);
            throw { status: 500, message: "Error al eliminar la reserva de la base de datos." };
        }
    },
    actualizar: async({id,fecha_hora_act,hora_act,nombre_act,celular_act,correo_act,tipo_re,cantidad_p_act,obser_act})=>{
        try {
            const [result]= await db.query(`UPDATE reservas SET fecha_hora = COALESCE(?, fecha_hora),hora = COALESCE(?, hora),nombre = COALESCE(?, nombre),celular = COALESCE(?, celular),correo = COALESCE(?, correo),tipo_re = COALESCE(?, tipo_re),cantidad_p = COALESCE(?, cantidad_p),obser = COALESCE(?, obser)WHERE id_re = ?`,
                [fecha_hora_act || null, 
                    hora_act || null, 
                    nombre_act || null, 
                    celular_act || null, 
                    correo_act || null, 
                    tipo_re || null, 
                    cantidad_p_act || null, 
                    obser_act || null, 
                    id
                    ]
            )
        } catch (err) {
            console.error("❌ Error al actualizar el producto:", err.message);
            throw {status: 500, message: "Error al actualizar el producto en la base de datos." }; 
        }
    },

}
export default mres