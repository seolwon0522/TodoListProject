-- User 테이블에 total_focus_time 컬럼 추가
ALTER TABLE todo_users 
ADD COLUMN total_focus_time BIGINT DEFAULT 0 COMMENT '총 집중시간 (초 단위)';

-- 기존 사용자들의 total_focus_time을 계산하여 업데이트
UPDATE todo_users u 
SET total_focus_time = (
    SELECT COALESCE(SUM(t.total_focus_time), 0) 
    FROM todo t 
    WHERE t.user_id = u.id
);

-- 확인용 쿼리
SELECT id, user_id, user_name, total_focus_time 
FROM todo_users; 