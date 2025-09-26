import { GameDefinition, BudgetBattleState, GameEvent, BudgetCategory, BudgetEvent } from '@/lib/types';
import { BudgetBattleRenderer } from './renderer';

// Budget validation utilities
export function validateBudget(categories: BudgetCategory[], monthlyIncome: number): {
  isValid: boolean;
  totalAllocated: number;
  savingsRate: number;
  violations: string[];
} {
  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const savings = categories.find(cat => cat.name === 'Savings')?.allocated || 0;
  const savingsRate = (savings / monthlyIncome) * 100;

  const violations: string[] = [];

  if (totalAllocated > monthlyIncome) {
    violations.push('Total allocation exceeds income');
  }

  if (savingsRate < 15) {
    violations.push('Savings rate below 15% minimum');
  }

  const debtPayments = categories.find(cat => cat.name === 'Debt Payments')?.allocated || 0;
  const minDebtPayment = monthlyIncome * 0.1; // Minimum 10%

  if (debtPayments < minDebtPayment) {
    violations.push('Debt payments below 10% minimum');
  }

  return {
    isValid: violations.length === 0 && totalAllocated <= monthlyIncome,
    totalAllocated,
    savingsRate,
    violations
  };
}

// Generate random budget events
export function generateRandomEvent(): BudgetEvent {
  const events: BudgetEvent[] = [
    {
      id: 'car-repair',
      title: 'Car Repair Emergency',
      description: 'Your car broke down and needs immediate repair',
      impact: -800,
      category: 'Transportation',
      type: 'expense'
    },
    {
      id: 'medical-bill',
      title: 'Unexpected Medical Bill',
      description: 'Insurance didn\'t cover everything',
      impact: -400,
      category: 'Healthcare',
      type: 'expense'
    },
    {
      id: 'bonus',
      title: 'Work Bonus',
      description: 'Great performance this quarter!',
      impact: 600,
      type: 'income'
    },
    {
      id: 'utility-spike',
      title: 'High Utility Bill',
      description: 'Extreme weather increased your energy costs',
      impact: -200,
      category: 'Utilities',
      type: 'expense'
    },
    {
      id: 'freelance-income',
      title: 'Freelance Project',
      description: 'Side hustle paying off!',
      impact: 300,
      type: 'income'
    },
    {
      id: 'subscription-increase',
      title: 'Subscription Price Increase',
      description: 'Your streaming services just got more expensive',
      impact: -50,
      category: 'Entertainment',
      type: 'expense'
    }
  ];

  return events[Math.floor(Math.random() * events.length)];
}

// Initialize default budget categories
function createDefaultCategories(monthlyIncome: number): BudgetCategory[] {
  return [
    {
      id: 'housing',
      name: 'Housing',
      type: 'fixed',
      allocated: Math.round(monthlyIncome * 0.25),
      spent: 0,
      priority: 1
    },
    {
      id: 'transportation',
      name: 'Transportation',
      type: 'variable',
      allocated: Math.round(monthlyIncome * 0.15),
      spent: 0,
      priority: 2
    },
    {
      id: 'food',
      name: 'Food',
      type: 'variable',
      allocated: Math.round(monthlyIncome * 0.12),
      spent: 0,
      priority: 1
    },
    {
      id: 'utilities',
      name: 'Utilities',
      type: 'fixed',
      allocated: Math.round(monthlyIncome * 0.08),
      spent: 0,
      priority: 1
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      type: 'variable',
      allocated: Math.round(monthlyIncome * 0.05),
      spent: 0,
      priority: 1
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      type: 'variable',
      allocated: Math.round(monthlyIncome * 0.05),
      spent: 0,
      priority: 3
    },
    {
      id: 'savings',
      name: 'Savings',
      type: 'variable',
      allocated: Math.round(monthlyIncome * 0.20),
      spent: 0,
      priority: 1
    },
    {
      id: 'debt-payments',
      name: 'Debt Payments',
      type: 'fixed',
      allocated: Math.round(monthlyIncome * 0.10),
      spent: 0,
      priority: 1
    }
  ];
}

export const budgetBattleDefinition: GameDefinition = {
  id: 'budget-battle',
  title: 'Budget Battle',
  summary: 'Master budgeting skills by allocating income across categories and handling financial emergencies. Learn to distinguish fixed vs variable costs.',
  estimatedTimeMin: 10,
  objectives: [
    {
      id: 'budget-allocation',
      text: 'Create balanced budget allocations',
      rubric: ['Allocates income across all necessary categories', 'Maintains savings rate of at least 15%', 'Ensures debt payments meet minimum requirements']
    },
    {
      id: 'emergency-handling',
      text: 'Handle financial emergencies effectively',
      rubric: ['Maintains positive cash flow during unexpected events', 'Adjusts variable expenses before fixed expenses', 'Uses emergency buffer when appropriate']
    },
    {
      id: 'sustained-success',
      text: 'Achieve sustained financial stability',
      rubric: ['Maintains positive cash balance for 3+ consecutive rounds', 'Meets savings goals consistently', 'Demonstrates understanding of fixed vs variable costs']
    }
  ],
  controls: { mouse: true, touch: true, keyboard: true },
  tutorialSteps: [
    "Welcome to Budget Battle! You'll learn to manage money by creating and maintaining a monthly budget.",
    "Your monthly income is displayed at the top. You need to allocate this across different spending categories.",
    "Notice the difference: Fixed costs (like rent) stay the same each month, while variable costs can be adjusted.",
    "You must maintain at least 15% savings rate and 10% for debt payments - these are non-negotiable!",
    "Watch out for random events! Car repairs, bonuses, and emergencies will test your budget flexibility.",
    "Success means keeping positive cash flow for 3 months straight. Can you maintain financial stability?"
  ],
  levels: 5, // 5 rounds to complete

  init: (): BudgetBattleState => {
    const monthlyIncome = 4000; // Starting monthly income
    return {
      level: 1,
      score: 0,
      timeMs: 0,
      mistakes: 0,
      monthlyIncome,
      categories: createDefaultCategories(monthlyIncome),
      events: [],
      currentRound: 1,
      totalRounds: 5,
      cashBuffer: 500, // Starting emergency buffer
      savingsGoal: monthlyIncome * 0.15,
      consecutiveSuccesses: 0
    };
  },

  update: (state: BudgetBattleState, event: GameEvent): BudgetBattleState => {
    switch (event.type) {
      case 'start':
        return {
          ...state,
          timeMs: 0,
          score: 0
        };

      case 'action':
        if (event.name === 'allocate-budget' && event.payload) {
          const { categoryId, amount } = event.payload as { categoryId: string; amount: number };
          const updatedCategories = state.categories.map(cat =>
            cat.id === categoryId ? { ...cat, allocated: Math.max(0, amount) } : cat
          );

          return { ...state, categories: updatedCategories };
        }

        if (event.name === 'submit-budget') {
          const validation = validateBudget(state.categories, state.monthlyIncome);

          if (!validation.isValid) {
            return {
              ...state,
              mistakes: state.mistakes + 1
            };
          }

          // Generate random event for this round
          const randomEvent = Math.random() < 0.7 ? generateRandomEvent() : null;
          const events = randomEvent ? [...state.events, randomEvent] : state.events;

          // Apply event impact
          let newCashBuffer = state.cashBuffer;
          let newIncome = state.monthlyIncome;
          let updatedCategories = [...state.categories];

          if (randomEvent) {
            if (randomEvent.type === 'income') {
              newIncome += randomEvent.impact;
            } else {
              // Handle expense event
              if (randomEvent.category) {
                const categoryIndex = updatedCategories.findIndex(cat => cat.name === randomEvent.category);
                if (categoryIndex >= 0) {
                  updatedCategories[categoryIndex].spent += Math.abs(randomEvent.impact);
                }
              } else {
                newCashBuffer += randomEvent.impact; // Use buffer for uncategorized expenses
              }
            }
          }

          // Calculate actual spending and remaining
          const totalSpent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0);
          const totalAllocated = updatedCategories.reduce((sum, cat) => sum + cat.allocated, 0);
          const cashFlow = newIncome - totalSpent;

          // Check for success this round
          const savings = updatedCategories.find(cat => cat.name === 'Savings')?.allocated || 0;
          const savingsRate = (savings / newIncome) * 100;
          const isSuccess = cashFlow > 0 && savingsRate >= 15;

          const newConsecutiveSuccesses = isSuccess ? state.consecutiveSuccesses + 1 : 0;
          const points = isSuccess ? 100 : 0;
          const bonusPoints = newConsecutiveSuccesses >= 3 ? 50 : 0;

          return {
            ...state,
            categories: updatedCategories,
            events,
            currentRound: state.currentRound + 1,
            cashBuffer: Math.max(0, newCashBuffer),
            consecutiveSuccesses: newConsecutiveSuccesses,
            score: state.score + points + bonusPoints,
            monthlyIncome: newIncome
          };
        }

        if (event.name === 'use-emergency-fund' && event.payload) {
          const { amount } = event.payload as { amount: number };
          return {
            ...state,
            cashBuffer: Math.max(0, state.cashBuffer - amount)
          };
        }

        return state;

      case 'complete':
        return {
          ...state,
          score: state.score + (event.passed ? 100 : 0)
        };

      default:
        return state;
    }
  },

  render: (state: BudgetBattleState, onEvent) => {
    return BudgetBattleRenderer({ state, onEvent });
  },

  assessMastery: (state: BudgetBattleState): boolean => {
    // Mastery: Complete 5 rounds with 3+ consecutive successes and minimal mistakes
    return state.currentRound > 5 && state.consecutiveSuccesses >= 3 && state.mistakes <= 3;
  }
};