import React, { useState } from 'react';
import { BudgetBattleState, GameEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { validateBudget } from './definition';

interface BudgetBattleRendererProps {
  state: BudgetBattleState;
  onEvent: (event: GameEvent) => void;
}

export function BudgetBattleRenderer({ state, onEvent }: BudgetBattleRendererProps) {
  const [budgetValues, setBudgetValues] = useState<Record<string, number>>(
    state.categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.allocated }), {})
  );

  const handleBudgetChange = (categoryId: string, value: number) => {
    setBudgetValues(prev => ({ ...prev, [categoryId]: value }));
    onEvent({ type: 'action', name: 'allocate-budget', payload: { categoryId, amount: value } });
  };

  const handleSubmitBudget = () => {
    onEvent({ type: 'action', name: 'submit-budget' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const validation = validateBudget(state.categories, state.monthlyIncome);
  const totalAllocated = state.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const remainingIncome = state.monthlyIncome - totalAllocated;
  const totalSpent = state.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const actualCashFlow = state.monthlyIncome - totalSpent;

  const latestEvent = state.events[state.events.length - 1];

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'border-red-300 bg-red-50';
      case 2: return 'border-yellow-300 bg-yellow-50';
      case 3: return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Essential';
      case 2: return 'Important';
      case 3: return 'Optional';
      default: return 'Unknown';
    }
  };

  const getConsecutiveSuccessMessage = () => {
    if (state.consecutiveSuccesses >= 3) {
      return "🎉 Mastery achieved! 3+ months of financial stability!";
    } else if (state.consecutiveSuccesses > 0) {
      return `💪 ${state.consecutiveSuccesses} consecutive successful month${state.consecutiveSuccesses > 1 ? 's' : ''}`;
    }
    return "Start your success streak!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Battle</h1>
          <p className="text-lg text-gray-600 mb-4">
            Round {state.currentRound}/{state.totalRounds} - Monthly Budget Planning
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <span>Score: {state.score}</span>
            <span>Streak: {state.consecutiveSuccesses} months</span>
            <span>Cash Buffer: {formatCurrency(state.cashBuffer)}</span>
          </div>
        </div>

        {/* Latest Event Alert */}
        {latestEvent && (
          <Card className="mb-6 border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-bold text-orange-800">{latestEvent.title}</h3>
                  <p className="text-orange-700">{latestEvent.description}</p>
                  <p className={`font-bold ${latestEvent.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Impact: {latestEvent.impact > 0 ? '+' : ''}{formatCurrency(latestEvent.impact)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Income & Summary */}
          <div className="space-y-6">
            {/* Monthly Income */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(state.monthlyIncome)}
                </div>
              </CardContent>
            </Card>

            {/* Budget Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Allocated:</span>
                  <span className={totalAllocated > state.monthlyIncome ? 'text-red-600 font-bold' : ''}>
                    {formatCurrency(totalAllocated)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className={remainingIncome < 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                    {formatCurrency(remainingIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Savings Rate:</span>
                  <span className={validation.savingsRate < 15 ? 'text-red-600 font-bold' : 'text-green-600'}>
                    {validation.savingsRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cash Flow:</span>
                  <span className={actualCashFlow < 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                    {formatCurrency(actualCashFlow)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {validation.isValid ? (
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2 text-red-600" />
                  )}
                  Budget Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validation.isValid ? (
                  <div className="text-green-600">✅ Budget is valid!</div>
                ) : (
                  <div className="space-y-2">
                    {validation.violations.map((violation, index) => (
                      <div key={index} className="text-red-600 text-sm">
                        ❌ {violation}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Success Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Success Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {state.consecutiveSuccesses}/3
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {getConsecutiveSuccessMessage()}
                  </div>
                  <Progress value={(state.consecutiveSuccesses / 3) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Budget Categories */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>
                  Adjust your spending across categories. Fixed costs are harder to change!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.categories.map((category) => (
                    <div key={category.id} className={`p-4 rounded-lg border ${getPriorityColor(category.priority)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span className={category.type === 'fixed' ? 'text-red-600' : 'text-blue-600'}>
                              {category.type === 'fixed' ? '🔒 Fixed' : '📊 Variable'}
                            </span>
                            <span>•</span>
                            <span>{getPriorityLabel(category.priority)}</span>
                          </div>
                        </div>
                        {category.spent > 0 && (
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Spent</div>
                            <div className="text-sm font-bold text-red-600">
                              -{formatCurrency(category.spent)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={Math.min(state.monthlyIncome, category.allocated * 2)}
                          value={budgetValues[category.id] || category.allocated}
                          onChange={(e) => handleBudgetChange(category.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          disabled={category.type === 'fixed'}
                        />

                        <div className="flex justify-between items-center">
                          <input
                            type="number"
                            value={budgetValues[category.id] || category.allocated}
                            onChange={(e) => handleBudgetChange(category.id, parseInt(e.target.value) || 0)}
                            className="w-24 px-2 py-1 text-sm border rounded"
                            disabled={category.type === 'fixed'}
                            min="0"
                            max={state.monthlyIncome}
                          />
                          <span className="text-lg font-bold">
                            {formatCurrency(budgetValues[category.id] || category.allocated)}
                          </span>
                        </div>

                        {category.allocated > 0 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Used</span>
                              <span>{((category.spent / category.allocated) * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={(category.spent / category.allocated) * 100} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button
                    onClick={handleSubmitBudget}
                    disabled={!validation.isValid || state.currentRound > state.totalRounds}
                    size="lg"
                    className="px-8"
                  >
                    {state.currentRound <= state.totalRounds ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Submit Budget for Round {state.currentRound}
                      </>
                    ) : (
                      'Game Complete!'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Complete */}
        {state.currentRound > state.totalRounds && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Budget Battle Complete!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{state.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{state.consecutiveSuccesses}</div>
                  <div className="text-sm text-gray-600">Max Streak</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{state.mistakes}</div>
                  <div className="text-sm text-gray-600">Mistakes</div>
                </div>
              </div>
              {state.consecutiveSuccesses >= 3 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-800 font-bold">🎉 Mastery Achieved!</div>
                  <div className="text-green-700 text-sm">
                    You've demonstrated sustained financial discipline and budgeting skills!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}