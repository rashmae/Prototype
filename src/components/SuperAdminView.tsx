import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Institution } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  ExternalLink, 
  Settings, 
  Mail, 
  MapPin, 
  Sparkles,
  BarChart3,
  Server,
  Activity,
  Layers,
  ArrowRight,
  X,
  FileCheck2,
  CalendarCheck2,
  ShieldAlert
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { 
    allInstitutions, 
    addInstitution, 
    updateInstitution, 
    setInstitutionId, 
    setCurrentRole, 
    setActiveView, 
    allFacilities, 
    allBookings,
    addToast,
    institutionalRegistrations,
    approveInstitutionalRegistration,
    rejectInstitutionalRegistration,
    demoRequests,
  } = useApp();

  const [adminSection, setAdminSection] = useState<'institutions' | 'pending-registrations' | 'demo-inquiries'>('institutions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInst, setEditingInst] = useState<Institution | null>(null);
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form states for adding a university
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [campus, setCampus] = useState('');
  const [city, setCity] = useState('Cebu City');
  const [instType, setInstType] = useState<'Public' | 'Private'>('Private');
  const [plan, setPlan] = useState<'Pilot' | 'Standard' | 'Enterprise'>('Standard');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Platform metrics
  const totalUniversities = allInstitutions.length;
  const totalFacilities = allFacilities.length;
  const totalBookingsCount = allBookings.length;
  const approvedBookingsCount = allBookings.filter((b) => b.status === 'approved').length;

  const filteredInstitutions = useMemo(() => {
    return allInstitutions.filter((inst) => {
      const matchesSearch = 
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.assignedAdminName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || inst.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [allInstitutions, searchQuery, filterType]);

  const handleRegisterUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortName.trim() || !campus.trim()) {
      addToast('error', 'Missing Information', 'Please complete university name, code, and campus.');
      return;
    }

    addInstitution({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      campus: campus.trim(),
      city: city.trim() || 'Cebu City',
      type: instType,
      isPilot: false,
      status: 'active',
      subscriptionPlan: plan,
      contactName: contactName.trim() || 'Institutional Representative',
      contactEmail: contactEmail.trim() || `contact@${shortName.toLowerCase().replace(/[^a-z]/g, '')}.edu.ph`,
      assignedAdminName: adminName.trim() || 'Facilities Coordinator',
      assignedAdminEmail: adminEmail.trim() || `facilities@${shortName.toLowerCase().replace(/[^a-z]/g, '')}.edu.ph`,
      statusNote: `${plan} Institutional Subscription · Active Workspace`,
    });

    // Reset form
    setName('');
    setShortName('');
    setCampus('');
    setContactName('');
    setContactEmail('');
    setAdminName('');
    setAdminEmail('');
    setShowAddModal(false);
  };

  const handleUpdateUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst) return;

    updateInstitution(editingInst.id, {
      name: editingInst.name,
      shortName: editingInst.shortName,
      campus: editingInst.campus,
      type: editingInst.type,
      subscriptionPlan: editingInst.subscriptionPlan,
      status: editingInst.status,
      contactName: editingInst.contactName,
      contactEmail: editingInst.contactEmail,
      assignedAdminName: editingInst.assignedAdminName,
      assignedAdminEmail: editingInst.assignedAdminEmail,
    });

    setEditingInst(null);
  };

  const handleSwitchToUniversity = (instId: string, roleToAssume: 'university_admin' | 'student') => {
    setInstitutionId(instId);
    setCurrentRole(roleToAssume);
    if (roleToAssume === 'university_admin') {
      setActiveView('admin-requests');
    } else {
      setActiveView('facilities');
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Super Admin Executive Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SmartSpace Platform Super Administrator</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Institutional Subscription & Campus Operations
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Manage participating higher education institutions, provision institutional subscriptions, and authorize university facility administrators across Cebu City.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New University</span>
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2 pl-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Platform Multi-Tenant Network: Healthy</span>
            </div>
          </div>
        </div>

        {/* Backdrop Graphic */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Platform Network KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Subscribed Institutions</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalUniversities}</div>
          <p className="text-[11px] text-slate-500">Public & private universities</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Spaces</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalFacilities}</div>
          <p className="text-[11px] text-slate-500">Across all participating campuses</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Bookings</span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalBookingsCount}</div>
          <p className="text-[11px] text-slate-500">{approvedBookingsCount} confirmed permits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">System Reliability</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">99.98%</div>
          <p className="text-[11px] text-slate-500">Uptime & API health</p>
        </div>
      </div>

      {/* Super Admin Section Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setAdminSection('institutions')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            adminSection === 'institutions'
              ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Active Universities ({allInstitutions.length})</span>
        </button>

        <button
          onClick={() => setAdminSection('pending-registrations')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            adminSection === 'pending-registrations'
              ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-purple-600" />
          <span>Review Institutional Registrations</span>
          {institutionalRegistrations.filter((r) => r.status === 'pending').length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-black">
              {institutionalRegistrations.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminSection('demo-inquiries')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            adminSection === 'demo-inquiries'
              ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Demo Inquiries ({demoRequests.length})</span>
        </button>
      </div>

      {/* SECTION 1: PENDING INSTITUTIONAL REGISTRATIONS QUEUE */}
      {adminSection === 'pending-registrations' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Pending Institutional Onboarding Registrations</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  {institutionalRegistrations.filter((r) => r.status === 'pending').length} Awaiting Authorization
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted institutional accounts. Platform administrator authorization is required before a university workspace is activated.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {institutionalRegistrations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No institutional registrations submitted yet.
              </div>
            ) : (
              institutionalRegistrations.map((req) => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    req.status === 'pending'
                      ? 'border-purple-200 bg-purple-50/30'
                      : req.status === 'approved'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-red-200 bg-red-50/20 opacity-70'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {req.institutionName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {req.institutionType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          Status: {req.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Contact Person:</span>
                          <strong>{req.contactPerson}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Official Email:</span>
                          <span>{req.officialEmail}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Contact Number:</span>
                          <span>{req.contactNumber}</span>
                        </div>
                      </div>

                      {req.notes && (
                        <p className="text-xs text-slate-500 italic bg-white/60 p-2 rounded-lg border border-slate-100">
                          "{req.notes}"
                        </p>
                      )}

                      {req.rejectionReason && (
                        <p className="text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                          <strong>Rejection Justification:</strong> {req.rejectionReason}
                        </p>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => approveInstitutionalRegistration(req.id)}
                          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Authorize & Activate Workspace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const reason = prompt('Please provide reason for declining this institutional registration:');
                            if (reason) rejectInstitutionalRegistration(req.id, reason);
                          }}
                          className="px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: DEMO INQUIRIES QUEUE */}
      {adminSection === 'demo-inquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Institutional Demonstration Inquiries</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                {demoRequests.length} Received
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prospective universities requesting personalized platform presentations.
            </p>
          </div>

          <div className="space-y-3">
            {demoRequests.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{d.institutionName}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {d.estimatedFacilities}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Submitted: {d.submittedAt}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                  <div>Contact: <strong>{d.contactName}</strong> ({d.designation})</div>
                  <div>Email: <strong>{d.contactEmail}</strong></div>
                  <div>Phone: <strong>{d.contactNumber}</strong></div>
                </div>

                {d.message && (
                  <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    "{d.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: UNIVERSITY DIRECTORY (Active Universities) */}
      {adminSection === 'institutions' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Higher Education Institutions
              </h2>
              <p className="text-xs text-slate-500">
                Configure institution accounts, subscription tiers, and authorized facility administrators.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enroll University</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by university name, short code, or admin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Institutions ({allInstitutions.length})
              </button>
              <button
                onClick={() => setFilterType('public')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'public' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setFilterType('private')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'private' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Private
              </button>
            </div>
          </div>
        </div>

        {/* Institutions Grid / List */}
        <div className="divide-y divide-slate-100">
          {filteredInstitutions.map((inst) => {
            const instFacilitiesCount = allFacilities.filter((f) => f.institutionId === inst.id).length;
            const instBookingsCount = allBookings.filter((b) => b.institutionId === inst.id).length;

            return (
              <div key={inst.id} className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-black">
                        {inst.shortName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {inst.name}
                      </h3>
                      {inst.isPilot && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                          Flagship Campus
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inst.type === 'Public' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {inst.type} Institution
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                        Plan: {inst.subscriptionPlan || 'Standard'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {inst.campus}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {inst.contactEmail}
                      </span>
                    </div>

                    {/* Admin Assignment */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Authorized University Facility Administrator:
                        </span>
                        <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{inst.assignedAdminName}</span>
                          <span className="text-slate-400 font-normal">({inst.assignedAdminEmail})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div>
                          <strong className="text-slate-900">{instFacilitiesCount}</strong> Spaces
                        </div>
                        <span className="text-slate-300">·</span>
                        <div>
                          <strong className="text-slate-900">{instBookingsCount}</strong> Bookings
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap lg:flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSwitchToUniversity(inst.id, 'university_admin')}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      title="Open University Facility Administrator Workspace"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Manage Facilities</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleSwitchToUniversity(inst.id, 'student')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      title="View Student / Faculty Experience for this University"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                      <span>User Booking View</span>
                    </button>

                    <button
                      onClick={() => setEditingInst(inst)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3 text-slate-500" />
                      <span>Edit Account</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Add University Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Register New Higher Education Institution</h3>
                <p className="text-xs text-slate-400 mt-0.5">Provision a new SmartSpace multi-tenant university workspace.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterUniversity} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">University Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Southwestern University PHINMA"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Short Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SWU"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Campus Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Urgello St, Sambag I, Cebu City"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Institution Type</label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value as 'Public' | 'Private')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Private">Private Institution</option>
                    <option value="Public">Public / State University</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subscription Tier</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Standard">Standard Campus Plan</option>
                    <option value="Enterprise">Enterprise Multi-Campus Plan</option>
                    <option value="Pilot">Pilot Agreement</option>
                  </select>
                </div>
              </div>

              {/* Authorized Administrator Credentials */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <span className="text-xs font-bold text-indigo-900 block">
                  Assign Initial University Administrator
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Admin Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Engr. Mark Alcantara"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Admin Email</label>
                    <input
                      type="email"
                      placeholder="e.g. facilities@swu.edu.ph"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Enroll University</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit University Modal */}
      {editingInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Edit Institutional Configuration</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editingInst.name} ({editingInst.shortName})</p>
              </div>
              <button
                onClick={() => setEditingInst(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUniversity} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">University Name</label>
                <input
                  type="text"
                  value={editingInst.name}
                  onChange={(e) => setEditingInst({ ...editingInst, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subscription Tier</label>
                  <select
                    value={editingInst.subscriptionPlan || 'Standard'}
                    onChange={(e) => setEditingInst({ ...editingInst, subscriptionPlan: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Pilot">Pilot Agreement</option>
                    <option value="Standard">Standard Campus</option>
                    <option value="Enterprise">Enterprise Multi-Campus</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Account Status</label>
                  <select
                    value={editingInst.status}
                    onChange={(e) => setEditingInst({ ...editingInst, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="active">Active Subscription</option>
                    <option value="trial">Evaluation Trial</option>
                    <option value="inactive">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">Assigned University Administrator</span>
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={editingInst.assignedAdminName}
                  onChange={(e) => setEditingInst({ ...editingInst, assignedAdminName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg mb-2"
                />
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={editingInst.assignedAdminEmail}
                  onChange={(e) => setEditingInst({ ...editingInst, assignedAdminEmail: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingInst(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
