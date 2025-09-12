import { BaseGame } from './BaseGame';

interface BudgetItem {
  name: string;
  category: 'needs' | 'wants' | 'savings';
  cost: number;
  allocated: boolean;
}

export class BudgetBlitzGame extends BaseGame {
  private income: number = 0;
  private remaining: number = 0;
  private timeLeft: number = 60;
  private items: BudgetItem[] = [];
  private categories = {
    needs: { allocated: 0, target: 0.5 },
    wants: { allocated: 0, target: 0.3 },
    savings: { allocated: 0, target: 0.2 },
  };
  
  private timerText!: Phaser.GameObjects.Text;
  private remainingText!: Phaser.GameObjects.Text;
  private itemsGroup!: Phaser.GameObjects.Group;

  constructor() {
    super('budget-blitz');
  }

  setupGame() {
    this.income = 5000;
    this.remaining = this.income;
    this.timeLeft = 60;

    this.items = [
      { name: 'Rent', category: 'needs', cost: 1500, allocated: false },
      { name: 'Groceries', category: 'needs', cost: 600, allocated: false },
      { name: 'Phone Bill', category: 'needs', cost: 80, allocated: false },
      { name: 'Coffee Shop', category: 'wants', cost: 150, allocated: false },
      { name: 'Movies', category: 'wants', cost: 200, allocated: false },
      { name: 'Gym', category: 'wants', cost: 50, allocated: false },
      { name: 'Emergency Fund', category: 'savings', cost: 500, allocated: false },
      { name: 'Retirement', category: 'savings', cost: 700, allocated: false },
    ];

    this.add.text(400, 50, 'Budget Blitz', {
      fontSize: '48px',
      color: '#4CAF50',
    }).setOrigin(0.5);

    this.add.text(400, 100, `Monthly Income: $${this.income}`, {
      fontSize: '24px',
      color: '#333',
    }).setOrigin(0.5);

    this.remainingText = this.add.text(400, 130, `Remaining: $${this.remaining}`, {
      fontSize: '20px',
      color: '#2196F3',
    }).setOrigin(0.5);

    this.timerText = this.add.text(700, 50, `Time: ${this.timeLeft}s`, {
      fontSize: '24px',
      color: '#F44336',
    }).setOrigin(0.5);

    this.itemsGroup = this.add.group();
    this.createBudgetItems();
    this.createCategoryAreas();

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  private createBudgetItems() {
    this.items.forEach((item, index) => {
      const y = 200 + index * 50;
      const itemContainer = this.add.container(150, y);

      const background = this.add.rectangle(0, 0, 280, 40, 0xffffff, 0.8);
      (background as any).setStroke(2, 0x333333);

      const text = this.add.text(-120, 0, `${item.name}: $${item.cost}`, {
        fontSize: '16px',
        color: '#333',
      }).setOrigin(0, 0.5);

      const allocateButton = this.add.text(100, 0, 'Allocate', {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#4CAF50',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.allocateItem(item, itemContainer));

      itemContainer.add([background, text, allocateButton]);
      this.itemsGroup.add(itemContainer);
    });
  }

  private createCategoryAreas() {
    const categories = [
      { name: 'Needs (50%)', color: 0x4CAF50, x: 500, target: 0.5 },
      { name: 'Wants (30%)', color: 0x2196F3, x: 600, target: 0.3 },
      { name: 'Savings (20%)', color: 0xFFC107, x: 700, target: 0.2 },
    ];

    categories.forEach(cat => {
      this.add.rectangle(cat.x, 300, 80, 200, cat.color, 0.3);
      this.add.text(cat.x, 200, cat.name, {
        fontSize: '14px',
        color: '#333',
      }).setOrigin(0.5);
    });
  }

  private allocateItem(item: BudgetItem, container: Phaser.GameObjects.Container) {
    if (item.allocated || this.remaining < item.cost) return;

    item.allocated = true;
    this.remaining -= item.cost;
    this.categories[item.category].allocated += item.cost;

    container.setAlpha(0.5);
    this.addScore(100);
    this.updateDisplay();
    this.checkWinCondition();
  }

  private updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    if (this.timeLeft <= 0) {
      this.endGame(this.checkWinCondition());
    }
  }

  private updateDisplay() {
    this.remainingText.setText(`Remaining: $${this.remaining}`);
  }

  private checkWinCondition(): boolean {
    const totalAllocated = this.income - this.remaining;
    const needsRatio = this.categories.needs.allocated / totalAllocated;
    const wantsRatio = this.categories.wants.allocated / totalAllocated;
    const savingsRatio = this.categories.savings.allocated / totalAllocated;

    return (
      Math.abs(needsRatio - 0.5) < 0.1 &&
      Math.abs(wantsRatio - 0.3) < 0.1 &&
      Math.abs(savingsRatio - 0.2) < 0.1 &&
      this.remaining < this.income * 0.1
    );
  }
}