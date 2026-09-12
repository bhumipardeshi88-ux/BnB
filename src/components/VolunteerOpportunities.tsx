import React from 'react';
import {
  BookOpen,
  Sparkles,
  HeartHandshake,
  Compass,
  CalendarDays,
  Palette,
  GraduationCap,
  Trophy,
  Coins,
  Clock,
  Award,
  ArrowRight,
} from 'lucide-react';
import { VolunteerOpportunity } from '../types';

interface VolunteerOpportunitiesProps {
  opportunities: VolunteerOpportunity[];
  onSelectOpportunity: (opportunity: VolunteerOpportunity) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5 text-amber-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-orange-600" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-rose-600" />,
  Compass: <Compass className="w-5 h-5 text-emerald-600" />,
  CalendarDays: <CalendarDays className="w-5 h-5 text-indigo-600" />,
  Palette: <Palette className="w-5 h-5 text-pink-600" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-blue-600" />,
  Trophy: <Trophy className="w-5 h-5 text-amber-700" />,
  Coins: <Coins className="w-5 h-5 text-yellow-600" />,
};

export function VolunteerOpportunities({
  opportunities,
  onSelectOpportunity,
}: VolunteerOpportunitiesProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-md">
        <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full inline-block mb-2 backdrop-blur-xs">
          Empower Children Through Learning
        </span>
        <h1 className="text-2xl font-bold font-display">Volunteer Opportunities</h1>
        <p className="text-xs text-amber-100 mt-1 max-w-lg leading-relaxed">
          Select a role that fits your passion. Each completed session logs verified hours, awards credits, and unlocks your official BalSetu Certificate & LOR.
        </p>
      </div>

      {/* Grid of All Opportunities (> 3 options, exactly matching requested 9 domains) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {ICON_MAP[opp.icon] || <Sparkles className="w-5 h-5 text-amber-600" />}
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>+{opp.creditsReward} Credits</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                {opp.title}
              </h3>

              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {opp.shortDescription}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                {opp.typicalDuration}
              </span>

              <button
                type="button"
                id={`btn-signup-${opp.id}`}
                onClick={() => onSelectOpportunity(opp)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white hover:bg-amber-600 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
