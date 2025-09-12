import { MicroLesson } from '../types';

export const MICRO_LESSONS: MicroLesson[] = [
  {
    id: 'budget-basic',
    concept: 'Budgeting',
    message: 'The 50/30/20 rule helps you allocate 50% to needs, 30% to wants, and 20% to savings for financial stability.',
    gameId: 'budget-blitz',
  },
  {
    id: 'emergency-fund',
    concept: 'Emergency Fund',
    message: 'Having 3-6 months of expenses saved provides financial security during unexpected situations.',
    gameId: 'budget-blitz',
  },
  {
    id: 'compound-interest',
    concept: 'Compound Interest',
    message: 'Starting to save early lets your money grow exponentially through compound interest over time.',
    gameId: 'invest-quest',
  },
  {
    id: 'risk-reward',
    concept: 'Risk vs Reward',
    message: 'Higher potential returns usually come with higher risk. Diversification helps balance your investment portfolio.',
    gameId: 'invest-quest',
  },
  {
    id: 'inflation-basics',
    concept: 'Inflation',
    message: 'Inflation reduces your purchasing power over time, making it important to invest money rather than just save.',
    gameId: 'inflation-invaders',
  },
  {
    id: 'market-cycles',
    concept: 'Market Cycles',
    message: 'Markets naturally go through bull and bear cycles. Long-term investing helps weather short-term volatility.',
    gameId: 'bull-bear-sprint',
  },
];

export const getRandomLessonForGame = (gameId: string): string | undefined => {
  const gameLessons = MICRO_LESSONS.filter(lesson => lesson.gameId === gameId);
  if (gameLessons.length === 0) return undefined;
  
  const randomIndex = Math.floor(Math.random() * gameLessons.length);
  return gameLessons[randomIndex].message;
};