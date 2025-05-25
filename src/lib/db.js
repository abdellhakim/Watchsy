import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'suivi_series_films',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
