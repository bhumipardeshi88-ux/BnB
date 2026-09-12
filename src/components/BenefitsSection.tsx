import React from 'react';
import {
  Lock,
  Unlock,
  Award,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '../types';

interface BenefitsSectionProps {
  user: UserProfile;
  onOpenCertificate: () => void;
  onOpenLor: () => void;
  onInstantCompleteSession?: () => void;
}

export function BenefitsSection({
  user,
  onOpenCertificate,
  onOpenLor,
  onInstantCompleteSession,
}: BenefitsSectionProps) {
  const isUnlocked = (user.completedSessionsCount || 0) >= 1;
  const hours = user.verifiedHours || 0;

  // Badge rank progression
  const getBadgeProgress = () => {
    if (hours < 1) return { current: 'None', next: 'Bronze', target: 1, percent: 0 };
    if (hours < 6) return { current: 'Bronze', next: 'Silver', target: 6, percent: Math.min(100, Math.round((hours / 6) * 100)) };
    if (hours < 16) return { current: 'Silver', next: 'Gold', target: 16, percent: Math.min(100, Math.round(((hours - 6) / 10) * 100)) };
    return { current: 'Gold', next: 'Max Honor', target: 16, percent: 100 };
  };

  const progress = getBadgeProgress();

  if (!isUnlocked) {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-stone-300 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
              Gated Rewards
            </span>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Complete your first session to unlock benefits.
            </h2>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Once you teach or mentor your first class, your institutional benefits will instantly unlock: an official verifiable Certificate, an executive Letter of Recommendation (LOR), verified logged hours, and rank badges.
        </p>

        {/* Locked Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 opacity-65 select-none">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center relative">
            <Award className="w-6 h-6 text-stone-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-stone-700">Certificate</div>
            <div className="text-[10px] text-stone-400">Locked 🔒</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center relative">
            <FileText className="w-6 h-6 text-stone-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-stone-700">Official LOR</div>
            <div className="text-[10px] text-stone-400">Locked 🔒</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center relative">
            <Clock className="w-6 h-6 text-stone-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-stone-700">Verified Hours</div>
            <div className="text-[10px] text-stone-400">0 hrs logged</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center relative">
            <Sparkles className="w-6 h-6 text-stone-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-stone-700">Badge System</div>
            <div className="text-[10px] text-stone-400">Bronze → Gold</div>
          </div>
        </div>

        {/* Quick instant action for testing */}
        {onInstantCompleteSession && (
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-500">
              Reviewing the app? Test the unlock in 1 click:
            </span>
            <button
              type="button"
              id="btn-quick-unlock-benefits"
              onClick={onInstantCompleteSession}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Simulate Completing 1 Session</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-6">
      {/* Unlocked Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                Unlocked &amp; Verified
              </span>
              <span className="text-xs text-stone-500">
                ({user.completedSessionsCount} session{user.completedSessionsCount === 1 ? '' : 's'} completed)
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 font-display mt-0.5">
              Your Benefits
            </h2>
          </div>
        </div>

        {/* Verified hours counter */}
        <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 flex items-center gap-2 shrink-0">
          <Clock className="w-4 h-4 text-amber-600" />
          <div>
            <div className="text-xs font-bold text-stone-900 leading-none">
              {hours} Hours Logged
            </div>
            <div className="text-[10px] text-stone-500">Verified Teaching Service</div>
          </div>
        </div>
      </div>

      {/* 4 Benefits Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Benefit 1: Certificate */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
              Ready
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Certificate of Volunteering
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              Official institutional certificate recognizing your teaching hours and contribution.
            </p>
          </div>

          <button
            type="button"
            id="btn-view-certificate"
            onClick={onOpenCertificate}
            className="w-full py-2 px-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>View &amp; Print Certificate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Benefit 2: Letter of Recommendation (LOR) */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase text-rose-900 bg-rose-200/70 px-2 py-0.5 rounded-md">
              Ready
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Letter of Recommendation (LOR)
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              Formal recommendation on institutional letterhead for colleges, internships &amp; jobs.
            </p>
          </div>

          <button
            type="button"
            id="btn-view-lor"
            onClick={onOpenLor}
            className="w-full py-2 px-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>View &amp; Download LOR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Benefit 3 & 4: Rank / Badge System (Bronze -> Silver -> Gold) */}
      <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-stone-900">
              Badge &amp; Rank Progression
            </span>
          </div>
          <div className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>Current Rank:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-white text-[11px] font-extrabold ${
                user.badge === 'Gold'
                  ? 'bg-amber-500'
                  : user.badge === 'Silver'
                  ? 'bg-slate-400'
                  : user.badge === 'Bronze'
                  ? 'bg-amber-700'
                  : 'bg-stone-400'
              }`}
            >
              {user.badge}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 font-medium">
            <span>{hours} hours completed</span>
            {progress.next !== 'Max Honor' ? (
              <span>Next Rank ({progress.next}) at {progress.target} hours</span>
            ) : (
              <span className="text-amber-700 font-bold">Highest Gold Rank Achieved!</span>
            )}
          </div>
        </div>

        {/* 3 Tier Explanation */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-center text-xs">
          <div
            className={`p-2 rounded-xl transition-all ${
              user.badge === 'Bronze' ? 'bg-amber-100/70 border border-amber-300 font-bold' : 'text-stone-500'
            }`}
          >
            <div className="text-[11px] font-extrabold text-amber-800">🥉 Bronze</div>
            <div className="text-[10px] text-stone-500">1 – 5 Hours</div>
          </div>

          <div
            className={`p-2 rounded-xl transition-all ${
              user.badge === 'Silver' ? 'bg-slate-200/80 border border-slate-300 font-bold text-stone-900' : 'text-stone-500'
            }`}
          >
            <div className="text-[11px] font-extrabold text-slate-700">🥈 Silver</div>
            <div className="text-[10px] text-stone-500">6 – 15 Hours</div>
          </div>

          <div
            className={`p-2 rounded-xl transition-all ${
              user.badge === 'Gold' ? 'bg-amber-100 border border-amber-400 font-bold text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <div className="text-[11px] font-extrabold text-amber-600">🥇 Gold</div>
            <div className="text-[10px] text-stone-500">16+ Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
