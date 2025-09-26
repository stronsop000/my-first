import { GameDefinition } from './types';
import { compound2048Definition } from '../games/compound-2048/definition';
import { npvBuilderDefinition } from '../games/npv-builder/definition';
import { budgetBattleDefinition } from '../games/budget-battle/definition';
import { elasticityExplorerDefinition } from '../games/elasticity-explorer/definition';

export const GAMES: GameDefinition[] = [
  compound2048Definition,
  npvBuilderDefinition,
  budgetBattleDefinition,
  elasticityExplorerDefinition
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES.find(game => game.id === id);
}

export const FINANCE_GLOSSARY = {
  'NPV': {
    term: 'Net Present Value',
    definition: 'The difference between the present value of cash inflows and the present value of cash outflows over time.',
    example: 'If an investment costs $1000 today but returns $1200 in present value terms, the NPV is $200.'
  },
  'Discount Rate': {
    term: 'Discount Rate',
    definition: 'The interest rate used to determine the present value of future cash flows.',
    example: 'With a 10% discount rate, $110 received next year is worth $100 today.'
  },
  'Cash Flow': {
    term: 'Cash Flow',
    definition: 'The amount of cash generated or spent by a business or investment over a specific period.',
    example: 'A coffee shop might have initial cash outflow of $50,000 and monthly inflows of $5,000.'
  },
  'Present Value': {
    term: 'Present Value',
    definition: 'The current value of future cash flows, discounted back at an appropriate rate.',
    example: 'At 5% discount rate, $105 next year has a present value of $100.'
  },
  'Fixed Costs': {
    term: 'Fixed Costs',
    definition: 'Expenses that remain constant regardless of the level of production or activity.',
    example: 'Rent, insurance, and loan payments are typically fixed costs.'
  },
  'Variable Costs': {
    term: 'Variable Costs',
    definition: 'Expenses that change in proportion to the level of activity or production.',
    example: 'Food expenses, gas, and entertainment can vary month to month.'
  },
  'Budget': {
    term: 'Budget',
    definition: 'A plan for managing income and expenses over a specific period.',
    example: 'A monthly budget might allocate 30% for housing, 15% for food, and 20% for savings.'
  },
  'Emergency Fund': {
    term: 'Emergency Fund',
    definition: 'Savings set aside to cover unexpected expenses or financial emergencies.',
    example: 'Financial experts recommend 3-6 months of expenses in an emergency fund.'
  },
  'Price Elasticity': {
    term: 'Price Elasticity of Demand',
    definition: 'A measure of how responsive quantity demanded is to changes in price.',
    example: 'If a 10% price increase causes a 20% decrease in quantity, elasticity is -2 (elastic).'
  },
  'Elastic Demand': {
    term: 'Elastic Demand',
    definition: 'When quantity demanded changes significantly in response to price changes (|elasticity| > 1).',
    example: 'Luxury items often have elastic demand - small price increases cause large drops in sales.'
  },
  'Inelastic Demand': {
    term: 'Inelastic Demand',
    definition: 'When quantity demanded changes little in response to price changes (|elasticity| < 1).',
    example: 'Gasoline has inelastic demand - people still need to drive despite price increases.'
  },
  'Revenue': {
    term: 'Total Revenue',
    definition: 'The total amount of income generated from sales, calculated as Price × Quantity.',
    example: 'Selling 100 items at $10 each generates $1,000 in total revenue.'
  },
  'Marginal Revenue': {
    term: 'Marginal Revenue',
    definition: 'The additional revenue generated from selling one more unit.',
    example: 'If total revenue increases from $1,000 to $1,009 when selling one more unit, MR is $9.'
  },
  'Unit Elastic': {
    term: 'Unit Elastic',
    definition: 'When the percentage change in quantity equals the percentage change in price (elasticity = -1).',
    example: 'At unit elasticity, total revenue is maximized - the optimal pricing point.'
  }
};