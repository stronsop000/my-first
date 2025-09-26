'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target, Trophy, BookOpen, TrendingUp } from 'lucide-react';
import { GAMES } from '@/lib/games';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5D4]/10 via-[#7C3AED]/10 to-[#FBBF24]/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00F5D4] via-[#7C3AED] to-[#FBBF24] bg-clip-text text-transparent">
              Finance Arcade
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master finance concepts through interactive mini-games. Experience compound growth, NPV analysis, and elasticity in a beautiful neon arcade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/games">
                <Button size="lg" className="bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] hover:from-[#00F5D4]/80 hover:to-[#7C3AED]/80 text-black font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Start Playing
                </Button>
              </Link>
              <Link href="/progress">
                <Button size="lg" variant="outline" className="border-[#00F5D4] text-[#00F5D4] hover:bg-[#00F5D4]/10">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Games */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {GAMES.map((game) => (
            <Card
              key={game.id}
              className="bg-gray-900/50 border-gray-700 hover:border-[#00F5D4] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] group"
            >
              <CardHeader>
                <CardTitle className="text-white group-hover:text-[#00F5D4] transition-colors">
                  {game.title}
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  {game.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {game.estimatedTimeMin}m
                  </span>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {game.levels} levels
                  </span>
                </div>
                <Link href={`/games/${game.id}`}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-[#7C3AED] to-[#FBBF24] hover:from-[#7C3AED]/80 hover:to-[#FBBF24]/80 text-white">
                    <Play className="w-3 h-3 mr-2" />
                    Play
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/games">
            <Card className="bg-gray-900/30 border-gray-700 hover:border-[#7C3AED] transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Play className="w-8 h-8 text-[#7C3AED] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-2">All Games</h3>
                <p className="text-sm text-gray-400">Browse our complete collection</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="bg-gray-900/30 border-gray-700 hover:border-[#FBBF24] transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-[#FBBF24] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-2">Track Progress</h3>
                <p className="text-sm text-gray-400">Monitor your learning journey</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/glossary">
            <Card className="bg-gray-900/30 border-gray-700 hover:border-[#FB7185] transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-[#FB7185] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-2">Glossary</h3>
                <p className="text-sm text-gray-400">Learn key finance terms</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-400 mb-2">
            🚀 Professional Finance Learning Platform
          </p>
          <p className="text-gray-500 text-sm">
            Built with Next.js 14, TypeScript, PWA capabilities, and comprehensive accessibility
          </p>
        </div>
      </div>
    </div>
  );
}
