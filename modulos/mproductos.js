import fs from "fs"
import db from "../config/db.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import { v2 as cloudinary } from 'cloudinary';
const mprod={
    tipo: async()=>{
        try {
            console.log("📌 Ejecutando consulta en la BD...");
            const [results] = await db.query("SELECT id, nombre FROM tipo_pr");
           
            return results;
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    proveedor: async()=>{
        try {
            const [resultspro] = await db.query("SELECT NID, nombre from proveedor")
            
            return resultspro
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    insertdatos: async({ruta,nombre,tipo,cantidad,costo,proveedor,precio,cantidad_min,usuario,cloudinary_id})=>{
        try {
            await db.query("Insert into producto (nombre,tipo,cantidad,proveedor,precio,costo,dir,minimo_cant,empleado,cloudinary_id) values (?,?,?,?,?,?,?,?,?,)",
                [nombre,tipo,cantidad,proveedor,precio,costo,ruta,cantidad_min,usuario,cloudinary_id]
            )
        } catch (err) {
            console.error("❌ Error al guardar los datos en la base de datos:", err);
            throw { status: 500, message: "Error al guardar los datos" };
        }
    },
    mostpod: async()=>{
        try {
            const [resultprod] = await db.query("SELECT id,nombre,tipo,cantidad,proveedor,precio,dir FROM producto") 
            return resultprod
        } catch (err) {
            throw {status:500,message:"error al cargar datos"}
        }
    },
    cantadd: async({producto,cantidad,costo,proveedor,usuario})=>{
        try {
            await db.query("insert into producto_add(id_prod,cantidad,proveedor,costo,empleado) values (?,?,?,?,?)",
                [producto,cantidad,proveedor,costo,usuario]
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
    borrar: async ({id}) => {
        const coneccion = await db.getConnection();
        try {
            await coneccion.beginTransaction();

            // Obtener ruta de la imagen antes de eliminar el producto
            const [producto] = await coneccion.query("SELECT dir FROM producto WHERE id = ?", [id]);

            if (!producto.length) throw new Error("Producto no encontrado.");

            const imagePath = path.join(process.cwd(), "public", producto[0].dir);

            // Eliminar el producto de la base de datos
            const [result] = await coneccion.query("DELETE FROM producto WHERE id = ?", [id]);

            if (result.affectedRows === 0) throw new Error("No se pudo eliminar el producto.");

            // Verificar y eliminar imagen
            if (fs.existsSync(imagePath)) {
                await fs.promises.unlink(imagePath);
                console.log("✅ Imagen eliminada:", imagePath);
            } else {
                console.warn("⚠️ La imagen no existe en la ruta:", imagePath);
            }

        await coneccion.commit();
        console.log("✅ Producto eliminado correctamente:", result);

        return result;

        
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
    },
    not: async () => {
        try {
            const [result] = await db.query("select count(*) as total_not from producto where cantidad < minimo_cant")
            return result
        } catch (error) {
            console.error("❌ error al contar la cantidad de productos", error)
        }
    },
    duplicados: async () => {
        try {
            const [result] = await db.query("select nombre from PRODUCTO")
            console.log(result)
            return result
        } catch (error) {
            console.error("error al traer datos")
        }
    }
}

export default mprod