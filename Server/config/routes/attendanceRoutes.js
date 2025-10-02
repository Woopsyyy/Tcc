const express = require('express');
const { createAttendance, getAllAttendance, getAttendanceByUser, getStats } = require('../../controllers/attendanceController');
const router = express.Router();

router.post('/', createAttendance);
router.get('/', getAllAttendance);
router.get('/user/:user_id', getAttendanceByUser);
router.get('/stats', getStats);

module.exports = router;
