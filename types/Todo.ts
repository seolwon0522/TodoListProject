export type TodoStatus = 'THINKING' | 'FOCUSING' | 'WAITING' | 'DONE';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Todo {  // 클라이언트가 서버로부터 받는 데이터
    id: number;
    title: string;
    content?: string;
    status: TodoStatus;
    priority: Priority;
    difficulty: Difficulty;
    completed: boolean;
    targetDate?: string; // 마감일 
    focusDuration: number; // 집중한 시간 (초 단위)
    createdAt?: string;
    updatedAt?: string;
}

export interface TodoRequest { // 서버가 클라이언트로부터 기대하는 데이터
    title: string;
    content?: string;
    status?: TodoStatus; // 기본값이 THINKING이기에
    priority: Priority;
    difficulty: Difficulty;
    completed: boolean;
    targetDate?: string; // 마감일이 없을 수도 있으니
    focusDuration?: number;
} 