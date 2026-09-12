import React from 'react';
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile, DEFAULT_TEST_USER } from '../types';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
  onContinueAsGuest?: (guestUser?: UserProfile) => void;
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const handleLogin = () => {
    // Instant login directly into the app — no validation, no credentials, no database checks
    onSuccess(DEFAULT_TEST_USER);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/90 relative overflow-hidden">
        {/* Soft top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        {/* Prototype badge */}
        <div className="flex items-center justify-center pt-1 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Prototype Preview</span>
          </span>
        </div>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mb-3.5 shadow-xs">
            <HeartHandshake className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
            Welcome to BalSetu
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-xs mx-auto leading-relaxed">
            Connecting caring parents with adoption centers & volunteers with children's education.
          </p>
        </div>

        {/* Single Log In Button */}
        <div className="space-y-4">
          <button
            id="auth-single-login-button"
            type="button"
            onClick={handleLogin}
            className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Log In</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safe, secure & confidential child welfare ecosystem</span>
          </p>
        </div>
      </div>
    </div>
  );
}
