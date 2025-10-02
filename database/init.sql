CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'utility_worker') NOT NULL DEFAULT 'student'
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  date DATE,
  time_in TIME,
  time_out TIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, role) VALUES ('admin', 'admin', 'teacher');
INSERT INTO users (username, password, role) VALUES ('teacher1', 'password', 'teacher');
INSERT INTO users (username, password, role) VALUES ('student1', 'password', 'student');
INSERT INTO users (username, password, role) VALUES ('utility1', 'password', 'utility_worker');
