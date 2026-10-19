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
  User, 
  Shield, 
  ShieldCheck,
  PlusCircle,
  ChevronDown,
  LogOut,
  Home,
  CheckCircle2,
  Layers,
  Sparkles
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
    currentUser,
    logout,
  } = useApp();

  const pendingCount = institutionBookings.filter((b) => b.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar: Brand, Workspace Switcher, and 3-Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Logo & Institutional Workspace */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setActiveView('landing')}
              className="text-left cursor-pointer transition-opacity hover:opacity-95"
              title="Return to SmartSpace Portal"
            >
              <SmartSpaceLogo size={36} showTagline={true} />
            </button>

            {/* University Workspace Selector */}
            {currentRole !== 'super_admin' ? (
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Campus Workspace
                  </span>
                  <div className="relative group">
                    <select
                      value={currentInstitution.id}
                      onChange={(e) => setInstitutionId(e.target.value)}
                      className="text-xs font-bold text-slate-800 bg-transparent pr-5 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                    >
                      {allInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.shortName} {inst.isPilot ? '· Proposed Initial Pilot' : `· ${inst.type}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                    Platform Management
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Multi-University Network ({allInstitutions.length} Campuses)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: 3-Role Demo Switcher & Portal Shortcut */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* THREE ROLE DEMO SWITCHER */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              {/* Role 1: Student / Faculty */}
              <button
                onClick={() => {
                  setCurrentRole('student');
                  if (activeView === 'super-admin' || activeView === 'admin-requests' || activeView === 'admin-facilities' || activeView === 'admin-records' || activeView === 'reports') {
                    setActiveView('facilities');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  currentRole === 'student' || currentRole === 'faculty'
                    ? 'bg-white text-blue-700 shadow-xs font-bold ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
                title="Switch to Student / Faculty Requester Mode"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">User</span>
              </button>

              {/* Role 2: University Facility Administrator */}
              <button
                onClick={() => {
                  setCurrentRole('university_admin');
                  if (activeView === 'super-admin' || activeView === 'new-booking' || activeView === 'my-bookings' || activeView === 'landing') {
                    setActiveView('admin-requests');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  currentRole === 'university_admin' || currentRole === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
                title="Switch to University Facility Administrator Mode"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">University Admin</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Role 3: SmartSpace Super Admin */}
              <button
                onClick={() => {
                  setCurrentRole('super_admin');
                  setActiveView('super-admin');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  currentRole === 'super_admin'
                    ? 'bg-indigo-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
                title="Switch to SmartSpace Super Admin (Platform Level)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                <span className="hidden sm:inline">Super Admin</span>
              </button>
            </div>

            {/* Portal / Landing Shortcut */}
            <button
              onClick={() => setActiveView('landing')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Return to SmartSpace Portal & Role Selection"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1 sm:space-x-1.5 text-xs">
            {/* 1. Student / Faculty Navigation Tabs */}
            {(currentRole === 'student' || currentRole === 'faculty') && (
              <>
                <button
                  onClick={() => setActiveView('facilities')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'facilities'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Browse Facilities</span>
                </button>

                <button
                  onClick={() => setActiveView('new-booking')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'new-booking'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Request Space</span>
                </button>

                <button
                  onClick={() => setActiveView('my-bookings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'my-bookings'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CalendarCheck2 className="w-3.5 h-3.5" />
                  <span>My Booking Requests</span>
                  {institutionBookings.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                      {institutionBookings.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* 2. University Administrator Navigation Tabs */}
            {(currentRole === 'university_admin' || currentRole === 'admin') && (
              <>
                <button
                  onClick={() => setActiveView('admin-requests')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'admin-requests'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Review Requests</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black rounded-full text-[10px]">
                      {pendingCount} Pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveView('admin-facilities')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'admin-facilities'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Manage Spaces</span>
                </button>

                <button
                  onClick={() => setActiveView('admin-records')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'admin-records'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Reservation Records</span>
                </button>

                <button
                  onClick={() => setActiveView('reports')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'reports'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Utilization Reports</span>
                </button>

                <button
                  onClick={() => setActiveView('facilities')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'facilities'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Browse Directory</span>
                </button>
              </>
            )}

            {/* 3. SmartSpace Super Admin Navigation Tabs */}
            {currentRole === 'super_admin' && (
              <>
                <button
                  onClick={() => setActiveView('super-admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeView === 'super-admin'
                      ? 'bg-indigo-700 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Subscribed Universities</span>
                </button>

                <button
                  onClick={() => setActiveView('facilities')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeView === 'facilities'
                      ? 'bg-indigo-700 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cross-Campus Spaces</span>
                </button>
              </>
            )}
          </nav>

          {/* Current Workspace Tag & Pilot Notice */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            {currentRole === 'super_admin' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                Platform Level View
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active: <strong className="text-slate-800">{currentInstitution.shortName}</strong></span>
                {currentInstitution.isPilot && (
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold border border-blue-100">
                    Pilot
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
