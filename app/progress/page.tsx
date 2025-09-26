'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, Star, ArrowLeft } from 'lucide-react';
import { GAMES } from '@/lib/games';

export default function ProgressPage() {
  // Mock progress data - in real app this would come from store/API
  const mockProgress = {
    totalXP: 2450,
    level: 5,
    gamesPlayed: 3,
    achievementsUnlocked: 8,
    totalPlayTime: 125, // minutes
    streak: 3
  };

  const gameProgress = GAMES.map((game) => ({
    gameId: game.id,
    title: game.title,
    level: Math.floor(Math.random() * game.levels) + 1,
    maxLevel: game.levels,
    highScore: Math.floor(Math.random() * 100) + 50,
    mastered: Math.random() > 0.5,
    objectivesCompleted: Math.floor(Math.random() * game.objectives.length),
    totalObjectives: game.objectives.length,
    timesPlayed: Math.floor(Math.random() * 10) + 1
  }));

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] bg-clip-text text-transparent">
            Your Progress
          </h1>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-[#FBBF24] mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{mockProgress.totalXP}</p>
                  <p className="text-sm text-gray-400">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-[#00F5D4] mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">Level {mockProgress.level}</p>
                  <p className="text-sm text-gray-400">Current Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-[#7C3AED] mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{mockProgress.achievementsUnlocked}</p>
                  <p className="text-sm text-gray-400">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-[#FB7185] mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{mockProgress.totalPlayTime}m</p>
                  <p className="text-sm text-gray-400">Play Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Progress */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Game Progress</CardTitle>
            <CardDescription className="text-gray-400">
              Track your mastery across all finance games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {gameProgress.map((progress) => (
                <div key={progress.gameId} className="border-b border-gray-700 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{progress.title}</h3>
                    {progress.mastered && (
                      <span className="px-2 py-1 bg-[#00F5D4]/20 text-[#00F5D4] text-xs rounded-full border border-[#00F5D4]/50">
                        Mastered
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Level Progress</p>
                      <Progress value={(progress.level / progress.maxLevel) * 100} className="mb-1" />
                      <p className="text-xs text-gray-500">{progress.level}/{progress.maxLevel} levels</p>
                    </div>

                    <div>
                      <p className="text-gray-400 mb-1">Objectives</p>
                      <Progress value={(progress.objectivesCompleted / progress.totalObjectives) * 100} className="mb-1" />
                      <p className="text-xs text-gray-500">{progress.objectivesCompleted}/{progress.totalObjectives} completed</p>
                    </div>

                    <div>
                      <p className="text-gray-400 mb-1">High Score</p>
                      <p className="text-lg font-bold text-[#FBBF24]">{progress.highScore}</p>
                      <p className="text-xs text-gray-500">{progress.timesPlayed} plays</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Achievements</CardTitle>
            <CardDescription className="text-gray-400">
              Your latest accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'First Steps', description: 'Complete your first game', date: '2 days ago' },
                { name: 'NPV Master', description: 'Master NPV Builder game', date: '1 week ago' },
                { name: 'Budget Guru', description: 'Complete 5 budget scenarios', date: '1 week ago' },
                { name: 'Streak Hunter', description: 'Maintain 3-day play streak', date: '3 days ago' }
              ].map((achievement, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-800/50 rounded-lg">
                  <Trophy className="w-6 h-6 text-[#FBBF24] mr-3" />
                  <div>
                    <p className="font-semibold text-white">{achievement.name}</p>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}