import { TodoStatus } from '@/types/Todo';

export const getBoardStyle = (status: TodoStatus): string => {
  switch (status) {
    case 'THINKING': return 'bg-gray-100';
    case 'FOCUSING': return 'bg-blue-100';
    case 'WAITING': return 'bg-yellow-100';
    case 'DONE': return 'bg-green-100';
    default: return 'bg-gray-100';
  }
};

export const statusLabels: Record<TodoStatus, string> = {
  THINKING: '할 예정 💭',
  FOCUSING: '작업중인 일 🔥',
  WAITING: '마감임박 ⏳',
  DONE: '완료 ✅',
}; 