import mindex from "../modulos/mindex.js";

const cindex ={
    get_index: async (req,res) => {
        try {
            const tipos = await mindex.mosttipo()
            const mesas = await mindex.mostmesa()
            res.render("index",{tipos,mesas})
        } catch (error) {
             console.error("Error:", error);
            res.status(500).send("Error interno del servidor");

        }
    },
    insertdatos: async(req,res)=>{
        try {
            const{fecha_hora,hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser}=req.body
            await mindex.insertardatos({fecha_hora,hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser})
            res.redirect("/res")
        } catch (err) {
            console.error("❌ Error al guardar los datos:", err);
            res.status(500).send("Error al guardar los datos.");  
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
    insertardatos: async({fecha_hora,hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser})=>{
        try {
            await db.query("insert into reservas(fecha_hora,hora,NID,nombre,correo,celular,tipo_re,cantidad_p,mesa_asig,obser) values (?,?,?,?,?,?,?,?,?)",
                [fecha_hora,hora,NID,nombre,correo,celular,tipos,cantidad_p,mesa_asig,obser]
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };
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
    getFechasReservadas: async (req, res) => {
        try {
            const fechareservada = await mindex.dia(); // Obtén las fechas reservadas desde tu modelo
            console.log("NADA DE NADA",fechareservada)
            res.json(fechareservada); // Envía las fechas al frontend como JSON
        } catch (err) {
            console.error("Error al obtener fechas reservadas:", err);
            res.status(500).json({ mensaje: "Error al obtener fechas reservadas" });
        }
    },
}
export default cindex