'use client';

import React from 'react';
import { Loader2, Send, AlertCircle } from 'lucide-react';
import { LevelMode } from '@/lib/gameData';

interface SubmitSectionProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  submitAttempted: boolean;
  selectedCount: number;
  allSelectedClassified: boolean;
  mode: LevelMode;
  onSubmit: () => void;
}

export default function SubmitSection({
  canSubmit,
  isSubmitting,
  submitAttempted,
  selectedCount,
  allSelectedClassified,
  mode,
  onSubmit,
}: SubmitSectionProps) {
  const hasSelectionStep = mode === 'mixed' || mode === 'identify-only';
  const completionText =
    mode === 'classify-all'
      ? 'All statements classified'
      : mode === 'prioritise-only'
      ? 'All priorities assigned'
      : 'All selected requirements classified and prioritised';
  const incompleteText =
    mode === 'classify-all'
      ? 'Some statements still need a type'
      : mode === 'prioritise-only'
      ? 'Some statements still need a priority'
      : 'Some selected requirements need type + priority';

  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-700 text-slate-800 mb-1" style={{ fontWeight: 700 }}>
            Ready to submit?
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  !hasSelectionStep || selectedCount > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                {!hasSelectionStep || selectedCount > 0 ? '✓' : '·'}
              </span>
              {!hasSelectionStep
                ? 'Statements loaded'
                : selectedCount > 0
                ? `${selectedCount} statement${selectedCount > 1 ? 's' : ''} selected`
                : 'No statements selected yet'}
            </div>
            {mode !== 'identify-only' && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    allSelectedClassified ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  {allSelectedClassified ? '✓' : '·'}
                </span>
                {allSelectedClassified ? completionText : incompleteText}
              </div>
            )}
          </div>

          {submitAttempted && !canSubmit && (
            <div className="flex items-center gap-1.5 mt-2 text-amber-600">
              <AlertCircle size={13} />
              <span className="text-xs font-medium">
                {selectedCount === 0 && hasSelectionStep
                  ? 'Select at least one requirement before submitting.'
                  : 'Complete all required fields before submitting.'}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm min-w-[160px] justify-center ${
            canSubmit && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-200'
              : isSubmitting
              ? 'bg-indigo-600 text-white cursor-not-allowed opacity-80'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}
