-- Points 테이블 구조 변경을 위한 마이그레이션 스크립트

-- 1. 기존 데이터 백업 (혹시 모를 상황에 대비)
CREATE TABLE points_backup AS SELECT * FROM points;

-- 2. 기존 points 테이블 삭제
DROP TABLE IF EXISTS points;

-- 3. 새로운 points 테이블 생성
CREATE TABLE points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    focus_time_used BIGINT NOT NULL,
    points_earned BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES todo_users(id)
);

-- 4. 인덱스 생성 (성능 향상)
CREATE INDEX idx_points_user_id ON points(user_id);
CREATE INDEX idx_points_created_at ON points(created_at);

-- 5. 확인용 쿼리
SELECT 'Points 테이블 마이그레이션 완료' AS status;
DESCRIBE points; 