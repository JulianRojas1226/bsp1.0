import  mysql  from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config()
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
pool.getConnection()
    .then(connection => {
        console.log("✅ Conexión exitosa a la base de datos");
        connection.release(); // 🔹 Liberar la conexión después de probarla
    })
    .catch(err => {
        console.error("❌ Error al conectar a la base de datos:", err);
    });
export default pool