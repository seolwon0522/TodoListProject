'use client';

import { useTodosByStatus } from '../../lib/hooks/useTodos';
import { Status, TodoResponseDto } from '../../lib/types';
import KanbanColumn from '../components/KanbanColumn';

export default function KanbanPage() {
    const { todosByStatus, loading, error, fetchTodosByStatus, moveTodo } = useTodosByStatus();

    const handleMoveTodo = async (todoId: number, newStatus: Status) => {
        try {
            await moveTodo(todoId, newStatus);
        } catch (error) {
            console.error('할 일 이동 실패:', error);
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
                            onClick={fetchTodosByStatus}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            새로고침
                        </button>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* 칸반보드 컬럼들 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KanbanColumn
                        title="할 일"
                        status={Status.TODO}
                        todos={todosByStatus.TODO}
                        onMoveTodo={handleMoveTodo}
                        color="gray"
                    />
                    <KanbanColumn
                        title="진행 중"
                        status={Status.IN_PROGRESS}
                        todos={todosByStatus.IN_PROGRESS}
                        onMoveTodo={handleMoveTodo}
                        color="yellow"
                    />
                    <KanbanColumn
                        title="완료"
                        status={Status.DONE}
                        todos={todosByStatus.DONE}
                        onMoveTodo={handleMoveTodo}
                        color="green"
                    />
                </div>
            </div>
        </div>
    );
} 