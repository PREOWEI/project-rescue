'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  LEVELS,
  STORAGE_KEY_GAME_STATE,
  STORAGE_KEY_SHOW_TIMER,
  calculateProgress,
  createAttemptLevel,
  createInitialAnswers,
  getAttemptCountKey,
  getLevelById,
  getLastScoreKey,
  getLastPlayedKey,
  getEstimatedSeconds,
  getSelectedLevelId,
  shouldShowClassification,
  shouldShowPriority,
  shouldShowSelection,
  UserAnswer,
  Classification,
  Priority,
  Statement,
} from '@/lib/gameData';
import ProgressBar from './ProgressBar';
import ScenarioHeader from './ScenarioHeader';
import StatementCard from './StatementCard';
import SubmitSection from './SubmitSection';

function shuffleStatements(items: Statement[]): Statement[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GameScreenClient() {
  const router = useRouter();
  const [level, setLevel] = useState(LEVELS[0]);
  const [statements, setStatements] = useState<Statement[]>(LEVELS[0].statements);
  const [answers, setAnswers] = useState<UserAnswer[]>(() => createInitialAnswers(LEVELS[0]));
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getEstimatedSeconds(LEVELS[0].statements.length));
  const [showTimer, setShowTimer] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [hasLoadedGameState, setHasLoadedGameState] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const selectedLevel = getLevelById(getSelectedLevelId());
    setShowTimer(localStorage.getItem(STORAGE_KEY_SHOW_TIMER) !== '0');
    const previousScoreRaw = localStorage.getItem(getLastScoreKey(selectedLevel.id));
    const previousScore = previousScoreRaw !== null ? parseInt(previousScoreRaw, 10) : null;
    const attemptLevel = createAttemptLevel(selectedLevel, previousScore);
    let attemptStatements = shuffleStatements(attemptLevel.statements);
    setLevel(attemptLevel);
    setAnswers(createInitialAnswers(attemptLevel));
    setTimeLeft(getEstimatedSeconds(attemptLevel.statements.length));

    const saved = localStorage.getItem(STORAGE_KEY_GAME_STATE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.levelId === selectedLevel.id && !parsed.submitted && parsed.answers) {
          setAnswers(parsed.answers);
          if (Array.isArray(parsed.statementOrder)) {
            const order = parsed.statementOrder as string[];
            attemptStatements = order
              .map((id) => attemptLevel.statements.find((statement) => statement.id === id))
              .filter((statement): statement is Statement => Boolean(statement));
          }
          if (typeof parsed.timeLeft === 'number') {
            setTimeLeft(Math.max(0, parsed.timeLeft));
          }
        }
      } catch {
        // ignore corrupt state
      }
    }
    setStatements(attemptStatements);
    setHasLoadedGameState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedGameState || isSubmitting || timeLeft <= 0) return;
    const timerId = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [hasLoadedGameState, isSubmitting, timeLeft]);

  // Save state on every answer change
  useEffect(() => {
    if (!hasLoadedGameState) return;
    const state = {
      levelId: level.id,
      answers,
      submitted: false,
      statementOrder: statements.map((statement) => statement.id),
      timeLeft,
    };
    localStorage.setItem(STORAGE_KEY_GAME_STATE, JSON.stringify(state));
    setProgress(calculateProgress(level, answers));
  }, [answers, level, statements, timeLeft, hasLoadedGameState]);

  const handleToggleSelect = useCallback((statementId: string, selected: boolean) => {
    if (!shouldShowSelection(level)) return;
    setAnswers((prev) =>
      prev.map((a) =>
        a.statementId === statementId
          ? { ...a, selected, classification: selected ? a.classification : undefined, priority: selected ? a.priority : undefined }
          : a
      )
    );
  }, [level]);

  const handleClassify = useCallback((statementId: string, classification: Classification) => {
    setAnswers((prev) =>
      prev.map((a) => (a.statementId === statementId ? { ...a, classification } : a))
    );
  }, []);

  const handlePriority = useCallback((statementId: string, priority: Priority) => {
    setAnswers((prev) =>
      prev.map((a) => (a.statementId === statementId ? { ...a, priority } : a))
    );
  }, []);

  const selectedCount = answers.filter((a) => a.selected).length;
  const requiredAnswers = answers.filter((answer) => {
    const needsClassification = shouldShowClassification(level, answer);
    const needsPriority = shouldShowPriority(level, answer);
    return needsClassification || needsPriority;
  });
  const completedRequiredCount = requiredAnswers.filter((answer) => {
    const hasClassification = !shouldShowClassification(level, answer) || Boolean(answer.classification);
    const hasPriority = !shouldShowPriority(level, answer) || Boolean(answer.priority);
    return hasClassification && hasPriority;
  }).length;
  const allSelectedClassified = requiredAnswers.every((answer) => {
    const hasClassification = !shouldShowClassification(level, answer) || Boolean(answer.classification);
    const hasPriority = !shouldShowPriority(level, answer) || Boolean(answer.priority);
    return hasClassification && hasPriority;
  });
  const canSubmit = level.mode === 'identify-only'
    ? true
    : selectedCount > 0 && allSelectedClassified;
  const formattedTime = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  const handleSubmit = () => {
    if (!canSubmit) {
      setSubmitAttempted(true);
      return;
    }
    setIsSubmitting(true);
    const attemptCountRaw = localStorage.getItem(getAttemptCountKey(level.id));
    const attemptCount = attemptCountRaw !== null ? parseInt(attemptCountRaw, 10) : 0;
    localStorage.setItem(getAttemptCountKey(level.id), String(attemptCount + 1));
    localStorage.setItem(getLastPlayedKey(level.id), new Date().toISOString());

    const state = {
      levelId: level.id,
      answers,
      submitted: true,
      statementOrder: statements.map((statement) => statement.id),
      timeLeft,
    };
    localStorage.setItem(STORAGE_KEY_GAME_STATE, JSON.stringify(state));
    setTimeout(() => {
      router.push('/result-screen');
    }, 600);
  };

  const handleLeaveTask = () => {
    const state = {
      levelId: level.id,
      answers,
      submitted: false,
      statementOrder: statements.map((statement) => statement.id),
      timeLeft,
    };
    localStorage.setItem(STORAGE_KEY_GAME_STATE, JSON.stringify(state));
    router.push('/');
  };

  if (!hasLoadedGameState) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="h-5 w-56 rounded bg-slate-200 animate-pulse mb-3" />
            <div className="h-2.5 w-full rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
          <div className="h-72 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
          <div className="h-24 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse" />
          <div className="h-24 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse" />
          <div className="h-24 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top sticky bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="mr-1 flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 active:scale-95 transition-all duration-150"
                aria-label="Leave task"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-base font-700 text-slate-900" style={{ fontWeight: 700 }}>
                Project <span className="text-indigo-600">Rescue</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                Level {level.number}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {level.mode === 'identify-only'
                ? `${selectedCount} selected`
                : `${completedRequiredCount} of ${requiredAnswers.length} ready`}
            </span>
          </div>
          {showTimer && (
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold tabular-nums ${timeLeft === 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                {timeLeft === 0 ? "Time's up" : `Timer: ${formattedTime}`}
              </span>
              {timeLeft === 0 && (
                <span className="text-xs text-amber-600 font-medium">
                  Finish your current answer and submit.
                </span>
              )}
            </div>
          )}
          <ProgressBar progress={progress} />
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {shouldShowSelection(level) && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                  Select
                </span>
              )}
              {level.statements.some((stmt) => shouldShowClassification(level, answers.find((a) => a.statementId === stmt.id))) && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Classify
                </span>
              )}
              {level.statements.some((stmt) => shouldShowPriority(level, answers.find((a) => a.statementId === stmt.id))) && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Prioritise
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {selectedCount} selected
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <ScenarioHeader level={level} />

        <div className="space-y-4 mt-6">
          {statements.map((stmt, i) => {
            const answer = answers.find((a) => a.statementId === stmt.id)!;
            const showIncompleteWarning =
              submitAttempted && answer.selected && (!answer.classification || !answer.priority);
            return (
              <StatementCard
                key={stmt.id}
                index={i}
                level={level}
                statement={stmt}
                answer={answer}
                showIncompleteWarning={
                  submitAttempted &&
                  ((shouldShowClassification(level, answer) && !answer.classification) ||
                    (shouldShowPriority(level, answer) && !answer.priority))
                }
                onToggleSelect={handleToggleSelect}
                onClassify={handleClassify}
                onPriority={handlePriority}
              />
            );
          })}
        </div>

        <SubmitSection
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          submitAttempted={submitAttempted}
          selectedCount={selectedCount}
          allSelectedClassified={allSelectedClassified}
          mode={level.mode}
          onSubmit={handleSubmit}
        />
      </div>

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
            <h2 className="text-base font-700 text-slate-900 mb-2" style={{ fontWeight: 700 }}>
              Leave this task?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Your current answers and remaining timer will be saved. You can continue this level later.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 font-semibold text-sm transition-all duration-150"
              >
                Stay
              </button>
              <button
                onClick={handleLeaveTask}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-sm shadow-indigo-200 transition-all duration-150"
              >
                Leave Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
