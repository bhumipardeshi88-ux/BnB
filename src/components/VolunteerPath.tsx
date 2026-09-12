import React, { useState } from 'react';
import {
  Heart,
  BookOpen,
  Sparkles,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { UserProfile, VolunteerSession } from '../types';
import { AvatarIcon, AvatarSelector } from './AvatarPicker';
import { BenefitsSection } from './BenefitsSection';

interface VolunteerPathProps {
  user: UserProfile;
  onSelectDonate: () => void;
  onSelectTeach: () => void;
  onOpenCertificate: () => void;
  onOpenLor: () => void;
  onUpdateUser: (updated: UserProfile) => void;
}

export function VolunteerPath({
  user,
  onSelectDonate,
  onSelectTeach,
  onOpenCertificate,
  onOpenLor,
  onUpdateUser,
}: VolunteerPathProps) {
  const [copied, setCopied] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [simulatingReferral, setSimulatingReferral] = useState(false);
  const [completingSessionId, setCompletingSessionId] = useState<string | null>(null);

  const referralLink = `${window.location.origin}/?ref=${user.referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarChange = (type: 'boy' | 'girl') => {
    onUpdateUser({ ...user, avatar: type });
  };

  // Simulate friend referral signing up to earn +100 credits for both!
  const handleSimulateFriendReferral = () => {
    setSimulatingReferral(true);
    const updatedCredits = user.credits + 100;
    const updatedReferred = (user.referredCount || 0) + 1;
    let newBadge = user.badge;
    if (updatedCredits >= 300) newBadge = 'Gold';
    else if (updatedCredits >= 150) newBadge = 'Silver';
    else if (updatedCredits >= 50) newBadge = 'Bronze';

    const optimisticUser: UserProfile = {
      ...user,
      credits: updatedCredits,
      referredCount: updatedReferred,
      badge: newBadge,
    };
    setTimeout(() => {
      onUpdateUser(optimisticUser);
      setSimulatingReferral(false);
    }, 300);
  };

  // Complete a session: logs 2 hours, +50 credits, unlocks benefits!
  const handleCompleteSession = (sessionId?: string) => {
    setCompletingSessionId(sessionId || 'instant');

    const addCredits = 50;
    const addHours = 2;
    const newTotalCredits = user.credits + addCredits;
    const newTotalHours = user.verifiedHours + addHours;
    const newSessionsCount = user.completedSessionsCount + 1;
    let newBadge = user.badge;
    if (newTotalCredits >= 300) newBadge = 'Gold';
    else if (newTotalCredits >= 150) newBadge = 'Silver';
    else if (newTotalCredits >= 50) newBadge = 'Bronze';

    const updatedSessions = user.sessions.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'Completed' as const,
          hours: addHours,
          creditsEarned: addCredits,
          completedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    const updatedUser: UserProfile = {
      ...user,
      credits: newTotalCredits,
      verifiedHours: newTotalHours,
      completedSessionsCount: newSessionsCount,
      badge: newBadge,
      sessions: updatedSessions,
    };

    setTimeout(() => {
      onUpdateUser(updatedUser);
      setCompletingSessionId(null);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Volunteer Dashboard Header with Avatar & Credits */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Clickable Avatar Picker */}
            <button
              type="button"
              id="btn-edit-avatar"
              onClick={() => setShowAvatarModal(true)}
              title="Click to switch avatar (Boy / Girl)"
              className="relative group cursor-pointer"
            >
              <AvatarIcon type={user.avatar} size={54} />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 text-[10px] shadow-xs group-hover:scale-110 transition-transform">
                ✎
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 font-display">
                  {user.name}
                </h1>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-white ${
                    user.badge === 'Gold'
                      ? 'bg-amber-500'
                      : user.badge === 'Silver'
                      ? 'bg-slate-400'
                      : user.badge === 'Bronze'
                      ? 'bg-amber-700'
                      : 'bg-stone-400'
                  }`}
                >
                  {user.badge === 'None' ? 'Novice' : `${user.badge} Volunteer`}
                </span>
              </div>
              <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                <span>Ref Code:</span>
                <span className="font-mono font-bold text-stone-700">{user.referralCode}</span>
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="text-amber-700 hover:underline text-[11px] ml-2"
                >
                  Change Avatar
                </button>
              </div>
            </div>
          </div>

          {/* "My Credits" Counter */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 text-right shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              My Credits
            </div>
            <div className="text-2xl font-black text-amber-900 flex items-center justify-end gap-1 font-display">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>{user.credits}</span>
            </div>
            <div className="text-[10px] text-amber-700/80">
              {user.referredCount || 0} friends referred
            </div>
          </div>
        </div>

        {/* The Two Main Options: Donate and Teach */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {/* Option 1: Donate */}
          <button
            id="volunteer-btn-donate"
            type="button"
            onClick={onSelectDonate}
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  Choose a Cause
                </span>
                <div className="text-base font-bold text-stone-900 font-display mt-0.5">
                  Donate
                </div>
                <div className="text-xs text-stone-600">Sponsor education, meals, or supplies</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Teach */}
          <button
            id="volunteer-btn-teach"
            type="button"
            onClick={onSelectTeach}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-500 hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Volunteer &amp; Teach
                </span>
                <div className="text-base font-bold text-stone-900 font-display mt-0.5">
                  Teach
                </div>
                <div className="text-xs text-stone-600">9 volunteering roles available</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Credits & Referrals Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Credits &amp; Referrals
              </h2>
              <span className="text-[11px] text-stone-500">
                Earn +100 credits for every friend who joins!
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            +100 Credits each
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Share your personal referral code or invite link. When someone signs up with your code, you both instantly earn 100 volunteer credits.
        </p>

        {/* Copy referral box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 font-mono text-xs text-stone-800">
            <span>Code: <strong>{user.referralCode}</strong></span>
            <button
              type="button"
              onClick={handleCopyReferral}
              className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <button
            type="button"
            id="btn-simulate-referral"
            onClick={handleSimulateFriendReferral}
            disabled={simulatingReferral}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{simulatingReferral ? 'Crediting...' : 'Test Referral (+100 Pts)'}</span>
          </button>
        </div>
      </div>

      {/* Scheduled / Active Sessions List */}
      {user.sessions && user.sessions.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Your Volunteer Sessions ({user.sessions.length})</span>
            </h2>
            <span className="text-[11px] text-stone-500">Scheduled &amp; Past</span>
          </div>

          <div className="space-y-2.5">
            {user.sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      {sess.opportunityTitle}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sess.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-medium">
                    Topic: <span className="text-stone-800">{sess.topic}</span>
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-500">
                    <span>{sess.date}</span>
                    <span>•</span>
                    <span>{sess.timeSlot}</span>
                    <span>•</span>
                    <span>{sess.mode}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {sess.status === 'Completed' ? (
                    <div className="text-right sm:text-right">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+{sess.creditsEarned} Credits Verified</span>
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCompleteSession(sess.id)}
                      disabled={completingSessionId === sess.id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {completingSessionId === sess.id ? 'Verifying...' : 'Verify & Mark Completed'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gated Benefits Section */}
      <BenefitsSection
        user={user}
        onOpenCertificate={onOpenCertificate}
        onOpenLor={onOpenLor}
        onInstantCompleteSession={() => handleCompleteSession()}
      />

      {/* Avatar Picker Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">
                Choose Volunteer Avatar
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <AvatarSelector
              selected={user.avatar}
              onSelect={(type) => {
                handleAvatarChange(type);
                setShowAvatarModal(false);
              }}
              label="Select your icon (No photo upload needed):"
            />

            <button
              type="button"
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-2 text-xs font-bold rounded-xl bg-stone-900 text-white hover:bg-stone-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
