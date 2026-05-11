'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Gauge,
  Lightbulb,
  ListChecks,
  Lock,
  MousePointerClick,
  RotateCcw,
  Ruler,
  Settings,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import {
  LEVELS,
  STORAGE_KEY_GAME_STATE,
  STORAGE_KEY_SELECTED_LEVEL,
  STORAGE_KEY_SHOW_TIMER,
  STORAGE_KEY_THEME,
  getAssistedUnlockKey,
  getAttemptCountKey,
  getBestScoreKey,
  getEstimatedMinutes,
  getLastPlayedKey,
  getXpScoreKey,
} from '@/lib/gameData';

const careerRoles = [
  { title: 'Trainee Requirements Analyst', xp: 0 },
  { title: 'Junior Requirements Analyst', xp: 100 },
  { title: 'Requirements Analyst', xp: 250 },
  { title: 'Requirements Engineer', xp: 450 },
  { title: 'Product Requirements Specialist', xp: 700 },
  { title: 'Senior Requirements Engineer', xp: 1000 },
  { title: 'Lead Requirements Engineer', xp: 1400 },
  { title: 'Principal Requirements Engineer', xp: 1900 },
  { title: 'Requirements Architect', xp: 2500 },
  { title: 'Head of Requirements Strategy', xp: 3000 },
];

const xpRewards = [
  { label: '70-79%', xp: 50 },
  { label: '80-89%', xp: 75 },
  { label: '90-99%', xp: 100 },
  { label: '100%', xp: 125 },
  { label: 'Failed or Assisted', xp: 0 },
];

type TipKind =
  | 'xp'
  | 'requirement'
  | 'quality'
  | 'functional'
  | 'selection'
  | 'priority'
  | 'assisted'
  | 'replay'
  | 'security'
  | 'measurable'
  | 'stakeholder'
  | 'checklist';

type Tip = {
  title: string;
  body: string;
  kind: TipKind;
};

const allTips: Tip[] = [
  {
    title: 'Earn XP through mastery',
    body: 'XP is awarded from your first normal pass on each project level. Later retries can improve Best Score.',
    kind: 'xp',
  },
  {
    title: 'Look for testable requirements',
    body: 'A valid requirement should be clear enough that a team could build or test it.',
    kind: 'checklist',
  },
  {
    title: 'Spot quality targets',
    body: 'Non-functional requirements usually describe speed, security, usability, or reliability.',
    kind: 'quality',
  },
  {
    title: 'Check what the system does',
    body: 'Functional requirements describe actions the system should perform for users or other systems.',
    kind: 'functional',
  },
  {
    title: 'Do not select everything',
    body: 'Selecting every statement is risky because invalid requirements reduce your score.',
    kind: 'selection',
  },
  {
    title: 'Prioritise impact',
    body: 'High priority usually means strong business value, legal risk, safety risk, or serious technical impact.',
    kind: 'priority',
  },
  {
    title: 'Use assisted mode carefully',
    body: 'Assisted completion helps learning progress, but it does not award XP or role progress.',
    kind: 'assisted',
  },
  {
    title: 'Replay to improve',
    body: 'Replay levels to improve your best score and strengthen weak skill areas.',
    kind: 'replay',
  },
  {
    title: 'Security often means quality',
    body: 'Security and compliance statements are often non-functional requirements.',
    kind: 'security',
  },
  {
    title: 'Avoid vague opinions',
    body: 'Vague wishes can be useful stakeholder input, but they are not always valid software requirements yet.',
    kind: 'requirement',
  },
  {
    title: 'Measure the statement',
    body: 'A measurable statement is usually stronger than a general opinion.',
    kind: 'measurable',
  },
  {
    title: 'Separate preference from need',
    body: 'If a statement is only about developer preference, it may not be a user or business requirement.',
    kind: 'selection',
  },
  {
    title: 'Ask who benefits',
    body: 'In real projects, every strong requirement should connect to a user, stakeholder, or business goal.',
    kind: 'stakeholder',
  },
  {
    title: 'Rewrite vague words',
    body: 'Words like fast, modern, easy, or reliable need measurable detail before they become useful requirements.',
    kind: 'measurable',
  },
  {
    title: 'Find the acceptance test',
    body: 'If you cannot imagine how to check whether a requirement is done, it probably needs more detail.',
    kind: 'checklist',
  },
  {
    title: 'Watch for hidden constraints',
    body: 'Compliance, privacy, budget, deadlines, and platform limits can change what the final requirement should say.',
    kind: 'security',
  },
  {
    title: 'Classify before prioritising',
    body: 'Understanding the type of requirement first makes it easier to judge its urgency and impact.',
    kind: 'priority',
  },
  {
    title: 'Do not confuse solution with requirement',
    body: 'A stakeholder may suggest a technology, but the real requirement is usually the outcome they want.',
    kind: 'selection',
  },
  {
    title: 'Look for user actions',
    body: 'Login, book, send, view, update, and search are common clues for functional requirements.',
    kind: 'functional',
  },
  {
    title: 'Look for quality promises',
    body: 'Timing, uptime, encryption, accessibility, and response limits usually point to non-functional requirements.',
    kind: 'quality',
  },
  {
    title: 'Treat missed valid items seriously',
    body: 'In the game and in real projects, missing an important requirement can be just as costly as choosing a bad one.',
    kind: 'selection',
  },
  {
    title: 'Use feedback as a checklist',
    body: 'After each result screen, focus your replay on the weakest area: selection, classification, or priority.',
    kind: 'replay',
  },
  {
    title: 'Priority is not personal preference',
    body: 'A high-priority requirement should be justified by value, risk, urgency, or dependency.',
    kind: 'priority',
  },
  {
    title: 'Security needs evidence',
    body: 'Security requirements are stronger when they name what must be protected and under what conditions.',
    kind: 'security',
  },
  {
    title: 'Small details change meaning',
    body: 'Within 5 minutes, using hospital ID, and on standard broadband are details that make requirements clearer.',
    kind: 'measurable',
  },
  {
    title: 'Assisted mode is for learning',
    body: 'Use reveal answers when stuck, then retry normally if you want XP and role progress.',
    kind: 'assisted',
  },
  {
    title: 'Compare similar statements',
    body: 'When unsure, compare statements against each other and ask which ones are clearer, testable, and actionable.',
    kind: 'checklist',
  },
  {
    title: 'Avoid gold-plating',
    body: 'Not every nice idea should become a requirement; good requirements protect the project from unnecessary scope.',
    kind: 'priority',
  },
  {
    title: 'Stakeholders need translation',
    body: 'Real stakeholders often speak in goals, worries, and opinions. Your job is to turn the useful parts into requirements.',
    kind: 'stakeholder',
  },
  {
    title: 'Replay is not just repetition',
    body: 'Because levels can vary, replaying helps you practise the skill instead of only memorising one answer set.',
    kind: 'replay',
  },
];

const leaderboardNames = [
  'Amira',
  'Daniel',
  'Sofia',
  'Marcus',
  'Priya',
  'Noah',
  'Lena',
  'Ethan',
  'Zara',
  'Owen',
  'Maya',
  'Leo',
];

type LeaderboardEntry = {
  name: string;
  xp: number;
  isPlayer?: boolean;
};

function shuffleItems<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getTipIcon(kind: TipKind) {
  const className = 'text-indigo-600 shrink-0 mt-0.5';
  switch (kind) {
    case 'xp':
      return <Trophy size={20} className={className} />;
    case 'requirement':
      return <ClipboardCheck size={20} className={className} />;
    case 'quality':
      return <Gauge size={20} className={className} />;
    case 'functional':
      return <MousePointerClick size={20} className={className} />;
    case 'priority':
      return <Star size={20} className={className} />;
    case 'assisted':
      return <Lightbulb size={20} className={className} />;
    case 'replay':
      return <RotateCcw size={20} className={className} />;
    case 'security':
      return <ShieldCheck size={20} className={className} />;
    case 'measurable':
      return <Ruler size={20} className={className} />;
    case 'stakeholder':
      return <Users size={20} className={className} />;
    case 'checklist':
      return <ListChecks size={20} className={className} />;
    case 'selection':
    default:
      return <CheckCircle2 size={20} className={className} />;
  }
}

function getXpForScore(score: number | null): number {
  if (score === null) return 0;
  if (score === 100) return 125;
  if (score >= 90) return 100;
  if (score >= 80) return 75;
  if (score >= 70) return 50;
  return 0;
}

function getEarnedXp(score: number | undefined, assisted: boolean): number {
  if (assisted) return 0;
  return getXpForScore(score ?? null);
}

function getCareerProgress(xp: number) {
  let current = careerRoles[0];
  let next = careerRoles[careerRoles.length - 1];

  for (let i = 0; i < careerRoles.length; i += 1) {
    if (xp >= careerRoles[i].xp) {
      current = careerRoles[i];
      next = careerRoles[i + 1] ?? careerRoles[i];
    }
  }

  const span = Math.max(1, next.xp - current.xp);
  const progress = current === next ? 100 : Math.round(((xp - current.xp) / span) * 100);

  return { current, next, progress };
}

function createLeaderboardPreview(playerXp: number): LeaderboardEntry[] {
  const shuffledNames = [...leaderboardNames].sort(() => Math.random() - 0.5).slice(0, 4);
  const sampleScores = shuffledNames.map((name, index) => ({
    name,
    xp: Math.max(0, 120 + Math.floor(Math.random() * 860) - index * 40),
  }));

  return [...sampleScores, { name: 'You', xp: playerXp, isPlayer: true }].sort((a, b) => b.xp - a.xp);
}

export default function HomeDashboard() {
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [xpScores, setXpScores] = useState<Record<string, number>>({});
  const [assistedUnlocks, setAssistedUnlocks] = useState<Record<string, boolean>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [lastPlayed, setLastPlayed] = useState<Record<string, string>>({});
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [savedLevelId, setSavedLevelId] = useState(LEVELS[0].id);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [tipDeck, setTipDeck] = useState<Tip[]>([]);
  const [visibleTips, setVisibleTips] = useState<Tip[]>([]);
  const [tipCursor, setTipCursor] = useState(0);
  const [tipsFading, setTipsFading] = useState(false);

  useEffect(() => {
    const scores: Record<string, number> = {};
    const xpScoreValues: Record<string, number> = {};
    const assisted: Record<string, boolean> = {};
    const attempts: Record<string, number> = {};
    const played: Record<string, string> = {};
    for (const level of LEVELS) {
      const storedScore = localStorage.getItem(getBestScoreKey(level.id));
      if (storedScore !== null) {
        scores[level.id] = parseInt(storedScore, 10);
      }
      const storedXpScore = localStorage.getItem(getXpScoreKey(level.id));
      if (storedXpScore !== null) {
        xpScoreValues[level.id] = parseInt(storedXpScore, 10);
      }
      assisted[level.id] = localStorage.getItem(getAssistedUnlockKey(level.id)) === '1';
      attempts[level.id] = parseInt(localStorage.getItem(getAttemptCountKey(level.id)) || '0', 10);
      const storedLastPlayed = localStorage.getItem(getLastPlayedKey(level.id));
      if (storedLastPlayed) {
        played[level.id] = storedLastPlayed;
      }
    }
    setBestScores(scores);
    setXpScores(xpScoreValues);
    setAssistedUnlocks(assisted);
    setAttemptCounts(attempts);
    setLastPlayed(played);
    setShowTimer(localStorage.getItem(STORAGE_KEY_SHOW_TIMER) !== '0');
    const storedTheme = localStorage.getItem(STORAGE_KEY_THEME) === 'dark' ? 'dark' : 'light';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');

    const savedGame = localStorage.getItem(STORAGE_KEY_GAME_STATE);
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        setHasSavedProgress(!parsed?.submitted && parsed?.answers?.length > 0);
        if (parsed?.levelId) {
          setSavedLevelId(parsed.levelId);
        }
      } catch {
        setHasSavedProgress(false);
      }
    }
    setHasLoadedProgress(true);
  }, []);

  const xp = useMemo(
    () =>
      LEVELS.reduce(
        (total, level) => {
          const scoreForXp = xpScores[level.id] ?? bestScores[level.id];
          return total + getEarnedXp(scoreForXp, assistedUnlocks[level.id] === true);
        },
        0
      ),
    [bestScores, xpScores, assistedUnlocks]
  );
  const career = useMemo(() => getCareerProgress(xp), [xp]);
  const projectsSaved = LEVELS.filter(
    (level) => (bestScores[level.id] ?? 0) >= 70 && assistedUnlocks[level.id] !== true
  ).length;
  const attemptedProjects = LEVELS.filter(
    (level) => (attemptCounts[level.id] ?? 0) > 0 || bestScores[level.id] !== undefined
  ).length;

  useEffect(() => {
    if (!hasLoadedProgress) return;
    setLeaderboard(createLeaderboardPreview(xp));
  }, [hasLoadedProgress, xp]);

  const rotateTips = () => {
    setTipsFading(true);
    window.setTimeout(() => {
      setTipDeck((currentDeck) => {
        let nextDeck = currentDeck.length > 0 ? currentDeck : shuffleItems(allTips);
        let nextCursor = tipCursor;

        if (nextCursor + 3 > nextDeck.length) {
          nextDeck = shuffleItems(allTips);
          nextCursor = 0;
        }

        setVisibleTips(nextDeck.slice(nextCursor, nextCursor + 3));
        setTipCursor(nextCursor + 3);
        return nextDeck;
      });
      setTipsFading(false);
    }, 180);
  };

  useEffect(() => {
    const deck = shuffleItems(allTips);
    setTipDeck(deck);
    setVisibleTips(deck.slice(0, 3));
    setTipCursor(3);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      rotateTips();
    }, 35000);

    return () => window.clearInterval(interval);
  });

  const selectLevel = (levelId: string) => {
    localStorage.setItem(STORAGE_KEY_SELECTED_LEVEL, levelId);
  };

  const toggleTimer = () => {
    const next = !showTimer;
    setShowTimer(next);
    localStorage.setItem(STORAGE_KEY_SHOW_TIMER, next ? '1' : '0');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const resetProgress = () => {
    const confirmed = window.confirm('Reset all saved progress, scores, assisted status, attempts, and unlocks?');
    if (!confirmed) return;

    Object.keys(localStorage)
      .filter((key) => key.startsWith('project_rescue_'))
      .forEach((key) => localStorage.removeItem(key));

    setBestScores({});
    setXpScores({});
    setAssistedUnlocks({});
    setAttemptCounts({});
    setLastPlayed({});
    setHasSavedProgress(false);
    setSavedLevelId(LEVELS[0].id);
    setShowTimer(true);
    setTheme('light');
    document.documentElement.classList.remove('dark');
  };

  const isLevelUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const previousLevel = LEVELS[index - 1];
    return (bestScores[previousLevel.id] ?? 0) >= 70 || assistedUnlocks[previousLevel.id] === true;
  };

  const unlockedLevels = LEVELS.filter((_, index) => isLevelUnlocked(index));
  const firstUnlockedUnplayed = unlockedLevels.find((level) => bestScores[level.id] === undefined);
  const latestUnlockedLevel = unlockedLevels[unlockedLevels.length - 1] ?? LEVELS[0];
  const primaryLevel = hasSavedProgress
    ? LEVELS.find((level) => level.id === savedLevelId) ?? LEVELS[0]
    : firstUnlockedUnplayed ?? latestUnlockedLevel;
  const primaryLabel = hasSavedProgress
    ? `Continue Level ${primaryLevel.number}`
    : firstUnlockedUnplayed
    ? `Play Level ${primaryLevel.number}`
    : `Retry Level ${primaryLevel.number}`;

  const formatLastPlayed = (isoDate?: string): string => {
    if (!isoDate) return 'Never';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Never';
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return 'Today';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (!hasLoadedProgress) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            Requirements Engineering Career
          </div>
          <div className="space-y-4">
            <div className="h-12 w-72 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-5 w-full max-w-xl rounded bg-slate-200 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 pt-6">
              <div className="h-40 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
              <div className="h-40 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <section className="mb-6 relative rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-7">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute right-5 top-5 inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50 active:scale-95 shadow-sm transition-all duration-150"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </button>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pr-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <BriefcaseBusiness size={14} />
                Requirements Engineering Career
              </div>
              <h1 className="text-4xl sm:text-5xl font-800 text-slate-900 tracking-tight" style={{ fontWeight: 800 }}>
                Project <span className="text-indigo-600">Rescue</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
                Build your requirements engineering skill by rescuing realistic software projects from unclear stakeholder input.
              </p>
            </div>

            <div className="flex items-center self-start lg:self-end">
              <a
                onClick={() => selectLevel(primaryLevel.id)}
                href="/start-screen"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-150"
              >
                {primaryLabel}
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Current Role
                </p>
                <h2 className="text-xl font-700 text-slate-900" style={{ fontWeight: 700 }}>
                  {career.current.title}
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-sm font-semibold self-start">
                <Trophy size={15} />
                {xp} XP
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Portfolio
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-800 text-slate-900 leading-none" style={{ fontWeight: 800 }}>
                  {attemptedProjects}
                </p>
                <p className="text-sm font-semibold text-slate-500 mt-1">attempted</p>
              </div>
              <div>
                <p className="text-3xl font-800 text-slate-900 leading-none" style={{ fontWeight: 800 }}>
                  {projectsSaved}
                </p>
                <p className="text-sm font-semibold text-slate-500 mt-1">saved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Next Rank
            </p>
            <h2 className="text-xl font-700 text-slate-900 mb-5" style={{ fontWeight: 700 }}>
              {career.next.title}
            </h2>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Progress
              </span>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                {career.progress}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-fill bg-gradient-to-r from-indigo-600 to-emerald-500"
                style={{ width: `${career.progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-5 mb-6 items-stretch">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 min-h-[210px]">
            <div className="mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  <span className="inline-flex items-center gap-2">
                    <Lightbulb size={15} className="text-indigo-600" />
                    Tips & Hints
                  </span>
                </p>
                <h2 className="text-base font-700 text-slate-900" style={{ fontWeight: 700 }}>
                  Requirements Coach
                </h2>
              </div>
            </div>

            <div className={`grid grid-cols-1 gap-3 transition-opacity duration-200 ${tipsFading ? 'opacity-0' : 'opacity-100'}`}>
              {visibleTips.map((tip) => (
                <div key={tip.title} className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  {getTipIcon(tip.kind)}
                  <div>
                    <p className="text-sm font-700 text-slate-900" style={{ fontWeight: 700 }}>
                      {tip.title}
                    </p>
                    <p className="text-sm font-semibold text-slate-600 mt-1 leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Leaderboard Review
                </p>
                <h2 className="text-base font-700 text-slate-900" style={{ fontWeight: 700 }}>
                  Class XP Ranking
                </h2>
              </div>

              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.name}-${index}`}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                      entry.isPlayer
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-white/70 border border-current/10 flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold truncate">{entry.name}</span>
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap flex items-center gap-1">
                      {index === 0 && <Trophy size={13} className="text-amber-500" />}
                      {entry.xp} XP
                    </span>
                  </div>
                ))}
              </div>

            </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Project Levels
            </h2>
            <span className="text-xs text-slate-400">More levels can be added to the same structure.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {LEVELS.map((level, index) => {
              const bestScore = bestScores[level.id];
              const attemptCount = Math.max(attemptCounts[level.id] ?? 0, bestScore !== undefined ? 1 : 0);
              const assisted = assistedUnlocks[level.id] === true;
              const passed = bestScore !== undefined && bestScore >= 70 && !assisted;
              const unlocked = isLevelUnlocked(index);
              const completionType = !unlocked
                ? 'Locked'
                : assisted
                ? 'Assisted'
                : passed
                ? 'Normal'
                : attemptCount > 0
                ? 'Failed'
                : 'Not started';
              const statusStyle =
                completionType === 'Normal'
                  ? 'bg-emerald-100 text-emerald-700'
                  : completionType === 'Assisted'
                  ? 'bg-amber-100 text-amber-700'
                  : completionType === 'Failed'
                  ? 'bg-red-100 text-red-600'
                  : completionType === 'Locked'
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-indigo-100 text-indigo-700';

              return (
                <a
                  key={level.id}
                  onClick={(event) => {
                    if (!unlocked) {
                      event.preventDefault();
                      return;
                    }
                    selectLevel(level.id);
                  }}
                  href={unlocked ? '/start-screen' : '#'}
                  aria-disabled={!unlocked}
                  className={`text-left bg-white rounded-2xl border shadow-sm transition-all duration-150 overflow-hidden ${
                    unlocked
                      ? 'border-indigo-200 hover:shadow-md hover:border-indigo-300'
                      : 'border-slate-200 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        unlocked ? 'bg-indigo-600' : 'bg-slate-100'
                      }`}>
                        {unlocked ? (
                          <BookOpen size={21} className="text-white" />
                        ) : (
                          <Lock size={20} className="text-slate-400" />
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>
                        {completionType === 'Normal' && <CheckCircle2 size={13} />}
                        {completionType}
                      </span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-1">
                      {level.industry}
                    </p>
                    <h3 className="text-base font-700 text-slate-900 mb-2" style={{ fontWeight: 700 }}>
                      {level.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {level.projectName} for {level.clientName}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex flex-col gap-0.5">
                        <span className="text-slate-400">Best</span>
                        <span className="font-semibold text-slate-600">{bestScore ?? 0}%</span>
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-slate-400">Attempts</span>
                        <span className="font-semibold text-slate-600">{attemptCount}</span>
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-slate-400">Last played</span>
                        <span className="font-semibold text-slate-600">{formatLastPlayed(lastPlayed[level.id])}</span>
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-slate-400">Time</span>
                        <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <Clock size={13} />
                        ~{getEstimatedMinutes(level.statements.length)} min
                        </span>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-700 text-slate-900" style={{ fontWeight: 700 }}>
                  Settings
                </h2>
                <p className="text-xs text-slate-400">Gameplay options and career progression rules.</p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                aria-label="Close settings"
              >
                <X size={17} className="mx-auto" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                  Gameplay
                </h3>
                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Show timer</p>
                      <p className="text-xs text-slate-400">Hide the countdown if it feels distracting.</p>
                    </div>
                    <button
                      onClick={toggleTimer}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        showTimer ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {showTimer ? 'On' : 'Off'}
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Theme</p>
                      <p className="text-xs text-slate-400">Switch between light and dark display.</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        theme === 'dark' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Reset progress</p>
                      <p className="text-xs text-slate-400">Clears scores, attempts, assisted status, and unlocks.</p>
                    </div>
                    <button
                      onClick={resetProgress}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                  Career Roles
                </h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  {careerRoles.map((role) => (
                    <div key={role.title} className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 last:border-b-0">
                      <span className="text-sm text-slate-700">{role.title}</span>
                      <span className="text-xs font-semibold text-slate-500">{role.xp} XP</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                  XP Rewards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {xpRewards.map((reward) => (
                    <div key={reward.label} className="rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-slate-700">{reward.label}</span>
                      <span className="text-xs font-semibold text-slate-500">{reward.xp} XP</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  XP is awarded from the first normal pass on each level. After answers have been reviewed, retries can improve Best Score but do not increase XP. Reveal Correct Answers unlocks learning progress, but Assisted levels award 0 XP and do not contribute to role progression.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
