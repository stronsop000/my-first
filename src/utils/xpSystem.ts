export const XP_REWARDS = {
  PLAY_GAME: 10,
  BEAT_PERSONAL_BEST: 5,
  BEAT_FRIEND_SCORE: 20,
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXpForNextLevel = (currentLevel: number): number => {
  return currentLevel * 100;
};

export const getXpProgress = (xp: number): { current: number; next: number; progress: number } => {
  const level = calculateLevel(xp);
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const currentProgress = xp - xpForCurrentLevel;
  const maxProgress = xpForNextLevel - xpForCurrentLevel;
  
  return {
    current: currentProgress,
    next: maxProgress,
    progress: currentProgress / maxProgress,
  };
};

export const shouldUnlockCosmetic = (level: number): boolean => {
  return level % 5 === 0;
};