import { BaseGame } from './BaseGame';

interface BudgetItem {
  id: string;
  name: string;
  category: 'needs' | 'wants' | 'savings';
  baseCost: number;
  currentCost: number;
  purchased: boolean;
  essential: boolean;
}

export class BudgetBlitzGame extends BaseGame {
  private income: number = 3000;
  private remaining: number = 3000;
  private timeLeft: number = 60;
  private targetSavings: number = 600; // 20% of income
  private items: BudgetItem[] = [];
  private currentSavings: number = 0;
  
  private timerText: Phaser.GameObjects.Text | null = null;
  private remainingText: Phaser.GameObjects.Text | null = null;
  private savingsText: Phaser.GameObjects.Text | null = null;
  private itemButtons: Phaser.GameObjects.Container[] = [];
  
  private gameTimer: Phaser.Time.TimerEvent | null = null;
  private priceFluctuationTimer: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super('budget-blitz');
  }

  setupGame() {
    // Reset game state
    this.remaining = this.income;
    this.timeLeft = 60;
    this.currentSavings = 0;
    this.itemButtons = [];

    // Initialize budget items with price fluctuations
    this.items = [
      // NEEDS (Essential - must buy all to avoid penalty)
      { id: 'rent', name: 'Rent', category: 'needs', baseCost: 1200, currentCost: 1200, purchased: false, essential: true },
      { id: 'groceries', name: 'Groceries', category: 'needs', baseCost: 400, currentCost: 400, purchased: false, essential: true },
      { id: 'utilities', name: 'Utilities', category: 'needs', baseCost: 150, currentCost: 150, purchased: false, essential: true },
      { id: 'phone', name: 'Phone Bill', category: 'needs', baseCost: 80, currentCost: 80, purchased: false, essential: true },
      
      // WANTS (Optional - choose wisely)
      { id: 'streaming', name: 'Streaming', category: 'wants', baseCost: 50, currentCost: 50, purchased: false, essential: false },
      { id: 'coffee', name: 'Coffee Shop', category: 'wants', baseCost: 120, currentCost: 120, purchased: false, essential: false },
      { id: 'gym', name: 'Gym Membership', category: 'wants', baseCost: 60, currentCost: 60, purchased: false, essential: false },
      { id: 'dining', name: 'Dining Out', category: 'wants', baseCost: 200, currentCost: 200, purchased: false, essential: false },
      { id: 'shopping', name: 'Shopping', category: 'wants', baseCost: 150, currentCost: 150, purchased: false, essential: false },
      
      // SAVINGS (Goal - need to reach target)
      { id: 'emergency', name: 'Emergency Fund', category: 'savings', baseCost: 300, currentCost: 300, purchased: false, essential: false },
      { id: 'retirement', name: 'Retirement', category: 'savings', baseCost: 200, currentCost: 200, purchased: false, essential: false },
      { id: 'investment', name: 'Investments', category: 'savings', baseCost: 100, currentCost: 100, purchased: false, essential: false },
    ];

    this.setupUI();
    this.createItemButtons();
    this.startGameLoop();
  }

  private setupUI() {
    // Title
    this.add.text(400, 40, 'Budget Blitz', {
      fontSize: '36px',
      color: '#4CAF50',
    }).setOrigin(0.5);

    // Goal explanation
    this.add.text(400, 80, `Goal: Cover all NEEDS, save $${this.targetSavings}, manage WANTS wisely!`, {
      fontSize: '16px',
      color: '#666',
    }).setOrigin(0.5);

    // Income display
    this.add.text(200, 120, `Monthly Income: $${this.income}`, {
      fontSize: '18px',
      color: '#333',
    }).setOrigin(0.5);

    // Timer
    this.timerText = this.add.text(600, 120, `Time: ${this.timeLeft}s`, {
      fontSize: '18px',
      color: '#F44336',
    }).setOrigin(0.5);

    // Remaining money
    this.remainingText = this.add.text(200, 150, `Remaining: $${this.remaining}`, {
      fontSize: '16px',
      color: '#2196F3',
    }).setOrigin(0.5);

    // Savings progress
    this.savingsText = this.add.text(600, 150, `Savings: $${this.currentSavings}/$${this.targetSavings}`, {
      fontSize: '16px',
      color: '#4CAF50',
    }).setOrigin(0.5);

    // Category headers
    this.add.text(200, 190, 'NEEDS (Must Buy)', {
      fontSize: '14px',
      color: '#F44336',
    }).setOrigin(0.5);

    this.add.text(400, 190, 'WANTS (Choose Wisely)', {
      fontSize: '14px',
      color: '#FF9800',
    }).setOrigin(0.5);

    this.add.text(600, 190, 'SAVINGS (Reach Goal)', {
      fontSize: '14px',
      color: '#4CAF50',
    }).setOrigin(0.5);
  }

  private createItemButtons() {
    const needsItems = this.items.filter(item => item.category === 'needs');
    const wantsItems = this.items.filter(item => item.category === 'wants');
    const savingsItems = this.items.filter(item => item.category === 'savings');

    // Position items in columns
    needsItems.forEach((item, index) => {
      this.createItemButton(item, 200, 220 + index * 50);
    });

    wantsItems.forEach((item, index) => {
      this.createItemButton(item, 400, 220 + index * 50);
    });

    savingsItems.forEach((item, index) => {
      this.createItemButton(item, 600, 220 + index * 50);
    });
  }

  private createItemButton(item: BudgetItem, x: number, y: number) {
    const container = this.add.container(x, y);

    const background = this.add.rectangle(0, 0, 180, 35, item.purchased ? 0x4CAF50 : 0xFFFFFF, 0.8);
    background.setStrokeStyle(2, item.purchased ? 0x4CAF50 : 0x999999);

    const nameText = this.add.text(-80, -8, item.name, {
      fontSize: '12px',
      color: item.purchased ? '#FFF' : '#333',
    });

    const costText = this.add.text(-80, 5, `$${item.currentCost}`, {
      fontSize: '10px',
      color: item.purchased ? '#FFF' : (item.currentCost > item.baseCost ? '#F44336' : '#4CAF50'),
    });

    // Price change indicator
    const priceChange = item.currentCost - item.baseCost;
    let changeText = '';
    if (priceChange > 0) changeText = `+$${priceChange}`;
    else if (priceChange < 0) changeText = `-$${Math.abs(priceChange)}`;
    
    if (changeText) {
      this.add.text(60, 0, changeText, {
        fontSize: '10px',
        color: priceChange > 0 ? '#F44336' : '#4CAF50',
      }).setOrigin(0.5);
    }

    container.add([background, nameText, costText]);

    // Make clickable if not purchased and affordable
    if (!item.purchased) {
      background.setInteractive();
      background.on('pointerdown', () => this.purchaseItem(item));
      background.on('pointerover', () => background.setFillStyle(0xE3F2FD));
      background.on('pointerout', () => background.setFillStyle(0xFFFFFF));
    }

    this.itemButtons.push(container);
  }

  private purchaseItem(item: BudgetItem) {
    if (item.purchased || this.remaining < item.currentCost) return;

    // Purchase the item
    item.purchased = true;
    this.remaining -= item.currentCost;

    // Add to savings if it's a savings item
    if (item.category === 'savings') {
      this.currentSavings += item.currentCost;
    }

    // Add score based on smart purchasing
    let scoreGain = 50;
    if (item.category === 'needs') {
      scoreGain = 100; // Bonus for buying essentials
    } else if (item.category === 'savings') {
      scoreGain = 150; // Bonus for saving
    } else if (item.currentCost < item.baseCost) {
      scoreGain = 75; // Bonus for buying wants on sale
    }

    this.addScore(scoreGain);

    // Refresh display
    this.updateDisplay();
    this.recreateButtons();
  }

  private recreateButtons() {
    // Clear existing buttons
    this.itemButtons.forEach(button => button.destroy());
    this.itemButtons = [];
    
    // Recreate buttons with updated state
    this.createItemButtons();
  }

  private updateDisplay() {
    if (this.remainingText) {
      this.remainingText.setText(`Remaining: $${this.remaining}`);
    }
    
    if (this.savingsText) {
      this.savingsText.setText(`Savings: $${this.currentSavings}/$${this.targetSavings}`);
    }
    
    if (this.timerText) {
      this.timerText.setText(`Time: ${this.timeLeft}s`);
      // Change color as time runs out
      if (this.timeLeft <= 10) {
        this.timerText.setColor('#F44336');
      } else if (this.timeLeft <= 30) {
        this.timerText.setColor('#FF9800');
      }
    }
  }

  private startGameLoop() {
    // Main game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Price fluctuation timer (every 5-8 seconds)
    this.priceFluctuationTimer = this.time.addEvent({
      delay: Phaser.Math.Between(5000, 8000),
      callback: this.fluctuatePrices,
      callbackScope: this,
      loop: true,
    });
  }

  private updateTimer() {
    this.timeLeft--;
    this.updateDisplay();

    if (this.timeLeft <= 0) {
      this.endGameWithResults();
    }
  }

  private fluctuatePrices() {
    // Randomly adjust prices of non-purchased items
    this.items.forEach(item => {
      if (!item.purchased && item.category !== 'needs') {
        // 30% chance of price change
        if (Math.random() < 0.3) {
          const changePercent = Phaser.Math.Between(-20, 30) / 100;
          const newCost = Math.round(item.baseCost * (1 + changePercent));
          item.currentCost = Math.max(newCost, Math.round(item.baseCost * 0.5)); // Never less than 50% of base
        }
      }
    });

    this.recreateButtons();

    // Schedule next fluctuation by recreating the timer
    if (this.priceFluctuationTimer) {
      this.priceFluctuationTimer.destroy();
    }
    
    this.priceFluctuationTimer = this.time.addEvent({
      delay: Phaser.Math.Between(4000, 8000),
      callback: this.fluctuatePrices,
      callbackScope: this,
      loop: false, // Set to false since we recreate it each time
    });
  }

  private endGameWithResults() {
    // Calculate final score based on financial wisdom
    let finalScore = this.gameScore;

    // Check if all needs are covered
    const needsItems = this.items.filter(item => item.category === 'needs');
    const purchasedNeeds = needsItems.filter(item => item.purchased);
    
    if (purchasedNeeds.length === needsItems.length) {
      finalScore += 500; // Big bonus for covering all needs
    } else {
      finalScore -= 300 * (needsItems.length - purchasedNeeds.length); // Penalty for missing needs
    }

    // Savings goal bonus
    if (this.currentSavings >= this.targetSavings) {
      finalScore += 1000; // Major bonus for meeting savings goal
    } else {
      const savingsRatio = this.currentSavings / this.targetSavings;
      finalScore += Math.round(500 * savingsRatio); // Partial credit
    }

    // Efficiency bonus - leftover money is good
    if (this.remaining > 0) {
      finalScore += Math.round(this.remaining / 5); // Small bonus for leftover money
    }

    // Set final score
    this.gameScore = Math.max(0, finalScore);

    // Determine if player "won"
    const won = purchasedNeeds.length === needsItems.length && this.currentSavings >= this.targetSavings;

    this.endGame(won);
  }
}