'use client';

import { useState } from 'react';
import { useTodos } from '../../lib/hooks/useTodos';
import { useAuth } from '../../lib/hooks/useAuth';
import { TodoRequestDto, Status } from '../../lib/types';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

export default function TodosPage() {
    const { todos, loading, error, createTodo, updateTodo, deleteTodo, updateTodoStatus } = useTodos();
    const { user, isAuthenticated } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingTodo, setEditingTodo] = useState<number | null>(null);

    const handleCreateTodo = async (data: TodoRequestDto) => {
        try {
            await createTodo(data);
            setShowForm(false);
        } catch (error) {
            console.error('할 일 생성 실패:', error);
        }
    };

    const handleUpdateTodo = async (id: number, data: TodoRequestDto) => {
        try {
            await updateTodo(id, data);
            setEditingTodo(null);
        } catch (error) {
            console.error('할 일 수정 실패:', error);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        if (confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
            try {
                await deleteTodo(id);
            } catch (error) {
                console.error('할 일 삭제 실패:', error);
            }
        }
    };

    const handleStatusChange = async (id: number, status: Status) => {
        try {
            await updateTodoStatus(id, status);
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">할 일을 불러오는 중...</p>
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
                    <p className="text-gray-600 mb-6">할 일 관리와 포인트 시스템을 이용하려면 로그인해주세요.</p>
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 헤더 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">할 일 관리</h1>
                            <p className="text-gray-600 mt-1">총 {todos.length}개의 할 일</p>
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

                {/* 할 일 목록 */}
                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <p className="text-gray-500 text-lg">아직 할 일이 없습니다.</p>
                            <p className="text-gray-400 mt-2">새 할 일을 추가해보세요!</p>
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                isEditing={editingTodo === todo.id}
                                onEdit={() => setEditingTodo(todo.id)}
                                onCancelEdit={() => setEditingTodo(null)}
                                onUpdate={(data) => handleUpdateTodo(todo.id, data)}
                                onDelete={() => handleDeleteTodo(todo.id)}
                                onStatusChange={(status) => handleStatusChange(todo.id, status)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 