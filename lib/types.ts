import { ReactNode } from 'react';

export type LearningObjective = {
  id: string;
  text: string;
  rubric: string[];
};

export type GameEvent =
  | { type: 'start' }
  | { type: 'action'; name: string; payload?: unknown }
  | { type: 'hint' }
  | { type: 'complete'; passed: boolean; score: number }
  | { type: 'quit' };

export type GameState = {
  level: number;
  score: number;
  timeMs: number;
  mistakes: number;
};

export type GameDefinition = {
  id: string;
  title: string;
  summary: string;
  estimatedTimeMin: number;
  objectives: LearningObjective[];
  controls: { mouse: boolean; touch: boolean; keyboard: boolean };
  tutorialSteps: string[];
  levels: number;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  init: () => any;
  update: (state: any, event: GameEvent) => any;
  render: (state: any, onEvent: (event: GameEvent) => void) => ReactNode;
  assessMastery: (state: any) => boolean;
};

export type User = {
  id: string;
  username: string;
  xp: number;
  level: number;
  achievements: string[];
  financeConceptsCompleted: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type GameProgress = {
  gameId: string;
  level: number;
  highScore: number;
  timesPlayed: number;
  mastered: boolean;
  lastPlayed: Date;
  objectives: Record<string, boolean>;
};

export type GameSession = {
  id: string;
  gameId: string;
  userId: string;
  score: number;
  duration: number;
  level: number;
  events: GameEvent[];
  timestamp: Date;
};

// NPV Builder specific types
export type CashFlow = {
  id: string;
  year: number;
  amount: number;
  isPlaced: boolean;
  position?: { x: number; y: number };
};

export type Project = {
  id: string;
  name: string;
  cashFlows: number[];
  timeline: number[];
};

export type NPVBuilderState = GameState & {
  cashFlows: CashFlow[];
  discountRate: number;
  currentProject: Project;
  availableProjects: Project[];
  calculatedNPV: number;
  decision: 'invest' | 'reject' | 'indifferent' | null;
  draggedItem: string | null;
};

// Budget Battle specific types
export type BudgetCategory = {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  allocated: number;
  spent: number;
  priority: 1 | 2 | 3;
};

export type BudgetEvent = {
  id: string;
  title: string;
  description: string;
  impact: number;
  category?: string;
  type: 'income' | 'expense';
};

export type BudgetBattleState = GameState & {
  monthlyIncome: number;
  categories: BudgetCategory[];
  events: BudgetEvent[];
  currentRound: number;
  totalRounds: number;
  cashBuffer: number;
  savingsGoal: number;
  consecutiveSuccesses: number;
};

// Elasticity Explorer specific types
export type DemandPoint = {
  price: number;
  quantity: number;
  elasticity?: number;
  revenue?: number;
};

export type ElasticityQuest = {
  id: string;
  title: string;
  description: string;
  target: {
    elasticity?: number;
    elasticityRange?: [number, number];
    pricePoint?: number;
    revenueTarget?: number;
  };
  completed: boolean;
};

export type ElasticityExplorerState = GameState & {
  demandCurve: DemandPoint[];
  currentPrice: number;
  currentQuantity: number;
  elasticity: number;
  revenue: number;
  marginalRevenue: number;
  quests: ElasticityQuest[];
  completedQuests: string[];
};