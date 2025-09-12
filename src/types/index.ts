export interface User {
  id: string;
  username: string;
  xp: number;
  level: number;
  avatar?: string;
  achievements: Achievement[];
  financeConceptsCompleted: string[];
}

export interface Game {
  id: string;
  name: string;
  description: string;
  type: 'fun' | 'finance';
  icon: string;
  backgroundColor: string;
  isFinanceThemed: boolean;
  minDuration: number;
  maxDuration: number;
}

export interface GameScore {
  gameId: string;
  score: number;
  timestamp: number;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  xp: number;
  level: number;
}

export interface MicroLesson {
  id: string;
  concept: string;
  message: string;
  gameId: string;
}

export interface GameSession {
  gameId: string;
  score: number;
  duration: number;
  timestamp: number;
}