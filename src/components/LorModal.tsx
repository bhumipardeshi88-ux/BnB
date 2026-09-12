import React from 'react';
import { FileText, Printer, Download, X, Heart, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface LorModalProps {
  user: UserProfile;
  onClose: () => void;
}

export function LorModal({ user, onClose }: LorModalProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-stone-100/80 border-b border-stone-200">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Official Letter of Recommendation (LOR)</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Letterhead Body */}
        <div className="p-6 sm:p-8 bg-stone-50/40 text-stone-800 text-xs space-y-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4 font-serif">
            {/* Letterhead header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 font-sans">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 leading-tight">
                    BalSetu National Foundation
                  </h3>
                  <span className="text-[10px] text-stone-500 block">
                    Adoption Support & Youth Education Network
                  </span>
                </div>
              </div>
              <div className="text-right text-[10px] text-stone-500">
                <div>Ref: LOR-BS/{user.id.slice(-6).toUpperCase()}</div>
                <div>Date: {currentDate}</div>
              </div>
            </div>

            {/* Letter content */}
            <div className="space-y-3 pt-2 text-stone-700 leading-relaxed text-[13px]">
              <p className="font-bold font-sans text-stone-900">
                TO WHOM IT MAY CONCERN:
              </p>

              <p>
                It is our pleasure to formally recommend{' '}
                <strong className="font-bold text-stone-900 font-sans">{user.name}</strong> for their
                exemplary service, compassion, and leadership as an educational volunteer with BalSetu.
              </p>

              <p>
                During their tenure, {user.name} has contributed a verified total of{' '}
                <strong className="font-bold text-stone-900 font-sans">
                  {user.verifiedHours || 2} hours
                </strong>{' '}
                of active instruction and mentorship across our child learning sessions. Their ability
                to connect with young learners, adapt curricula to varied learning levels, and foster
                an encouraging learning environment has made an enduring impact on the students.
              </p>

              <p>
                We have consistently observed outstanding punctuality, high emotional intelligence,
                and an unwavering dedication to child empowerment and educational equity.
              </p>

              <p>
                We offer our wholehearted recommendation of {user.name} for any academic,
                professional, or community leadership opportunity.
              </p>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between font-sans">
                <div>
                  <div className="italic font-serif font-bold text-stone-900 text-sm">
                    Ananya Sengupta
                  </div>
                  <div className="text-[11px] text-stone-600 font-medium">Head of Volunteer Programs</div>
                  <div className="text-[10px] text-stone-400">BalSetu Child Care & Education Council</div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Institutional Seal Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print LOR</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
