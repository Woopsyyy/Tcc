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

2. Create a new MySQL database.

3. Import the database schema:
   - Use a MySQL client (e.g., MySQL Workbench, phpMyAdmin) to import `database/init.sql` into your database.

4. Configure database connection:
   - Update `Server/config/db.js` with your database credentials if necessary.

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
