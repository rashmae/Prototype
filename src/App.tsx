import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingAndLogin } from './components/LandingAndLogin';
import { FacilityDirectory } from './components/FacilityDirectory';
import { BookingForm } from './components/BookingForm';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminRequestsView } from './components/AdminRequestsView';
import { AdminRecordsView } from './components/AdminRecordsView';
import { UtilizationReportsView } from './components/UtilizationReportsView';
import { UsabilityTestingModule } from './components/UsabilityTestingModule';
import { ToastContainer } from './components/ToastContainer';
import SmartSpaceLogo from './components/SmartSpaceLogo';
import { 
  Building2, 
  ShieldCheck, 
  CalendarCheck, 
  Users, 
  FlaskConical,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, currentInstitution, currentRole, setCurrentRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Global Navigation Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'landing' && <LandingAndLogin />}
        {activeView === 'facilities' && <FacilityDirectory />}
        {activeView === 'new-booking' && <BookingForm />}
        {activeView === 'my-bookings' && <MyBookingsView />}
        {activeView === 'admin-requests' && <AdminRequestsView />}
        {activeView === 'admin-records' && <AdminRecordsView />}
        {activeView === 'reports' && <UtilizationReportsView />}
        {activeView === 'usability-testing' && <UsabilityTestingModule />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <SmartSpaceLogo size={28} showTagline={true} />
              <p className="text-[11px] text-slate-400 mt-1">
                Institutional Facility Reservation & Resource Management SaaS Platform.
              </p>
            </div>

            {/* Quick Demo Navigation */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => {
                  setCurrentRole('student');
                  setActiveView('facilities');
                }}
                className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Browse Facilities
              </button>
              <button
                onClick={() => {
                  setCurrentRole('student');
                  setActiveView('new-booking');
                }}
                className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Book Space
              </button>
              <button
                onClick={() => {
                  setCurrentRole('student');
                  setActiveView('my-bookings');
                }}
                className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                My Requests
              </button>
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setActiveView('admin-requests');
                }}
                className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Admin Review
              </button>
              <button
                onClick={() => setActiveView('usability-testing')}
                className="text-amber-700 font-semibold hover:text-amber-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>5-User Validation Suite</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>
              Technopreneurship Case Study 4 MVP Prototype · Active Workspace: <strong className="text-slate-600">{currentInstitution.name}</strong>
            </p>
            <p>
              Notice: Prototype for academic validation. Not officially adopted or endorsed by any university.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
