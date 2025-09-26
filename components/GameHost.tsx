'use client';

import React, { useEffect, useCallback } from 'react';
import { GameDefinition, GameState, GameEvent } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TutorialModal } from '@/components/TutorialModal';
import { GameHUD } from '@/components/GameHUD';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

interface GameHostProps {
  game: GameDefinition;
  onBack: () => void;
}

export function GameHost({ game, onBack }: GameHostProps) {
  const {
    gameState,
    showTutorial,
    setCurrentGame,
    updateGameState,
    resetGameState,
    setShowTutorial,
    trackEvent,
    updateGameProgress
  } = useAppStore();

  useEffect(() => {
    setCurrentGame(game);
    trackEvent({ type: 'game_start', gameId: game.id });
  }, [game, setCurrentGame, trackEvent]);

  const handleGameEvent = useCallback((event: GameEvent) => {
    if (!gameState) return;

    const newState = game.update(gameState, event);
    updateGameState(newState);

    // Track specific events
    if (event.type === 'hint') {
      trackEvent({ type: 'hint_used', gameId: game.id, data: { level: gameState.level } });
    }

    if (event.type === 'complete') {
      trackEvent({
        type: 'level_complete',
        gameId: game.id,
        data: {
          level: gameState.level,
          score: event.score,
          passed: event.passed,
          timeMs: gameState.timeMs,
          mastery: game.assessMastery(newState)
        }
      });

      // Update game progress
      updateGameProgress(game.id, {
        level: Math.max(gameState.level, 1),
        mastered: game.assessMastery(newState),
        timesPlayed: 1 // This would be incremented properly in a full implementation
      });
    }

    if (event.type === 'quit') {
      trackEvent({ type: 'quit', gameId: game.id, data: { level: gameState.level, timeMs: gameState.timeMs } });
    }
  }, [game, gameState, updateGameState, trackEvent, updateGameProgress]);

  const handleStartTutorial = () => {
    setShowTutorial(true);
  };

  const handleRestart = () => {
    resetGameState();
    trackEvent({ type: 'restart', gameId: game.id });
  };

  const handleQuit = () => {
    handleGameEvent({ type: 'quit' });
    onBack();
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading {game.title}...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Game HUD */}
      <GameHUD
        game={game}
        gameState={gameState}
        onTutorial={handleStartTutorial}
        onRestart={handleRestart}
        onQuit={handleQuit}
        onBack={onBack}
      />

      {/* Game Content */}
      <div className="relative">
        {game.render(gameState, handleGameEvent)}
      </div>

      {/* Tutorial Modal */}
      <TutorialModal game={game} />

      {/* Start Game Overlay (if game hasn't started) */}
      {gameState.timeMs === 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{game.title}</h2>
              <p className="text-gray-600 mb-6">{game.summary}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => handleGameEvent({ type: 'start' })}
                  size="lg"
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
                <Button
                  onClick={handleStartTutorial}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  View Tutorial First
                </Button>
                <Button
                  onClick={onBack}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}