import { useState, useCallback } from 'react';
import { PointResponseDto } from '../types';
import { pointApi } from '../api';

export const usePoints = () => {
    const [points, setPoints] = useState<PointResponseDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 포인트 조회
    const fetchPoints = useCallback(async (userId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await pointApi.getUserPoints(userId);
            setPoints(response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '포인트 조회에 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 포인트 계산 및 업데이트
    const calculatePoints = useCallback(async (userId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await pointApi.calculateAndUpdatePoints(userId);
            setPoints(response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '포인트 계산에 실패했습니다.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        points,
        loading,
        error,
        fetchPoints,
        calculatePoints
    };
}; 