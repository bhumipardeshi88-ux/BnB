import React from 'react';
import { AvatarType } from '../types';

interface AvatarIconProps {
  type: AvatarType;
  className?: string;
  size?: number;
}

export function AvatarIcon({ type, className = 'w-10 h-10', size = 40 }: AvatarIconProps) {
  if (type === 'girl') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 border-2 border-rose-300 select-none overflow-hidden shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Hair back */}
          <path
            d="M14 26C12 28 10 33 11 38C15 39 18 35 18 32V25"
            fill="#D97706"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          <path
            d="M34 26C36 28 38 33 37 38C33 39 30 35 30 32V25"
            fill="#D97706"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          {/* Face */}
          <circle cx="24" cy="22" r="11" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1.5" />
          {/* Hair front & bangs */}
          <path
            d="M13 21C13 15 17 11 24 11C31 11 35 15 35 21C35 18 31 15 24 16C17 15 13 18 13 21Z"
            fill="#B45309"
          />
          {/* Eyes */}
          <circle cx="20" cy="22" r="1.5" fill="#451A03" />
          <circle cx="28" cy="22" r="1.5" fill="#451A03" />
          {/* Smile */}
          <path
            d="M21 26C22.5 28 25.5 28 27 26"
            stroke="#EA580C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Hair Ribbon / Flower */}
          <circle cx="15" cy="14" r="3.5" fill="#F43F5E" />
          <circle cx="15" cy="14" r="1.5" fill="#FEF08A" />
          {/* Shoulders */}
          <path
            d="M15 42C15 36 19 33 24 33C29 33 33 36 33 42"
            fill="#FB7185"
            stroke="#E11D48"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-800 border-2 border-amber-300 select-none overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        {/* Face */}
        <circle cx="24" cy="22" r="11" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1.5" />
        {/* Hair short crop */}
        <path
          d="M13 20C13 14 17 10 24 10C31 10 35 14 35 20C33 16 28 14 24 14C19 14 15 16 13 20Z"
          fill="#451A03"
        />
        {/* Eyes */}
        <circle cx="20" cy="22" r="1.5" fill="#1C1917" />
        <circle cx="28" cy="22" r="1.5" fill="#1C1917" />
        {/* Smile */}
        <path
          d="M21 26C22.5 28 25.5 28 27 26"
          stroke="#D97706"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Cheerful blush */}
        <circle cx="18" cy="25" r="1" fill="#FCA5A5" />
        <circle cx="30" cy="25" r="1" fill="#FCA5A5" />
        {/* Shirt Collar */}
        <path
          d="M15 42C15 36 19 33 24 33C29 33 33 36 33 42"
          fill="#0284C7"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <path d="M21 33L24 38L27 33" fill="#BAE6FD" />
      </svg>
    </div>
  );
}

interface AvatarSelectorProps {
  selected: AvatarType;
  onSelect: (type: AvatarType) => void;
  label?: string;
}

export function AvatarSelector({ selected, onSelect, label = 'Choose your profile avatar:' }: AvatarSelectorProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-stone-600 block">{label}</label>}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          id="avatar-select-boy"
          onClick={() => onSelect('boy')}
          className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left ${
            selected === 'boy'
              ? 'border-amber-500 bg-amber-50 shadow-sm'
              : 'border-stone-200 bg-white hover:border-amber-200'
          }`}
        >
          <AvatarIcon type="boy" size={38} />
          <div>
            <div className="text-sm font-semibold text-stone-800">Boy Avatar</div>
            <div className="text-[11px] text-stone-500">Cheerful buddy</div>
          </div>
        </button>

        <button
          type="button"
          id="avatar-select-girl"
          onClick={() => onSelect('girl')}
          className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left ${
            selected === 'girl'
              ? 'border-rose-400 bg-rose-50 shadow-sm'
              : 'border-stone-200 bg-white hover:border-rose-200'
          }`}
        >
          <AvatarIcon type="girl" size={38} />
          <div>
            <div className="text-sm font-semibold text-stone-800">Girl Avatar</div>
            <div className="text-[11px] text-stone-500">Joyful learner</div>
          </div>
        </button>
      </div>
    </div>
  );
}
