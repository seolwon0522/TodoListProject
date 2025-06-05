-- Create todo_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS todo_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    user_pw VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL
);

-- Create todo table if it doesn't exist
CREATE TABLE IF NOT EXISTS todo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20),
    difficulty VARCHAR(20),
    status VARCHAR(20),
    focus_duration_in_seconds BIGINT DEFAULT 0,
    target_date DATE,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES todo_users(id)
); 