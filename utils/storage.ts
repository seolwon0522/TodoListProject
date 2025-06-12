// localStorage 관련 공통 유틸 함수

/**
 * localStorage에서 안전하게 값을 읽어오는 함수
 */
export const getLocalStorage = <T = any>(key: string, defaultValue: T = undefined as unknown as T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
}; 