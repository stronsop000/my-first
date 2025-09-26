import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RefreshCw } from 'lucide-react';

type Compound2048State = {
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

interface Compound2048RendererProps {
  state: Compound2048State;
  onEvent: (event: any) => void;
}

export function Compound2048Renderer({ state, onEvent }: Compound2048RendererProps) {
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (state.gameOver) return;

      let direction: string | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
      }

      if (direction) {
        e.preventDefault();
        onEvent({ type: 'action', name: 'move', payload: direction });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.gameOver, onEvent]);

  const getTileClass = (value: number | null) => {
    if (!value) return 'bg-gray-800 text-transparent';

    const colorMap: Record<number, string> = {
      2: 'bg-gray-700 text-white',
      4: 'bg-gray-600 text-white',
      8: 'bg-[#00F5D4] text-black',
      16: 'bg-[#7C3AED] text-white',
      32: 'bg-[#FBBF24] text-black',
      64: 'bg-[#FB7185] text-white',
      128: 'bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] text-white',
      256: 'bg-gradient-to-r from-[#7C3AED] to-[#FBBF24] text-white',
      512: 'bg-gradient-to-r from-[#FBBF24] to-[#FB7185] text-white',
      1024: 'bg-gradient-to-r from-[#FB7185] to-[#00F5D4] text-white',
      2048: 'bg-gradient-to-r from-[#00F5D4] via-[#7C3AED] to-[#FBBF24] text-white animate-pulse'
    };

    return colorMap[value] || 'bg-white text-black';
  };

  const formatNumber = (num: number | null) => {
    if (!num) return '';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0F1A] text-white p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] bg-clip-text text-transparent">
            Compound 2048
          </h1>
          <p className="text-gray-400 text-sm">
            Learn compound growth through familiar 2048 mechanics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-gray-700">
            <div className="text-lg font-bold text-[#00F5D4]">{state.score}</div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-gray-700">
            <div className="text-lg font-bold text-[#FBBF24]">{state.bestTile}</div>
            <div className="text-xs text-gray-400">Best</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-gray-700">
            <div className="text-lg font-bold text-[#7C3AED]">{state.moves}</div>
            <div className="text-xs text-gray-400">Moves</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-gray-700">
            <div className="text-lg font-bold text-[#FB7185]">{state.compoundPeriods}</div>
            <div className="text-xs text-gray-400">Periods</div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700">
          <div className="grid grid-cols-4 gap-2">
            {state.grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 ${getTileClass(cell)}`}
                >
                  {formatNumber(cell)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => onEvent({ type: 'action', name: 'undo' })}
            disabled={!state.canUndo}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button
            onClick={() => onEvent({ type: 'action', name: 'restart' })}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        {/* Learning Panel */}
        <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-700 mb-6">
          <h3 className="text-sm font-semibold text-[#00F5D4] mb-2">💡 Learning: Compound Growth</h3>
          <p className="text-xs text-gray-400 mb-2">
            Each merge demonstrates compound growth. Notice how larger numbers grow exponentially faster.
          </p>
          <div className="text-xs text-gray-300">
            <strong>Example:</strong> 2 → 4 → 8 → 16 (each step doubles the previous)
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400">
          <p>Use arrow keys or WASD to move tiles</p>
          <p className="mt-1">Goal: Reach 2048 to master compound growth!</p>
        </div>

        {/* Game Over */}
        {state.gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-center max-w-sm">
              <h2 className="text-2xl font-bold mb-4 text-white">
                {state.won ? '🎉 You Won!' : '😞 Game Over'}
              </h2>
              <p className="text-gray-300 mb-4">
                Final Score: <span className="text-[#FBBF24] font-bold">{state.score}</span>
              </p>
              <p className="text-gray-300 mb-6">
                Best Tile: <span className="text-[#00F5D4] font-bold">{state.bestTile}</span>
              </p>
              <Button
                onClick={() => onEvent({ type: 'action', name: 'restart' })}
                className="w-full bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] hover:from-[#00F5D4]/80 hover:to-[#7C3AED]/80 text-black font-semibold"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}