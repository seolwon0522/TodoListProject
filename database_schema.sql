-- ===================================
-- TodoList 프로젝트 데이터베이스 스키마
-- ===================================

-- 1. todo_users 테이블 (사용자 정보)
CREATE TABLE todo_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,          -- 로그인 ID
    user_pw VARCHAR(255) NOT NULL,                 -- 암호화된 비밀번호
    user_name VARCHAR(255) NOT NULL,               -- 사용자 이름
    total_focus_time BIGINT DEFAULT 0,             -- 총 집중시간 (초 단위) ⭐ 새로 추가
    INDEX idx_user_id (user_id)
);

-- 2. todo 테이블 (할 일 정보)
CREATE TABLE todo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                   -- 할 일 제목
    description TEXT,                              -- 할 일 상세 설명
    status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',  -- 할 일 상태
    total_focus_time BIGINT DEFAULT 0,             -- 개별 할 일의 집중시간 (초 단위)
    user_id BIGINT NOT NULL,                       -- 사용자 외래키
    FOREIGN KEY (user_id) REFERENCES todo_users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_user_id (user_id)
);

-- 3. points 테이블 (포인트 획득 이력) ⭐ 완전히 새로운 구조
CREATE TABLE points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,                       -- 사용자 외래키
    focus_time_used BIGINT NOT NULL,               -- 이번에 포인트로 변환된 집중시간 (초)
    points_earned BIGINT NOT NULL,                 -- 획득한 포인트 (focus_time_used ÷ 60)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 포인트 획득 시각
    FOREIGN KEY (user_id) REFERENCES todo_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ===================================
-- 테이블 간 관계 설명
-- ===================================
/*
1. todo_users (1) ←→ (N) todo
   - 한 사용자는 여러 할 일을 가질 수 있음
   - 사용자 삭제 시 모든 할 일도 삭제 (CASCADE)

2. todo_users (1) ←→ (N) points  
   - 한 사용자는 여러 포인트 기록을 가질 수 있음
   - 사용자 삭제 시 모든 포인트 기록도 삭제 (CASCADE)
   - ⭐ todo와 points는 직접 연결되지 않음 (독립적)

3. 집중시간 흐름:
   개별 todo.total_focus_time → 합계 → todo_users.total_focus_time → points.focus_time_used
*/

-- ===================================
-- 샘플 데이터
-- ===================================

-- 사용자 데이터 (비밀번호는 암호화되어 저장됨)
INSERT INTO todo_users (user_id, user_pw, user_name, total_focus_time) VALUES
('testuser', '$2a$10$...', '테스트사용자', 0);

-- 할 일 데이터
INSERT INTO todo (title, description, status, total_focus_time, user_id) VALUES
('프로젝트 기획', '새 프로젝트 기획서 작성', 'TODO', 0, 1),
('코딩 공부', 'Java Spring 학습', 'IN_PROGRESS', 120, 1),
('운동하기', '헬스장에서 운동', 'DONE', 180, 1);

-- 포인트 기록 (포인트 계산 버튼을 눌렀을 때 생성됨)
INSERT INTO points (user_id, focus_time_used, points_earned, created_at) VALUES
(1, 300, 5, '2024-01-01 10:00:00'),  -- 300초(5분) = 5포인트
(1, 240, 4, '2024-01-02 14:30:00');  -- 240초(4분) = 4포인트

-- ===================================
-- 주요 조회 쿼리 예시
-- ===================================

-- 사용자의 총 포인트 조회
SELECT SUM(points_earned) as total_points 
FROM points 
WHERE user_id = 1;

-- 사용자의 총 집중시간 조회 (실시간)
SELECT total_focus_time 
FROM todo_users 
WHERE id = 1;

-- 사용자의 포인트 획득 이력 조회
SELECT focus_time_used, points_earned, created_at 
FROM points 
WHERE user_id = 1 
ORDER BY created_at DESC;

-- 사용자의 할 일별 집중시간 조회
SELECT title, total_focus_time, status 
FROM todo 
WHERE user_id = 1; 