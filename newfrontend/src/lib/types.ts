export interface UserResponseDto {
    id: number;
    userId: string;
    userName: string;
    totalFocusTime: number; // 총 누적 집중시간 (초 단위)
    currentPoints: number; // 현재 보유 포인트
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

// Shop 관련 타입 정의
export interface ShopItemDto {
    id: number;
    itemName: string;
    description: string;
    price: number;
    category: string;
    isPurchased: boolean;
    canPurchase: boolean;
}

export interface PurchaseRequestDto {
    userId: number;
    shopItemId: number;
}

export interface PurchaseResponseDto {
    success: boolean;
    message: string;
    remainingPoints?: number;
    itemName?: string;
    purchasePrice?: number;
}

export interface UserPurchase {
    id: number;
    user: UserResponseDto;
    shopItem: ShopItemDto;
    purchasedAt: string;
}

export type ShopCategory = '테마' | '스티커' | '아바타' | '위젯' | '기능';
