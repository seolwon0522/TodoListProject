import { useState, useEffect } from 'react';
import { authApi, userApi } from '../api';
import { LoginRequestDto, UserRequestDto, UserResponseDto } from '../types';

// 인증 상태 관리 훅
export const useAuth = () => {
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 현재 사용자 정보 조회
    const fetchCurrentUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await authApi.getCurrentUser();
            setUser(userData);
        } catch (err) {
            setUser(null);
            // 인증되지 않은 상태는 에러로 처리하지 않음
            if (err instanceof Error && !err.message.includes('401')) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // 로그인
    const login = async (data: LoginRequestDto) => {
        try {
            setError(null);
            const response = await authApi.login(data);
            setUser(response.user);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
            setError(errorMessage);
            throw err;
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            setError(null);
            await authApi.logout();
            setUser(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : '로그아웃에 실패했습니다.');
            throw err;
        }
    };

    // 회원가입
    const register = async (data: UserRequestDto) => {
        try {
            setError(null);
            const newUser = await userApi.register(data);
            return newUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
            setError(errorMessage);
            throw err;
        }
    };

    // 컴포넌트 마운트 시 현재 사용자 정보 조회
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return {
        user,
        loading,
        error,
        login,
        logout,
        register,
        fetchCurrentUser,
        isAuthenticated: !!user
    };
};

// 사용자 목록 관리 훅 (관리자용)
export const useUsers = () => {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 모든 사용자 조회
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 사용자 삭제
    const deleteUser = async (id: number) => {
        try {
            setError(null);
            await userApi.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : '사용자 삭제에 실패했습니다.');
            throw err;
        }
    };

    // 사용자 정보 수정
    const updateUser = async (id: number, data: Partial<UserRequestDto>) => {
        try {
            setError(null);
            const updatedUser = await userApi.updateUser(id, data);
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
            return updatedUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : '사용자 정보 수정에 실패했습니다.');
            throw err;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        deleteUser,
        updateUser
    };
}; 