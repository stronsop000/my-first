import React, { useState, useRef, useEffect } from 'react';
import { ElasticityExplorerState, GameEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  BarChart3,
  Calculator,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { classifyElasticity } from './definition';

interface ElasticityExplorerRendererProps {
  state: ElasticityExplorerState;
  onEvent: (event: GameEvent) => void;
}

export function ElasticityExplorerRenderer({ state, onEvent }: ElasticityExplorerRendererProps) {
  const [showRevenueCurve, setShowRevenueCurve] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePointMove = (price: number, quantity: number) => {
    onEvent({ type: 'action', name: 'move-point', payload: { price, quantity } });
  };

  const handleKeyboardMove = (direction: 'left' | 'right' | 'up' | 'down') => {
    onEvent({ type: 'action', name: 'keyboard-move', payload: { direction } });
  };

  const handleNextLevel = () => {
    onEvent({ type: 'action', name: 'next-level' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleKeyboardMove('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleKeyboardMove('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleKeyboardMove('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleKeyboardMove('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system
    const maxPrice = 100;
    const maxQuantity = 50;
    const maxRevenue = 1250; // Approximate max for this curve

    const priceToY = (price: number) => padding + ((maxPrice - price) / maxPrice) * (height - 2 * padding);
    const quantityToX = (quantity: number) => padding + (quantity / maxQuantity) * (width - 2 * padding);
    const revenueToY = (revenue: number) => padding + ((maxRevenue - revenue) / maxRevenue) * (height - 2 * padding);

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Quantity', width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Price', 0, 0);
    ctx.restore();

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;

    // Vertical grid lines (quantity)
    for (let q = 0; q <= maxQuantity; q += 10) {
      const x = quantityToX(q);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.fillStyle = '#6B7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(q.toString(), x, height - padding + 20);
    }

    // Horizontal grid lines (price)
    for (let p = 0; p <= maxPrice; p += 20) {
      const y = priceToY(p);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#6B7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`$${p}`, padding - 10, y + 5);
    }

    // Draw demand curve
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    state.demandCurve.forEach((point, index) => {
      const x = quantityToX(point.quantity);
      const y = priceToY(point.price);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw revenue curve if enabled
    if (showRevenueCurve) {
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();

      state.demandCurve.forEach((point, index) => {
        const x = quantityToX(point.quantity);
        const y = revenueToY(point.revenue || 0);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Revenue curve legend
      ctx.fillStyle = '#10B981';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Revenue Curve', width - 150, 30);
    }

    // Draw current point
    const currentX = quantityToX(state.currentQuantity);
    const currentY = priceToY(state.currentPrice);

    // Highlight current point
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw elasticity zones
    const classification = classifyElasticity(state.elasticity);
    let zoneColor = '#6B7280';

    switch (classification) {
      case 'elastic':
        zoneColor = '#DC2626'; // Red for elastic
        break;
      case 'inelastic':
        zoneColor = '#2563EB'; // Blue for inelastic
        break;
      case 'unit':
        zoneColor = '#059669'; // Green for unit elastic
        break;
    }

    // Draw zone indicator on the current point
    ctx.strokeStyle = zoneColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 12, 0, 2 * Math.PI);
    ctx.stroke();

    // Demand curve legend
    ctx.fillStyle = '#3B82F6';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Demand Curve', width - 150, 50);

    // Handle canvas clicks
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert screen coordinates to data coordinates
      const quantity = ((x - padding) / (width - 2 * padding)) * maxQuantity;
      const price = maxPrice - ((y - padding) / (height - 2 * padding)) * maxPrice;

      // For linear demand curve P = 100 - 2Q, adjust to stay on curve
      const adjustedQuantity = Math.max(0, Math.min(maxQuantity, quantity));
      const adjustedPrice = 100 - 2 * adjustedQuantity;

      if (adjustedPrice >= 0 && adjustedQuantity >= 0) {
        handlePointMove(adjustedPrice, adjustedQuantity);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    return () => canvas.removeEventListener('click', handleCanvasClick);
  }, [state.currentPrice, state.currentQuantity, state.demandCurve, showRevenueCurve]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getElasticityLabel = () => {
    const classification = classifyElasticity(state.elasticity);
    const labels = {
      'elastic': { text: 'Elastic', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
      'inelastic': { text: 'Inelastic', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
      'unit': { text: 'Unit Elastic', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
      'perfectly-elastic': { text: 'Perfectly Elastic', color: 'text-red-800', bg: 'bg-red-100 border-red-300' },
      'perfectly-inelastic': { text: 'Perfectly Inelastic', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-300' }
    };
    return labels[classification] || { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' };
  };

  const elasticityInfo = getElasticityLabel();
  const completedQuestCount = state.quests.filter(q => q.completed).length;
  const totalQuests = state.quests.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Elasticity Explorer</h1>
          <p className="text-lg text-gray-600 mb-4">
            Level {state.level}/3 - Interactive Demand Curve Analysis
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <span>Score: {state.score}</span>
            <span>Quests: {completedQuestCount}/{totalQuests}</span>
            <span>Time: {Math.floor(state.timeMs / 1000)}s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Graph */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Interactive Demand Curve</CardTitle>
                    <CardDescription>
                      Click on the curve or use arrow keys to explore elasticity
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowRevenueCurve(!showRevenueCurve)}
                    variant="outline"
                    size="sm"
                  >
                    {showRevenueCurve ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    Revenue Curve
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg border p-4">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full max-w-full cursor-crosshair"
                    style={{ maxHeight: '400px' }}
                  />
                </div>

                {/* Current Values Display */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(state.currentPrice)}
                    </div>
                    <div className="text-sm text-gray-600">Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {state.currentQuantity.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Quantity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(state.revenue)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(state.marginalRevenue)}
                    </div>
                    <div className="text-sm text-gray-600">Marginal Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Analysis */}
          <div className="space-y-6">
            {/* Elasticity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Elasticity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {state.elasticity.toFixed(2)}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full border ${elasticityInfo.bg} ${elasticityInfo.color}`}>
                    {elasticityInfo.text}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>|Elasticity|:</span>
                    <span className="font-medium">{Math.abs(state.elasticity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification:</span>
                    <span className="font-medium">{elasticityInfo.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Effect:</span>
                    <span className="font-medium">
                      {Math.abs(state.elasticity) > 1 ? 'Price ↓ → Revenue ↑' :
                       Math.abs(state.elasticity) < 1 ? 'Price ↑ → Revenue ↑' :
                       'Revenue maximized'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Formula:</strong> Elasticity = (% Δ Quantity) / (% Δ Price)
                  <br />
                  <strong>Interpretation:</strong> Values &gt; 1 mean elastic (responsive), &lt; 1 mean inelastic
                </div>
              </CardContent>
            </Card>

            {/* Quests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Quests - Level {state.level}
                </CardTitle>
                <CardDescription>
                  Complete objectives to master elasticity concepts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {state.quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-3 rounded-lg border ${
                      quest.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {quest.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-medium ${quest.completed ? 'text-green-800' : 'text-gray-900'}`}>
                          {quest.title}
                        </h4>
                        <p className={`text-sm ${quest.completed ? 'text-green-700' : 'text-gray-600'}`}>
                          {quest.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{completedQuestCount}/{totalQuests}</span>
                  </div>
                  <Progress value={(completedQuestCount / totalQuests) * 100} />
                </div>

                {/* Next Level Button */}
                {completedQuestCount === totalQuests && state.level < 3 && (
                  <Button onClick={handleNextLevel} className="w-full mt-4">
                    Next Level <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Controls Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div><strong>Mouse:</strong> Click on curve to move</div>
                <div><strong>Keyboard:</strong> Use arrow keys for precise movement</div>
                <div><strong>↑/↓:</strong> Adjust price</div>
                <div><strong>←/→:</strong> Adjust quantity</div>
                <div className="text-xs text-gray-600 mt-3">
                  Red zone = Elastic | Blue zone = Inelastic | Green zone = Unit Elastic
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Complete */}
        {state.level >= 3 && completedQuestCount === totalQuests && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Elasticity Explorer Complete! 🎉</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">{state.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{completedQuestCount}</div>
                  <div className="text-sm text-gray-600">Quests Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{state.level}</div>
                  <div className="text-sm text-gray-600">Levels Mastered</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-800 font-bold">🎓 Elasticity Mastery Achieved!</div>
                <div className="text-blue-700 text-sm">
                  You now understand how price elasticity affects business decisions and revenue!
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}