import { GameDefinition, LearningObjective } from '@/lib/types';
import { Compound2048Renderer } from './renderer';

export type Compound2048State = {
  level: number;
  score: number;
  timeMs: number;
  mistakes: number;
  grid: (number | null)[][];
  moves: number;
  bestTile: number;
  previousGrid?: (number | null)[][];
  canUndo: boolean;
  gameOver: boolean;
  won: boolean;
  compoundPeriods: number;
};

const objectives: LearningObjective[] = [
  {
    id: 'compound-growth',
    text: 'Understand compound growth vs simple addition',
    rubric: ['Can explain difference between doubling and compound interest', 'Recognizes exponential growth patterns']
  },
  {
    id: 'interest-periods',
    text: 'Learn how compounding periods affect growth',
    rubric: ['Understands relationship between rate and periods', 'Can calculate compound returns']
  }
];

function initState(): Compound2048State {
  const grid = Array(4).fill(null).map(() => Array(4).fill(null));

  // Add two initial tiles
  addRandomTile(grid);
  addRandomTile(grid);

  return {
    level: 1,
    score: 0,
    timeMs: 0,
    mistakes: 0,
    grid,
    moves: 0,
    bestTile: 2,
    canUndo: false,
    gameOver: false,
    won: false,
    compoundPeriods: 0
  };
}

function addRandomTile(grid: (number | null)[][]) {
  const emptyCells: [number, number][] = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === null) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length > 0) {
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function moveGrid(grid: (number | null)[][], direction: 'up' | 'down' | 'left' | 'right') {
  const newGrid = grid.map(row => [...row]);
  let moved = false;
  let score = 0;

  const processLine = (line: (number | null)[]) => {
    // Remove nulls
    const filtered = line.filter(val => val !== null) as number[];
    const merged: number[] = [];
    let i = 0;

    while (i < filtered.length) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        // Merge tiles using compound formula: new_value = old_value * (1 + rate)^periods
        const mergedValue = filtered[i] * 2; // Simple doubling for now
        merged.push(mergedValue);
        score += mergedValue;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }

    // Fill with nulls
    while (merged.length < 4) {
      merged.push(null as any);
    }

    return { line: merged, score };
  };

  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < 4; i++) {
      const line = direction === 'left' ? newGrid[i] : [...newGrid[i]].reverse();
      const { line: processedLine, score: lineScore } = processLine(line);
      const finalLine = direction === 'left' ? processedLine : processedLine.reverse();

      if (JSON.stringify(finalLine) !== JSON.stringify(newGrid[i])) {
        moved = true;
      }

      newGrid[i] = finalLine;
      score += lineScore;
    }
  } else {
    for (let j = 0; j < 4; j++) {
      const column = [];
      for (let i = 0; i < 4; i++) {
        column.push(newGrid[i][j]);
      }

      const line = direction === 'up' ? column : [...column].reverse();
      const { line: processedLine, score: lineScore } = processLine(line);
      const finalLine = direction === 'up' ? processedLine : processedLine.reverse();

      let columnMoved = false;
      for (let i = 0; i < 4; i++) {
        if (newGrid[i][j] !== finalLine[i]) {
          columnMoved = true;
        }
        newGrid[i][j] = finalLine[i];
      }

      if (columnMoved) moved = true;
      score += lineScore;
    }
  }

  return { grid: newGrid, moved, score };
}

function isGameOver(grid: (number | null)[][]): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === null) return false;
    }
  }

  // Check for possible merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];
      if (
        (i > 0 && grid[i-1][j] === current) ||
        (i < 3 && grid[i+1][j] === current) ||
        (j > 0 && grid[i][j-1] === current) ||
        (j < 3 && grid[i][j+1] === current)
      ) {
        return false;
      }
    }
  }

  return true;
}

function getBestTile(grid: (number | null)[][]): number {
  let best = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] && grid[i][j]! > best) {
        best = grid[i][j]!;
      }
    }
  }
  return best;
}

function updateState(state: Compound2048State, event: any): Compound2048State {
  switch (event.type) {
    case 'start':
      return { ...initState(), timeMs: Date.now() };

    case 'action':
      if (event.name === 'move' && !state.gameOver) {
        const direction = event.payload as 'up' | 'down' | 'left' | 'right';
        const { grid: newGrid, moved, score } = moveGrid(state.grid, direction);

        if (!moved) {
          return { ...state, mistakes: state.mistakes + 1 };
        }

        // Add new tile
        addRandomTile(newGrid);

        const bestTile = getBestTile(newGrid);
        const gameOver = isGameOver(newGrid);
        const won = bestTile >= 2048;

        return {
          ...state,
          previousGrid: state.grid,
          grid: newGrid,
          score: state.score + score,
          moves: state.moves + 1,
          bestTile,
          canUndo: true,
          gameOver,
          won,
          compoundPeriods: state.compoundPeriods + (score > 0 ? 1 : 0)
        };
      }

      if (event.name === 'undo' && state.canUndo && state.previousGrid) {
        return {
          ...state,
          grid: state.previousGrid,
          moves: Math.max(0, state.moves - 1),
          canUndo: false,
          previousGrid: undefined
        };
      }

      if (event.name === 'restart') {
        return initState();
      }

      return state;

    case 'complete':
      return { ...state, timeMs: Date.now() - state.timeMs };

    default:
      return state;
  }
}

function assessMastery(state: Compound2048State): boolean {
  return state.bestTile >= 512 && state.compoundPeriods >= 10;
}

export const compound2048Definition: GameDefinition = {
  id: 'compound-2048',
  title: 'Compound 2048',
  summary: 'Learn compound growth through the familiar 2048 puzzle mechanics',
  estimatedTimeMin: 15,
  objectives,
  controls: { mouse: true, touch: true, keyboard: true },
  tutorialSteps: [
    'Use arrow keys or swipe to move tiles',
    'When two tiles with the same number touch, they merge',
    'Each merge demonstrates compound growth',
    'Try to reach 2048 to master compounding',
    'Use undo (1 move) if you make a mistake',
    'Watch how compound periods accelerate growth'
  ],
  levels: 3,
  init: initState,
  update: updateState,
  render: Compound2048Renderer,
  assessMastery
};