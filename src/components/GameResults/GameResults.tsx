import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { Game } from '../../types';
import { GameResult } from '../../games/BaseGame';

interface GameResultsProps {
  game: Game;
  result: GameResult;
  isPersonalBest: boolean;
  xpEarned: number;
  onPlayAgain: () => void;
  onShare: () => void;
  onBackToHub: () => void;
  microLesson?: string;
}

const ResultsContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${theme.colors.neutral.white};
  border-radius: 16px;
  box-shadow: ${theme.shadows.heavy};
  text-align: center;
`;

const GameTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 2rem;
  color: ${theme.colors.neutral.dark};
  margin-bottom: 1rem;
`;

const StatusBadge = styled.div<{ completed: boolean }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: ${theme.fonts.heading};
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  background: ${props => props.completed ? theme.colors.primary.green : theme.colors.accent.red};
  color: ${theme.colors.neutral.white};
`;

const ScoreSection = styled.div`
  margin-bottom: 2rem;
`;

const Score = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  color: ${theme.colors.primary.blue};
  margin-bottom: 0.5rem;
`;

const PersonalBest = styled.div`
  background: ${theme.colors.accent.yellow};
  color: ${theme.colors.neutral.dark};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-family: ${theme.fonts.heading};
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const XpEarned = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  color: ${theme.colors.primary.green};
  margin-bottom: 2rem;
  
  span {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const MicroLessonCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.accent.yellow}20, ${theme.colors.primary.green}20);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid ${theme.colors.primary.green};
  margin-bottom: 2rem;
`;

const LessonTitle = styled.h4`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  color: ${theme.colors.neutral.dark};
  margin: 0 0 0.5rem 0;
`;

const LessonText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.95rem;
  color: ${theme.colors.neutral.dark};
  margin: 0;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  font-family: ${theme.fonts.heading};
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: 1rem;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.green};
          color: ${theme.colors.neutral.white};
          &:hover {
            background: ${theme.colors.primary.blue};
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.accent.yellow};
          color: ${theme.colors.neutral.dark};
          &:hover {
            background: ${theme.colors.accent.yellow}dd;
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: transparent;
          color: ${theme.colors.neutral.gray};
          border: 2px solid ${theme.colors.neutral.gray};
          &:hover {
            color: ${theme.colors.primary.blue};
            border-color: ${theme.colors.primary.blue};
          }
        `;
    }
  }}
`;

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}:${(seconds % 60).toString().padStart(2, '0')}` : `${seconds}s`;
};

export const GameResults: React.FC<GameResultsProps> = ({
  game,
  result,
  isPersonalBest,
  xpEarned,
  onPlayAgain,
  onShare,
  onBackToHub,
  microLesson,
}) => {
  return (
    <ResultsContainer>
      <GameTitle>{game.name}</GameTitle>
      
      <StatusBadge completed={result.completed}>
        {result.completed ? '🎉 Completed!' : '💥 Game Over'}
      </StatusBadge>

      <ScoreSection>
        <Score>{result.score.toLocaleString()}</Score>
        {isPersonalBest && <PersonalBest>🏆 Personal Best!</PersonalBest>}
      </ScoreSection>

      <XpEarned>
        <span>+{xpEarned}</span> XP Earned
      </XpEarned>

      {microLesson && game.isFinanceThemed && (
        <MicroLessonCard>
          <LessonTitle>💡 Finance Tip</LessonTitle>
          <LessonText>{microLesson}</LessonText>
        </MicroLessonCard>
      )}

      <div style={{ marginBottom: '2rem', color: theme.colors.neutral.gray }}>
        Duration: {formatDuration(result.duration)}
      </div>

      <ButtonGroup>
        <Button variant="primary" onClick={onPlayAgain}>
          🎮 Play Again
        </Button>
        <Button variant="secondary" onClick={onShare}>
          📱 Share Score
        </Button>
        <Button variant="outline" onClick={onBackToHub}>
          🏠 Back to Hub
        </Button>
      </ButtonGroup>
    </ResultsContainer>
  );
};