'use client';

import { useEffect, useState } from 'react';
import { usePoints } from '../../lib/hooks/usePoints';
import { useAuth } from '../../lib/hooks/useAuth';

interface PointDisplayProps {
    userId: number;
}

export default function PointDisplay({ userId }: PointDisplayProps) {
    const { points, loading, error, fetchPoints, calculatePoints } = usePoints();
    const { user } = useAuth(); // 사용자 정보에서 전체 집중시간 가져오기
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (userId) {
            fetchPoints(userId);
        }
    }, [userId, fetchPoints]);

    const handleCalculatePoints = async () => {
        try {
            const result = await calculatePoints(userId);
            setMessage(result.message);
            
            // 3초 후 메시지 제거
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('포인트 계산 실패:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}분 ${remainingSeconds}초`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">내 포인트</h3>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🏆</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {points?.totalPoints || 0} 포인트
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            총 집중 시간: {formatTime(user?.totalFocusTime || 0)}
                        </div>
                        <div className="text-xs text-gray-500">
                            포인트 획득 시간: {formatTime(points?.totalFocusTimeUsed || 0)}
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={handleCalculatePoints}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {loading ? '계산 중...' : '포인트 계산'}
                </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* 성공/정보 메시지 */}
            {message && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm">{message}</p>
                </div>
            )}

            {/* 포인트 획득 정보 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">포인트 획득 방법</h4>
                <div className="text-xs text-gray-600 space-y-1">
                    <p>• 집중 시간 1분마다 1포인트 획득</p>
                    <p>• 할 일 완료 후 '포인트 계산' 버튼을 눌러주세요</p>
                </div>
            </div>
        </div>
    );
} 