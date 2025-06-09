import axios from 'axios';
import { TodoRequestDto, TodoResponseDto, Status, UserRequestDto, UserResponseDto, LoginRequestDto, PointResponseDto } from './types';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
});

// 인증 관련 API 함수들
export const authApi = {
    // 로그인
    login: async (data: LoginRequestDto): Promise<{ message: string; user: UserResponseDto }> => {
        const response = await api.post('/users/login', data);
        return response.data;
    },

    // 로그아웃
    logout: async (): Promise<void> => {
        await api.post('/logout');
    },

    // 현재 사용자 정보 조회
    getCurrentUser: async (): Promise<UserResponseDto> => {
        const response = await api.get('/users/me');
        return response.data;
    }
};

// 사용자 관리 API 함수들
export const userApi = {
    // 회원가입
    register: async (data: UserRequestDto): Promise<UserResponseDto> => {
        const response = await api.post('/users/register', data);
        return response.data;
    },

    // 모든 사용자 조회 (관리자용)
    getAllUsers: async (): Promise<UserResponseDto[]> => {
        const response = await api.get('/users/list');
        return response.data;
    },

    // 사용자 정보 수정
    updateUser: async (id: number, data: Partial<UserRequestDto>): Promise<UserResponseDto> => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    // 사용자 삭제
    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    }
};

// Todo API 함수들
export const todoApi = {
    // 할 일 생성
    createTodo: async (data: TodoRequestDto): Promise<TodoResponseDto> => {
        const response = await api.post('/todos', data);
        return response.data;
    },

    // 모든 할 일 조회
    getAllTodos: async (): Promise<TodoResponseDto[]> => {
        const response = await api.get('/todos');
        return response.data;
    },

    // 특정 할 일 조회
    getTodoById: async (id: number): Promise<TodoResponseDto> => {
        const response = await api.get(`/todos/${id}`);
        return response.data;
    },

    // 할 일 수정
    updateTodo: async (id: number, data: TodoRequestDto): Promise<TodoResponseDto> => {
        const response = await api.put(`/todos/${id}`, data);
        return response.data;
    },

    // 할 일 삭제
    deleteTodo: async (id: number): Promise<void> => {
        await api.delete(`/todos/${id}`);
    },

    // 상태별 할 일 조회 (칸반보드용)
    getTodosByStatus: async (status: Status): Promise<TodoResponseDto[]> => {
        const response = await api.get(`/todos/status/${status}`);
        return response.data;
    },

    // 할 일 상태 변경 (칸반보드용)
    updateTodoStatus: async (id: number, status: Status): Promise<TodoResponseDto> => {
        const response = await api.patch(`/todos/${id}/status?status=${status}`);
        return response.data;
    },

    // 집중시간 업데이트
    updateFocusTime: async (id: number, focusTime: number): Promise<TodoResponseDto> => {
        const response = await api.patch(`/todos/${id}/focus-time?focusTime=${focusTime}`);
        return response.data;
    }
};

// Point API 함수들
export const pointApi = {
    // 사용자 포인트 조회
    getUserPoints: async (userId: number): Promise<PointResponseDto> => {
        const response = await api.get(`/points/${userId}`);
        return response.data;
    },

    // 포인트 계산 및 업데이트
    calculateAndUpdatePoints: async (userId: number): Promise<PointResponseDto> => {
        const response = await api.post(`/points/${userId}/calculate`);
        return response.data;
    }
};

export default api;
