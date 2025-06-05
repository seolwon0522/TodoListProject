'use client';

import { TodoResponseDto, Status } from '../../lib/types';

interface KanbanCardProps {
    todo: TodoResponseDto;
    onMoveTodo: (todoId: number, newStatus: Status) => void;
}

export default function KanbanCard({ todo, onMoveTodo }: KanbanCardProps) {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', todo.id.toString());
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleQuickStatusChange = (newStatus: Status) => {
        if (newStatus !== todo.status) {
            onMoveTodo(todo.id, newStatus);
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
        >
            {/* 제목 */}
            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                {todo.title}
            </h4>

            {/* 설명 */}
            {todo.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {todo.description}
                </p>
            )}

            {/* 하단 정보 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>생성: {formatDate(todo.createdAt)}</span>
                {todo.updatedAt !== todo.createdAt && (
                    <span>수정: {formatDate(todo.updatedAt)}</span>
                )}
            </div>

            {/* 빠른 상태 변경 버튼들 */}
            <div className="flex gap-1 mt-3">
                <button
                    onClick={() => handleQuickStatusChange(Status.TODO)}
                    className={`px-2 py-1 text-xs rounded ${
                        todo.status === Status.TODO
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    title="할 일로 이동"
                >
                    할 일
                </button>
                <button
                    onClick={() => handleQuickStatusChange(Status.IN_PROGRESS)}
                    className={`px-2 py-1 text-xs rounded ${
                        todo.status === Status.IN_PROGRESS
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                    }`}
                    title="진행 중으로 이동"
                >
                    진행 중
                </button>
                <button
                    onClick={() => handleQuickStatusChange(Status.DONE)}
                    className={`px-2 py-1 text-xs rounded ${
                        todo.status === Status.DONE
                            ? 'bg-green-200 text-green-800'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                    title="완료로 이동"
                >
                    완료
                </button>
            </div>
        </div>
    );
} 