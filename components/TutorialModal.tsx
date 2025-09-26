'use client';

import React from 'react';
import { GameDefinition } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Lightbulb,
  Target,
  Gamepad2
} from 'lucide-react';

interface TutorialModalProps {
  game: GameDefinition;
}

export function TutorialModal({ game }: TutorialModalProps) {
  const {
    showTutorial,
    tutorialStep,
    setShowTutorial,
    nextTutorialStep,
    prevTutorialStep,
    setTutorialStep
  } = useAppStore();

  if (!showTutorial) return null;

  const currentStep = tutorialStep;
  const totalSteps = game.tutorialSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleClose = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      nextTutorialStep();
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      prevTutorialStep();
    }
  };

  const getControlsText = () => {
    const controls = [];
    if (game.controls.mouse) controls.push('Mouse');
    if (game.controls.touch) controls.push('Touch');
    if (game.controls.keyboard) controls.push('Keyboard');
    return controls.join(', ');
  };

  return (
    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            {game.title} Tutorial
          </DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {totalSteps} - Learn how to play
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tutorial Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Tutorial Content */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-lg text-blue-900 leading-relaxed">
              {game.tutorialSteps[currentStep]}
            </div>
          </div>

          {/* Game Information - Show on first step */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Target className="w-4 h-4 mr-2 text-green-600" />
                  <h3 className="font-semibold">Learning Objectives</h3>
                </div>
                <ul className="text-sm space-y-1">
                  {game.objectives.map((objective, index) => (
                    <li key={objective.id} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>{objective.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Gamepad2 className="w-4 h-4 mr-2 text-purple-600" />
                  <h3 className="font-semibold">Game Details</h3>
                </div>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-600">Estimated Time:</span>{' '}
                    <span className="font-medium">{game.estimatedTimeMin} minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Levels:</span>{' '}
                    <span className="font-medium">{game.levels}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Controls:</span>{' '}
                    <span className="font-medium">{getControlsText()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2">
            {game.tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setTutorialStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button onClick={handleClose} variant="ghost">
                <X className="w-4 h-4 mr-1" />
                Skip Tutorial
              </Button>
            </div>

            <Button onClick={handleNext}>
              {currentStep < totalSteps - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Start Playing!
                  <Gamepad2 className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}