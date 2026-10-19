import React from 'react';
import { useApp } from '../context/AppContext';
import SmartSpaceLogo from './SmartSpaceLogo';
import { 
  Building2, 
  CalendarCheck2, 
  Clock, 
  ClipboardCheck, 
  BarChart3, 
  FileSpreadsheet, 
  ShieldAlert, 
  FlaskConical, 
  User, 
  Shield, 
  PlusCircle,
  ChevronDown,
  LogOut,
  Home,
  CheckCircle2
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentInstitution,
    allInstitutions,
    setInstitutionId,
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    institutionBookings,
    disclaimerDismissed,
    setDisclaimerDismissed,
    currentUser,
    logout,
  } = useApp();

  const pendingCount = institutionBookings.filter((b) => b.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Prototype & Technopreneurship Disclaimer Banner */}
      {!disclaimerDismissed && (
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border border-amber-500/30">
              Prototype MVP Notice
            </span>
            <span>
              Academic Technopreneurship Case Study 4 validation build. CTU Main Campus is the proposed pilot institution.
            </span>
            <span className="text-slate-400 hidden sm:inline">
              (Not officially adopted or endorsed by any university. Demo data only.)
            </span>
          </div>
          <button
            onClick={() => setDisclaimerDismissed(true)}
            className="text-slate-400 hover:text-white transition-colors text-[11px] underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('landing')}
              className="text-left cursor-pointer transition-opacity hover:opacity-95"
              title="Return to SmartSpace Landing & Demo Login"
            >
              <SmartSpaceLogo size={36} />
            </button>

            {/* Institution Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-slate-200">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Institution Workspace
                </span>
                <div className="relative group">
                  <select
                    value={currentInstitution.id}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    className="text-xs font-semibold text-slate-800 bg-transparent pr-5 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                  >
                    {allInstitutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.shortName} {inst.isPilot ? '(Proposed Pilot)' : '(Demo Workspace)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Center/Right: Role Switcher & 5-User Testing Suite Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 5-User Validation Mode Button */}
            <button
              onClick={() => setActiveView('usability-testing')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'usability-testing'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
              title="Open the 5-User Usability Testing Suite for Technopreneurship Case Study 4"
            >
              <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="hidden sm:inline">Usability Testing</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded font-bold">
                5-User
              </span>
            </button>

            {/* DEMO ROLE SWITCHER */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wider hidden xl:inline">
                Role:
              </span>
              <button
                onClick={() => {
                  setCurrentRole('student');
                  if (activeView === 'admin-requests' || activeView === 'admin-records' || activeView === 'reports') {
                    setActiveView('facilities');
                  } else if (activeView === 'landing') {
                    setActiveView('facilities');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  currentRole === 'student' || currentRole === 'faculty'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Student / Faculty Requester Role"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">User View</span>
              </button>
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  if (activeView === 'new-booking' || activeView === 'my-bookings' || activeView === 'landing') {
                    setActiveView('admin-requests');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Facility Administrator Role"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Admin View</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Demo Login / Landing shortcut */}
            <button
              onClick={() => setActiveView('landing')}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="View Landing & Demo Login Screen"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 py-1 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs">
            {/* Landing link */}
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Landing & Demo Login
            </button>

            {/* Student / Faculty Views */}
            {currentRole !== 'admin' && (
              <>
                <button
                  onClick={() => setActiveView('facilities')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'facilities'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Facility Directory
                </button>

                <button
                  onClick={() => setActiveView('new-booking')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'new-booking'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Request Booking
                </button>

                <button
                  onClick={() => setActiveView('my-bookings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'my-bookings'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CalendarCheck2 className="w-3.5 h-3.5" />
                  My Booking Requests
                  {institutionBookings.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                      {institutionBookings.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Admin Views */}
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveView('admin-requests')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'admin-requests'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  Review Requests
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-900 font-bold rounded-full text-[10px]">
                      {pendingCount} Pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveView('admin-records')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'admin-records'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Reservation Records
                </button>

                <button
                  onClick={() => setActiveView('reports')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'reports'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Utilization Reports
                </button>

                <button
                  onClick={() => setActiveView('facilities')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeView === 'facilities'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Browse Directory
                </button>
              </>
            )}
          </nav>

          {/* Current Workspace Tag */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Workspace: <strong className="text-slate-800">{currentInstitution.shortName}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
