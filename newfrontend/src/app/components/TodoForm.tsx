'use client';

import { useState } from 'react';
import { TodoRequestDto, Status } from '../../lib/types';

interface TodoFormProps {
    initialData?: TodoRequestDto;
    onSubmit: (data: TodoRequestDto) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function TodoForm({ initialData, onSubmit, onCancel, isEditing = false }: TodoFormProps) {
    const [formData, setFormData] = useState<TodoRequestDto>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || Status.TODO
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        onSubmit(formData);
    };

    const handleChange = (field: keyof TodoRequestDto, value: string | Status) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* 제목 입력 */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="할 일 제목을 입력하세요"
                    required
                />
            </div>

            {/* 설명 입력 */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="할 일에 대한 상세 설명을 입력하세요 (선택사항)"
                />
            </div>

            {/* 상태 선택 */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    상태
                </label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as Status)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value={Status.TODO}>할 일</option>
                    <option value={Status.IN_PROGRESS}>진행 중</option>
                    <option value={Status.DONE}>완료</option>
                </select>
            </div>

            {/* 버튼들 */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    {isEditing ? '수정' : '추가'}
                </button>
            </div>
        </form>
    );
} 