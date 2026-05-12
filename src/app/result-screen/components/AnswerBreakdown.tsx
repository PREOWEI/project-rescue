'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import {
  Level,
  Statement,
  UserAnswer,
  BreakdownEntry,
  shouldShowClassification,
  shouldShowPriority,
  shouldShowSelection,
} from '@/lib/gameData';

interface AnswerBreakdownProps {
  level: Level;
  statements: Statement[];
  answers: UserAnswer[];
  breakdown: Record<string, BreakdownEntry>;
  guideMode?: boolean;
}

function StatusIcon({ correct, na }: { correct: boolean; na?: boolean }) {
  if (na) return <MinusCircle size={15} className="text-slate-300" />;
  return correct ? (
    <CheckCircle2 size={15} className="text-emerald-500" />
  ) : (
    <XCircle size={15} className="text-red-400" />
  );
}

function ClassificationBadge({ value }: { value?: string }) {
  if (!value) return <span className="text-slate-300 text-xs">-</span>;
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        value === 'functional' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
      }`}
    >
      {value === 'functional' ? 'Functional' : 'Non-Functional'}
    </span>
  );
}

function PriorityBadge({ value }: { value?: string }) {
  if (!value) return <span className="text-slate-300 text-xs">-</span>;
  const styles: Record<string, string> = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${styles[value] ?? ''}`}>
      {value}
    </span>
  );
}

export default function AnswerBreakdown({ level, statements, answers, breakdown, guideMode = false }: AnswerBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const showSelection = shouldShowSelection(level);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden fade-in">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-700 text-slate-900" style={{ fontWeight: 700 }}>
          {guideMode ? 'Correct Answer Guide' : 'Answer Breakdown'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {guideMode
            ? 'Review the correct answers and explanations. This is not scored.'
            : 'See how your answers compared to the correct ones for each statement.'}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {statements.map((stmt, i) => {
          const answer = answers.find((a) => a.statementId === stmt.id);
          const bd = breakdown[stmt.id];
          const isExpanded = expandedId === stmt.id;
          const userSelected = answer?.selected ?? false;
          const showClassification = shouldShowClassification(level, answer);
          const showPriority = shouldShowPriority(level, answer);
          const allCorrect =
            guideMode ||
            ((!showSelection || bd.selectionCorrect) &&
              (!showClassification || bd.classificationCorrect) &&
              (!showPriority || bd.priorityCorrect));

          return (
            <div key={stmt.id} className="hover:bg-slate-50/70 transition-colors duration-150">
              <button
                onClick={() => setExpandedId(isExpanded ? null : stmt.id)}
                className="w-full text-left px-5 py-4 flex items-start gap-3"
                aria-expanded={isExpanded}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-700 mt-0.5 ${
                    allCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                    &ldquo;{stmt.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {showSelection && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        {!guideMode && <StatusIcon correct={bd.selectionCorrect} />}
                        {guideMode
                          ? stmt.isRequirement
                            ? 'Correct: select this requirement'
                            : 'Correct: do not select this statement'
                          : userSelected
                          ? 'Marked as requirement'
                          : 'Not selected'}
                        {!guideMode && !bd.selectionCorrect && (
                          <span className="text-red-400 font-medium ml-1">
                            (should be {stmt.isRequirement ? 'selected' : 'not selected'})
                          </span>
                        )}
                      </span>
                    )}

                    {showClassification && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        {!guideMode && <StatusIcon correct={bd.classificationCorrect} />}
                        <ClassificationBadge value={guideMode ? stmt.correctClassification : answer?.classification} />
                        {!guideMode && !bd.classificationCorrect && (
                          <span className="text-red-400 font-medium">
                            should be <ClassificationBadge value={stmt.correctClassification} />
                          </span>
                        )}
                      </span>
                    )}

                    {showPriority && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        {!guideMode && <StatusIcon correct={bd.priorityCorrect} />}
                        <PriorityBadge value={guideMode ? stmt.correctPriority : answer?.priority} />
                        {!guideMode && !bd.priorityCorrect && (
                          <span className="text-red-400 font-medium">
                            should be <PriorityBadge value={stmt.correctPriority} />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-slate-400 mt-1">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 fade-in">
                  <div className="ml-10 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Explanation
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{stmt.explanation}</p>

                    {(showClassification || showPriority) && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-500">
                        {showClassification && (
                          <span>
                            <span className="font-semibold text-slate-700">Correct type: </span>
                            <ClassificationBadge value={stmt.correctClassification} />
                          </span>
                        )}
                        {showPriority && (
                          <span>
                            <span className="font-semibold text-slate-700">Correct priority: </span>
                            <PriorityBadge value={stmt.correctPriority} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
