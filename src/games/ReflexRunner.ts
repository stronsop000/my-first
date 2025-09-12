import { BaseGame } from './BaseGame';

export class ReflexRunnerGame extends BaseGame {
  private player!: Phaser.GameObjects.Rectangle;
  private obstacles!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number = 200;
  private obstacleSpeed: number = 300;
  private spawnTimer!: Phaser.Time.TimerEvent;
  private distance: number = 0;
  private distanceText!: Phaser.GameObjects.Text;
  private isJumping: boolean = false;
  private jumpHeight: number = 150;

  constructor() {
    super('reflex-runner');
  }

  setupGame() {
    this.add.text(400, 30, 'Reflex Runner', {
      fontSize: '36px',
      color: '#FF6D00',
    }).setOrigin(0.5);

    this.add.text(400, 70, 'Use SPACE to jump over obstacles!', {
      fontSize: '18px',
      color: '#333',
    }).setOrigin(0.5);

    this.add.rectangle(400, 550, 800, 100, 0x4CAF50);
    
    this.player = this.add.rectangle(150, 500, 30, 30, 0x2196F3);
    this.player.setOrigin(0.5, 1);

    this.obstacles = this.add.group();

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.distanceText = this.add.text(50, 100, 'Distance: 0m', {
      fontSize: '20px',
      color: '#333',
    });

    this.spawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 100,
      callback: this.updateDistance,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 5000,
      callback: this.increaseSpeed,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.gameEnded) return;

    if (this.cursors.space.isDown && !this.isJumping) {
      this.jump();
    }

    this.obstacles.children.entries.forEach((obstacle: any) => {
      obstacle.x -= this.obstacleSpeed * (1/60);
      
      if (obstacle.x < -50) {
        obstacle.destroy();
        this.addScore(10);
      }

      if (this.checkCollision(this.player, obstacle)) {
        this.endGame(false);
      }
    });
  }

  private jump() {
    if (this.isJumping) return;
    
    this.isJumping = true;
    const originalY = this.player.y;
    
    this.tweens.add({
      targets: this.player,
      y: originalY - this.jumpHeight,
      duration: 300,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        this.isJumping = false;
      }
    });
  }

  private spawnObstacle() {
    const obstacle = this.add.rectangle(850, 500, 20, 40, 0xF44336);
    obstacle.setOrigin(0.5, 1);
    this.obstacles.add(obstacle);
    
    const currentDelay = (this.spawnTimer as any).delay;
    this.spawnTimer.remove();
    this.spawnTimer = this.time.addEvent({
      delay: Math.max(800, currentDelay - 50),
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });
  }

  private updateDistance() {
    this.distance += 1;
    this.distanceText.setText(`Distance: ${this.distance}m`);
  }

  private increaseSpeed() {
    this.obstacleSpeed += 20;
    this.addScore(50);
  }

  private checkCollision(player: Phaser.GameObjects.Rectangle, obstacle: Phaser.GameObjects.Rectangle): boolean {
    const playerBounds = player.getBounds();
    const obstacleBounds = obstacle.getBounds();
    
    return Phaser.Geom.Rectangle.Overlaps(playerBounds, obstacleBounds);
  }
}