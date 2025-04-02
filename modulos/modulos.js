import bcrypt from "bcrypt"
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
    }
}   
export default mlogin   