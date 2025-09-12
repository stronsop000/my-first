import { BaseGame } from './BaseGame';

export class PuzzleMergeGame extends BaseGame {
  private grid: number[][] = [];
  private gridSize: number = 4;
  private tileSize: number = 80;
  private gridOffset: { x: number; y: number } = { x: 0, y: 0 };
  private tiles: Phaser.GameObjects.Group | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private canMove: boolean = true;
  private scoreText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('puzzle-merge');
  }

  setupGame() {
    // Initialize grid
    this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
    this.gridOffset = { x: 240, y: 180 };
    
    // Game title and instructions
    this.add.text(400, 50, 'Puzzle Merge', {
      fontSize: '36px',
      color: '#00BCD4',
    }).setOrigin(0.5);

    this.add.text(400, 90, 'Use arrow keys to merge tiles! Reach 2048 to win!', {
      fontSize: '18px',
      color: '#333',
    }).setOrigin(0.5);

    // Score display
    this.scoreText = this.add.text(50, 120, 'Score: 0', {
      fontSize: '24px',
      color: '#333',
    });

    // Initialize game objects
    this.tiles = this.add.group();
    
    // Set up controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Create visual grid
    this.createGrid();
    
    // Add starting tiles
    this.addRandomTile();
    this.addRandomTile();
    this.updateDisplay();
  }

  update() {
    if (!this.canMove || this.gameEnded || !this.cursors) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.move('left');
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.move('right');
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.move('up');
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.move('down');
    }
  }

  private createGrid() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = this.gridOffset.x + col * (this.tileSize + 5);
        const y = this.gridOffset.y + row * (this.tileSize + 5);
        
        const gridCell = this.add.rectangle(x, y, this.tileSize, this.tileSize, 0xCCCCCC);
        gridCell.setStrokeStyle(2, 0x999999);
      }
    }
  }

  private addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  private move(direction: string) {
    this.canMove = false;
    let moved = false;
    const newGrid = this.grid.map(row => [...row]);

    switch (direction) {
      case 'left':
        moved = this.moveLeft(newGrid);
        break;
      case 'right':
        moved = this.moveRight(newGrid);
        break;
      case 'up':
        moved = this.moveUp(newGrid);
        break;
      case 'down':
        moved = this.moveDown(newGrid);
        break;
    }

    if (moved) {
      this.grid = newGrid;
      this.addRandomTile();
      this.updateDisplay();
      
      if (this.checkWin()) {
        this.addScore(1000);
        this.time.delayedCall(500, () => {
          this.endGame(true);
        });
        return;
      } else if (this.checkGameOver()) {
        this.time.delayedCall(500, () => {
          this.endGame(false);
        });
        return;
      }
    }

    this.time.delayedCall(200, () => {
      this.canMove = true;
    });
  }

  private moveLeft(grid: number[][]): boolean {
    let moved = false;
    for (let row = 0; row < this.gridSize; row++) {
      const line = grid[row].filter(val => val !== 0);
      const merged = this.mergeLine(line);
      while (merged.length < this.gridSize) {
        merged.push(0);
      }
      
      for (let col = 0; col < this.gridSize; col++) {
        if (grid[row][col] !== merged[col]) {
          moved = true;
        }
        grid[row][col] = merged[col];
      }
    }
    return moved;
  }

  private moveRight(grid: number[][]): boolean {
    let moved = false;
    for (let row = 0; row < this.gridSize; row++) {
      const line = grid[row].filter(val => val !== 0).reverse();
      const merged = this.mergeLine(line).reverse();
      while (merged.length < this.gridSize) {
        merged.unshift(0);
      }
      
      for (let col = 0; col < this.gridSize; col++) {
        if (grid[row][col] !== merged[col]) {
          moved = true;
        }
        grid[row][col] = merged[col];
      }
    }
    return moved;
  }

  private moveUp(grid: number[][]): boolean {
    let moved = false;
    for (let col = 0; col < this.gridSize; col++) {
      const line = [];
      for (let row = 0; row < this.gridSize; row++) {
        if (grid[row][col] !== 0) {
          line.push(grid[row][col]);
        }
      }
      
      const merged = this.mergeLine(line);
      while (merged.length < this.gridSize) {
        merged.push(0);
      }
      
      for (let row = 0; row < this.gridSize; row++) {
        if (grid[row][col] !== merged[row]) {
          moved = true;
        }
        grid[row][col] = merged[row];
      }
    }
    return moved;
  }

  private moveDown(grid: number[][]): boolean {
    let moved = false;
    for (let col = 0; col < this.gridSize; col++) {
      const line = [];
      for (let row = this.gridSize - 1; row >= 0; row--) {
        if (grid[row][col] !== 0) {
          line.push(grid[row][col]);
        }
      }
      
      const merged = this.mergeLine(line);
      while (merged.length < this.gridSize) {
        merged.push(0);
      }
      
      for (let row = 0; row < this.gridSize; row++) {
        const newValue = merged[this.gridSize - 1 - row];
        if (grid[row][col] !== newValue) {
          moved = true;
        }
        grid[row][col] = newValue;
      }
    }
    return moved;
  }

  private mergeLine(line: number[]): number[] {
    const result = [];
    let i = 0;
    
    while (i < line.length) {
      if (i < line.length - 1 && line[i] === line[i + 1]) {
        const merged = line[i] * 2;
        result.push(merged);
        this.addScore(merged);
        i += 2;
      } else {
        result.push(line[i]);
        i++;
      }
    }
    
    return result;
  }

  private updateDisplay() {
    if (this.tiles) {
      this.tiles.clear(true, true);
    }
    
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.gameScore}`);
    }

    if (!this.tiles) return;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const value = this.grid[row][col];
        if (value !== 0) {
          const x = this.gridOffset.x + col * (this.tileSize + 5);
          const y = this.gridOffset.y + row * (this.tileSize + 5);
          
          const color = this.getTileColor(value);
          const tile = this.add.rectangle(x, y, this.tileSize, this.tileSize, color);
          
          const text = this.add.text(x, y, value.toString(), {
            fontSize: value >= 1000 ? '20px' : '24px',
            color: value > 4 ? '#ffffff' : '#333333',
          }).setOrigin(0.5);
          
          this.tiles.add(tile);
          this.tiles.add(text);

          // Add scale animation for new tiles
          if (value === 2 || value === 4) {
            tile.setScale(0);
            text.setScale(0);
            this.tweens.add({
              targets: [tile, text],
              scale: 1,
              duration: 200,
              ease: 'Back.easeOut'
            });
          }
        }
      }
    }
  }

  private getTileColor(value: number): number {
    const colors: { [key: number]: number } = {
      2: 0xEEE4DA,
      4: 0xEDE0C8,
      8: 0xF2B179,
      16: 0xF59563,
      32: 0xF67C5F,
      64: 0xF65E3B,
      128: 0xEDCF72,
      256: 0xEDCC61,
      512: 0xEDC850,
      1024: 0xEDC53F,
      2048: 0xEDC22E,
    };
    return colors[value] || 0x3C3A32;
  }

  private checkWin(): boolean {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === 2048) {
          return true;
        }
      }
    }
    return false;
  }

  private checkGameOver(): boolean {
    // Check for empty cells
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === 0) {
          return false;
        }
        
        // Check horizontal merges
        if (col < this.gridSize - 1 && this.grid[row][col] === this.grid[row][col + 1]) {
          return false;
        }
        
        // Check vertical merges
        if (row < this.gridSize - 1 && this.grid[row][col] === this.grid[row + 1][col]) {
          return false;
        }
      }
    }
    return true;
  }
}