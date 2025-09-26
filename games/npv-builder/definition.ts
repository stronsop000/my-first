import { GameDefinition, NPVBuilderState, GameEvent, CashFlow, Project } from '@/lib/types';
import { NPVBuilderRenderer } from './renderer';

// NPV calculation utility
export function calculateNPV(cashFlows: CashFlow[], discountRate: number): number {
  return cashFlows
    .filter(cf => cf.isPlaced)
    .reduce((npv, cf) => {
      return npv + (cf.amount / Math.pow(1 + discountRate, cf.year));
    }, 0);
}

// Investment decision logic
export function assessInvestmentDecision(npv: number): 'invest' | 'reject' | 'indifferent' {
  if (npv > 50) return 'invest';
  if (npv < -50) return 'reject';
  return 'indifferent';
}

// Generate sample projects for different levels
export function generateProjects(level: number): Project[] {
  const projects: Project[][] = [
    // Level 1: Single simple project
    [{
      id: 'project-1',
      name: 'Coffee Shop Investment',
      cashFlows: [-1000, 400, 400, 400],
      timeline: [0, 1, 2, 3]
    }],
    // Level 2: Two mutually exclusive projects
    [{
      id: 'project-2a',
      name: 'Project Alpha',
      cashFlows: [-1200, 600, 600, 400],
      timeline: [0, 1, 2, 3]
    }, {
      id: 'project-2b',
      name: 'Project Beta',
      cashFlows: [-1200, 400, 500, 800],
      timeline: [0, 1, 2, 3]
    }],
    // Level 3: Capital rationing with 3 projects
    [{
      id: 'project-3a',
      name: 'Tech Startup',
      cashFlows: [-2000, 800, 900, 1000],
      timeline: [0, 1, 2, 3]
    }, {
      id: 'project-3b',
      name: 'Real Estate',
      cashFlows: [-1500, 500, 600, 700],
      timeline: [0, 1, 2, 3]
    }, {
      id: 'project-3c',
      name: 'Manufacturing',
      cashFlows: [-2500, 1000, 1200, 1400],
      timeline: [0, 1, 2, 3]
    }]
  ];

  return projects[Math.min(level - 1, projects.length - 1)] || projects[0];
}

// Create initial cash flows from project
function createCashFlowsFromProject(project: Project): CashFlow[] {
  return project.cashFlows.map((amount, index) => ({
    id: `cf-${project.id}-${index}`,
    year: project.timeline[index],
    amount,
    isPlaced: false
  }));
}

export const npvBuilderDefinition: GameDefinition = {
  id: 'npv-builder',
  title: 'NPV Builder',
  summary: 'Learn time value of money through interactive NPV calculations. Drag cash flows, set discount rates, and make investment decisions.',
  estimatedTimeMin: 8,
  objectives: [
    {
      id: 'understand-discounting',
      text: 'Understand how discounting works',
      rubric: ['Can explain why money today is worth more than money tomorrow', 'Understands the impact of discount rates on present values']
    },
    {
      id: 'calculate-npv',
      text: 'Calculate NPV correctly',
      rubric: ['Places cash flows on correct timeline positions', 'Applies discount rate properly', 'Sums discounted cash flows accurately']
    },
    {
      id: 'investment-decisions',
      text: 'Make sound investment decisions',
      rubric: ['Uses NPV > 0 rule correctly', 'Can compare mutually exclusive projects', 'Understands capital rationing constraints']
    }
  ],
  controls: { mouse: true, touch: true, keyboard: true },
  tutorialSteps: [
    "Welcome to NPV Builder! Money today is worth more than money tomorrow - that's discounting.",
    "Use the discount rate slider to set your required rate of return. Higher rates make future cash flows worth less today.",
    "Drag cash flow cards from the left panel onto the timeline. Each year has a different present value.",
    "Watch how each cash flow is discounted: CF / (1 + r)^t. The formula shows below each placed cash flow.",
    "The total NPV is the sum of all discounted cash flows. Positive NPV means invest!",
    "If NPV > 0, invest. If NPV < 0, reject. If NPV ≈ 0, you're indifferent. Make your decision!"
  ],
  levels: 3,

  init: (): NPVBuilderState => {
    const projects = generateProjects(1);
    const currentProject = projects[0];

    return {
      level: 1,
      score: 0,
      timeMs: 0,
      mistakes: 0,
      cashFlows: createCashFlowsFromProject(currentProject),
      discountRate: 0.1,
      currentProject,
      availableProjects: projects,
      calculatedNPV: 0,
      decision: null,
      draggedItem: null
    };
  },

  update: (state: NPVBuilderState, event: GameEvent): NPVBuilderState => {
    switch (event.type) {
      case 'start':
        return {
          ...state,
          timeMs: 0,
          score: 0
        };

      case 'action':
        if (event.name === 'drag-start' && typeof event.payload === 'string') {
          return { ...state, draggedItem: event.payload };
        }

        if (event.name === 'drag-end') {
          return { ...state, draggedItem: null };
        }

        if (event.name === 'place-cashflow' && event.payload) {
          const { cashFlowId, year } = event.payload as { cashFlowId: string; year: number };
          const updatedCashFlows = state.cashFlows.map(cf =>
            cf.id === cashFlowId
              ? { ...cf, year, isPlaced: true }
              : cf
          );
          const newNPV = calculateNPV(updatedCashFlows, state.discountRate);
          const decision = assessInvestmentDecision(newNPV);

          return {
            ...state,
            cashFlows: updatedCashFlows,
            calculatedNPV: newNPV,
            decision
          };
        }

        if (event.name === 'set-discount-rate' && typeof event.payload === 'number') {
          const newRate = event.payload / 100; // Convert percentage to decimal
          const newNPV = calculateNPV(state.cashFlows, newRate);
          const decision = assessInvestmentDecision(newNPV);

          return {
            ...state,
            discountRate: newRate,
            calculatedNPV: newNPV,
            decision
          };
        }

        if (event.name === 'make-decision' && event.payload) {
          const { decision } = event.payload as { decision: 'invest' | 'reject' | 'indifferent' };
          const correctDecision = assessInvestmentDecision(state.calculatedNPV);
          const isCorrect = decision === correctDecision;
          const points = isCorrect ? 100 : 0;

          return {
            ...state,
            score: state.score + points,
            mistakes: isCorrect ? state.mistakes : state.mistakes + 1
          };
        }

        if (event.name === 'next-level') {
          const nextLevel = Math.min(state.level + 1, 3);
          const projects = generateProjects(nextLevel);
          const currentProject = projects[0];

          return {
            ...state,
            level: nextLevel,
            currentProject,
            availableProjects: projects,
            cashFlows: createCashFlowsFromProject(currentProject),
            calculatedNPV: 0,
            decision: null,
            draggedItem: null
          };
        }

        return state;

      case 'complete':
        return {
          ...state,
          score: state.score + (event.passed ? 50 : 0)
        };

      default:
        return state;
    }
  },

  render: (state: NPVBuilderState, onEvent) => {
    return NPVBuilderRenderer({ state, onEvent });
  },

  assessMastery: (state: NPVBuilderState): boolean => {
    // Mastery criteria: Complete all levels with correct decisions and minimal mistakes
    return state.level >= 3 && state.mistakes <= 2 && state.score >= 250;
  }
};