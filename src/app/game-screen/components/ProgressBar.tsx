'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full progress-bar-fill"
        style={{
          width: `${clampedProgress}%`,
          background:
            clampedProgress === 100
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : clampedProgress >= 60
              ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              : 'linear-gradient(90deg, #6366f1, #a78bfa)',
        }}
      />
    </div>
  );
}