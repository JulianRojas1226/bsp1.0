import db from "../config/db.js"
import bcrypt, { hash } from "bcrypt"

const madmin={
 traer_categoria_e:async () => {
    try {
        const [result] = await db.query("SELECT * from tipo_egreso")
        return result
    } catch (error) {
        console.error ("no se pudieron traer los datos ",error)
    }
 },
 traer_metodo_pago:async () => {
    try {
        const [result]= await db.query("select * from tipo_pago")
        return result
    } catch (error) {
        console.error ("error al traer datos", error )
    }
 },
 traer_empleado:async () => {
    try {
        const [result] = await db.query("select nombre,cargo,estado from empleado")
        return result
    } catch (error) {
        console.error ("no se pudieron traer los datos ",error)
    }
 },
 traer_cargo: async () => {
    try {
        const [result] = await db.query("select id,cargo from cargo")
        return result
    } catch (error) {
        console.error("no se pudieron cargar datos")
    }
 },
 creacion: async (usuario) => {
        try {
          const hash = await bcrypt.hash(String(usuario.codigo), 10);
          const [results] = await db.query(
            "INSERT INTO empleado (codigo,nombre,correo,cargo) values (?,?,?,?)",
            [hash,usuario.nombre,usuario.correo,usuario.cargo]
          );
          return results;
        } catch (err) {
          throw {
            status: 500,
            message: `Error al crear el usuario ${usuario.nombre_r}`,
          };
        }},
 add_egreso: async({nombre,tipo,costo,usuario})=>{
    try {
        const result = await db.query("insert into egresos(nombre,tipo,costo,empleado) values(?,?,?,?)",[nombre,tipo,costo,usuario])
    } catch (error) {
        console.error("los datos del egreso no se pudieron registrar: ", error)
    }
 },
 traer_egresos:async ({ fecha_inicio, fecha_fin, categoria, empleado, nombre } = {}) => {
    let query = "SELECT * FROM egresos WHERE 1=1";
    const params = [];
    
    if (fecha_inicio && fecha_fin) {
        query += " AND hora BETWEEN ? AND ?";
        params.push(fecha_inicio, fecha_fin);
    }
    if (categoria) {
        query += " AND tipo = ?";
        params.push(categoria);
    }
    if (empleado) {
        query += " AND empleado = ?";
        params.push(empleado);
    }
    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

    query += " ORDER BY hora DESC";

    try {
        const [result] = await db.query(query, params);
        return result;
    } catch (error) {
        console.error("Error al traer egresos:", error);
        throw error;
    }
},
 traer_ventas: async({fecha_inicio,fecha_fin,empleado,pago})=>{
    let query = "SELECT * FROM pagos WHERE 1=1";
    if(fecha_inicio && fecha_fin)
    try {
    } catch (error) {
        console.error ("no se pudieron traer los datos ",error)
    }
 }
}
export default madmin