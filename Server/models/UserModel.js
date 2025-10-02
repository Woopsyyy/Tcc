const db = require('../config/db');

class User {
  static create(userData, callback) {
    const { username, password, role } = userData;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], callback);
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  }

  static findAll(callback) {
    const query = 'SELECT * FROM users';
    db.query(query, callback);
  }

  static findByRole(role, callback) {
    const query = 'SELECT * FROM users WHERE role = ?';
    db.query(query, [role], callback);
  }
}

module.exports = User;
