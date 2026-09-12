import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Compass, KeyRound } from 'lucide-react';
import { AvatarSelector } from './AvatarPicker';
import { AvatarType, UserProfile, DEFAULT_GUEST_USER, DEFAULT_TEST_USER } from '../types';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
  onContinueAsGuest?: (guestUser?: UserProfile) => void;
}

export function AuthModal({ onSuccess, onContinueAsGuest }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarType>('boy');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestFlow = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        if (onContinueAsGuest) {
          onContinueAsGuest(data.user);
        } else {
          onSuccess(data.user);
        }
        return;
      }
    } catch {
      // Fallback seamlessly to local guest profile
    } finally {
      setLoading(false);
    }

    if (onContinueAsGuest) {
      onContinueAsGuest(DEFAULT_GUEST_USER);
    } else {
      onSuccess(DEFAULT_GUEST_USER);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Prototype test account bypass: email "abcd@gmail.com" or "abcd" and password "abcd"
    const isTestEmail = normalizedEmail === 'abcd@gmail.com' || normalizedEmail === 'abcd';
    if (isTestEmail && normalizedPassword === 'abcd') {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password: 'abcd' }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          onSuccess(data.user);
          return;
        }
      } catch {
        // Fallback directly to DEFAULT_TEST_USER if server request is delayed or offline
      } finally {
        setLoading(false);
      }
      onSuccess({ ...DEFAULT_TEST_USER, email: 'abcd@gmail.com' });
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp
        ? { email: email.trim(), password: password.trim(), name, avatar, referralCode: referralCode.trim() }
        : { email: email.trim(), password: password.trim() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword = 'password123') => {
    setLoading(true);
    setError(null);
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onSuccess(data.user);
        return;
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }

    if (demoEmail === 'abcd@gmail.com' || demoEmail === 'abcd') {
      onSuccess({ ...DEFAULT_TEST_USER, email: 'abcd@gmail.com' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/90 relative overflow-hidden">
        {/* Soft top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        {/* Top bar with quick Skip button */}
        <div className="flex items-center justify-between pt-1 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
            Prototype Preview
          </span>
          <button
            id="auth-skip-top-btn"
            type="button"
            onClick={handleGuestFlow}
            disabled={loading}
            className="text-xs font-bold text-stone-600 hover:text-amber-700 bg-stone-100 hover:bg-amber-100/70 px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            title="Skip sign in and enter prototype"
          >
            <span>Skip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Brand header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mb-3 shadow-xs">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display">
            Welcome to BalSetu
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xs mx-auto">
            Connecting caring parents with adoption centers & volunteers with children's education.
          </p>
        </div>

        {/* Prominent Continue as Guest / Skip Button */}
        <div className="mb-6 space-y-2">
          <button
            id="btn-continue-as-guest"
            type="button"
            onClick={handleGuestFlow}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
            <span>Continue as Guest</span>
            <span className="text-[11px] font-normal text-amber-100 bg-amber-600/70 px-2 py-0.5 rounded-full">
              No account needed
            </span>
            <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-[11px] text-center text-stone-500">
            Tap above to explore the main screen, adoption agencies, and volunteer hub directly.
          </p>
        </div>

        {/* Visual Divider */}
        <div className="relative flex items-center my-5">
          <div className="grow border-t border-stone-200"></div>
          <span className="shrink mx-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            or sign in with an account
          </span>
          <div className="grow border-t border-stone-200"></div>
        </div>

        {/* Quick Demo Login shortcuts */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> Instant Demo Profiles
            </span>
            <span className="text-[10px] text-amber-700">Optional</span>
          </div>

          {/* Prototype Test Account abcd@gmail.com */}
          <button
            id="demo-test-abcd-btn"
            type="button"
            onClick={() => handleDemoLogin('abcd@gmail.com', 'abcd')}
            className="w-full mb-2 px-3 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors active:scale-98 shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login with Test Account (abcd@gmail.com / abcd)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="demo-parent-btn"
              type="button"
              onClick={() => handleDemoLogin('parent@example.com')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-amber-300 text-stone-800 hover:bg-amber-100 transition-colors active:scale-98 shadow-2xs text-center cursor-pointer"
            >
              Test as Parent
            </button>
            <button
              id="demo-volunteer-btn"
              type="button"
              onClick={() => handleDemoLogin('volunteer@example.com')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-amber-300 text-stone-800 hover:bg-amber-100 transition-colors active:scale-98 shadow-2xs text-center cursor-pointer"
            >
              Test as Volunteer
            </button>
          </div>
        </div>

        {/* Sign In vs Sign Up Tab Switch */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-5">
          <button
            type="button"
            id="auth-tab-signin"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="auth-tab-signup"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isSignUp
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden transition-all bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Email Address or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-email-input"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abcd@gmail.com or you@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="abcd or your password"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden transition-all bg-white"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1 px-1">
              <span>Test Account:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('abcd@gmail.com');
                  setPassword('abcd');
                }}
                className="text-amber-700 font-semibold hover:underline cursor-pointer"
              >
                Autofill "abcd@gmail.com" / "abcd"
              </button>
            </div>
          </div>

          {isSignUp && (
            <>
              {/* Profile Avatar selection */}
              <AvatarSelector
                selected={avatar}
                onSelect={(val) => setAvatar(val)}
                label="Pick Your Avatar (No photo upload needed):"
              />

              {/* Referral code input */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Referral Code <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="signup-referral-input"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BAL-AARAV1"
                  className="w-full px-3 py-2 text-xs uppercase tracking-wider rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-300 outline-hidden"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Have a friend's code? Both of you get 100 volunteer credits!
                </p>
              </div>
            </>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Please wait...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Join BalSetu' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Skip to Guest option */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <button
            id="auth-skip-bottom-btn"
            type="button"
            onClick={handleGuestFlow}
            className="text-xs font-medium text-stone-500 hover:text-amber-800 transition-colors cursor-pointer"
          >
            Just exploring the prototype? <span className="underline font-bold text-amber-700">Continue as Guest</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure, private & child confidentiality protected</span>
          </p>
        </div>
      </div>
    </div>
  );
}
