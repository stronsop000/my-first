import React from 'react';
import { NPVBuilderState, GameEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

interface NPVBuilderRendererProps {
  state: NPVBuilderState;
  onEvent: (event: GameEvent) => void;
}

export function NPVBuilderRenderer({ state, onEvent }: NPVBuilderRendererProps) {
  const handleDragStart = (cashFlowId: string) => {
    onEvent({ type: 'action', name: 'drag-start', payload: cashFlowId });
  };

  const handleDragEnd = () => {
    onEvent({ type: 'action', name: 'drag-end' });
  };

  const handleDrop = (year: number) => {
    if (state.draggedItem) {
      onEvent({
        type: 'action',
        name: 'place-cashflow',
        payload: { cashFlowId: state.draggedItem, year }
      });
    }
  };

  const handleDiscountRateChange = (rate: number) => {
    onEvent({ type: 'action', name: 'set-discount-rate', payload: rate });
  };

  const handleMakeDecision = (decision: 'invest' | 'reject' | 'indifferent') => {
    onEvent({ type: 'action', name: 'make-decision', payload: { decision } });
  };

  const handleNextLevel = () => {
    onEvent({ type: 'action', name: 'next-level' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDecisionIcon = () => {
    switch (state.decision) {
      case 'invest': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'reject': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'indifferent': return <Minus className="w-5 h-5 text-yellow-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDecisionColor = () => {
    switch (state.decision) {
      case 'invest': return 'bg-green-100 border-green-300 text-green-800';
      case 'reject': return 'bg-red-100 border-red-300 text-red-800';
      case 'indifferent': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const unplacedCashFlows = state.cashFlows.filter(cf => !cf.isPlaced);
  const placedCashFlows = state.cashFlows.filter(cf => cf.isPlaced);
  const timelineYears = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NPV Builder</h1>
          <p className="text-lg text-gray-600 mb-4">{state.currentProject.name}</p>
          <div className="flex justify-center space-x-8 text-sm">
            <span>Level: {state.level}/3</span>
            <span>Score: {state.score}</span>
            <span>Time: {Math.floor(state.timeMs / 1000)}s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Cash Flow Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Cash Flow Library
              </CardTitle>
              <CardDescription>
                Drag cash flows to the timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {unplacedCashFlows.map((cf) => (
                  <div
                    key={cf.id}
                    draggable
                    onDragStart={() => handleDragStart(cf.id)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 rounded-lg border-2 border-dashed cursor-move transition-all hover:shadow-md
                      ${cf.amount >= 0
                        ? 'bg-green-50 border-green-300 hover:bg-green-100'
                        : 'bg-red-50 border-red-300 hover:bg-red-100'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Year {cf.year}</span>
                      <span className={`font-bold ${cf.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(cf.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                {unplacedCashFlows.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    All cash flows placed!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Center Panel - Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Timeline</CardTitle>
              <CardDescription>
                Drop cash flows here to see their present values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineYears.map((year) => {
                  const cashFlowsForYear = placedCashFlows.filter(cf => cf.year === year);
                  const totalForYear = cashFlowsForYear.reduce((sum, cf) => sum + cf.amount, 0);
                  const presentValue = totalForYear / Math.pow(1 + state.discountRate, year);

                  return (
                    <div
                      key={year}
                      className={`min-h-[80px] p-4 rounded-lg border-2 border-dashed transition-all
                        ${state.draggedItem
                          ? 'border-blue-400 bg-blue-50 hover:border-blue-500'
                          : 'border-gray-300 bg-gray-50'
                        }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(year);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">Year {year}</span>
                        {cashFlowsForYear.length > 0 && (
                          <div className="text-right">
                            <div className={`font-bold ${totalForYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(totalForYear)}
                            </div>
                            <div className="text-xs text-gray-500">
                              PV: {formatCurrency(presentValue)}
                            </div>
                            <div className="text-xs text-gray-400">
                              ÷ (1.{Math.round(state.discountRate * 100)})^{year}
                            </div>
                          </div>
                        )}
                      </div>
                      {cashFlowsForYear.length === 0 && (
                        <div className="text-center text-gray-400 text-sm">
                          Drop cash flow here
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Controls and NPV */}
          <div className="space-y-6">
            {/* Discount Rate Control */}
            <Card>
              <CardHeader>
                <CardTitle>Discount Rate</CardTitle>
                <CardDescription>
                  Your required rate of return
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={state.discountRate * 100}
                    onChange={(e) => handleDiscountRateChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {(state.discountRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NPV Calculation */}
            <Card>
              <CardHeader>
                <CardTitle>NPV Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Net Present Value</div>
                    <div className={`text-3xl font-bold ${
                      state.calculatedNPV > 0 ? 'text-green-600' :
                      state.calculatedNPV < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {formatCurrency(state.calculatedNPV)}
                    </div>
                  </div>

                  {/* Investment Decision */}
                  {state.decision && (
                    <div className={`p-4 rounded-lg border ${getDecisionColor()} text-center`}>
                      <div className="flex items-center justify-center mb-2">
                        {getDecisionIcon()}
                        <span className="ml-2 font-bold uppercase tracking-wide">
                          {state.decision}
                        </span>
                      </div>
                      <div className="text-sm">
                        {state.decision === 'invest' && 'NPV > 0: Accept the project!'}
                        {state.decision === 'reject' && 'NPV < 0: Reject the project!'}
                        {state.decision === 'indifferent' && 'NPV ≈ 0: Indifferent decision'}
                      </div>
                    </div>
                  )}

                  {/* Decision Buttons */}
                  {placedCashFlows.length === state.cashFlows.length && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleMakeDecision('invest')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Invest
                      </Button>
                      <Button
                        onClick={() => handleMakeDecision('reject')}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleMakeDecision('indifferent')}
                        variant="secondary"
                        className="w-full"
                      >
                        Indifferent
                      </Button>
                    </div>
                  )}

                  {/* Next Level */}
                  {state.level < 3 && state.decision && (
                    <Button
                      onClick={handleNextLevel}
                      className="w-full"
                    >
                      Next Level <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Completion</span>
                    <span>{Math.round((placedCashFlows.length / state.cashFlows.length) * 100)}%</span>
                  </div>
                  <Progress value={(placedCashFlows.length / state.cashFlows.length) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}