import { useState, useEffect } from 'react';
import { todoApi } from '../api';
import { TodoRequestDto, TodoResponseDto, Status } from '../types';

// 모든 할 일 관리 훅
export const useTodos = () => {
    const [todos, setTodos] = useState<TodoResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 모든 할 일 조회
    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await todoApi.getAllTodos();
            setTodos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '할 일을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 할 일 생성
    const createTodo = async (data: TodoRequestDto) => {
        try {
            setError(null);
            const newTodo = await todoApi.createTodo(data);
            setTodos(prev => [...prev, newTodo]);
            return newTodo;
        } catch (err) {
            setError(err instanceof Error ? err.message : '할 일 생성에 실패했습니다.');
            throw err;
        }
    };

    // 할 일 수정
    const updateTodo = async (id: number, data: TodoRequestDto) => {
        try {
            setError(null);
            const updatedTodo = await todoApi.updateTodo(id, data);
            setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
            return updatedTodo;
        } catch (err) {
            setError(err instanceof Error ? err.message : '할 일 수정에 실패했습니다.');
            throw err;
        }
    };

    // 할 일 삭제
    const deleteTodo = async (id: number) => {
        try {
            setError(null);
            await todoApi.deleteTodo(id);
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : '할 일 삭제에 실패했습니다.');
            throw err;
        }
    };

    // 할 일 상태 변경
    const updateTodoStatus = async (id: number, status: Status) => {
        try {
            setError(null);
            const updatedTodo = await todoApi.updateTodoStatus(id, status);
            setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
            return updatedTodo;
        } catch (err) {
            setError(err instanceof Error ? err.message : '상태 변경에 실패했습니다.');
            throw err;
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return {
        todos,
        loading,
        error,
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        updateTodoStatus
    };
};

// 상태별 할 일 관리 훅 (칸반보드용)
export const useTodosByStatus = () => {
    const [todosByStatus, setTodosByStatus] = useState<{
        [key in Status]: TodoResponseDto[]
    }>({
        TODO: [],
        IN_PROGRESS: [],
        DONE: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 상태별 할 일 조회
    const fetchTodosByStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            const [todoTodos, inProgressTodos, doneTodos] = await Promise.all([
                todoApi.getTodosByStatus(Status.TODO),
                todoApi.getTodosByStatus(Status.IN_PROGRESS),
                todoApi.getTodosByStatus(Status.DONE)
            ]);
            
            setTodosByStatus({
                TODO: todoTodos,
                IN_PROGRESS: inProgressTodos,
                DONE: doneTodos
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : '할 일을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 할 일 상태 변경 (칸반보드에서 드래그앤드롭용)
    const moveTodo = async (todoId: number, newStatus: Status) => {
        try {
            setError(null);
            const updatedTodo = await todoApi.updateTodoStatus(todoId, newStatus);
            
            // 기존 상태에서 제거하고 새 상태에 추가
            setTodosByStatus(prev => {
                const newState = { ...prev };
                
                // 모든 상태에서 해당 todo 제거
                Object.keys(newState).forEach(status => {
                    newState[status as Status] = newState[status as Status].filter(
                        todo => todo.id !== todoId
                    );
                });
                
                // 새 상태에 추가
                newState[newStatus] = [...newState[newStatus], updatedTodo];
                
                return newState;
            });
            
            return updatedTodo;
        } catch (err) {
            setError(err instanceof Error ? err.message : '상태 변경에 실패했습니다.');
            throw err;
        }
    };

    useEffect(() => {
        fetchTodosByStatus();
    }, []);

    return {
        todosByStatus,
        loading,
        error,
        fetchTodosByStatus,
        moveTodo
    };
}; 