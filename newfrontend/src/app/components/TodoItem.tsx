'use client';

import { TodoResponseDto, TodoRequestDto, Status } from '../../lib/types';
import TodoForm from './TodoForm';

interface TodoItemProps {
    todo: TodoResponseDto;
    isEditing: boolean;
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (data: TodoRequestDto) => void;
    onDelete: () => void;
    onStatusChange: (status: Status) => void;
}

export default function TodoItem({
    todo,
    isEditing,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    onStatusChange
}: TodoItemProps) {
    const getStatusColor = (status: Status) => {
        switch (status) {
            case Status.TODO:
                return 'bg-gray-100 text-gray-800';
            case Status.IN_PROGRESS:
                return 'bg-yellow-100 text-yellow-800';
            case Status.DONE:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Status) => {
        switch (status) {
            case Status.TODO:
                return '할 일';
            case Status.IN_PROGRESS:
                return '진행 중';
            case Status.DONE:
                return '완료';
            default:
                return '할 일';
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">할 일 수정</h3>
                <TodoForm
                    initialData={{
                        title: todo.title,
                        description: todo.description,
                        status: todo.status
                    }}
                    onSubmit={onUpdate}
                    onCancel={onCancelEdit}
                    isEditing={true}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* 제목과 상태 */}
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{todo.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
                            {getStatusText(todo.status)}
                        </span>
                    </div>

                    {/* 설명 */}
                    {todo.description && (
                        <p className="text-gray-600 mb-3">{todo.description}</p>
                    )}
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2 ml-4">
                    {/* 상태 변경 드롭다운 */}
                    <select
                        value={todo.status}
                        onChange={(e) => onStatusChange(e.target.value as Status)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={Status.TODO}>할 일</option>
                        <option value={Status.IN_PROGRESS}>진행 중</option>
                        <option value={Status.DONE}>완료</option>
                    </select>

                    {/* 수정 버튼 */}
                    <button
                        onClick={onEdit}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="수정"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* 삭제 버튼 */}
                    <button
                        onClick={onDelete}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="삭제"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
} 