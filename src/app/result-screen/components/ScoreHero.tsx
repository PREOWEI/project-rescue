'use client';

import React from 'react';
import { Trophy, XCircle, Star, TrendingUp, BookOpenCheck } from 'lucide-react';
import { PASS_THRESHOLD } from '@/lib/gameData';

interface ScoreHeroProps {
  percentage: number;
  correct: number;
  total: number;
  passed: boolean;
  isNewBest: boolean;
  assisted: boolean;
  scoreSuppressed?: boolean;
}

export default function ScoreHero({
  percentage,
  correct,
  total,
  passed,
  isNewBest,
  assisted,
  scoreSuppressed = false,
}: ScoreHeroProps) {
  const positive = passed || assisted;

  return (
    <div
      className={`rounded-2xl border shadow-md p-8 mb-6 text-center fade-in ${
        positive
          ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'
          : 'bg-gradient-to-br from-red-50 to-white border-red-200'
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          positive ? 'bg-emerald-100' : 'bg-red-100'
        }`}
      >
        {assisted ? (
          <BookOpenCheck size={32} className="text-emerald-600" />
        ) : passed ? (
          <Trophy size={32} className="text-emerald-600" />
        ) : (
          <XCircle size={32} className="text-red-500" />
        )}
      </div>

      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-700 mb-4 ${
          positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
        }`}
        style={{ fontWeight: 700 }}
      >
        {assisted ? 'Assisted Review' : passed ? 'Project Saved' : 'Project Failed'}
      </div>

      <div className="tabular-nums">
        <span
          className={`text-6xl font-800 ${positive ? 'text-emerald-600' : 'text-red-500'}`}
          style={{ fontWeight: 800 }}
        >
          {scoreSuppressed ? 'Review' : `${percentage}%`}
        </span>
      </div>
      <p className="text-sm text-slate-500 mt-1 font-medium">
        {scoreSuppressed ? 'No score is awarded in Assisted Mode' : `${correct} out of ${total} points correct`}
      </p>

      {isNewBest && !assisted && (
        <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          <Star size={13} />
          New personal best!
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
        <TrendingUp size={13} />
        <span>
          {assisted
            ? 'Answers revealed for learning. Scores, XP, and career progress are not updated.'
            : `Pass threshold: ${PASS_THRESHOLD}% - ${passed ? "You're above it." : 'You need a higher score.'}`}
        </span>
      </div>
    </div>
  );
}
