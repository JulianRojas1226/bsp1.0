import mysql from 'mysql2/promise';

const db = mysql.createConnection(process.env.DATABASE_URL);

export default db;