import React from 'react';
import { ShieldCheck, ExternalLink, CheckCircle, Clock, FileText, Home, Heart, X } from 'lucide-react';

interface GovernmentGuideModalProps {
  onClose: () => void;
}

export function GovernmentGuideModal({ onClose }: GovernmentGuideModalProps) {
  const steps = [
    {
      num: '1',
      title: 'Online Registration on CARINGS',
      desc: 'Prospective Adoptive Parents (PAPs) register on the official CARA portal (cara.wcd.gov.in) and upload basic KYC documents.',
      icon: <FileText className="w-4 h-4 text-amber-600" />,
    },
    {
      num: '2',
      title: 'Home Study Report (HSR)',
      desc: 'A certified social worker from your designated Specialized Adoption Agency (SAA) conducts a family home study within 2-3 months.',
      icon: <Home className="w-4 h-4 text-amber-600" />,
    },
    {
      num: '3',
      title: 'Referral & Child Matching',
      desc: 'CARA’s automated central system reserves child profile matches strictly in order of seniority and preferences.',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
    },
    {
      num: '4',
      title: 'Court Adoption Order',
      desc: 'The District Magistrate or Family Court issues a legal adoption order, making the child legally yours with full rights.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 font-display">
                Statutory Government Adoption Process
              </h3>
              <span className="text-[11px] text-stone-500">
                Central Adoption Resource Authority (CARA)
              </span>
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
          Under the Juvenile Justice Act 2015, all legal adoptions in India take place solely through CARA. No private individual or agency can directly hand over a child.
        </p>

        {/* 4 Steps */}
        <div className="space-y-2.5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-amber-200/70 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {s.num}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  {s.icon}
                  <span>{s.title}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
          <span className="text-xs font-medium text-amber-950">
            Ready to initiate official statutory registration?
          </span>

          <a
            href="https://cara.wcd.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <span>Visit CARA Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
