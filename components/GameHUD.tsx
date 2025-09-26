'use client';

import React from 'react';
import { GameDefinition, GameState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  HelpCircle,
  RotateCcw,
  Home,
  Clock,
  Target,
  Trophy,
  AlertCircle
} from 'lucide-react';

interface GameHUDProps {
  game: GameDefinition;
  gameState: GameState;
  onTutorial: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onBack: () => void;
}

export function GameHUD({
  game,
  gameState,
  onTutorial,
  onRestart,
  onQuit,
  onBack
}: GameHUDProps) {
  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getObjectiveProgress = () => {
    // This would be implemented based on specific game logic
    // For now, return a simple calculation based on level and score
    const baseProgress = (gameState.level / game.levels) * 100;
    const scoreBonus = Math.min((gameState.score / 500) * 20, 20);
    return Math.min(baseProgress + scoreBonus, 100);
  };

  const getLevelProgress = () => {
    return (gameState.level / game.levels) * 100;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Games
            </Button>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <div>
              <h1 className="font-bold text-lg text-gray-900">{game.title}</h1>
              <div className="text-xs text-gray-500">
                Level {gameState.level} of {game.levels}
              </div>
            </div>
          </div>

          {/* Center Section - Game Stats */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Score */}
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <div>
                <div className="text-sm font-bold text-gray-900">{gameState.score.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-bold text-gray-900">{formatTime(gameState.timeMs)}</div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
            </div>

            {/* Mistakes */}
            {gameState.mistakes > 0 && (
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <div>
                  <div className="text-sm font-bold text-gray-900">{gameState.mistakes}</div>
                  <div className="text-xs text-gray-500">Mistakes</div>
                </div>
              </div>
            )}

            {/* Level Progress */}
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <div className="w-24">
                <Progress value={getLevelProgress()} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">Progress</div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onTutorial}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              title="View Tutorial"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Help</span>
            </Button>

            <Button
              onClick={onRestart}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Restart</span>
            </Button>

            <Button
              onClick={onQuit}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              title="Quit Game"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Quit</span>
            </Button>
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="md:hidden mt-2 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-yellow-600 font-bold">Score: {gameState.score.toLocaleString()}</span>
            <span className="text-blue-600">Time: {formatTime(gameState.timeMs)}</span>
            {gameState.mistakes > 0 && (
              <span className="text-red-600">Mistakes: {gameState.mistakes}</span>
            )}
          </div>
          <div className="w-20">
            <Progress value={getLevelProgress()} className="h-2" />
          </div>
        </div>

        {/* Objectives Indicator */}
        {game.objectives.length > 0 && (
          <div className="mt-2 hidden lg:block">
            <div className="text-xs text-gray-600 mb-1">Learning Objectives:</div>
            <div className="flex space-x-4">
              {game.objectives.map((objective, index) => (
                <div key={objective.id} className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      getObjectiveProgress() > (index + 1) * (100 / game.objectives.length)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-xs text-gray-600 truncate max-w-24">
                    {objective.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}