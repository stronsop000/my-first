import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import styled from 'styled-components';
import { Game } from '../../types';
import { SimpleDemoGame } from '../../games/SimpleDemo';
import { PuzzleMergeGame } from '../../games/PuzzleMergeFixed';
import { BudgetBlitzGame } from '../../games/BudgetBlitzFixed';
import { GameResult } from '../../games/BaseGame';

interface GameEngineProps {
  game: Game;
  onGameEnd: (result: GameResult) => void;
  onBack: () => void;
}

const GameContainer = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
`;

const GameCanvas = styled.div`
  width: 800px;
  height: 600px;
`;

export const GameEngine: React.FC<GameEngineProps> = ({ game, onGameEnd, onBack }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const getGameScene = () => {
      switch (game.id) {
        case 'puzzle-merge':
          return PuzzleMergeGame;
        case 'budget-blitz':
          return BudgetBlitzGame;
        default:
          return SimpleDemoGame;
      }
    };

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#ffffff',
      scene: getGameScene(),
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    const sceneKey = game.id === 'puzzle-merge' ? 'puzzle-merge' : 
                     game.id === 'budget-blitz' ? 'budget-blitz' : 'simple-demo';
    phaserGameRef.current.scene.start(sceneKey, { onGameEnd });

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [game.id, onGameEnd]);

  return (
    <GameContainer>
      <GameCanvas ref={gameRef} />
    </GameContainer>
  );
};