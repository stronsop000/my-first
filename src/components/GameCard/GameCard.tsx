import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  highScore?: number;
}

const Card = styled.div<{ backgroundColor: string }>`
  background: linear-gradient(135deg, ${props => props.backgroundColor}, ${props => props.backgroundColor}dd);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all ${theme.transitions.medium};
  box-shadow: ${theme.shadows.light};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.heavy};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%);
    pointer-events: none;
  }
`;

const GameIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const GameInfo = styled.div`
  color: ${theme.colors.neutral.white};
`;

const GameName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const GameDescription = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const GameMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameType = styled.span<{ isFinance: boolean }>`
  background: ${props => props.isFinance ? theme.colors.accent.yellow : theme.colors.neutral.white};
  color: ${theme.colors.neutral.dark};
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: ${theme.fonts.heading};
  text-transform: uppercase;
`;

const HighScore = styled.div`
  color: ${theme.colors.neutral.white};
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  text-align: right;
`;

const Duration = styled.div`
  color: rgba(255,255,255,0.8);
  font-family: ${theme.fonts.body};
  font-size: 0.7rem;
  margin-top: 0.5rem;
`;

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, highScore }) => {
  return (
    <Card backgroundColor={game.backgroundColor} onClick={() => onClick(game)}>
      <div>
        <GameIcon>{game.icon}</GameIcon>
        <GameInfo>
          <GameName>{game.name}</GameName>
          <GameDescription>{game.description}</GameDescription>
        </GameInfo>
      </div>
      <div>
        <GameMeta>
          <GameType isFinance={game.isFinanceThemed}>
            {game.isFinanceThemed ? '💰 Finance' : '🎯 Fun'}
          </GameType>
          {highScore && (
            <HighScore>
              Best: {highScore.toLocaleString()}
            </HighScore>
          )}
        </GameMeta>
        <Duration>
          {game.minDuration}-{game.maxDuration} min
        </Duration>
      </div>
    </Card>
  );
};