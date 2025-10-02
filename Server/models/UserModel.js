let db;
try {
  db = require('../config/db');
} catch (err) {
  db = null;
}

class User {
  static create(userData, callback) {
    const { username, password, role } = userData;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    if (!db) return callback(new Error('DB unavailable'));
    db.query(query, [username, password, role], callback);
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    if (!db) return callback(new Error('DB unavailable'));
    db.query(query, [username], callback);
  }

  static findAll(callback) {
    const query = 'SELECT * FROM users';
    if (!db) return callback(new Error('DB unavailable'));
    db.query(query, callback);
  }

  static findByRole(role, callback) {
    const query = 'SELECT * FROM users WHERE role = ?';
    if (!db) return callback(new Error('DB unavailable'));
    db.query(query, [role], callback);
  }
}

module.exports = User;
