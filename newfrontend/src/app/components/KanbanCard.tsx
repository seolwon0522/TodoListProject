'use client';

import { TodoResponseDto, Status } from '../../lib/types';
import { useTimer } from '../../lib/hooks/useTimer';
import { todoApi } from '../../lib/api';
import { useRef, useCallback } from 'react';

interface KanbanCardProps {
    todo: TodoResponseDto;
    onMoveTodo: (todoId: number, newStatus: Status) => void;
    onDeleteTodo: (todoId: number) => void;
}

export default function KanbanCard({ todo, onMoveTodo, onDeleteTodo }: KanbanCardProps) {
    const lastUpdateTimeRef = useRef(0);

    const handleTimeUpdate = useCallback(async (todoId: number, totalTime: number) => {
        // 5초마다 한 번씩만 서버에 업데이트
        if (totalTime - lastUpdateTimeRef.current >= 5) {
            lastUpdateTimeRef.current = totalTime;
            try {
                await todoApi.updateFocusTime(todoId, totalTime);
            } catch (error) {
                console.error('집중시간 업데이트 실패:', error);
            }
        }
    }, []);

    const { formattedTime, isRunning, currentTime } = useTimer({
        todoId: todo.id,
        initialTime: todo.totalFocusTime,
        status: todo.status,
        onTimeUpdate: handleTimeUpdate
    });

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', todo.id.toString());
    };

    const handleQuickStatusChange = async (newStatus: Status) => {
        if (newStatus !== todo.status) {
            // 상태 변경 시 현재 집중시간을 즉시 저장
            if (todo.status === Status.IN_PROGRESS && currentTime > todo.totalFocusTime) {
                try {
                    await todoApi.updateFocusTime(todo.id, currentTime);
                } catch (error) {
                    console.error('집중시간 저장 실패:', error);
                }
            }
            onMoveTodo(todo.id, newStatus);
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
        >
            {/* 제목과 삭제 버튼 */}
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
                    {todo.title}
                </h4>
                <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0"
                    title="할 일 삭제"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* 설명 */}
            {todo.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {todo.description}
                </p>
            )}

            {/* 집중시간 타이머 */}
            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-mono text-gray-700">
                    {formattedTime}
                </span>
                <span className="text-xs text-gray-500">
                    {isRunning ? '진행 중' : '정지'}
                </span>
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