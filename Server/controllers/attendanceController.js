const Attendance = require('../models/AttendanceModel');

const createAttendance = (req, res) => {
  const { user_id, date, time_in, time_out } = req.body;
  Attendance.create({ user_id, date, time_in, time_out }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creating attendance' });
    res.status(201).json({ message: 'Attendance recorded' });
  });
};

const getAllAttendance = (req, res) => {
  Attendance.findAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

const getAttendanceByUser = (req, res) => {
  const { user_id } = req.params;
  Attendance.findByUserId(user_id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

const getStats = (req, res) => {
  Attendance.getStatsByRole((err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

module.exports = { createAttendance, getAllAttendance, getAttendanceByUser, getStats };
