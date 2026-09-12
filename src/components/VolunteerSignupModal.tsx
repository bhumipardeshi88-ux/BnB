import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Globe, MapPin, CheckCircle, X } from 'lucide-react';
import { VolunteerOpportunity } from '../types';

interface VolunteerSignupModalProps {
  opportunity: VolunteerOpportunity;
  userEmail: string;
  onClose: () => void;
  onSuccess: (sessionData: any) => void;
}

export function VolunteerSignupModal({
  opportunity,
  userEmail,
  onClose,
  onSuccess,
}: VolunteerSignupModalProps) {
  const [topic, setTopic] = useState(opportunity.suggestedTopics[0] || 'General Session');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicText, setCustomTopicText] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // default 2 days ahead
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [mode, setMode] = useState<'Online' | 'In-person'>('Online');
  const [locationOrCenter, setLocationOrCenter] = useState('BalSetu Virtual Interactive Classroom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTopicChange = (val: string) => {
    if (val === 'OTHER_CUSTOM') {
      setIsCustomTopic(true);
      setTopic('Other / My own topic');
    } else {
      setIsCustomTopic(false);
      setTopic(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCustomTopic && !customTopicText.trim()) {
      setError('Please briefly describe your topic.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/volunteer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          opportunityId: opportunity.id,
          opportunityTitle: opportunity.title,
          date,
          timeSlot,
          mode,
          locationOrCenter:
            mode === 'Online'
              ? 'BalSetu Virtual Interactive Classroom'
              : locationOrCenter || 'Community Children Center',
          topic: isCustomTopic ? customTopicText.trim() : topic,
          customTopic: isCustomTopic ? customTopicText.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Fast Signup (Under 1 Min)
            </span>
            <h2 className="text-lg font-bold text-stone-900 font-display mt-0.5">
              Sign Up: {opportunity.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* 4-5 Fields Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Field 1: Topic Selection */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              1. Select Topic or Focus Area
            </label>
            <select
              id="signup-topic-select"
              value={isCustomTopic ? 'OTHER_CUSTOM' : topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:bg-white focus:border-amber-500 outline-hidden"
            >
              {opportunity.suggestedTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="OTHER_CUSTOM">✨ Other / My own topic</option>
            </select>
          </div>

          {/* Conditional Field: Custom Topic Textbox (Appears ONLY when "Other / My own topic" is selected) */}
          {isCustomTopic && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-amber-900 block mb-1">
                Your Topic / What would you like to share?
              </label>
              <textarea
                id="signup-custom-topic-input"
                rows={2}
                required
                value={customTopicText}
                onChange={(e) => setCustomTopicText(e.target.value)}
                placeholder="e.g. Basic Chess Openings, Vedic Math Tricks, or Environmental Gardening"
                className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
              <span className="text-[11px] text-amber-700 block mt-1">
                Our educational team will review and prepare learning resources for you.
              </span>
            </div>
          )}

          {/* Field 2: Date */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>2. Preferred Date</span>
            </label>
            <input
              id="signup-date-input"
              type="date"
              required
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:bg-white focus:border-amber-500 outline-hidden"
            />
          </div>

          {/* Field 3: Time Slot */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>3. Time Slot</span>
            </label>
            <select
              id="signup-timeslot-select"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:bg-white focus:border-amber-500 outline-hidden"
            >
              <option value="10:00 AM - 12:00 PM">Morning: 10:00 AM - 12:00 PM</option>
              <option value="02:00 PM - 04:00 PM">Afternoon: 02:00 PM - 04:00 PM</option>
              <option value="05:00 PM - 07:00 PM">Evening: 05:00 PM - 07:00 PM</option>
            </select>
          </div>

          {/* Field 4: Mode (Online / In-person) */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <span>4. Volunteering Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="signup-mode-online"
                onClick={() => {
                  setMode('Online');
                  setLocationOrCenter('BalSetu Virtual Interactive Classroom');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                  mode === 'Online'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                💻 Online (Virtual)
              </button>
              <button
                type="button"
                id="signup-mode-inperson"
                onClick={() => {
                  setMode('In-person');
                  setLocationOrCenter('Nearby Child Care & Learning Center');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                  mode === 'In-person'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                🏫 In-Person (Onsite)
              </button>
            </div>
          </div>

          {/* Rewards Callout */}
          <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs text-stone-600 border border-stone-200">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Completion Reward:
            </span>
            <span className="font-bold text-amber-800">
              +{opportunity.creditsReward} Credits &amp; 2 Verified Hours
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Confirming...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
