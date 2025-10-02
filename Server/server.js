const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./config/db');
const authenticateToken = require('./middleware/auth');

let logCount = 0;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./config/routes/authRoutes');
const attendanceRoutes = require('./config/routes/attendanceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/attendance', authenticateToken, attendanceRoutes);

app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running with Bootstrap!' });
});

app.use((req, res, next) => {
  logCount++;
  if (logCount > 10) {
    console.clear();
    logCount = 1;
  }
  const timestamp = new Date().toISOString();
  console.log(`\x1b[36m[${timestamp}] \x1b[33m${req.method} \x1b[37m${req.url}\x1b[0m`);
  next();
});

// Start server
app.listen(PORT, () => {
  console.clear();
  console.log(`\x1b[32m

     ▄█  ▄██████▄     ▄████████    ▄█    █▄
    ███ ███    ███   ███    ███   ███    ███
    ███ ███    ███   ███    █▀    ███    ███
    ███ ███    ███   ███         ▄███▄▄▄▄███▄▄
    ███ ███    ███ ▀███████████ ▀▀███▀▀▀▀███▀
    ███ ███    ███          ███   ███    ███
    ███ ███    ███    ▄█    ███   ███    ███
█▄ ▄███  ▀██████▀   ▄████████▀    ███    █▀
▀▀▀▀▀▀

         ⚡ SERVER ONLINE ⚡
        🚀 Powered by: JOSH
     🌐 http://localhost:${PORT}

  \x1b[0m`);
});

// File watcher for logging changes
const watcher = chokidar.watch('.', { ignored: /node_modules/ });
watcher.on('change', (path) => {
  logCount++;
  if (logCount > 10) {
    console.clear();
    logCount = 1;
  }
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  console.log(`\x1b[32m[updated] ${date}: ${time} ${path}\x1b[0m`);
});
watcher.on('ready', () => {
  logCount++;
  if (logCount > 10) {
    console.clear();
    logCount = 1;
  }
  console.log('\x1b[36m[watching for changes]\x1b[0m');
});
