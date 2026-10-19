import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SmartSpaceLogo from './SmartSpaceLogo';
import { 
  Building2, 
  CalendarCheck, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  User, 
  Shield, 
  FlaskConical, 
  Lock, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const LandingAndLogin: React.FC = () => {
  const { loginAs, setActiveView, currentInstitution, setInstitutionId, allInstitutions } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your university email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    loginAs(selectedRole, email, selectedRole === 'admin' ? 'Facility Administrator' : 'Demo User');
  };

  const handleQuickDemoEnter = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      loginAs('admin', 'admin.facilities@ctu.edu.ph', 'Engr. R. Santos');
    } else {
      loginAs('student', 'juan.delacruz@ctu.edu.ph', 'Juan Dela Cruz');
    }
  };

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud-Based University Facility Management Platform</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              University Spaces, <br />
              <span className="text-blue-400 underline decoration-blue-500/50 decoration-wavy">
                Booked Smarter.
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-300 italic pt-1">
              “Book It, Track It, Use It.”
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            SmartSpace streamlines university facility discovery, live availability checking, digital booking approvals, and administrative utilization reporting — replacing scattered paper slips, custodian logbooks, and Messenger chats.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleQuickDemoEnter('student')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <User className="w-4 h-4" />
              <span>Enter Demo as Student / Faculty</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleQuickDemoEnter('admin')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-bold border border-slate-700 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Enter Demo as Facility Admin</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
          <div className="w-full h-full border-l border-slate-700 grid grid-cols-3 gap-4 p-8">
            <div className="border border-slate-700 rounded-lg"></div>
            <div className="border border-slate-700 rounded-lg"></div>
            <div className="border border-slate-700 rounded-lg"></div>
            <div className="border border-slate-700 rounded-lg"></div>
            <div className="border border-slate-700 rounded-lg"></div>
            <div className="border border-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Login Card & Platform Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Demo Login Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <SmartSpaceLogo size={36} showTagline={false} />
            <h2 className="text-xl font-bold text-slate-900 pt-3">
              SmartSpace Demo Entry Point
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to experience the role-based reservation workflow.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Simulated Demo Quick-Access Role Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Demo Access Role:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'student' || selectedRole === 'faculty'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-950 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-xs font-bold">User View</div>
                <div className="text-[10px] text-slate-500">Student & Faculty</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-slate-800 bg-slate-900 text-white ring-1 ring-slate-800'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400 mb-1" />
                <div className="text-xs font-bold">Admin View</div>
                <div className="text-[10px] opacity-80">Facility Office</div>
              </button>
            </div>
          </div>

          {/* Interactive Credential Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin.facilities@ctu.edu.ph'
                      : 'juan.delacruz@ctu.edu.ph'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Sign In to Demo Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Autofill Helpers */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              One-Click Instant Access:
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoEnter('student')}
                className="w-full text-left p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs transition-colors flex items-center justify-between cursor-pointer border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enter as <strong>Student Requester</strong> (Juan Dela Cruz)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoEnter('admin')}
                className="w-full text-left p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs transition-colors flex items-center justify-between cursor-pointer border border-slate-300"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-700" />
                  <span>Enter as <strong>Facility Administrator</strong> (Engr. R. Santos)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Prototype Disclosure Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
            <strong className="block font-semibold">Simulated Demo Authentication Notice:</strong>
            <p>
              This login interface simulates user and administrative access for prototype usability evaluation. No real passwords or sensitive credentials are required or stored.
            </p>
          </div>
        </div>

        {/* Right Column: Problem Addressed & Feature Overview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Institutional Pilot Notice */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Pilot Institution Context
              </span>
              <span className="text-xs text-slate-500">Cebu City, Philippines</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Proposed Initial Pilot: {currentInstitution.name} ({currentInstitution.shortName})
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SmartSpace is proposed to serve public and private higher education institutions across Cebu City. CTU Main Campus represents our initial proposed pilot scenario for usability evaluation.
            </p>
            <p className="text-[11px] text-slate-400 italic">
              *Disclaimer: SmartSpace is a proposed technological concept currently undergoing usability and problem-relevance validation. It is not officially endorsed, adopted, or deployed by CTU or any university.
            </p>
          </div>

          {/* The Problem Addressed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              The Problem Being Solved
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-red-700 block">Manual Logbooks & Slips</span>
                <p className="text-slate-600 text-[11px]">
                  Paper forms get lost, signatures take days to collect across offices, and students queue in person to check room availability.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-red-700 block">Double Bookings & Conflicts</span>
                <p className="text-slate-600 text-[11px]">
                  Uncoordinated spreadsheets and Messenger group chats cause simultaneous events in the same lecture hall or lab.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-700 block">SmartSpace Digital Booking</span>
                <p className="text-slate-600 text-[11px]">
                  Online submission with immediate conflict checking, pending status tracking, and verifiable digital permits.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-700 block">Central Utilization Records</span>
                <p className="text-slate-600 text-[11px]">
                  Real-time visibility for facility managers, rejection justification tracking, and automated reporting.
                </p>
              </div>
            </div>
          </div>

          {/* Core Tested Facilities in Demo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Fictional Demo Spaces Included in Validation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block">Lecture Room A</span>
                <span className="text-[11px] text-slate-500">Cap: 40 · Projector & Whiteboard</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block">Computer Lab 1</span>
                <span className="text-[11px] text-slate-500">Cap: 30 · Computers & Projector</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block">Seminar Room B</span>
                <span className="text-[11px] text-slate-500">Cap: 25 · Tables & Chairs</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block">Multipurpose Hall</span>
                <span className="text-[11px] text-slate-500">Cap: 100 · Sound & Projector</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block">Engineering Lab</span>
                <span className="text-[11px] text-slate-500">Cap: 35 · Lab Equipment</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block">Grand Auditorium</span>
                <span className="text-[11px] text-slate-500">Cap: 450 · Full Stage Audio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
