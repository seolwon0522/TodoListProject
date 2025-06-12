USE todolist;

DROP TABLE IF EXISTS points;

CREATE TABLE points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    focus_time_used BIGINT NOT NULL,
    points_earned BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES todo_users(id) ON DELETE CASCADE
); 