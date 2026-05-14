import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#f8fafc_42%,_#ffffff_100%)] text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-12 h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute right-10 top-1/3 h-52 w-52 rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
        <div className="fade-in">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-500">
            Requirements Engineering Career
          </p>
          <h1 className="text-5xl font-800 leading-none tracking-tight sm:text-7xl" style={{ fontWeight: 800 }}>
            Project <span className="text-indigo-600">Rescue</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            The software recovery training program
          </p>
        </div>

        <div className="slide-up mt-12 w-full rounded-2xl border border-indigo-100 bg-white/90 p-6 text-left shadow-xl shadow-slate-200/70 backdrop-blur sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-600">
                Mission Brief
              </p>
              <h2 className="text-lg font-700 text-slate-950" style={{ fontWeight: 700 }}>
                Recover unclear software projects
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              Build your requirements engineering skill by rescuing realistic software projects from unclear stakeholder input.
            </p>
            <p>
              You are a trainee requirements analyst entering the Project Rescue program. Your mission is to recover struggling software projects by identifying requirements, resolving stakeholder confusion, and making correct engineering decisions.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="slide-up mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-150 hover:bg-indigo-700 active:scale-95"
        >
          Start Rescue Mission
          <ArrowRight size={18} />
        </Link>

        <p className="mt-5 text-xs text-slate-400">
          Analyze requirements · rescue projects · rank up your career
        </p>
      </section>
    </main>
  );
}
