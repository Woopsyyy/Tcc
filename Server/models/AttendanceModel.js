const db = require('../config/db');

class Attendance {
  static create(attendanceData, callback) {
    const { user_id, date, time_in, time_out } = attendanceData;
    const query = 'INSERT INTO attendance (user_id, date, time_in, time_out) VALUES (?, ?, ?, ?)';
    db.query(query, [user_id, date, time_in, time_out], callback);
  }

  static findAll(callback) {
    const query = 'SELECT * FROM attendance';
    db.query(query, callback);
  }

  static findByUserId(user_id, callback) {
    const query = 'SELECT * FROM attendance WHERE user_id = ?';
    db.query(query, [user_id], callback);
  }

  static getStatsByRole(callback) {
    const query = `
      SELECT u.role, COUNT(DISTINCT u.id) as user_count, COUNT(a.id) as attendance_count
      FROM users u
      LEFT JOIN attendance a ON u.id = a.user_id
      GROUP BY u.role
    `;
    db.query(query, callback);
  }
}

module.exports = Attendance;
