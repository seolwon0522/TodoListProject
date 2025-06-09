'use client';

import { useState } from 'react';
import { useTodosByStatus } from '../../lib/hooks/useTodos';
import { useAuth } from '../../lib/hooks/useAuth';
import { Status, TodoResponseDto, TodoRequestDto } from '../../lib/types';
import { todoApi } from '../../lib/api';
import KanbanColumn from '../components/KanbanColumn';
import TodoForm from '../components/TodoForm';

export default function KanbanPage() {
    const { todosByStatus, loading, error, fetchTodosByStatus, moveTodo, deleteTodo } = useTodosByStatus();
    const { user, isAuthenticated } = useAuth();
    const [showForm, setShowForm] = useState(false);

    const handleMoveTodo = async (todoId: number, newStatus: Status) => {
        try {
            await moveTodo(todoId, newStatus);
        } catch (error) {
            console.error('할 일 이동 실패:', error);
        }
    };

    const handleCreateTodo = async (data: TodoRequestDto) => {
        try {
            await todoApi.createTodo(data);
            setShowForm(false);
            // 칸반보드 데이터 새로고침
            await fetchTodosByStatus();
        } catch (error) {
            console.error('할 일 생성 실패:', error);
        }
    };

    const handleDeleteTodo = async (todoId: number) => {
        if (confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
            try {
                await deleteTodo(todoId);
            } catch (error) {
                console.error('할 일 삭제 실패:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">칸반보드를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 로그인하지 않은 사용자 처리
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
                    <p className="text-gray-600 mb-6">칸반보드와 할 일 관리를 이용하려면 로그인해주세요.</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        로그인하러 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 헤더 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">칸반보드</h1>
                            <p className="text-gray-600 mt-1">드래그 앤 드롭으로 할 일 상태를 변경하세요</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            새 할 일 추가
                        </button>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* 할 일 생성 폼 */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">새 할 일 추가</h2>
                        <TodoForm
                            onSubmit={handleCreateTodo}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {/* 칸반보드 컬럼들 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KanbanColumn
                        title="할 일"
                        status={Status.TODO}
                        todos={todosByStatus.TODO}
                        onMoveTodo={handleMoveTodo}
                        onDeleteTodo={handleDeleteTodo}
                        color="gray"
                    />
                    <KanbanColumn
                        title="진행 중"
                        status={Status.IN_PROGRESS}
                        todos={todosByStatus.IN_PROGRESS}
                        onMoveTodo={handleMoveTodo}
                        onDeleteTodo={handleDeleteTodo}
                        color="yellow"
                    />
                    <KanbanColumn
                        title="완료"
                        status={Status.DONE}
                        todos={todosByStatus.DONE}
                        onMoveTodo={handleMoveTodo}
                        onDeleteTodo={handleDeleteTodo}
                        color="green"
                    />
                </div>
            </div>
        </div>
    );
} 