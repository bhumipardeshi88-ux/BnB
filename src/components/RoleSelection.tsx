import React from 'react';
import { Heart, HandHeart, Sparkles, MapPin, Award } from 'lucide-react';
import { UserProfile } from '../types';
import { AvatarIcon } from './AvatarPicker';

interface RoleSelectionProps {
  user: UserProfile;
  onSelectAdopt: () => void;
  onSelectVolunteer: () => void;
}

export function RoleSelection({ user, onSelectAdopt, onSelectVolunteer }: RoleSelectionProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Friendly personalized greeting */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold mb-3 border border-amber-200">
          <AvatarIcon type={user.avatar} size={22} className="border-none" />
          <span>Namaste, {user.name}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 font-display">
          How would you like to help today?
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
          BalSetu is a dedicated bridge bringing hearts together — supporting prospective adoptive families and championing children’s education.
        </p>
      </div>

      {/* The Two Big Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Big Button 1: Want to Adopt? */}
        <button
          id="btn-want-to-adopt"
          type="button"
          onClick={onSelectAdopt}
          className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-rose-50/80 to-amber-50/50 border-2 border-rose-200/80 hover:border-rose-400 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-98 transition-all text-left cursor-pointer overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-rose-200/40 rounded-full blur-2xl group-hover:bg-rose-300/50 transition-all pointer-events-none" />

          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-105 transition-transform">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
              For Parents
            </span>

            <h2 className="text-2xl font-bold text-stone-900 mt-3 font-display group-hover:text-rose-700 transition-colors">
              Want to Adopt?
            </h2>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Find nearby authorized adoption agencies, browse confidential child profiles, and view the official government adoption portal.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between text-xs font-bold text-rose-700">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Nearby Centers
            </span>
            <span className="group-hover:translate-x-1 transition-transform">
              Explore Centers &rarr;
            </span>
          </div>
        </button>

        {/* Big Button 2: Want to Volunteer? */}
        <button
          id="btn-want-to-volunteer"
          type="button"
          onClick={onSelectVolunteer}
          className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-50/90 to-orange-50/50 border-2 border-amber-300/80 hover:border-amber-500 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-98 transition-all text-left cursor-pointer overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-300/30 rounded-full blur-2xl group-hover:bg-amber-400/40 transition-all pointer-events-none" />

          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-105 transition-transform">
              <HandHeart className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              For Volunteers & Donors
            </span>

            <h2 className="text-2xl font-bold text-stone-900 mt-3 font-display group-hover:text-amber-700 transition-colors">
              Want to Volunteer?
            </h2>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Quickly fund a child's education or teach, mentor, and lead sessions. Earn credits, badges, certificates & letters of recommendation.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Donate or Teach
            </span>
            <span className="group-hover:translate-x-1 transition-transform">
              Join Volunteer Path &rarr;
            </span>
          </div>
        </button>
      </div>

      {/* Trust & Safety notice */}
      <div className="mt-10 p-4 rounded-2xl bg-stone-100/80 border border-stone-200 text-center">
        <p className="text-xs text-stone-600 max-w-md mx-auto flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            BalSetu complies strictly with child protection guidelines: child confidentiality is guaranteed with NO public photos or names.
          </span>
        </p>
      </div>
    </div>
  );
}
