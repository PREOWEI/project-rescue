'use client';

import React from 'react';
import { BookOpenCheck } from 'lucide-react';

interface RevealAnswersModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RevealAnswersModal({ onCancel, onConfirm }: RevealAnswersModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
          <BookOpenCheck size={24} className="text-amber-600" />
        </div>
        <h2 className="text-base font-700 text-slate-900 mb-2" style={{ fontWeight: 700 }}>
          Reveal correct answers?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          This is a helpful learning option. You will see the correct answers and explanations, and the next level can still unlock so you can keep practising.
        </p>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-5">
          <p className="text-xs text-amber-700 leading-relaxed">
            This attempt will be marked as Assisted. It can help you continue learning, but it will not award XP or count toward career role progress.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 font-semibold text-sm transition-all duration-150"
          >
            Keep Trying
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm shadow-sm transition-all duration-150"
          >
            Reveal Answers
          </button>
        </div>
      </div>
    </div>
  );
}
