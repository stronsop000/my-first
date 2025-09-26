'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target } from 'lucide-react';

export default function Home() {
  const games = [
    {
      id: 'npv-builder',
      title: 'NPV Builder',
      description: 'Learn time value of money through interactive NPV calculations',
      duration: 8,
      levels: 3
    },
    {
      id: 'budget-battle',
      title: 'Budget Battle',
      description: 'Master budgeting skills with realistic constraints and events',
      duration: 10,
      levels: 5
    },
    {
      id: 'elasticity-explorer',
      title: 'Elasticity Explorer',
      description: 'Explore price elasticity through interactive demand curves',
      duration: 12,
      levels: 3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Finance <span className="text-blue-600">Arcade</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master finance concepts through interactive mini-games. Learn NPV, budgeting, and elasticity in a fun, engaging way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {game.duration}m
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {game.levels} levels
                  </span>
                </div>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            🚀 Professional Finance Learning Platform - Built with Next.js 14 & TypeScript
          </p>
          <p className="text-gray-400 mt-2">
            Complete with PWA capabilities, accessibility features, and comprehensive game engine
          </p>
        </div>
      </div>
    </div>
  );
}
