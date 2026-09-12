import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Compass,
  Users,
  Building2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AdoptionCenter, AgeRangeLabel } from '../types';

interface AdoptPathProps {
  onSelectCenter: (center: AdoptionCenter) => void;
  onOpenGovGuide: () => void;
}

export function AdoptPath({ onSelectCenter, onOpenGovGuide }: AdoptPathProps) {
  const [centers, setCenters] = useState<AdoptionCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; label: string }>({
    lat: 28.6139,
    lng: 77.209,
    label: 'Auto-detecting...',
  });
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected' | 'fallback'>('detecting');

  // User-specified sorting: "sort by distance, age, or language"
  const [sortBy, setSortBy] = useState<'distance' | 'age' | 'language'>('distance');

  // User-specified filters: "filter by special needs, preferred language, or age range"
  const [filterSpecialNeeds, setFilterSpecialNeeds] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterAgeRange, setFilterAgeRange] = useState<string>('all');

  // Auto-detect user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: 'Your Current Location',
          });
          setLocationStatus('detected');
        },
        (error) => {
          console.log('Location permission denied or unavailable, using regional center', error);
          setUserCoords({
            lat: 28.6139,
            lng: 77.209,
            label: 'New Delhi (Default)',
          });
          setLocationStatus('fallback');
        },
        { timeout: 8000 }
      );
    } else {
      setLocationStatus('fallback');
    }
  }, []);

  // Fetch centers from API based on location & filters
  useEffect(() => {
    async function fetchCenters() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: userCoords.lat.toString(),
          lng: userCoords.lng.toString(),
          sort: sortBy,
          language: filterLanguage,
          specialNeeds: filterSpecialNeeds,
          ageRange: filterAgeRange,
        });

        const res = await fetch(`/api/centers?${params.toString()}`);
        const data = await res.json();
        setCenters(data);
      } catch (err) {
        console.error('Failed to fetch adoption centers', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCenters();
  }, [userCoords, sortBy, filterSpecialNeeds, filterLanguage, filterAgeRange]);

  const setCityPreset = (city: string, lat: number, lng: number) => {
    setUserCoords({ lat, lng, label: city });
    setLocationStatus('detected');
  };

  const ageRangeOptions: { id: string; label: string }[] = [
    { id: 'all', label: 'All Age Ranges' },
    { id: 'Under 2', label: 'Under 2' },
    { id: '2–5', label: '2–5' },
    { id: '6–9', label: '6–9' },
    { id: '10–12', label: '10–12' },
    { id: '13–17', label: '13–17' },
    { id: '18+', label: '18+' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full inline-block backdrop-blur-xs">
            Government Recognized SAA Network
          </span>
          <h1 className="text-2xl font-bold font-display">Nearby Adoption Centers</h1>
          <p className="text-xs text-rose-100 max-w-lg leading-relaxed">
            All adoption in India is strictly governed by the Central Adoption Resource Authority (CARA). Tapping a center displays verified age-range blocks to protect child confidentiality.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="adopt-gov-guide-btn"
              onClick={onOpenGovGuide}
              className="px-3.5 py-1.5 rounded-xl bg-white text-rose-900 text-xs font-bold hover:bg-rose-50 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Official CARA 4-Step Process</span>
            </button>
            <a
              href="https://cara.wcd.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/90 hover:text-white underline underline-offset-4 flex items-center gap-1 font-medium"
            >
              Official CARA Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Auto-detected Location Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Auto-detected Location:</div>
              <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{userCoords.label}</span>
                {locationStatus === 'detected' && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    Active GPS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick city presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 font-medium">Quick City:</span>
            {[
              { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
              { name: 'Delhi', lat: 28.6139, lng: 77.209 },
              { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
              { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
              { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
              { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
            ].map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => setCityPreset(city.name, city.lat, city.lng)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  userCoords.label === city.name
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-600" /> Sort & Filter Centers
          </span>
          <span className="text-[11px] text-stone-500 font-medium">
            {centers.length} center{centers.length === 1 ? '' : 's'} found
          </span>
        </div>

        {/* Sort Chips: sort by distance, age, or language */}
        <div>
          <label className="text-[11px] font-semibold text-stone-600 block mb-1.5 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-stone-400" /> Sort by:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'distance', label: 'Distance (Nearest First)' },
              { id: 'age', label: 'Age (Youngest Groups First)' },
              { id: 'language', label: 'Language' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                id={`sort-btn-${opt.id}`}
                onClick={() => setSortBy(opt.id as any)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium cursor-pointer ${
                  sortBy === opt.id
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns: special needs, preferred language, age range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
          {/* Filter: Special Needs */}
          <div>
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">
              Special Needs
            </label>
            <select
              id="filter-specialneeds-select"
              value={filterSpecialNeeds}
              onChange={(e) => setFilterSpecialNeeds(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:ring-1 focus:ring-amber-500 focus:bg-white outline-hidden font-medium cursor-pointer"
            >
              <option value="all">All (Healthy & Care)</option>
              <option value="none">No Special Needs (Healthy)</option>
              <option value="special">Special Care Support</option>
            </select>
          </div>

          {/* Filter: Preferred Language */}
          <div>
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">
              Preferred Language
            </label>
            <select
              id="filter-language-select"
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:ring-1 focus:ring-amber-500 focus:bg-white outline-hidden font-medium cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="marathi">Marathi</option>
              <option value="kannada">Kannada</option>
              <option value="telugu">Telugu</option>
              <option value="bengali">Bengali</option>
              <option value="gujarati">Gujarati</option>
              <option value="punjabi">Punjabi</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>

          {/* Filter: Age Range */}
          <div>
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">
              Age Range
            </label>
            <select
              id="filter-agerange-select"
              value={filterAgeRange}
              onChange={(e) => setFilterAgeRange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:ring-1 focus:ring-amber-500 focus:bg-white outline-hidden font-medium cursor-pointer"
            >
              {ageRangeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Child Confidentiality & Grouping Standard Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="font-bold">Child Protection & Safety Standard:</strong> Each center detail page presents age-range blocks (Under 2, 2–5, 6–9, 10–12, 13–17, 18+) with shared group details and appointment booking. <em>No names or photographs are published.</em>
        </p>
      </div>

      {/* Centers List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-stone-400 text-sm">
            Locating nearby adoption agencies...
          </div>
        ) : centers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-sm">No centers match your filters</h3>
            <p className="text-xs text-stone-500">
              Try resetting your language or age filters to view all nearby licensed agencies.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterLanguage('all');
                setFilterSpecialNeeds('all');
                setFilterAgeRange('all');
              }}
              className="mt-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          centers.map((center) => {
            const totalChildren = center.childrenCount || center.ageRangeBlocks?.reduce((acc, b) => acc + b.count, 0) || 0;

            return (
              <div
                key={center.id}
                id={`center-card-${center.id}`}
                onClick={() => onSelectCenter(center)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer space-y-3"
              >
                {/* Center Title & SAA License Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Verified SAA
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {center.code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                      {center.name}
                    </h3>

                    <p className="text-xs text-stone-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{center.city}, {center.state}</span>
                      {center.distanceKm !== undefined && (
                        <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                          {center.distanceKm} km away
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-bold">
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      <span>{totalChildren} in Care</span>
                    </div>
                  </div>
                </div>

                {/* Age-Range Blocks Summary Chips */}
                {center.ageRangeBlocks && center.ageRangeBlocks.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                      Age-Range Groups:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {center.ageRangeBlocks.map((b) => (
                        <span
                          key={b.range}
                          className="inline-flex items-center gap-1 text-[11px] bg-stone-50 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 font-medium"
                        >
                          <span className="font-semibold text-stone-900">{b.range}:</span>
                          <span className="text-amber-800 font-bold">{b.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action Row */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 text-[11px]">
                    Languages: <strong className="text-stone-700 font-medium">{center.primaryLanguage || 'Hindi & English'}</strong>
                  </span>

                  <div className="inline-flex items-center gap-1 font-bold text-amber-700 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all">
                    <span>View Age Groups & Book Appointment</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
