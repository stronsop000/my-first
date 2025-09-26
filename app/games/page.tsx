'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target, Star } from 'lucide-react';
import { GAMES } from '@/lib/games';

export default function GamesCatalog() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] bg-clip-text text-transparent">
            Finance Arcade
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose your financial adventure. Master concepts through interactive gameplay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <Card
              key={game.id}
              className="bg-gray-900/50 border-gray-700 hover:border-[#00F5D4] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,212,0.3)]"
            >
              <CardHeader>
                <CardTitle className="text-white">{game.title}</CardTitle>
                <CardDescription className="text-gray-400">{game.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {game.estimatedTimeMin}m
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {game.levels} levels
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {game.objectives.length} objectives
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Learning Objectives:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {game.objectives.slice(0, 2).map((objective) => (
                      <li key={objective.id}>• {objective.text}</li>
                    ))}
                  </ul>
                </div>

                <Link href={`/games/${game.id}`}>
                  <Button className="w-full bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] hover:from-[#00F5D4]/80 hover:to-[#7C3AED]/80 text-black font-semibold">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}