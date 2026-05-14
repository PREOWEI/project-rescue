'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Home } from 'lucide-react';
import { STORAGE_KEY_GAME_STATE } from '@/lib/gameData';

interface ResultActionsProps {
  passed: boolean;
}

export default function ResultActions({ passed }: ResultActionsProps) {
  const router = useRouter();

  const handleRetry = () => {
    localStorage.removeItem(STORAGE_KEY_GAME_STATE);
    router.push('/game-screen');
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {passed
              ? 'Great work! Want to sharpen your skills further?' :'Use the feedback above and try again.'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {passed
              ? 'Your first normal pass counts for XP. Retries can improve Best Score, but do not increase XP after answers are reviewed.' :'Reveal answers only if you want Assisted Mode for learning.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleHome}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 font-semibold text-sm transition-all duration-150"
          >
            <Home size={15} />
            Home
          </button>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-sm shadow-indigo-200 transition-all duration-150"
          >
            <RotateCcw size={15} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
