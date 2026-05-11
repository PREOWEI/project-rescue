'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LEVELS,
  PASS_THRESHOLD,
  STORAGE_KEY_GAME_STATE,
  calculateScore,
  getAssistedUnlockKey,
  getBestScoreKey,
  getLastScoreKey,
  getLevelById,
  getRevealRequestKey,
  getXpScoreKey,
  UserAnswer,
  Level,
} from '@/lib/gameData';
import ScoreHero from './ScoreHero';
import AnswerBreakdown from './AnswerBreakdown';
import ResultActions from './ResultActions';
import RevealAnswersModal from '@/components/RevealAnswersModal';

export default function ResultScreenClient() {
  const router = useRouter();
  const [level, setLevel] = useState<Level>(LEVELS[0]);
  const [reviewStatements, setReviewStatements] = useState(LEVELS[0].statements);
  const [answers, setAnswers] = useState<UserAnswer[] | null>(null);
  const [scoreData, setScoreData] = useState<ReturnType<typeof calculateScore> | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [answersRevealed, setAnswersRevealed] = useState(false);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GAME_STATE);
    if (!saved) {
      router.push('/start-screen');
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      const resultLevel = getLevelById(parsed.levelId);
      if (!resultLevel) {
        router.push('/start-screen');
        return;
      }
      setLevel(resultLevel);
      if (Array.isArray(parsed.statementOrder)) {
        const orderedStatements = parsed.statementOrder
          .map((id: string) => resultLevel.statements.find((statement) => statement.id === id))
          .filter((statement: unknown): statement is Level['statements'][number] => Boolean(statement));
        setReviewStatements(orderedStatements.length > 0 ? orderedStatements : resultLevel.statements);
      } else {
        setReviewStatements(resultLevel.statements);
      }
      const loadedAnswers: UserAnswer[] = parsed.answers;
      setAnswers(loadedAnswers);
      const score = calculateScore(resultLevel, loadedAnswers);
      setScoreData(score);
      localStorage.setItem(getLastScoreKey(resultLevel.id), String(score.percentage));
      const permanentlyAssisted = localStorage.getItem(getAssistedUnlockKey(resultLevel.id)) === '1';

      if (localStorage.getItem(getRevealRequestKey(resultLevel.id)) === '1') {
        localStorage.removeItem(getRevealRequestKey(resultLevel.id));
        localStorage.setItem(getAssistedUnlockKey(resultLevel.id), '1');
        setAnswersRevealed(true);
      }

      const prevBest = localStorage.getItem(getBestScoreKey(resultLevel.id));
      const prevBestNum = prevBest !== null ? parseInt(prevBest, 10) : -1;
      if (!permanentlyAssisted && score.percentage > prevBestNum) {
        localStorage.setItem(getBestScoreKey(resultLevel.id), String(score.percentage));
        setIsNewBest(true);
      }

      const hasXpScore = localStorage.getItem(getXpScoreKey(resultLevel.id)) !== null;
      if (!permanentlyAssisted && score.percentage >= PASS_THRESHOLD && !hasXpScore) {
        localStorage.setItem(getXpScoreKey(resultLevel.id), String(score.percentage));
      }
    } catch {
      router.push('/start-screen');
    }
  }, [router]);

  if (!answers || !scoreData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-slate-200" />
          <div className="w-48 h-4 rounded bg-slate-200" />
          <div className="w-32 h-3 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  const passed = scoreData.percentage >= PASS_THRESHOLD;
  const showFullReview = passed || answersRevealed;

  const handleRevealAnswers = () => {
    localStorage.setItem(getAssistedUnlockKey(level.id), '1');
    setShowRevealConfirm(false);
    setAnswersRevealed(true);
  };

  const weakAreas = getWeakAreas(level, scoreData.breakdown);
  const skillSummary = getSkillSummary(weakAreas);
  const failureInsights = getFailureInsights(level, answers, scoreData.breakdown);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors duration-150"
          >
            ← Back to Home
          </button>
        </div>

        <ScoreHero
          percentage={scoreData.percentage}
          correct={scoreData.correct}
          total={scoreData.total}
          passed={passed}
          isNewBest={isNewBest}
          assisted={answersRevealed && !passed}
        />

        <SkillSummary summary={skillSummary} />

        {passed && <WhyThisMatters level={level} />}

        {showFullReview ? (
          <AnswerBreakdown
            statements={reviewStatements}
            level={level}
            answers={answers}
            breakdown={scoreData.breakdown}
          />
        ) : (
          <FailureFeedback
            weakAreas={weakAreas}
            insights={failureInsights}
            onRevealAnswers={() => setShowRevealConfirm(true)}
          />
        )}

        <ResultActions passed={passed} />
      </div>
      {showRevealConfirm && (
        <RevealAnswersModal
          onCancel={() => setShowRevealConfirm(false)}
          onConfirm={handleRevealAnswers}
        />
      )}
    </div>
  );
}

function WhyThisMatters({ level }: { level: Level }) {
  const modeMessage =
    level.mode === 'mixed'
      ? 'This level practises the full requirements workflow: deciding what is valid, classifying it, and judging priority.'
      : level.mode === 'identify-only'
      ? 'This level strengthens early discovery judgement: separating actionable requirements from vague opinions, preferences, and implementation suggestions.'
      : level.mode === 'classify-all'
      ? 'This level builds classification skill, which helps teams separate system behaviour from quality targets and constraints.'
      : 'This level practises release judgement: deciding which requirements matter most when time, risk, and value compete.';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 p-5 fade-in">
      <h2 className="text-base font-700 text-slate-900 mb-2" style={{ fontWeight: 700 }}>
        Why This Matters
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        {modeMessage} In real {level.industry.toLowerCase()} projects, these decisions reduce rework, prevent unclear handoffs, and help teams build the right thing first.
      </p>
    </div>
  );
}

function getSkillSummary(weakAreas: ReturnType<typeof getWeakAreas>) {
  const areas = [
    {
      key: 'selection',
      label: 'Requirement selection',
      total: weakAreas.selection,
      mistakes: weakAreas.selectionMistakes,
      note: 'Review how to separate valid requirements from vague opinions or implementation preferences.',
    },
    {
      key: 'classification',
      label: 'Classification',
      total: weakAreas.classification,
      mistakes: weakAreas.classificationMistakes,
      note: 'Review the difference between system behaviour and quality or constraint requirements.',
    },
    {
      key: 'priority',
      label: 'Prioritization',
      total: weakAreas.priority,
      mistakes: weakAreas.priorityMistakes,
      note: 'Review how business value, risk, compliance, and workflow impact affect priority.',
    },
  ].filter((area) => area.total > 0);

  const scored = areas.map((area) => ({
    ...area,
    accuracy: area.total > 0 ? (area.total - area.mistakes) / area.total : 0,
    correct: area.total - area.mistakes,
    percentage: area.total > 0 ? Math.round(((area.total - area.mistakes) / area.total) * 100) : 0,
  }));

  if (scored.length === 1) {
    const area = scored[0];
    const clean = area.percentage === 100;
    const passed = area.percentage >= PASS_THRESHOLD;

    return {
      strongest: clean ? `${area.label}: excellent` : passed ? `${area.label}: passing accuracy` : `${area.label}: needs practice`,
      strongestNote: clean
        ? `You got all ${area.total} ${area.label.toLowerCase()} item${area.total === 1 ? '' : 's'} correct.`
        : `You got ${area.correct} of ${area.total} ${area.label.toLowerCase()} item${area.total === 1 ? '' : 's'} correct (${area.percentage}%).`,
      review: clean ? 'Next project challenge' : area.label,
      reviewNote: clean
        ? 'Move to the next level to practise a different requirements skill.'
        : `${area.mistakes} ${area.mistakes === 1 ? 'mistake needs' : 'mistakes need'} review. ${area.note}`,
    };
  }

  const strongest = [...scored].sort((a, b) => b.accuracy - a.accuracy)[0];
  const weakest = [...scored].sort((a, b) => a.accuracy - b.accuracy)[0];

  return {
    strongest: strongest ? `${strongest.label}: ${strongest.percentage}%` : 'Requirement analysis',
    strongestNote: strongest
      ? `You got ${strongest.correct} of ${strongest.total} ${strongest.label.toLowerCase()} item${strongest.total === 1 ? '' : 's'} correct.`
      : 'You are building your overall requirements analysis skill.',
    review: weakest?.mistakes > 0 ? `${weakest.label}: ${weakest.percentage}%` : 'Keep practising with new project scenarios',
    reviewNote:
      weakest?.mistakes > 0
        ? `${weakest.mistakes} ${weakest.mistakes === 1 ? 'mistake needs' : 'mistakes need'} review. ${weakest.note}`
        : 'You passed this level cleanly. Replay or move to the next project to build consistency.',
  };
}

function SkillSummary({
  summary,
}: {
  summary: ReturnType<typeof getSkillSummary>;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 p-5 fade-in">
      <h2 className="text-base font-700 text-slate-900 mb-3" style={{ fontWeight: 700 }}>
        Skill Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">Strength</p>
          <p className="text-sm font-semibold text-slate-800">{summary.strongest}</p>
          <p className="text-xs text-slate-600 leading-relaxed mt-1">{summary.strongestNote}</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">Review Next</p>
          <p className="text-sm font-semibold text-slate-800">{summary.review}</p>
          <p className="text-xs text-slate-600 leading-relaxed mt-1">{summary.reviewNote}</p>
        </div>
      </div>
    </div>
  );
}

function getWeakAreas(level: Level, breakdown: ReturnType<typeof calculateScore>['breakdown']) {
  const totals = {
    selection: 0,
    selectionMistakes: 0,
    classification: 0,
    classificationMistakes: 0,
    priority: 0,
    priorityMistakes: 0,
  };

  for (const stmt of level.statements) {
    const bd = breakdown[stmt.id];
    if (!bd) continue;

    if (level.mode === 'mixed' || level.mode === 'identify-only') {
      totals.selection += 1;
      if (!bd.selectionCorrect) totals.selectionMistakes += 1;
    }
    if (level.mode === 'mixed' || level.mode === 'classify-all') {
      if (stmt.isRequirement || level.mode === 'classify-all') {
        totals.classification += 1;
        if (!bd.classificationCorrect) totals.classificationMistakes += 1;
      }
    }
    if (level.mode === 'mixed' || level.mode === 'prioritise-only') {
      if (stmt.isRequirement || level.mode === 'prioritise-only') {
        totals.priority += 1;
        if (!bd.priorityCorrect) totals.priorityMistakes += 1;
      }
    }
  }

  return totals;
}

function getFailureInsights(
  level: Level,
  answers: UserAnswer[],
  breakdown: ReturnType<typeof calculateScore>['breakdown']
) {
  const selectedInvalid = level.statements.filter((statement) => {
    const answer = answers.find((item) => item.statementId === statement.id);
    return !statement.isRequirement && answer?.selected;
  }).length;
  const missedValid = level.statements.filter((statement) => {
    const answer = answers.find((item) => item.statementId === statement.id);
    return statement.isRequirement && !answer?.selected;
  }).length;
  const classificationMistakes = level.statements.filter((statement) => {
    const bd = breakdown[statement.id];
    const answer = answers.find((item) => item.statementId === statement.id);
    const shouldEvaluate =
      level.mode === 'classify-all' || (level.mode === 'mixed' && statement.isRequirement && answer?.selected);
    return bd && shouldEvaluate && !bd.classificationCorrect;
  }).length;
  const priorityMistakes = level.statements.filter((statement) => {
    const bd = breakdown[statement.id];
    const answer = answers.find((item) => item.statementId === statement.id);
    const shouldEvaluate =
      level.mode === 'prioritise-only' || (level.mode === 'mixed' && statement.isRequirement && answer?.selected);
    return bd && shouldEvaluate && !bd.priorityCorrect;
  }).length;

  const insights: string[] = [];

  if (selectedInvalid > 0) {
    insights.push('You may have selected too many vague opinions, preferences, or implementation suggestions.');
  }
  if (missedValid > 0) {
    insights.push('One or more valid requirements may have been missed. Look for statements that are specific, actionable, and testable.');
  }
  if (classificationMistakes > 0) {
    insights.push('Classification needs review. Ask whether the statement describes system behaviour or a quality/constraint target.');
  }
  if (priorityMistakes > 0) {
    insights.push('Priority assignment needs improvement. Focus on business value, risk, compliance, safety, and core workflow impact.');
  }
  if (insights.length === 0) {
    insights.push('You were close. Review the weakest skill area below and retry before revealing the full answers.');
  }

  return insights.slice(0, 3);
}

function FailureFeedback({
  weakAreas,
  insights,
  onRevealAnswers,
}: {
  weakAreas: ReturnType<typeof getWeakAreas>;
  insights: string[];
  onRevealAnswers: () => void;
}) {
  const rows = [
    {
      label: 'Requirement selection',
      total: weakAreas.selection,
      mistakes: weakAreas.selectionMistakes,
      hint: 'Check whether each statement is specific, actionable, and testable.',
    },
    {
      label: 'Classification',
      total: weakAreas.classification,
      mistakes: weakAreas.classificationMistakes,
      hint: 'Functional describes what the system does. Non-functional describes quality or constraints.',
    },
    {
      label: 'Prioritization',
      total: weakAreas.priority,
      mistakes: weakAreas.priorityMistakes,
      hint: 'High priority usually protects core workflows, safety, compliance, or major user impact.',
    },
  ].filter((row) => row.total > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 p-5 fade-in">
      <h2 className="text-base font-700 text-slate-900 mb-1" style={{ fontWeight: 700 }}>
        Learning Feedback
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Full answers are hidden after failed attempts. Use the feedback below, or reveal answers in Assisted Mode.
      </p>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          What to check before retrying
        </p>
        <div className="space-y-2">
          {insights.map((insight) => (
            <p key={insight} className="text-sm font-semibold text-slate-800 leading-relaxed">
              {insight}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="text-sm font-semibold text-slate-800">{row.label}</p>
              <span className="text-xs font-semibold text-slate-500">
                {row.mistakes} mistake{row.mistakes === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{row.hint}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onRevealAnswers}
        className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95 font-semibold text-sm transition-all duration-150"
      >
        Reveal Correct Answers
      </button>
      <p className="text-xs text-slate-400 mt-2">
        Assisted Mode unlocks learning progress, but does not award XP or update career progress.
      </p>
    </div>
  );
}
