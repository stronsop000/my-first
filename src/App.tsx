import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { User, Game, GameSession } from './types';
import { GameResult } from './games/BaseGame';
import { Header } from './components/Header/Header';
import { GameHub } from './components/GameHub/GameHub';
import { GameEngine } from './components/GameEngine/GameEngine';
import { GameResults } from './components/GameResults/GameResults';
import { GAMES } from './data/games';
import { getRandomLessonForGame } from './data/microLessons';
import { calculateLevel, XP_REWARDS } from './utils/xpSystem';

type AppState = 'hub' | 'playing' | 'results';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: ${theme.fonts.body};
`;

const MainContent = styled.main`
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-family: ${theme.fonts.heading};
  font-size: 1.5rem;
  color: ${theme.colors.neutral.dark};
`;

function App() {
  const [appState, setAppState] = useState<AppState>('hub');
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    initializeUser();
    loadHighScores();
  }, []);

  const initializeUser = () => {
    const savedUser = localStorage.getItem('financeArcadeUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        username: 'Player',
        xp: 0,
        level: 1,
        achievements: [],
        financeConceptsCompleted: [],
      };
      setCurrentUser(newUser);
      localStorage.setItem('financeArcadeUser', JSON.stringify(newUser));
    }
  };

  const loadHighScores = () => {
    const saved = localStorage.getItem('financeArcadeScores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  };

  const saveHighScores = (scores: Record<string, number>) => {
    setHighScores(scores);
    localStorage.setItem('financeArcadeScores', JSON.stringify(scores));
  };

  const saveUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('financeArcadeUser', JSON.stringify(user));
  };

  const handleGameSelect = (game: Game) => {
    setCurrentGame(game);
    setAppState('playing');
  };

  const handleGameEnd = (result: GameResult) => {
    if (!currentGame || !currentUser) return;

    setGameResult(result);

    const previousBest = highScores[currentGame.id] || 0;
    const newIsPersonalBest = result.score > previousBest;
    setIsPersonalBest(newIsPersonalBest);

    if (newIsPersonalBest) {
      saveHighScores({
        ...highScores,
        [currentGame.id]: result.score,
      });
    }

    let earnedXp = XP_REWARDS.PLAY_GAME;
    if (newIsPersonalBest) {
      earnedXp += XP_REWARDS.BEAT_PERSONAL_BEST;
    }
    setXpEarned(earnedXp);

    const newXp = currentUser.xp + earnedXp;
    const newLevel = calculateLevel(newXp);
    
    const updatedUser: User = {
      ...currentUser,
      xp: newXp,
      level: newLevel,
    };

    saveUser(updatedUser);

    const session: GameSession = {
      gameId: currentGame.id,
      score: result.score,
      duration: result.duration,
      timestamp: Date.now(),
    };

    const sessions = JSON.parse(localStorage.getItem('financeArcadeSessions') || '[]');
    sessions.push(session);
    localStorage.setItem('financeArcadeSessions', JSON.stringify(sessions));

    setAppState('results');
  };

  const handlePlayAgain = () => {
    if (currentGame) {
      setAppState('playing');
      setGameResult(null);
    }
  };

  const handleShare = () => {
    if (!currentGame || !gameResult) return;
    
    const shareText = `I scored ${gameResult.score.toLocaleString()} in ${currentGame.name} on Finance Arcade! Can you beat me?`;
    const shareUrl = `${window.location.origin}?challenge=${currentGame.id}-${gameResult.score}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Finance Arcade Challenge',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Challenge link copied to clipboard!');
    }
  };

  const handleBackToHub = () => {
    setAppState('hub');
    setCurrentGame(null);
    setGameResult(null);
  };

  const handleLogin = () => {
    const username = prompt('Enter your username:') || 'Player';
    if (currentUser) {
      const updatedUser = { ...currentUser, username };
      saveUser(updatedUser);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'hub':
        return (
          <GameHub
            games={GAMES}
            user={currentUser || undefined}
            onGameSelect={handleGameSelect}
            highScores={highScores}
          />
        );
      
      case 'playing':
        if (!currentGame) return <LoadingScreen>Loading game...</LoadingScreen>;
        return (
          <GameEngine
            game={currentGame}
            onGameEnd={handleGameEnd}
            onBack={handleBackToHub}
          />
        );
      
      case 'results':
        if (!currentGame || !gameResult) return <LoadingScreen>Loading results...</LoadingScreen>;
        return (
          <GameResults
            game={currentGame}
            result={gameResult}
            isPersonalBest={isPersonalBest}
            xpEarned={xpEarned}
            onPlayAgain={handlePlayAgain}
            onShare={handleShare}
            onBackToHub={handleBackToHub}
            microLesson={getRandomLessonForGame(currentGame.id)}
          />
        );
      
      default:
        return <LoadingScreen>Loading...</LoadingScreen>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header
          user={currentUser || undefined}
          onLogin={handleLogin}
        />
        <MainContent>
          {renderContent()}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
