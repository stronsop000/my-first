'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameHost } from '@/components/GameHost';
import { getGameById } from '@/lib/games';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const game = getGameById(gameId);

  const handleBack = () => {
    router.push('/games');
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-gray-400">The requested game could not be found.</p>
        </div>
      </div>
    );
  }

  return <GameHost game={game} onBack={handleBack} />;
}