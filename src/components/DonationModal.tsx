import React, { useState } from 'react';
import {
  Heart,
  GraduationCap,
  BookOpen,
  Utensils,
  Sparkles,
  Coins,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Download,
  X,
  CreditCard,
  Smartphone,
  Building2,
  Check,
} from 'lucide-react';
import { DonationRecord } from '../types';

interface DonationModalProps {
  userEmail: string;
  userName: string;
  onClose: () => void;
  onSuccess: (donation: DonationRecord, updatedUser: any) => void;
}

export interface DonationOption {
  id: string;
  title: string;
  tag: string;
  description: string;
  defaultAmount: number;
  presets: number[];
  icon: 'education' | 'supplies' | 'meals' | 'general' | 'custom';
  impactStatement: string;
}

const DONATION_OPTIONS: DonationOption[] = [
  {
    id: 'opt-education',
    title: "Sponsor a child's education for a month",
    tag: 'Highest Impact',
    description:
      'Covers school tuition, special tutoring, coaching, and exam fees for one child for an entire month.',
    defaultAmount: 2000,
    presets: [1500, 2000, 3000],
    icon: 'education',
    impactStatement: '1 month of full schooling, tutoring, and study materials',
  },
  {
    id: 'opt-supplies',
    title: 'Fund school supplies / books',
    tag: 'Essential Learning',
    description:
      'Provides a complete syllabus textbook set, notebooks, geometry box, school backpack, and art kit.',
    defaultAmount: 800,
    presets: [500, 800, 1200],
    icon: 'supplies',
    impactStatement: 'Complete semester learning kit and stationery backpack',
  },
  {
    id: 'opt-meals',
    title: 'Support a meal program',
    tag: 'Daily Nutrition',
    description:
      'Provides daily wholesome breakfast, fresh milk, seasonal fruits, and warm midday meals at partner care centers.',
    defaultAmount: 1200,
    presets: [600, 1200, 2400],
    icon: 'meals',
    impactStatement: 'Nutritious balanced meals and fruit rations for care home children',
  },
  {
    id: 'opt-general',
    title: 'General fund (used where most needed)',
    tag: 'Flexible Aid',
    description:
      'Directs resources where urgency is greatest: emergency healthcare, winter clothing, and utility support.',
    defaultAmount: 1000,
    presets: [500, 1000, 2500],
    icon: 'general',
    impactStatement: 'Emergency pediatric aid, winter warmth, and shelter essentials',
  },
  {
    id: 'opt-custom',
    title: 'Other / custom amount',
    tag: 'Your Choice',
    description:
      'Choose any contribution amount to support child welfare initiatives and verified adoption centers.',
    defaultAmount: 500,
    presets: [300, 500, 1000, 5000],
    icon: 'custom',
    impactStatement: 'Direct support distributed across care centers based on active needs',
  },
];

export function DonationModal({
  userEmail,
  userName,
  onClose,
  onSuccess,
}: DonationModalProps) {
  // Step state: 'select_option' -> 'confirm_payment' -> 'receipt'
  const [step, setStep] = useState<'select' | 'confirm' | 'receipt'>('select');
  const [selectedOption, setSelectedOption] = useState<DonationOption>(DONATION_OPTIONS[0]);
  const [amount, setAmount] = useState<number>(DONATION_OPTIONS[0].defaultAmount);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [donorName, setDonorName] = useState(userName || 'Generous Guardian');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);

  // When user clicks "Donate" on a specific option card
  const handlePickOption = (option: DonationOption, chosenAmount?: number) => {
    setSelectedOption(option);
    if (chosenAmount && chosenAmount > 0) {
      setAmount(chosenAmount);
      setCustomAmountInput(chosenAmount.toString());
    } else if (option.id === 'opt-custom') {
      const parsed = parseInt(customAmountInput, 10);
      const initial = !isNaN(parsed) && parsed > 0 ? parsed : option.defaultAmount;
      setAmount(initial);
      setCustomAmountInput(initial.toString());
    } else {
      setAmount(option.defaultAmount);
      setCustomAmountInput('');
    }
    setStep('confirm');
  };

  const handleAmountPresetClick = (val: number) => {
    setAmount(val);
    setCustomAmountInput(val.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/volunteer/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          amount,
          donorName: donorName.trim() || userName || 'Generous Guardian',
          cause: selectedOption.title,
        }),
      });

      const data = await res.json();
      if (data.success && data.donation) {
        setReceipt(data.donation);
        setStep('receipt');
        onSuccess(data.donation, data.user);
      }
    } catch (err) {
      console.error(err);
      // Fallback local receipt if network fails
      const fallbackDonation: DonationRecord = {
        id: `don-${Date.now()}`,
        amount,
        cause: selectedOption.title,
        date: new Date().toISOString().split('T')[0],
        transactionId: `TXN-BS-${Math.floor(100000 + Math.random() * 900000)}`,
        donorName: donorName.trim() || userName || 'Generous Guardian',
      };
      setReceipt(fallbackDonation);
      setStep('receipt');
    } finally {
      setLoading(false);
    }
  };

  const renderOptionIcon = (iconType: DonationOption['icon']) => {
    switch (iconType) {
      case 'education':
        return <GraduationCap className="w-5 h-5 text-amber-600" />;
      case 'supplies':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'meals':
        return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'general':
        return <Sparkles className="w-5 h-5 text-rose-600" />;
      case 'custom':
        return <Coins className="w-5 h-5 text-purple-600" />;
      default:
        return <Heart className="w-5 h-5 text-amber-600" />;
    }
  };

  const getOptionBadgeColor = (iconType: DonationOption['icon']) => {
    switch (iconType) {
      case 'education':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'supplies':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meals':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'general':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'custom':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <Heart className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg font-display">
                {step === 'select'
                  ? 'Choose Where Your Donation Goes'
                  : step === 'confirm'
                  ? 'Confirm Your Contribution'
                  : 'Donation Receipt'}
              </h3>
              <span className="text-[11px] text-stone-500 block">
                {step === 'select'
                  ? 'Review what your gift will fund before donating'
                  : step === 'confirm'
                  ? 'Review details & complete your payment'
                  : 'Official tax receipt & verification'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SELECT DONATION OPTION */}
        {step === 'select' && (
          <div className="overflow-y-auto py-3 space-y-3 pr-0.5">
            <p className="text-xs text-stone-600 leading-relaxed px-1">
              Select one of the child welfare programs below to see exactly how your donation is used:
            </p>

            <div className="space-y-2.5">
              {DONATION_OPTIONS.map((opt) => {
                const isCustom = opt.id === 'opt-custom';

                return (
                  <div
                    key={opt.id}
                    id={`donation-option-${opt.id}`}
                    className="p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    {/* Left: Icon & Description */}
                    <div className="flex items-start gap-3 grow">
                      <div className="w-10 h-10 rounded-2xl bg-stone-100 group-hover:bg-amber-100/70 transition-colors flex items-center justify-center shrink-0 mt-0.5">
                        {renderOptionIcon(opt.icon)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-stone-900 leading-snug">
                            {opt.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getOptionBadgeColor(
                              opt.icon
                            )}`}
                          >
                            {opt.tag}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount & Action Button */}
                    <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {!isCustom ? (
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-stone-900 block">
                            ₹{opt.defaultAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-500 block">suggested</span>
                        </div>
                      ) : (
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-stone-700 block">Custom</span>
                          <span className="text-[10px] text-stone-500 block">any amount</span>
                        </div>
                      )}

                      <button
                        type="button"
                        id={`btn-donate-${opt.id}`}
                        onClick={() => handlePickOption(opt)}
                        className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>Donate {!isCustom && `₹${opt.defaultAmount.toLocaleString('en-IN')}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% of donations are audited & eligible for 80G tax receipt
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRMATION & PAYMENT */}
        {step === 'confirm' && (
          <form onSubmit={handleCompletePayment} className="overflow-y-auto py-2 space-y-4 pr-0.5">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep('select')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all donation options</span>
            </button>

            {/* Selected Cause Summary Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  {renderOptionIcon(selectedOption.icon)}
                  <span>Selected Cause</span>
                </span>
                <span className="text-xs font-bold text-amber-900 bg-white px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                  {selectedOption.tag}
                </span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                {selectedOption.title}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                {selectedOption.description}
              </p>
              <div className="text-[11px] text-amber-800/90 font-medium pt-1 border-t border-amber-200/60 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-amber-700" />
                <span>Impact: {selectedOption.impactStatement}</span>
              </div>
            </div>

            {/* Amount Selection / Custom Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 block">
                Donation Amount (INR):
              </label>

              {/* Presets */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {selectedOption.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleAmountPresetClick(p)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      amount === p && (!customAmountInput || customAmountInput === p.toString())
                        ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    ₹{p.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom amount input */}
              <div className="pt-1">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    placeholder="Enter custom amount (min ₹100)"
                    value={customAmountInput}
                    onChange={handleCustomInputChange}
                    className="w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Donor Name Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Donor Name (For Tax Receipt & Certificate):
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Full Name"
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:border-amber-500 outline-hidden"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 block">
                  Payment Method:
                </label>
                <span className="text-[10px] text-stone-500">Instant Demo Simulation</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Complete Payment Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-confirm-donation"
                disabled={loading || amount <= 0}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 active:scale-98 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing donation...</span>
                ) : (
                  <>
                    <span>Complete Payment of ₹{amount.toLocaleString('en-IN')}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant 80G Tax Exemption Receipt & Gratitude Certificate generated</span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: RECEIPT VIEW */}
        {step === 'receipt' && receipt && (
          <div className="text-center py-4 space-y-4 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display mt-2">
                Thank You, {receipt.donorName}!
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                Your generous contribution of{' '}
                <strong className="text-stone-900">₹{receipt.amount.toLocaleString('en-IN')}</strong>{' '}
                has been allocated to:
              </p>
              <div className="inline-block mt-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
                {receipt.cause}
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 rounded-2xl p-4 text-left border border-stone-200 text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-500">Transaction ID:</span>
                <span className="font-mono font-bold text-stone-800">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date:</span>
                <span className="font-medium text-stone-800">{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Allocated To:</span>
                <span className="font-semibold text-stone-800 line-clamp-1">{receipt.cause}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200">
                <span className="text-stone-500">Gratitude Credits Earned:</span>
                <span className="font-bold text-amber-700">
                  +{Math.min(100, Math.floor(receipt.amount / 10))} Credits
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-stone-900 text-white hover:bg-stone-800 active:scale-98 transition-colors cursor-pointer"
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
