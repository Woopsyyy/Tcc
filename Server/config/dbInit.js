const fs = require('fs');
const path = require('path');
const pool = require('./db');

function runQuery(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function initializeDatabase() {
  const createUsers = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'utility_worker') NOT NULL DEFAULT 'student'
  )`;

  const createAttendance = `CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    time_in TIME,
    time_out TIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

  const seedUsers = `INSERT IGNORE INTO users (id, username, password, role) VALUES
    (1, 'admin', 'admin', 'teacher'),
    (2, 'teacher1', 'password', 'teacher'),
    (3, 'student1', 'password', 'student'),
    (4, 'utility1', 'password', 'utility_worker')`;

  try {
    await runQuery(createUsers);
    await runQuery(createAttendance);
    await runQuery(seedUsers);
    console.log('Database initialized and seeded');
  } catch (err) {
    console.warn('Database initialization failed:', err.code || err.message);
    throw err;
  }
}

module.exports = { initializeDatabase };

