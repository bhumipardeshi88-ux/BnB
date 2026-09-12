import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  HeartHandshake,
  FileCheck,
  Info,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';
import { AdoptionCenter, AgeRangeBlock, AgeRangeLabel, UserProfile, AppointmentBooking } from '../types';

interface CenterDetailsProps {
  center: AdoptionCenter;
  currentUser?: UserProfile | null;
  onOpenGovGuide: () => void;
}

export function CenterDetails({ center, currentUser, onOpenGovGuide }: CenterDetailsProps) {
  const [selectedBlock, setSelectedBlock] = useState<AgeRangeBlock | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Form state
  const [parentName, setParentName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<AppointmentBooking | null>(null);
  const [formError, setFormError] = useState('');

  // Minimum selectable date: tomorrow
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleOpenBooking = (block: AgeRangeBlock) => {
    setSelectedBlock(block);
    setFormError('');
    setBookedAppointment(null);
    setShowBookingModal(true);
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setSelectedBlock(null);
    setBookedAppointment(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim() || !email.trim() || !preferredDate) {
      setFormError('Please fill in your name, contact phone, email, and preferred date.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    // Instant confirmation with local appointment state
    setTimeout(() => {
      setBookedAppointment({
        id: `bk-${Date.now()}`,
        centerId: center.id,
        centerName: center.name,
        ageRange: selectedBlock?.range || 'Under 2',
        parentName,
        phone,
        email,
        preferredDate,
        preferredTimeSlot: preferredTimeSlot || '10:00 AM - 11:30 AM',
        notes,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      });
      setSubmitting(false);
    }, 400);
  };

  // Ensure all 6 age ranges are represented in order:
  // Under 2, 2–5, 6–9, 10–12, 13–17, 18+
  const targetRanges: AgeRangeLabel[] = ['Under 2', '2–5', '6–9', '10–12', '13–17', '18+'];

  const blocksToDisplay: AgeRangeBlock[] = targetRanges.map((range) => {
    const existing = center.ageRangeBlocks?.find((b) => b.range === range);
    if (existing) return existing;
    return {
      range,
      count: 0,
      gender: 'Gender distribution updated upon intake',
      preferredLanguage: center.primaryLanguage || 'Regional Language',
      ethnicity: 'Indian',
      specialNeeds: 'None (Regular Pediatric Care)',
    };
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Center Overview Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Licensed Specialized Adoption Agency
              </span>
              <span className="text-xs text-stone-500 font-mono font-medium">
                Registration: {center.code}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              {center.name}
            </h1>

            <p className="text-xs text-stone-600 flex items-start gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{center.address}</span>
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <a
              href={`tel:${center.contactNumber}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-stone-600" />
              <span>{center.contactNumber}</span>
            </a>
            {center.distanceKm !== undefined && (
              <span className="text-[11px] font-bold text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
                {center.distanceKm} km from you
              </span>
            )}
          </div>
        </div>

        {/* Official Statutory Government Adoption Process Link */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-700" />
              <span>Official Government Adoption Process (CARA)</span>
            </span>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              All adoptions are strictly governed under the Juvenile Justice Act 2015. No direct child handovers are permitted outside CARA.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="center-gov-guide-link"
              onClick={onOpenGovGuide}
              className="text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>View 4-Step Process</span>
            </button>

            <a
              id="center-cara-direct-link"
              href={center.governmentPortalUrl || 'https://cara.wcd.gov.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>CARA Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Child Privacy & Safety Banner */}
      <div className="bg-stone-100/90 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-stone-900">
            Age-Range Groups Policy (Child Safety Standard)
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            In compliance with child privacy laws, we display age-range blocks instead of individual child profiles with <strong>no names, no photos, and no individual dossiers</strong>. This keeps children safe and avoids confusion when several kids share the same age and language. Book an appointment to visit the orphanage and meet the adoption counselor.
          </p>
        </div>
      </div>

      {/* Age-Range Blocks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Children Under Care by Age Range
            </h2>
          </div>
          <span className="text-xs font-medium text-stone-500">
            Total: {center.childrenCount} children
          </span>
        </div>

        {/* 6 Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blocksToDisplay.map((block) => (
            <div
              key={block.range}
              id={`block-${block.range.replace(/\s+/g, '-').replace('+', 'plus')}`}
              className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header: Age Range & Child Count */}
              <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md inline-block mb-1">
                    Age Group
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 font-display">
                    {block.range}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{block.count} {block.count === 1 ? 'Child' : 'Children'}</span>
                  </span>
                </div>
              </div>

              {/* Shared Details for this Group: Gender, Language, Ethnicity, Special Needs */}
              <div className="space-y-2 text-xs">
                {/* Gender */}
                <div className="flex items-start justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-500 font-medium">Gender:</span>
                  <span className="font-semibold text-stone-900 text-right">{block.gender}</span>
                </div>

                {/* Preferred Language */}
                <div className="flex items-start justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-500 font-medium">Preferred Language:</span>
                  <span className="font-semibold text-stone-900 text-right">{block.preferredLanguage}</span>
                </div>

                {/* Ethnicity */}
                <div className="flex items-start justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-500 font-medium">Ethnicity:</span>
                  <span className="font-semibold text-stone-900 text-right">{block.ethnicity}</span>
                </div>

                {/* Special Needs / Disabilities */}
                <div className="flex items-start justify-between py-1">
                  <span className="text-stone-500 font-medium">Special Needs / Care:</span>
                  <span className={`font-semibold text-right text-[11px] max-w-[65%] ${
                    block.specialNeeds.toLowerCase().startsWith('none')
                      ? 'text-emerald-700'
                      : 'text-amber-800'
                  }`}>
                    {block.specialNeeds}
                  </span>
                </div>
              </div>

              {/* "Book an Appointment" Button */}
              <div className="pt-2">
                <button
                  type="button"
                  id={`btn-book-apt-${block.range.replace(/\s+/g, '-').replace('+', 'plus')}`}
                  onClick={() => handleOpenBooking(block)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span>Book an Appointment ({block.range})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Short Form Modal: Book an Appointment */}
      {showBookingModal && selectedBlock && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-auto space-y-5">
            {!bookedAppointment ? (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      Orphanage Visit Request
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-display">
                      Book an Appointment
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {center.name} • Group: <strong className="text-stone-800">{selectedBlock.range}</strong> ({selectedBlock.count} children)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Clarification Notice */}
                <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    The orphanage adoption counselor will contact you directly via phone or email to confirm the appointment and guide you on the official CARA registration process.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Form Fields: Contact details and preferred date */}
                <div className="space-y-3">
                  {/* Parent Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Parent / Guardian Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Priya & Rajesh Sharma"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                    />
                  </div>

                  {/* Phone & Email in grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. priya@example.com"
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Preferred Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Preferred Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        min={tomorrowStr}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={preferredTimeSlot}
                        onChange={(e) => setPreferredTimeSlot(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden bg-white"
                      >
                        <option>Morning (10:00 AM - 1:00 PM)</option>
                        <option>Afternoon (2:00 PM - 5:00 PM)</option>
                        <option>Weekend Consultation</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Notes or CARA ID */}
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      CARA Registration ID or Questions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Registered with CARA ID #DL-PAP-2026 or need guidance on Home Study Report (HSR)"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden resize-none"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Request Appointment'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success confirmation */
              <div className="text-center py-2 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-2xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-base font-display">
                    Appointment Request Received!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    The adoption counselor at <strong className="text-stone-800">{center.name}</strong> will contact you directly at <strong className="text-stone-800">{bookedAppointment.phone}</strong> or <strong className="text-stone-800">{bookedAppointment.email}</strong> to confirm the date and time.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 font-mono text-[11px]">
                  <div><strong>Booking Ref:</strong> {bookedAppointment.id}</div>
                  <div><strong>Age Group:</strong> {bookedAppointment.ageRange}</div>
                  <div><strong>Requested Date:</strong> {bookedAppointment.preferredDate} ({bookedAppointment.preferredTimeSlot})</div>
                  <div><strong>Status:</strong> <span className="text-amber-700 font-bold">{bookedAppointment.status}</span></div>
                </div>

                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Please keep your KYC identification and any prior CARING portal paperwork handy when the agency calls.
                </p>

                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
