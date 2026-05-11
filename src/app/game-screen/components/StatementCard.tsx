'use client';

import React from 'react';
import { UserCircle2, AlertCircle } from 'lucide-react';
import {
  Statement,
  UserAnswer,
  Classification,
  Priority,
  Level,
  shouldShowClassification,
  shouldShowPriority,
  shouldShowSelection,
} from '@/lib/gameData';

interface StatementCardProps {
  index: number;
  level: Level;
  statement: Statement;
  answer: UserAnswer;
  showIncompleteWarning: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  onClassify: (id: string, classification: Classification) => void;
  onPriority: (id: string, priority: Priority) => void;
}

const classificationOptions: { value: Classification; label: string; description: string }[] = [
  { value: 'functional', label: 'Functional', description: 'What the system does' },
  { value: 'non-functional', label: 'Non-Functional', description: 'How well it does it' },
];

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'text-red-600' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600' },
  { value: 'low', label: 'Low', color: 'text-slate-500' },
];

export default function StatementCard({
  index,
  level,
  statement,
  answer,
  showIncompleteWarning,
  onToggleSelect,
  onClassify,
  onPriority,
}: StatementCardProps) {
  const isSelected = answer.selected;
  const showSelection = shouldShowSelection(level);
  const showClassification = shouldShowClassification(level, answer);
  const showPriority = shouldShowPriority(level, answer);
  const showControls = showClassification || showPriority;

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 shadow-sm overflow-hidden ${
        isSelected
          ? showIncompleteWarning
            ? 'border-amber-300 shadow-amber-100'
            : 'border-indigo-300 shadow-indigo-50' :'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Statement row */}
      <label
        htmlFor={`check-${statement.id}`}
        className={`flex items-start gap-4 p-4 transition-colors duration-150 ${
          showSelection ? 'cursor-pointer' : ''
        } ${
          isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'
        }`}
      >
        {/* Checkbox */}
        {showSelection && (
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id={`check-${statement.id}`}
              checked={isSelected}
              onChange={(e) => onToggleSelect(statement.id, e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
        )}

        {/* Number badge */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-700 transition-colors duration-200 ${
            isSelected
              ? 'bg-indigo-600 text-white' :'bg-slate-100 text-slate-500'
          }`}
          style={{ fontWeight: 700 }}
        >
          {index + 1}
        </div>

        {/* Statement text and speaker */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-relaxed transition-colors duration-150 ${
              isSelected ? 'text-slate-900 font-500' : 'text-slate-700'
            }`}
            style={isSelected ? { fontWeight: 500 } : {}}
          >
            &ldquo;{statement.text}&rdquo;
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <UserCircle2 size={13} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">
              {statement.speaker}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">{statement.speakerRole}</span>
          </div>
        </div>

        {/* Selected indicator */}
        {showSelection && isSelected && (
          <div className="flex-shrink-0">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
              Selected
            </span>
          </div>
        )}
      </label>

      {/* Classification + Priority */}
      {showControls && (
        <div className="px-4 pb-4 pt-0 border-t border-indigo-100/60 bg-indigo-50/20 fade-in">
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            {/* Classification */}
            {showClassification && (
            <div className="flex-1">
              <label
                htmlFor={`classify-${statement.id}`}
                className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
              >
                Type
              </label>
              <select
                id={`classify-${statement.id}`}
                value={answer.classification ?? ''}
                onChange={(e) => onClassify(statement.id, e.target.value as Classification)}
                className={`w-full text-sm border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-150 cursor-pointer ${
                  answer.classification
                    ? 'border-indigo-300 text-slate-800' :'border-slate-200 text-slate-400'
                }`}
              >
                <option value="" disabled>
                  Select type…
                </option>
                {classificationOptions.map((opt) => (
                  <option key={`cls-${opt.value}`} value={opt.value}>
                    {opt.label} — {opt.description}
                  </option>
                ))}
              </select>
            </div>
            )}

            {/* Priority */}
            {showPriority && (
            <div className="flex-1">
              <label
                htmlFor={`priority-${statement.id}`}
                className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
              >
                Priority
              </label>
              <select
                id={`priority-${statement.id}`}
                value={answer.priority ?? ''}
                onChange={(e) => onPriority(statement.id, e.target.value as Priority)}
                className={`w-full text-sm border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-150 cursor-pointer ${
                  answer.priority
                    ? 'border-indigo-300 text-slate-800' :'border-slate-200 text-slate-400'
                }`}
              >
                <option value="" disabled>
                  Select priority…
                </option>
                {priorityOptions.map((opt) => (
                  <option key={`pri-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            )}
          </div>

          {showIncompleteWarning && (
            <div className="flex items-center gap-1.5 mt-2 text-amber-600">
              <AlertCircle size={13} />
              <span className="text-xs font-medium">
                Please complete the required fields before submitting.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
