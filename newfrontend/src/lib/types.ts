export interface UserResponseDto {
    id: number;
    userId: string;
    userName: string;
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
    createdAt: string;
    updatedAt: string;
    user: UserResponseDto;
}
