import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { Game, User } from '../../types';
import { GameCard } from '../GameCard/GameCard';

interface GameHubProps {
  games: Game[];
  user?: User;
  onGameSelect: (game: Game) => void;
  highScores: Record<string, number>;
}

const HubContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 2.5rem;
  color: ${theme.colors.neutral.dark};
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, ${theme.colors.primary.blue}, ${theme.colors.primary.green});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.2rem;
  color: ${theme.colors.neutral.gray};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.8rem;
  color: ${theme.colors.neutral.dark};
  margin: 2rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GameSection = styled.section`
  margin-bottom: 3rem;
`;

export const GameHub: React.FC<GameHubProps> = ({ 
  games, 
  user, 
  onGameSelect, 
  highScores 
}) => {
  const financeGames = games.filter(game => game.isFinanceThemed);
  const funGames = games.filter(game => !game.isFinanceThemed);

  return (
    <HubContainer>
      <WelcomeSection>
        <Title>Welcome to Finance Arcade!</Title>
        <Subtitle>
          Play addictive games, learn finance concepts, and compete with friends. 
          Level up your skills while having fun!
        </Subtitle>
      </WelcomeSection>

      <GameSection>
        <SectionTitle>💰 Finance Games</SectionTitle>
        <GamesGrid>
          {financeGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={onGameSelect}
              highScore={highScores[game.id]}
            />
          ))}
        </GamesGrid>
      </GameSection>

      <GameSection>
        <SectionTitle>🎯 Fun Games</SectionTitle>
        <GamesGrid>
          {funGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={onGameSelect}
              highScore={highScores[game.id]}
            />
          ))}
        </GamesGrid>
      </GameSection>
    </HubContainer>
  );
};