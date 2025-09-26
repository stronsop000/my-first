import { GameDefinition, ElasticityExplorerState, GameEvent, DemandPoint, ElasticityQuest } from '@/lib/types';
import { ElasticityExplorerRenderer } from './renderer';

// Price elasticity calculation
export function calculatePriceElasticity(p1: number, q1: number, p2: number, q2: number): number {
  if (p1 === p2 || q1 === q2) return 0;

  const midPrice = (p1 + p2) / 2;
  const midQuantity = (q1 + q2) / 2;

  if (midPrice === 0 || midQuantity === 0) return 0;

  const percentChangePrice = ((p2 - p1) / midPrice) * 100;
  const percentChangeQuantity = ((q2 - q1) / midQuantity) * 100;

  return percentChangeQuantity / percentChangePrice;
}

// Point elasticity calculation for a linear demand curve
export function calculatePointElasticity(price: number, quantity: number, slope: number): number {
  if (quantity === 0 || slope === 0) return 0;
  return slope * (price / quantity);
}

// Revenue calculation
export function calculateRevenue(price: number, quantity: number): number {
  return price * quantity;
}

// Marginal revenue calculation for linear demand
export function calculateMarginalRevenue(price: number, slope: number, intercept: number): number {
  // For linear demand P = a - bQ, MR = a - 2bQ
  // Rearranging: Q = (a - P) / b, so MR = P - (price - intercept) = 2P - intercept
  return 2 * price - intercept;
}

// Classify elasticity
export function classifyElasticity(elasticity: number): 'elastic' | 'inelastic' | 'unit' | 'perfectly-elastic' | 'perfectly-inelastic' {
  const absElasticity = Math.abs(elasticity);

  if (absElasticity === Infinity) return 'perfectly-elastic';
  if (absElasticity === 0) return 'perfectly-inelastic';
  if (absElasticity > 1) return 'elastic';
  if (absElasticity < 1) return 'inelastic';
  return 'unit';
}

// Generate demand curve points
export function generateDemandCurve(): DemandPoint[] {
  const points: DemandPoint[] = [];
  const maxPrice = 100;
  const maxQuantity = 50;

  // Linear demand curve: P = 100 - 2Q
  for (let q = 0; q <= maxQuantity; q += 2) {
    const p = maxPrice - 2 * q;
    if (p >= 0) {
      const elasticity = calculatePointElasticity(p, q, -2);
      const revenue = calculateRevenue(p, q);
      points.push({ price: p, quantity: q, elasticity, revenue });
    }
  }

  return points;
}

// Generate quests for different levels
export function generateQuests(level: number): ElasticityQuest[] {
  const questSets: ElasticityQuest[][] = [
    // Level 1: Basic elasticity understanding
    [
      {
        id: 'find-elastic',
        title: 'Find Elastic Demand',
        description: 'Move to a point where demand is elastic (|E| > 1)',
        target: { elasticityRange: [-Infinity, -1] },
        completed: false
      },
      {
        id: 'find-inelastic',
        title: 'Find Inelastic Demand',
        description: 'Move to a point where demand is inelastic (|E| < 1)',
        target: { elasticityRange: [-1, 0] },
        completed: false
      }
    ],
    // Level 2: Unit elasticity and revenue
    [
      {
        id: 'unit-elasticity',
        title: 'Find Unit Elasticity',
        description: 'Find the point where |E| = 1 (approximately)',
        target: { elasticityRange: [-1.1, -0.9] },
        completed: false
      },
      {
        id: 'max-revenue',
        title: 'Maximize Revenue',
        description: 'Find the price that maximizes total revenue',
        target: { revenueTarget: 1200 }, // This will be close to the midpoint
        completed: false
      }
    ],
    // Level 3: Advanced concepts
    [
      {
        id: 'revenue-elasticity',
        title: 'Revenue and Elasticity',
        description: 'Show that revenue is maximized when demand is unit elastic',
        target: { elasticityRange: [-1.1, -0.9] },
        completed: false
      },
      {
        id: 'price-discrimination',
        title: 'Price Strategy',
        description: 'Find the optimal price for a monopolist (where MR = MC = 0)',
        target: { pricePoint: 50 },
        completed: false
      }
    ]
  ];

  return questSets[Math.min(level - 1, questSets.length - 1)] || questSets[0];
}

export const elasticityExplorerDefinition: GameDefinition = {
  id: 'elasticity-explorer',
  title: 'Elasticity Explorer',
  summary: 'Explore price elasticity of demand through an interactive demand curve. Learn how elasticity affects revenue and business decisions.',
  estimatedTimeMin: 12,
  objectives: [
    {
      id: 'understand-elasticity',
      text: 'Understand price elasticity concepts',
      rubric: ['Can distinguish between elastic and inelastic demand', 'Understands how elasticity changes along a linear demand curve', 'Knows the relationship between elasticity and revenue']
    },
    {
      id: 'interpret-graphs',
      text: 'Interpret demand and revenue curves',
      rubric: ['Can read elasticity values from the demand curve', 'Understands the shape of the revenue curve', 'Identifies the revenue-maximizing price']
    },
    {
      id: 'business-applications',
      text: 'Apply elasticity to business decisions',
      rubric: ['Understands when to raise or lower prices', 'Can explain marginal revenue concepts', 'Makes pricing recommendations based on elasticity']
    }
  ],
  controls: { mouse: true, touch: true, keyboard: true },
  tutorialSteps: [
    "Welcome to Elasticity Explorer! Price elasticity measures how responsive quantity demanded is to price changes.",
    "Click and drag on the demand curve to move along it. Watch how elasticity changes at different points!",
    "Elasticity = % change in quantity / % change in price. Values greater than 1 (in absolute terms) are 'elastic'.",
    "Toggle the revenue curve to see total revenue (Price × Quantity) at each point.",
    "Notice: Revenue is maximized where elasticity equals -1 (unit elastic). This is key for pricing decisions!",
    "Complete the quests to master elasticity concepts. Use arrow keys for precise movement if needed."
  ],
  levels: 3,

  init: (): ElasticityExplorerState => {
    const demandCurve = generateDemandCurve();
    const startingPoint = demandCurve[Math.floor(demandCurve.length / 2)]; // Start in middle

    return {
      level: 1,
      score: 0,
      timeMs: 0,
      mistakes: 0,
      demandCurve,
      currentPrice: startingPoint.price,
      currentQuantity: startingPoint.quantity,
      elasticity: startingPoint.elasticity || 0,
      revenue: startingPoint.revenue || 0,
      marginalRevenue: calculateMarginalRevenue(startingPoint.price, -2, 100),
      quests: generateQuests(1),
      completedQuests: []
    };
  },

  update: (state: ElasticityExplorerState, event: GameEvent): ElasticityExplorerState => {
    switch (event.type) {
      case 'start':
        return {
          ...state,
          timeMs: 0,
          score: 0
        };

      case 'action':
        if (event.name === 'move-point' && event.payload) {
          const { price, quantity } = event.payload as { price: number; quantity: number };

          // Find the closest point on the demand curve
          const closestPoint = state.demandCurve.reduce((closest, point) => {
            const currentDistance = Math.abs(point.price - price) + Math.abs(point.quantity - quantity);
            const closestDistance = Math.abs(closest.price - price) + Math.abs(closest.quantity - quantity);
            return currentDistance < closestDistance ? point : closest;
          });

          const elasticity = closestPoint.elasticity || 0;
          const revenue = closestPoint.revenue || 0;
          const marginalRevenue = calculateMarginalRevenue(closestPoint.price, -2, 100);

          // Check quest completion
          const updatedQuests = state.quests.map(quest => {
            if (quest.completed) return quest;

            let completed = false;

            if (quest.target.elasticityRange) {
              const [min, max] = quest.target.elasticityRange;
              completed = elasticity >= min && elasticity <= max;
            }

            if (quest.target.revenueTarget) {
              completed = Math.abs(revenue - quest.target.revenueTarget) <= 50; // Within 50 units
            }

            if (quest.target.pricePoint) {
              completed = Math.abs(closestPoint.price - quest.target.pricePoint) <= 2; // Within 2 units
            }

            if (completed && !quest.completed) {
              // Award points for quest completion
              return { ...quest, completed: true };
            }

            return quest;
          });

          const newlyCompletedQuests = updatedQuests.filter(q => q.completed && !state.completedQuests.includes(q.id));
          const pointsEarned = newlyCompletedQuests.length * 100;
          const newCompletedQuests = [...state.completedQuests, ...newlyCompletedQuests.map(q => q.id)];

          return {
            ...state,
            currentPrice: closestPoint.price,
            currentQuantity: closestPoint.quantity,
            elasticity,
            revenue,
            marginalRevenue,
            quests: updatedQuests,
            completedQuests: newCompletedQuests,
            score: state.score + pointsEarned
          };
        }

        if (event.name === 'keyboard-move' && event.payload) {
          const { direction } = event.payload as { direction: 'left' | 'right' | 'up' | 'down' };

          let newPrice = state.currentPrice;
          let newQuantity = state.currentQuantity;

          switch (direction) {
            case 'left':
              newQuantity = Math.max(0, newQuantity - 1);
              break;
            case 'right':
              newQuantity = Math.min(50, newQuantity + 1);
              break;
            case 'up':
              newPrice = Math.min(100, newPrice + 1);
              break;
            case 'down':
              newPrice = Math.max(0, newPrice - 1);
              break;
          }

          // For linear demand curve P = 100 - 2Q, adjust the other variable
          if (direction === 'left' || direction === 'right') {
            newPrice = 100 - 2 * newQuantity;
          } else {
            newQuantity = (100 - newPrice) / 2;
          }

          return state.update(state, {
            type: 'action',
            name: 'move-point',
            payload: { price: newPrice, quantity: newQuantity }
          });
        }

        if (event.name === 'next-level') {
          const nextLevel = Math.min(state.level + 1, 3);
          const newQuests = generateQuests(nextLevel);

          return {
            ...state,
            level: nextLevel,
            quests: newQuests,
            completedQuests: []
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

  render: (state: ElasticityExplorerState, onEvent) => {
    return ElasticityExplorerRenderer({ state, onEvent });
  },

  assessMastery: (state: ElasticityExplorerState): boolean => {
    // Mastery: Complete all levels and most quests with good understanding
    const totalQuests = state.level * 2; // Approximate
    const completionRate = state.completedQuests.length / Math.max(totalQuests, 1);
    return state.level >= 3 && completionRate >= 0.8 && state.score >= 400;
  }
};