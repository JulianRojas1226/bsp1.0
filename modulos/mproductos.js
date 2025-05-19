import db from "../config/db.js";
const mprod={
    tipo: async()=>{
        try {
            console.log("📌 Ejecutando consulta en la BD...");
            const [results] = await db.query("SELECT id, nombre FROM tipo_pr");
            console.log("🟢 Resultados obtenidos de la BD:", results)
            return results;
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    proveedor: async()=>{
        try {
            const [resultspro] = await db.query("SELECT NID, nombre from proveedor")
            console.log("🟢 Resultado   s obtenidos de la BD:", resultspro)
            return resultspro
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    insertdatos: async({ruta,nombre,tipo,cantidad,costo,proveedor,precio,cantidad_min})=>{
        try {
            await db.query("Insert into producto (nombre,tipo,cantidad,proveedor,precio,costo,dir,minimo_cant) values (?,?,?,?,?,?,?,?)",
                [nombre,tipo,cantidad,proveedor,precio,costo,ruta,cantidad_min]
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };
        }
    },
    mostpod: async()=>{
        try {
            const [resultprod] = await db.query("SELECT id,nombre,tipo,cantidad,proveedor,precio,dir FROM producto")
            console.log("🟢 Resultados obtenidos de la BD:", resultprod)
            return resultprod
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    cantadd: async({producto,cantidad,costo,proveedor})=>{
        try {
            await db.query("insert into producto_add(id,cantidad,proveedor,costo) values (?,?,?,?)",
                [producto,cantidad,proveedor,costo]
            )
            
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };            
        }
    },
    addproveedor: async({nid,nombre,celular,correo})=>{
        try {
            await db.query("insert into proveedor(NID,nombre,celular,correo) values (?,?,?,?)",
                [nid,nombre,celular,correo]
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos"};             
        }
    },
    lowstock: async()=>{
        try {
           const [resultsmin_prod]= await db.query("select nombre, cantidad from producto where cantidad < minimo_cant")
           return resultsmin_prod
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos"};
        }
    },
    filtro: async ({ filtro } = {}) => {
        try {
            // Si se recibe un filtro, busca productos que coincidan con el tipo
            // Si no hay filtro, busca todos los productos
            const query = filtro
                ? "SELECT id, nombre, tipo, cantidad, proveedor, precio, dir FROM producto WHERE tipo = ?"
                : "SELECT id, nombre, tipo, cantidad, proveedor, precio, dir FROM producto";

            // Ejecución de la consulta con parámetros cuando hay filtro
            const [productos] = await db.query(query, filtro ? [filtro] : []);
            console.log("Parámetro enviado al filtro:", filtro ? [filtro] : "Ninguno")
            console.log("Query ejecutada:", query, "Parámetros:", filtro ? [filtro] : []);
            return productos;
        } catch (err) {
            console.error("❌ Error al buscar productos:", err.message);
            throw { status: 500, message: "Error al cargar productos desde la base de datos" };
        }
    },
    buscarconfiltro: async({query,filtro}={})=>{
        try {
            const terminoBusqueda = `%${query}%`
            const [results] = await db.query("select id, nombre, tipo, cantidad, proveedor, precio, dir from producto where tipo = ? and nombre like ?",
                [filtro,terminoBusqueda]
            )
            return results
        } catch (err) {
            console.error("❌ Error en la consulta de filtro y búsqueda:", err.message);
            throw { status: 500, message: "Error al buscar productos con filtro." };
        }
    }, 
    buscar: async ({ query } = {}) => {
        try {
            const terminoBusqueda = `%${query}%`; // Añade los comodines para LIKE
            console.log("Término de búsqueda procesado:", terminoBusqueda);

            const [results] = await db.query(
                "SELECT id, nombre, tipo, cantidad, proveedor, precio, dir FROM producto WHERE nombre LIKE ?",
                [terminoBusqueda]
            );
            console.log("Resultados de búsqueda:", results);
            return results; // Devuelve los resultados al controlador
        } catch (err) {
            console.error("❌ Error en la consulta de búsqueda:", err.message);
            throw { status: 500, message: "Error al buscar productos en la base de datos." };
        }
    },
    borrar: async ({id}) =>{
        try {
            const [result] = await db.query("delete from producto where id = ?",
                [id]
            )
            console.log("Producto eliminado:", result)
        } catch (err) {
            console.error("❌ Error al eliminar el producto:", err.message);
            throw { status: 500, message: "Error al eliminar el producto de la base de datos." };
        }
    },
    actualizar: async({id, nombre, cantidad_min, precio, proveedor, tipo })=>{
        
        try {
            const [result] = await db.query(`UPDATE producto SET nombre = COALESCE(?, nombre),minimo_cant = COALESCE(?, minimo_cant),precio = COALESCE(?, precio),proveedor = COALESCE(?, proveedor),tipo = COALESCE(?, tipo) WHERE id = ?`,
            [nombre || null, cantidad_min || null, precio || null, proveedor || null, tipo || null, id])
        } catch (err) {
            console.error("❌ Error al actualizar el producto:", err.message);
            throw { status: 500, message: "Error al actualizar el producto en la base de datos." };
        }
    }
    

  
}

export default mprod