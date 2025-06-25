import bcrypt, { hash } from "bcryptjs"
import db from "../config/db.js"

const mcontraseña ={
    buscaremail: async ({email}) => {
        try {
          const [emails]= await db.query("select nombre from empleado where correo = ?",[email])
          return emails
        } catch (error) {
          throw { status: 500, message: "Error al encontrar datos" }
        }
      },
      actualizar_contraseña: async({email,nuevaContraseña})=>{
        try {
         const hash = await bcrypt.hash(nuevaContraseña,10)
        const [result] = await db.query("update empleado set codigo = ? where correo = ?",
          [hash,email]
        )
        return result
        } catch (error) {
          console.error("Error en actualizar_contraseña:", error); // Mostrar error real
          throw {
            status: 500,
            message: `Error al actualizar la contraseña para el usuario ${email}`,
            originalError: error.message,
          }
        }
      }
}
export default mcontraseña