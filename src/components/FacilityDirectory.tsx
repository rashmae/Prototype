import React, { useState, useMemo } from 'react';
import { Facility, FacilityType } from '../types';
import { useApp } from '../context/AppContext';
import { FacilityDetailModal } from './FacilityDetailModal';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Clock, 
  CalendarDays, 
  ArrowRight,
  Info,
  Sparkles,
  Building
} from 'lucide-react';

export const FacilityDirectory: React.FC = () => {
  const { 
    institutionFacilities, 
    currentInstitution, 
    setSelectedFacility, 
    setActiveView 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [capacityFilter, setCapacityFilter] = useState<string>('All');
  const [detailModalFacility, setDetailModalFacility] = useState<Facility | null>(null);

  const facilityTypes: ('All' | FacilityType)[] = [
    'All',
    'Lecture Room',
    'Computer Laboratory',
    'Conference Room',
    'University Auditorium',
    'Student Activity Room',
    'Multimedia Presentation Hall',
  ];

  const filteredFacilities = useMemo(() => {
    return institutionFacilities.filter((f) => {
      // Type match
      if (selectedType !== 'All' && f.type !== selectedType) {
        return false;
      }

      // Capacity match
      if (capacityFilter === '1-30' && f.capacity > 30) return false;
      if (capacityFilter === '31-60' && (f.capacity < 31 || f.capacity > 60)) return false;
      if (capacityFilter === '61-100' && (f.capacity < 61 || f.capacity > 100)) return false;
      if (capacityFilter === '100+' && f.capacity < 100) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesBuilding = f.building.toLowerCase().includes(q);
        const matchesEquipment = f.equipment.some((eq) => eq.toLowerCase().includes(q));
        const matchesDesc = f.description.toLowerCase().includes(q);
        return matchesName || matchesBuilding || matchesEquipment || matchesDesc;
      }

      return true;
    });
  }, [institutionFacilities, selectedType, capacityFilter, searchQuery]);

  const handleBookNow = (facility: Facility, initialDate?: string, startTime?: string, endTime?: string) => {
    setSelectedFacility(facility);
    setActiveView('new-booking');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner / Workspace Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Building className="w-3.5 h-3.5" />
            <span>{currentInstitution.name} ({currentInstitution.shortName})</span>
            {currentInstitution.isPilot && (
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-bold">
                Proposed Initial Pilot
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Campus Facility Directory
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Discover university lecture halls, computer laboratories, conference rooms, and event venues. Check live availability schedules and submit reservation requests online.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>• Tagline: <strong className="text-slate-200">“Book It, Track It, Use It.”</strong></span>
            <span>• {institutionFacilities.length} Fictional Demo Spaces Available</span>
            <span>• Instant Conflict Detection</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by facility name, equipment (e.g. Projector, LAN, Microphones), or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Capacity filter dropdown */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="All">All Capacities</option>
              <option value="1-30">Small (1 – 30 attendees)</option>
              <option value="31-60">Medium (31 – 60 attendees)</option>
              <option value="61-100">Large (61 – 100 attendees)</option>
              <option value="100+">Auditorium / Grand (100+ attendees)</option>
            </select>
          </div>
        </div>

        {/* Facility Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {facilityTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Container */}
              <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Type Badge */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide uppercase">
                  {facility.type}
                </span>

                {/* Capacity badge */}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <Users className="w-3 h-3" /> {facility.capacity} seats
                </span>

                {/* Building location */}
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <p className="text-xs font-medium text-slate-200 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    {facility.building} · {facility.floor}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {facility.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                {/* Equipment Highlights */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Key Equipment:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {facility.equipment.slice(0, 3).map((eq, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[200px]"
                      >
                        {eq}
                      </span>
                    ))}
                    {facility.equipment.length > 3 && (
                      <span className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                        +{facility.equipment.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{facility.operatingHours.open} - {facility.operatingHours.close}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px]">{facility.operatingHours.days}</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
              <button
                onClick={() => setDetailModalFacility(facility)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                <span>Details & Schedule</span>
              </button>

              <button
                onClick={() => handleBookNow(facility)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Book Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFacilities.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Building className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Facilities Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No facilities in the active workspace match your current search and filter criteria. Try adjusting your search query or reset the filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
              setCapacityFilter('All');
            }}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Facility Detail Modal */}
      {detailModalFacility && (
        <FacilityDetailModal
          facility={detailModalFacility}
          onClose={() => setDetailModalFacility(null)}
          onBookNow={handleBookNow}
        />
      )}
    </div>
  );
};
