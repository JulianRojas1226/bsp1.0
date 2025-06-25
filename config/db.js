// import-db.js
import mysql from 'mysql2/promise';
import fs from 'fs';

async function importSQL() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Leer archivo SQL
  const sqlFile = fs.readFileSync('./database.sql', 'utf8');
  
  // Ejecutar cada statement
  const statements = sqlFile.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.execute(statement);
    }
  }
  
  console.log('Base de datos importada exitosamente');
  await connection.end();
}

importSQL().catch(console.error);