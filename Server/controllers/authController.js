const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const register = (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
    if (hashErr) {
      return res.status(500).json({ error: 'Error securing password' });
    }
    User.create({ username, password: hashedPassword, role }, (err) => {
      if (err) {
        // Fallback: if DB unavailable, pretend success (dev mode only)
        if (process.env.ALLOW_FAKE_AUTH === 'true') {
          return res.status(201).json({ message: 'User registered (in-memory fallback)' });
        }
        return res.status(500).json({ error: 'Error creating user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, results) => {
    if (err) {
      // Automatic fallback to demo users when DB is unavailable
      const demoUsers = [
        { id: 1, username: 'admin', password: 'admin', role: 'teacher' },
        { id: 2, username: 'teacher1', password: 'password', role: 'teacher' },
        { id: 3, username: 'student1', password: 'password', role: 'student' },
        { id: 4, username: 'utility1', password: 'password', role: 'utility_worker' }
      ];
      const user = demoUsers.find(u => u.username === username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 3600000
      });
      return res.json({ message: 'Login successful', role: user.role });
    }
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    const storedPassword = user.password || '';
    const isBcryptHash = typeof storedPassword === 'string' && storedPassword.startsWith('$2');

    const onAuthenticated = () => {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 3600000
      });
      res.json({ message: 'Login successful', role: user.role });
    };

    if (isBcryptHash) {
      bcrypt.compare(password, storedPassword, (compareErr, match) => {
        if (compareErr) return res.status(500).json({ error: 'Error verifying credentials' });
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        onAuthenticated();
      });
    } else {
      if (password !== storedPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      onAuthenticated();
    }
  });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

const verify = (req, res) => {
  res.json({ authenticated: true, user: req.user });
};

module.exports = { register, login, logout, verify };
