import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db = null;

async function createConnection() {
    try {
        db = await mysql.createConnection({
            uri: process.env.MYSQL_URL,
            connectTimeout: 60000
        });
        console.log("✅ Conexión a BD exitosa");
        return db;
    } catch (error) {
        console.error("❌ Error al conectar a BD:", error.message);
        return null;
    }
}

// Crear conexión al importar el módulo
db = await createConnection();

export default db;