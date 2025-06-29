import bcrypt, { hash } from "bcryptjs"
import  db from "../config/db.js";
const mlogin = {
    creacion: async (usuario) => {
        try {
          const hash = await bcrypt.hash(String(usuario.password), 10);
          const [results] = await db.query(
            "INSERT INTO empleado (codigo,nombre,correo,cargo) values (?,?,?,?)",
            [hash,usuario.nombre_r,usuario.correo,1]
          );
          return results;
        } catch (err) {
          throw {
            status: 500,
            message: `Error al crear el usuario ${usuario.nombre_r}`,
          };
        }},
    autenticacionlogi: async (usuario)=>{
        try { 
            
            const [results] = await db.query("select * from empleado where nombre = ?",
            [usuario])
            return results

        } catch (err) {
            throw {
                status: 500,
                message: `Error al obtener el usuario ${usuario}`,
              };
        }
      },
      buscaremail: async ({email}) => {
        try {
          const [emails]= await db.query("select * from empleado where correo = ?",[email])
          return emails[0]
        } catch (error) {
          throw { status: 500, message: "Error al encontrar datos" }
        }
      },
      mostrarcargo: async()=>{
        try {
          console.log("📌 Ejecutando consulta en la BD...");
          const [result] = await db.query("SELECT id,cargo from cargo")
          console.log("datos a pasar", result)
          return result
        } catch (error) {
          throw { status: 500, message: "Error al encontrar datos" }    
        }
      }
    
}   
export default mlogin   