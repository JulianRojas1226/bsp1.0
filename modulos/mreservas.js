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
    }

}
export default mres