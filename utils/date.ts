// 날짜/시간 관련 공통 유틸 함수

/**
 * 초 단위 시간을 "00분 00초" 등으로 포맷
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '0초';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0 && remainingSeconds > 0) return `${minutes}분 ${remainingSeconds}초`;
  if (minutes > 0) return `${minutes}분`;
  return `${remainingSeconds}초`;
};

/**
 * 초 단위 시간을 "00시간 00분" 등으로 포맷
 */
export const formatFocusTime = (seconds?: number): string => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) {
    return '0초';
  }
  if (seconds < 60) return `${seconds}초`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분`;
  return `${Math.floor(seconds / 3600)}시간 ${Math.floor((seconds % 3600) / 60)}분`;
};

/**
 * D-day 계산 (D-3, D+2 등)
 */
export const calculateDday = (targetDate: string): string | null => {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
};

/**
 * D-day 일수만 반환 (숫자)
 */
export const getDdayNumber = (targetDate?: string): number | null => {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}; 