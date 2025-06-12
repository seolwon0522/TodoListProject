import { useState, useEffect, useRef } from 'react';
import { Status } from '../types';

interface UseTimerProps {
    todoId: number;
    initialTime: number;
    status: Status;
    onTimeUpdate: (todoId: number, totalTime: number) => void;
}

export function useTimer({ todoId, initialTime, status, onTimeUpdate }: UseTimerProps) {
    const [currentTime, setCurrentTime] = useState(initialTime);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const isRunning = status === Status.IN_PROGRESS;

    // 최신 onTimeUpdate 함수를 ref에 저장
    useEffect(() => {
        onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);

    useEffect(() => {
        setCurrentTime(initialTime);
    }, [initialTime, todoId]);

    useEffect(() => {
        // 기존 타이머 정리
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        console.log(`타이머 상태 변경 - Todo ID: ${todoId}, Status: ${status}, isRunning: ${isRunning}`);

        if (isRunning) {
            console.log(`타이머 시작 - Todo ID: ${todoId}`);
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 1;
                    onTimeUpdateRef.current(todoId, newTime);
                    return newTime;
                });
            }, 1000);
        } else {
            console.log(`타이머 정지 - Todo ID: ${todoId}`);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, todoId, status]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        currentTime,
        isRunning,
        formattedTime: formatTime(currentTime)
    };
} 