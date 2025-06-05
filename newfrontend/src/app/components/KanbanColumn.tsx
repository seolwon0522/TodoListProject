'use client';

import { TodoResponseDto, Status } from '../../lib/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    title: string;
    status: Status;
    todos: TodoResponseDto[];
    onMoveTodo: (todoId: number, newStatus: Status) => void;
    color: 'gray' | 'yellow' | 'green';
}

export default function KanbanColumn({ title, status, todos, onMoveTodo, color }: KanbanColumnProps) {
    const getColumnColors = (color: string) => {
        switch (color) {
            case 'gray':
                return {
                    header: 'bg-gray-100 text-gray-800',
                    border: 'border-gray-200',
                    count: 'bg-gray-200 text-gray-700'
                };
            case 'yellow':
                return {
                    header: 'bg-yellow-100 text-yellow-800',
                    border: 'border-yellow-200',
                    count: 'bg-yellow-200 text-yellow-700'
                };
            case 'green':
                return {
                    header: 'bg-green-100 text-green-800',
                    border: 'border-green-200',
                    count: 'bg-green-200 text-green-700'
                };
            default:
                return {
                    header: 'bg-gray-100 text-gray-800',
                    border: 'border-gray-200',
                    count: 'bg-gray-200 text-gray-700'
                };
        }
    };

    const colors = getColumnColors(color);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const todoId = parseInt(e.dataTransfer.getData('text/plain'));
        if (todoId) {
            onMoveTodo(todoId, status);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border-2 ${colors.border} min-h-96`}>
            {/* 컬럼 헤더 */}
            <div className={`${colors.header} px-4 py-3 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <span className={`${colors.count} px-2 py-1 rounded-full text-sm font-medium`}>
                        {todos.length}
                    </span>
                </div>
            </div>

            {/* 드롭 영역 */}
            <div
                className="p-4 space-y-3 min-h-80"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {todos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">할 일이 없습니다</p>
                        <p className="text-xs mt-1">여기로 드래그해서 이동하세요</p>
                    </div>
                ) : (
                    todos.map((todo) => (
                        <KanbanCard
                            key={todo.id}
                            todo={todo}
                            onMoveTodo={onMoveTodo}
                        />
                    ))
                )}
            </div>
        </div>
    );
} 