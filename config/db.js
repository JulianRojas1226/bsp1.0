import  mysql  from "mysql2/promise";

const pool =  mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "bassprod",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})
pool.getConnection()
    .then(connection => {
        console.log("✅ Conexión exitosa a la base de datos");
        connection.release(); // 🔹 Liberar la conexión después de probarla
    })
    .catch(err => {
        console.error("❌ Error al conectar a la base de datos:", err);
    });
export default pool