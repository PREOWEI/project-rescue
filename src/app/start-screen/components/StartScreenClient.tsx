'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CheckSquare,
  Tag,
  BarChart2,
  Trophy,
  ArrowRight,
  Layers,
  Star,
  Clock,
  Home,
} from 'lucide-react';
import RevealAnswersModal from '@/components/RevealAnswersModal';
import {
  LEVELS,
  STORAGE_KEY_GAME_STATE,
  getAssistedUnlockKey,
  getBestScoreKey,
  getEstimatedMinutes,
  getLevelById,
  getRevealRequestKey,
  getSelectedLevelId,
} from '@/lib/gameData';

const steps = [
  {
    icon: CheckSquare,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'Step 1 — Identify Requirements',
    description:
      'Read each stakeholder statement and check the ones you believe are valid, actionable software requirements.',
  },
  {
    icon: Tag,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Step 2 — Classify Each One',
    description:
      'For every requirement you select, classify it as Functional (what the system does) or Non-Functional (how well it does it).',
  },
  {
    icon: BarChart2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Step 3 — Assign Priority',
    description:
      'Assign a priority level — High, Medium, or Low — based on business impact and technical risk.',
  },
];

export default function StartScreenClient() {
  const router = useRouter();
  const [level, setLevel] = useState(LEVELS[0]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);

  useEffect(() => {
    const selectedLevel = getLevelById(getSelectedLevelId());
    setLevel(selectedLevel);

    const stored = localStorage.getItem(getBestScoreKey(selectedLevel.id));
    if (stored !== null) {
      setBestScore(parseInt(stored, 10));
    } else {
      setBestScore(null);
    }
    const gameState = localStorage.getItem(STORAGE_KEY_GAME_STATE);
    if (gameState) {
      try {
        const parsed = JSON.parse(gameState);
        if (parsed?.levelId === selectedLevel?.id && !parsed?.submitted && parsed?.answers?.length > 0) {
          setHasSavedProgress(true);
        }
      } catch {
        // ignore
      }
    }
    setHasLoadedProgress(true);
  }, []);

  const handleStart = () => {
    // Clear any previous game state to start fresh
    localStorage.removeItem(STORAGE_KEY_GAME_STATE);
    router?.push('/game-screen');
  };

  const handleResume = () => {
    router?.push('/game-screen');
  };

  const handleRevealAnswers = () => {
    localStorage.setItem(getAssistedUnlockKey(level.id), '1');
    localStorage.setItem(getRevealRequestKey(level.id), '1');
    router?.push('/result-screen');
  };

  if (!hasLoadedProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          <div className="h-10 w-72 mx-auto rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-64 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="h-36 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse" />
            <div className="h-36 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse" />
            <div className="h-36 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col items-center justify-center px-4 py-12 relative">
      <a
        href="/"
        className="absolute left-4 top-4 sm:left-8 sm:top-6 z-30 flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 font-semibold bg-white/80 border border-slate-200 px-3 py-2 rounded-xl shadow-sm transition-colors duration-150"
      >
        <Home size={14} />
        Back to Dashboard
      </a>
      {/* Header Badge */}
      <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-600 px-3 py-1.5 rounded-full mb-6 fade-in">
        <Layers size={14} />
        <span className="font-semibold tracking-wide uppercase text-xs">Requirements Engineering Training</span>
      </div>
      {/* Hero */}
      <div className="text-center mb-10 fade-in">
        <h1 className="text-5xl font-800 text-slate-900 tracking-tight mb-3" style={{ fontWeight: 800 }}>
          Project <span className="text-indigo-600">Rescue</span>
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">
          Train your requirements engineering skills by analysing real project scenarios. Can you separate the signal from the noise?
        </p>
      </div>
      {/* Best Score Badge */}
      {bestScore !== null && (
        <div className="flex items-center gap-2 bg-white border border-amber-200 text-amber-700 px-4 py-2 rounded-xl shadow-sm mb-8 fade-in">
          <Trophy size={16} className="text-amber-500" />
          <span className="text-sm font-semibold">Your best score: {bestScore}%</span>
          {bestScore >= 70 && (
            <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Project Saved ✓</span>
          )}
        </div>
      )}
      {/* Scenario Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-md p-6 mb-8 slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
            <BookOpen size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                {level?.industry}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400 font-medium">{level?.clientName}</span>
            </div>
            <h2 className="text-lg font-700 text-slate-900 mb-2" style={{ fontWeight: 700 }}>
              {level?.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{level?.scenarioDescription}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            ~{getEstimatedMinutes(level.statements.length)} minutes
          </span>
          <span className="flex items-center gap-1.5">
            <CheckSquare size={13} />
            {level?.statements.length} statements to analyse
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={13} />
            Pass threshold: 70%
          </span>
        </div>
      </div>
      {/* How to Play */}
      <div className="w-full max-w-2xl mb-8 slide-up">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 text-center">
          How to Play
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {steps?.map((step, i) => (
            <div
              key={`step-${i + 1}`}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-9 h-9 rounded-lg ${step?.bg} flex items-center justify-center mb-3`}>
                <step.icon size={18} className={step?.color} />
              </div>
              <h4 className="text-xs font-700 text-slate-800 mb-1.5" style={{ fontWeight: 700 }}>
                {step?.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">{step?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 slide-up">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-150 text-base"
        >
          {bestScore !== null ? 'Retry' : 'Start'} Level {level.number}
          <ArrowRight size={18} />
        </button>
        {bestScore !== null && (
          <button
            onClick={() => setShowRevealConfirm(true)}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-700 font-semibold px-6 py-3.5 rounded-xl border border-amber-200 shadow-sm transition-all duration-150 text-base"
          >
            Reveal Correct Answers
          </button>
        )}
        {hasSavedProgress && (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-150 text-base"
          >
            Resume Session
          </button>
        )}
      </div>
      <p className="mt-8 text-xs text-slate-400 text-center">
        Progress is saved automatically in your browser. No account needed.
      </p>
      {showRevealConfirm && (
        <RevealAnswersModal
          onCancel={() => setShowRevealConfirm(false)}
          onConfirm={handleRevealAnswers}
        />
      )}
    </div>
  );
}
