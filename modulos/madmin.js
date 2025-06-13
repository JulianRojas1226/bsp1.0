import db from "../config/db.js"

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
        const [result]= await db.query("")
    } catch (error) {
        
    }
 },
 traer_empleado:async () => {
    try {
        const [result] = await db.query("select nombre,cargo from empleado")
        return result
    } catch (error) {
        console.error ("no se pudieron traer los datos ",error)
    }
 },
 traer_egresos: async({fecha_inicio,fecha_fin,pago,empleado})=>{
    try {
        const result = await db.query("SELECT * from egresos")
        return result
    } catch (error) {
        console.error("datos no encontarados")
    }
 },
 traer_ventas: async({fecha_inicio,fecha_fin,empleado,pago})=>{
    try {
        const result = await db.query(``)
    } catch (error) {
        console.error ("no se pudieron traer los datos ",error)
    }
 }
}
export default madmin