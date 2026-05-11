import React from 'react';
import { BookOpen, Building2 } from 'lucide-react';
import { Level } from '@/lib/gameData';

interface ScenarioHeaderProps {
  level: Level;
}

export default function ScenarioHeader({ level }: ScenarioHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 fade-in">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              Project Scenario
            </span>
            <span className="text-slate-200">·</span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Building2 size={12} />
              {level.clientName}
            </span>
          </div>
          <h2 className="text-base font-700 text-slate-900 mb-2" style={{ fontWeight: 700 }}>
            {level.projectName}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{level.scenarioDescription}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 mb-1">Your task:</p>
        <p className="text-xs text-slate-500 leading-relaxed">{level.taskDescription}</p>
      </div>
    </div>
  );
}
