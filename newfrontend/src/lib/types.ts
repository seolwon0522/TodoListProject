export interface UserResponseDto {
    id: number;
    userId: string;
    userName: string;
    totalFocusTime: number; // 총 누적 집중시간 (초 단위)
}

export interface UserRequestDto {
    userId: string;
    userPw: string;
    userName: string;
}

export interface LoginRequestDto {
    userId: string;
    userPw: string;
}

// Todo 관련 타입 정의
export enum Status {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}

export interface TodoRequestDto {
    title: string;
    description?: string;
    status?: Status;
}

export interface TodoResponseDto {
    id: number;
    title: string;
    description?: string;
    status: Status;
    totalFocusTime: number;
    user: UserResponseDto;
}

// Point 관련 타입 정의
export interface PointResponseDto {
    totalPoints: number;
    totalFocusTimeUsed: number;
    newPointsEarned: number;
    message: string;
}
