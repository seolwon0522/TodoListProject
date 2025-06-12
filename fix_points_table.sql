USE todolist;

-- 기존 points 테이블 삭제
DROP TABLE IF EXISTS points;

-- 새로운 points 테이블 생성 (포인트 획득 이력 기록용)
CREATE TABLE points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    focus_time_used BIGINT NOT NULL,
    points_earned BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES todo_users(id) ON DELETE CASCADE
);

-- 테이블 구조 확인
DESCRIBE points; 