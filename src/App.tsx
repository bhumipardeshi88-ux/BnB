import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { RoleSelection } from './components/RoleSelection';
import { AdoptPath } from './components/AdoptPath';
import { CenterDetails } from './components/CenterDetails';
import { VolunteerPath } from './components/VolunteerPath';
import { VolunteerOpportunities } from './components/VolunteerOpportunities';
import { VolunteerSignupModal } from './components/VolunteerSignupModal';
import { DonationModal } from './components/DonationModal';
import { CertificateModal } from './components/CertificateModal';
import { LorModal } from './components/LorModal';
import { GovernmentGuideModal } from './components/GovernmentGuideModal';
import { AdoptionCenter, UserProfile, VolunteerOpportunity } from './types';
import { VOLUNTEER_OPPORTUNITIES } from './data/seedData';

type ViewState =
  | { type: 'auth' }
  | { type: 'role_select' }
  | { type: 'adopt_list' }
  | { type: 'center_detail'; center: AdoptionCenter }
  | { type: 'volunteer_dashboard' }
  | { type: 'volunteer_opportunities' };

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check saved local session or start as null
    try {
      const saved = localStorage.getItem('balsetu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation History Stack: Ensures clicking Back goes back 1 step only, not jumping home!
  const [history, setHistory] = useState<ViewState[]>(() => {
    try {
      const saved = localStorage.getItem('balsetu_user');
      if (saved) {
        return [{ type: 'role_select' }];
      }
    } catch {
      // fallback
    }
    return [{ type: 'auth' }];
  });

  // Modals state
  const [activeOpportunity, setActiveOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showLorModal, setShowLorModal] = useState(false);
  const [showGovGuideModal, setShowGovGuideModal] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('balsetu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('balsetu_user');
    }
  }, [user]);

  // Push new view to history
  const pushView = (newView: ViewState) => {
    setHistory((prev) => [...prev, newView]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pop view: goes back exactly 1 step!
  const popView = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    if (!user) {
      setHistory([{ type: 'auth' }]);
    } else {
      setHistory([{ type: 'role_select' }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setHistory([{ type: 'role_select' }]);
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([{ type: 'auth' }]);
  };

  const currentView = history[history.length - 1] || { type: 'auth' };
  const canGoBack = history.length > 1;

  // Title hint for navbar
  const getCurrentTitle = (): string => {
    switch (currentView.type) {
      case 'adopt_list':
        return 'Adoption Centers';
      case 'center_detail':
        return currentView.center.name;
      case 'volunteer_dashboard':
        return 'Volunteer Hub';
      case 'volunteer_opportunities':
        return 'Opportunities';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2A26] font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        user={user}
        canGoBack={canGoBack}
        onBack={popView}
        onLogout={handleLogout}
        onOpenProfile={() => {
          if (user) {
            pushView({ type: 'volunteer_dashboard' });
          }
        }}
        currentTitle={getCurrentTitle()}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView.type === 'auth' && (
          <AuthModal onSuccess={handleLoginSuccess} />
        )}

        {currentView.type === 'role_select' && user && (
          <RoleSelection
            user={user}
            onSelectAdopt={() => pushView({ type: 'adopt_list' })}
            onSelectVolunteer={() => pushView({ type: 'volunteer_dashboard' })}
          />
        )}

        {currentView.type === 'adopt_list' && (
          <AdoptPath
            onSelectCenter={(center) => pushView({ type: 'center_detail', center })}
            onOpenGovGuide={() => setShowGovGuideModal(true)}
          />
        )}

        {currentView.type === 'center_detail' && (
          <CenterDetails
            center={currentView.center}
            currentUser={user}
            onOpenGovGuide={() => setShowGovGuideModal(true)}
          />
        )}

        {currentView.type === 'volunteer_dashboard' && user && (
          <VolunteerPath
            user={user}
            onSelectDonate={() => setShowDonationModal(true)}
            onSelectTeach={() => pushView({ type: 'volunteer_opportunities' })}
            onOpenCertificate={() => setShowCertModal(true)}
            onOpenLor={() => setShowLorModal(true)}
            onUpdateUser={(updated) => setUser(updated)}
          />
        )}

        {currentView.type === 'volunteer_opportunities' && (
          <VolunteerOpportunities
            opportunities={VOLUNTEER_OPPORTUNITIES}
            onSelectOpportunity={(opp) => setActiveOpportunity(opp)}
          />
        )}
      </main>

      {/* Modals */}
      {activeOpportunity && user && (
        <VolunteerSignupModal
          opportunity={activeOpportunity}
          userEmail={user.email}
          onClose={() => setActiveOpportunity(null)}
          onSuccess={(updatedUser) => {
            setUser(updatedUser);
            setActiveOpportunity(null);
            // Return to volunteer dashboard to see the new scheduled session!
            setHistory([{ type: 'role_select' }, { type: 'volunteer_dashboard' }]);
          }}
        />
      )}

      {showDonationModal && user && (
        <DonationModal
          userEmail={user.email}
          userName={user.name}
          onClose={() => setShowDonationModal(false)}
          onSuccess={(_donation, updatedUser) => {
            if (updatedUser) setUser(updatedUser);
          }}
        />
      )}

      {showCertModal && user && (
        <CertificateModal user={user} onClose={() => setShowCertModal(false)} />
      )}

      {showLorModal && user && (
        <LorModal user={user} onClose={() => setShowLorModal(false)} />
      )}

      {showGovGuideModal && (
        <GovernmentGuideModal onClose={() => setShowGovGuideModal(false)} />
      )}
    </div>
  );
}
