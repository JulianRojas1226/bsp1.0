import bcrypt, { hash } from "bcrypt"
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
      actualizar_contraseña: async({email,nuevaContraseña})=>{
        try {
          hash = await bcrypt.hash(nuevaContraseña,10)
        const [result] = await db.query("update empleado set codigo = ? where correo = ?",
          [hash,email]
        )
        return result
        } catch (error) {
          throw {
            status: 500,
            message: `Error al crear el usuario ${usuario.nombre_r}`,
          }
        }
      }
    
}   
export default mlogin   