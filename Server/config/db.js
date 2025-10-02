const mysql = require('mysql2');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'attendance_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test a connection non-fatally to log status
pool.getConnection((err, connection) => {
  if (err) {
    console.warn('MySQL pool init warning:', err.code || err.message);
  } else {
    console.log('MySQL pool ready');
    connection.release();
  }
});

module.exports = pool;
