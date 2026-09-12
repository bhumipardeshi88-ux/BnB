import React from 'react';
import { Award, Download, Printer, X, ShieldCheck, Heart } from 'lucide-react';
import { UserProfile } from '../types';

interface CertificateModalProps {
  user: UserProfile;
  onClose: () => void;
}

export function CertificateModal({ user, onClose }: CertificateModalProps) {
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-stone-100/80 border-b border-stone-200">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Official BalSetu Certificate of Volunteering</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Printable & Viewable) */}
        <div className="p-6 sm:p-8 bg-amber-50/40" id="printable-certificate">
          <div className="p-6 sm:p-8 rounded-2xl border-4 border-double border-amber-300 bg-white text-center relative shadow-inner">
            {/* Header Emblems */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg text-stone-900 leading-tight">BalSetu</div>
                <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Child Education & Welfare Initiative
                </div>
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1">
              Certificate of Appreciation & Volunteering
            </span>

            <p className="text-xs text-stone-500 mb-4">This is proudly presented to</p>

            {/* Recipient Name */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight border-b-2 border-amber-200 pb-2 max-w-sm mx-auto">
              {user.name}
            </h2>

            <p className="text-xs text-stone-600 mt-4 leading-relaxed max-w-md mx-auto">
              in grateful recognition of your voluntary dedication towards teaching, mentorship, and educational empowerment for children. You have completed{' '}
              <strong className="text-stone-900 font-bold">
                {user.verifiedHours || 2} verified hours
              </strong>{' '}
              of structured learning support.
            </p>

            {/* Badge & Seal row */}
            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-left text-xs">
              <div>
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Issue Date</div>
                <div className="font-bold text-stone-800">{issueDate}</div>
                <div className="text-[10px] text-stone-400 mt-1">
                  Cert ID: <span className="font-mono">BS-CERT-{user.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>

              {/* Gold Embossed Seal */}
              <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-amber-50 flex flex-col items-center justify-center text-center shadow-xs">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-900 mt-0.5">
                  Verified
                </span>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Authorized By</div>
                <div className="font-serif italic font-bold text-stone-800 text-sm">Dr. M. R. Varma</div>
                <div className="text-[10px] text-stone-500">Director, BalSetu Foundation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official digital verification link embedded</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
