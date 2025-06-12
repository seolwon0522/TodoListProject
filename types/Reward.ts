export interface UserStats {
  level: number;
  exp: number;
  nextLevelExp: number;
  points: number;
  achievements: string[];
  totalCompleted: number;
  totalFocusTime: number;
  streak: number;
  lastCompletedDate?: string;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'levelUp' | 'reward';
  message: string;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: (stats: UserStats, todos: any[]) => boolean;
  points: number;
  exp: number;
  completed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: 'theme' | 'sticker' | 'avatar' | 'widget';
  purchased: boolean;
}

export interface RecentReward {
  id: string;
  type: 'exp' | 'points' | 'achievement';
  value: number;
  source: string;
  timestamp: number;
} 