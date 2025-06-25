import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection = null;

async function createConnection() {
    try {
        connection = await mysql.createConnection({
            uri: process.env.MYSQL_URL,
            connectTimeout: 60000,
            acquireTimeout: 60000,
            timeout: 60000
        });
        console.log("✅ Conexión a BD exitosa");
        return connection;
    } catch (error) {
        console.error("❌ Error al conectar a BD:", error.message);
        return null;
    }
}

// Crear conexión al importar el módulo
connection = await createConnection();

export default connection;