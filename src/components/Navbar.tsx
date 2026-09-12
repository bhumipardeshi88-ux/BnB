import React from 'react';
import { ArrowLeft, Sparkles, LogOut, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { AvatarIcon } from './AvatarPicker';

interface NavbarProps {
  user: UserProfile | null;
  canGoBack: boolean;
  onBack: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  currentTitle?: string;
  onNavigateHome: () => void;
}

export function Navbar({
  user,
  canGoBack,
  onBack,
  onLogout,
  onOpenProfile,
  currentTitle,
  onNavigateHome,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 h-15 flex items-center justify-between gap-3">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {canGoBack ? (
            <button
              id="nav-back-button"
              type="button"
              onClick={onBack}
              aria-label="Go back one step"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 active:scale-95 transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-semibold">Back</span>
            </button>
          ) : null}

          <button
            id="nav-brand-button"
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 group text-left transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                Bal<span className="text-amber-600">Setu</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider text-amber-800/80 bg-amber-100/70 px-1.5 py-0.5 rounded ml-2">
                Bridge of Hope
              </span>
            </div>
          </button>
        </div>

        {/* Center / Current screen hint if back button is active */}
        {currentTitle && (
          <div className="hidden xs:block text-xs font-medium text-stone-500 truncate max-w-[120px] text-center">
            {currentTitle}
          </div>
        )}

        {/* Right side: User status & avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {/* Credits counter */}
              <button
                id="nav-credits-badge"
                type="button"
                onClick={onOpenProfile}
                title="Your BalSetu Credits"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{user.credits}</span>
                <span className="hidden sm:inline font-normal text-amber-700 text-[11px]">pts</span>
              </button>

              {/* Avatar trigger */}
              <button
                id="nav-profile-button"
                type="button"
                onClick={onOpenProfile}
                title="View Profile & Change Avatar"
                aria-label="Profile and settings"
                className="relative group cursor-pointer focus:outline-hidden"
              >
                <AvatarIcon type={user.avatar} size={34} />
                {user.badge !== 'None' && (
                  <span
                    className={`absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1 rounded-full border border-white text-white ${
                      user.badge === 'Gold'
                        ? 'bg-amber-500'
                        : user.badge === 'Silver'
                        ? 'bg-slate-400'
                        : 'bg-orange-700'
                    }`}
                  >
                    {user.badge[0]}
                  </span>
                )}
              </button>

              {/* Logout button */}
              <button
                id="nav-logout-button"
                type="button"
                onClick={onLogout}
                title="Log Out"
                aria-label="Log Out"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Safe & Confidential</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
