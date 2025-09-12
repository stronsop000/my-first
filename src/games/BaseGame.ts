import Phaser from 'phaser';

export interface GameResult {
  score: number;
  duration: number;
  completed: boolean;
}

export abstract class BaseGame extends Phaser.Scene {
  protected startTime: number = 0;
  protected gameScore: number = 0;
  protected gameEnded: boolean = false;
  protected onGameEnd?: (result: GameResult) => void;

  constructor(key: string) {
    super({ key });
  }

  init(data: { onGameEnd?: (result: GameResult) => void }) {
    this.onGameEnd = data.onGameEnd;
  }

  create() {
    this.startTime = Date.now();
    this.gameScore = 0;
    this.gameEnded = false;
    this.setupGame();
  }

  protected abstract setupGame(): void;

  protected endGame(completed: boolean = true) {
    if (this.gameEnded) return;
    
    this.gameEnded = true;
    const duration = Date.now() - this.startTime;
    
    const result: GameResult = {
      score: this.gameScore,
      duration,
      completed,
    };

    if (this.onGameEnd) {
      this.onGameEnd(result);
    }
  }

  protected addScore(points: number) {
    this.gameScore += points;
  }

  protected createButton(x: number, y: number, text: string, callback: () => void) {
    const button = this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', callback)
    .on('pointerover', () => button.setScale(1.1))
    .on('pointerout', () => button.setScale(1));

    return button;
  }
}