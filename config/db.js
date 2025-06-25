import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Verificando variables de entorno:");
console.log("MYSQL_URL:", process.env.MYSQL_URL);

// Verificar que la URL existe
if (!process.env.MYSQL_URL) {
    console.error("❌ MYSQL_URL no está definida");
    process.exit(1);
}

let connection;

try {
    // Crear la conexión
    connection = await mysql.createConnection(process.env.MYSQL_URL);
    console.log("✅ Conexión creada exitosamente");
    
    // Probar la conexión
    const [rows] = await connection.query('SELECT 1 as ');
    console.log("✅ Conexión a la base de datos exitosa:", rows);
    
} catch (err) {
    console.error("❌ Error al conectar:", err.message);
    console.error("❌ Código de error:", err.code);
}

export default connection;