import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameDefinition, GameState, User, GameProgress } from './types';

interface AppStore {
  // User state
  user: User | null;
  setUser: (user: User) => void;

  // Game state
  currentGame: GameDefinition | null;
  gameState: GameState | null;
  setCurrentGame: (game: GameDefinition | null) => void;
  updateGameState: (update: Partial<GameState>) => void;
  resetGameState: () => void;

  // Progress tracking
  gameProgress: Record<string, GameProgress>;
  updateGameProgress: (gameId: string, progress: Partial<GameProgress>) => void;

  // High scores
  highScores: Record<string, number>;
  updateHighScore: (gameId: string, score: number) => void;

  // Tutorial state
  showTutorial: boolean;
  tutorialStep: number;
  setShowTutorial: (show: boolean) => void;
  setTutorialStep: (step: number) => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;

  // Analytics (local storage)
  trackEvent: (event: { type: string; gameId?: string; data?: unknown }) => void;
  events: unknown[];

  // Initialize default user
  initializeUser: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentGame: null,
      gameState: null,
      gameProgress: {},
      highScores: {},
      showTutorial: false,
      tutorialStep: 0,
      events: [],

      setUser: (user) => set({ user }),

      setCurrentGame: (game) => {
        set({
          currentGame: game,
          gameState: game ? game.init() : null,
          showTutorial: false,
          tutorialStep: 0
        });
      },

      updateGameState: (update) => {
        const { gameState } = get();
        if (gameState) {
          set({ gameState: { ...gameState, ...update } });
        }
      },

      resetGameState: () => {
        const { currentGame } = get();
        if (currentGame) {
          set({ gameState: currentGame.init() });
        }
      },

      updateGameProgress: (gameId, progress) => {
        const { gameProgress } = get();
        const existing = gameProgress[gameId] || {
          gameId,
          level: 1,
          highScore: 0,
          timesPlayed: 0,
          mastered: false,
          lastPlayed: new Date(),
          objectives: {}
        };
        set({
          gameProgress: {
            ...gameProgress,
            [gameId]: { ...existing, ...progress, lastPlayed: new Date() }
          }
        });
      },

      updateHighScore: (gameId, score) => {
        const { highScores, gameProgress } = get();
        const currentHigh = highScores[gameId] || 0;
        if (score > currentHigh) {
          set({
            highScores: { ...highScores, [gameId]: score }
          });
          // Also update game progress
          get().updateGameProgress(gameId, {
            highScore: score,
            timesPlayed: (gameProgress[gameId]?.timesPlayed || 0) + 1
          });
        }
      },

      setShowTutorial: (show) => set({ showTutorial: show }),
      setTutorialStep: (step) => set({ tutorialStep: step }),

      nextTutorialStep: () => {
        const { tutorialStep, currentGame } = get();
        if (currentGame && tutorialStep < currentGame.tutorialSteps.length - 1) {
          set({ tutorialStep: tutorialStep + 1 });
        } else {
          set({ showTutorial: false, tutorialStep: 0 });
        }
      },

      prevTutorialStep: () => {
        const { tutorialStep } = get();
        if (tutorialStep > 0) {
          set({ tutorialStep: tutorialStep - 1 });
        }
      },

      trackEvent: (event) => {
        const { events } = get();
        set({
          events: [...events, { ...event, timestamp: Date.now() }].slice(-1000) // Keep last 1000 events
        });
      },

      initializeUser: () => {
        const { user } = get();
        if (!user) {
          const newUser: User = {
            id: Date.now().toString(),
            username: 'Player',
            xp: 0,
            level: 1,
            achievements: [],
            financeConceptsCompleted: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set({ user: newUser });
        }
      }
    }),
    {
      name: 'finance-arcade-storage',
      partialize: (state) => ({
        user: state.user,
        gameProgress: state.gameProgress,
        highScores: state.highScores,
        events: state.events
      })
    }
  )
);