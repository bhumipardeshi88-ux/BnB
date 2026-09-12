import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle, ShieldCheck, Download, X } from 'lucide-react';
import { DonationRecord } from '../types';

interface DonationModalProps {
  userEmail: string;
  userName: string;
  onClose: () => void;
  onSuccess: (donation: DonationRecord, updatedUser: any) => void;
}

const PRESET_AMOUNTS = [
  { value: 500, label: '₹500', desc: '1 Term Books & Art Kit' },
  { value: 1200, label: '₹1,200', desc: 'Uniform, Bag & Exam Fees' },
  { value: 2500, label: '₹2,500', desc: 'Full Year Education Sponsorship' },
];

export function DonationModal({
  userEmail,
  userName,
  onClose,
  onSuccess,
}: DonationModalProps) {
  const [amount, setAmount] = useState<number>(1200);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(userName || '');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/volunteer/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          amount,
          donorName: donorName || 'Generous Guardian',
          cause:
            amount >= 2500
              ? 'Full Year Comprehensive Educational Sponsorship'
              : amount >= 1200
              ? 'Uniform, School Bag & Study Supplies Kit'
              : 'Learning Books & Creative Art Materials',
        }),
      });

      const data = await res.json();
      if (data.success && data.donation) {
        setReceipt(data.donation);
        onSuccess(data.donation, data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        {!receipt ? (
          <form onSubmit={handleDonate} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    Fund a Child's Education
                  </h3>
                  <span className="text-[11px] text-stone-500">Fast 30-Second Donation</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              100% of your donation directly provides learning textbooks, stationery kits, and school uniforms for children awaiting adoption.
            </p>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Select Sponsorship Amount:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectPreset(item.value)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      amount === item.value && !customAmount
                        ? 'border-amber-500 bg-amber-50 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900">{item.label}</div>
                    <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="pt-1">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    placeholder="Or enter custom amount in INR"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Donor Name */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Donor Name (For Tax Receipt)
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Full Legal Name"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:border-amber-500 outline-hidden"
              />
            </div>

            {/* Quick Payment Action */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-confirm-donation"
                disabled={loading || amount <= 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-bold text-sm hover:from-amber-700 hover:to-rose-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing secure gift...</span>
                ) : (
                  <>
                    <span>Donate ₹{amount.toLocaleString('en-IN')} Now</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant 80G Tax Exemption Receipt & Gratitude Certificate</span>
              </div>
            </div>
          </form>
        ) : (
          /* Instant Receipt View */
          <div className="text-center py-2 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Payment Successful
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display mt-1">
                Thank You, {receipt.donorName}!
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                Your generous gift of ₹{receipt.amount.toLocaleString('en-IN')} has been pledged to{' '}
                <strong className="text-stone-800">{receipt.cause}</strong>.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3 text-left border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Transaction ID:</span>
                <span className="font-mono font-bold text-stone-800">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date:</span>
                <span className="font-medium text-stone-800">{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Gratitude Credits Earned:</span>
                <span className="font-bold text-amber-700">+{Math.min(100, Math.floor(receipt.amount / 10))} Credits</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-stone-900 text-white hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
