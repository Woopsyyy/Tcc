# TCC Project

A Node.js Express application with MySQL database for managing attendance and user authentication.

## Requirements

- Node.js (version 14 or higher)
- MySQL
- npm

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Tcc
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Database Setup

1. Ensure MySQL is installed and running on your system.

2. Create (or ensure) the database and tables exist. The app includes an initializer that will create tables and seed users on startup if the DB is reachable.

3. Configure database connection via environment variables (create a `.env` in project root):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=attendance_db
   JWT_SECRET=change_me
   ```

4. Start the app normally with `npm start`. On first run, it will attempt to create tables and seed users.

5. Seeded credentials (if tables empty):
   - admin / admin (role: teacher)
   - teacher1 / password (role: teacher)
   - student1 / password (role: student)
   - utility1 / password (role: utility_worker)

## Starting the Server

To start the development server:

```
npm start
```

The server will run on `http://localhost:3000`.

For development with auto-restart:

```
npm run dev
```

## How to Upload to Repository

1. Stage your changes:
   ```
   git add .
   ```

2. Commit your changes:
   ```
   git commit -m "Your commit message"
   ```

3. Push to the remote repository:
   ```
   git push origin main
   ```

## How to Update the Repository

To pull the latest changes from the repository:

```
git pull origin main
