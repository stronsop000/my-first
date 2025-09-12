import { BaseGame } from './BaseGame';

export class SimpleDemoGame extends BaseGame {
  constructor() {
    super('simple-demo');
  }

  setupGame() {
    this.add.text(400, 200, 'Demo Game', {
      fontSize: '48px',
      color: '#4CAF50',
    }).setOrigin(0.5);

    this.add.text(400, 300, 'Click anywhere to score points!', {
      fontSize: '24px',
      color: '#333',
    }).setOrigin(0.5);

    this.add.text(400, 350, `Score: ${this.gameScore}`, {
      fontSize: '20px',
      color: '#2196F3',
    }).setOrigin(0.5).setName('scoreText');

    this.input.on('pointerdown', () => {
      this.addScore(100);
      const scoreText = this.children.getByName('scoreText') as Phaser.GameObjects.Text;
      if (scoreText) {
        scoreText.setText(`Score: ${this.gameScore}`);
      }

      if (this.gameScore >= 1000) {
        this.add.text(400, 450, 'Great job! Game Complete!', {
          fontSize: '24px',
          color: '#4CAF50',
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
          this.endGame(true);
        });
      }
    });

    this.createButton(400, 500, 'End Game', () => {
      this.endGame(false);
    });
  }
}