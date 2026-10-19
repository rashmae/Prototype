import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  Institution,
  Facility,
  BookingRequest,
  ParticipantRecord,
  TaskObservation,
  OpenEndedResponses,
  ParticipantRating,
} from '../types';
import {
  DEMO_INSTITUTIONS,
  INITIAL_FACILITIES,
  INITIAL_BOOKINGS,
  INITIAL_PARTICIPANTS,
} from '../data/initialData';

export type AppView = 
  | 'landing'
  | 'facilities'
  | 'new-booking'
  | 'my-bookings'
  | 'admin-requests'
  | 'admin-records'
  | 'reports'
  | 'usability-testing';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface DemoUserSession {
  name: string;
  email: string;
  role: UserRole;
  organization: string;
}

interface AppContextType {
  // Navigation & Auth
  isLoggedIn: boolean;
  currentUser: DemoUserSession | null;
  loginAs: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  currentInstitution: Institution;
  allInstitutions: Institution[];
  setInstitutionId: (id: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedFacility: Facility | null;
  setSelectedFacility: (facility: Facility | null) => void;

  // Facilities & Bookings
  institutionFacilities: Facility[];
  allBookings: BookingRequest[];
  institutionBookings: BookingRequest[];
  userBookings: BookingRequest[];
  checkTimeConflict: (
    facilityId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ) => { hasConflict: boolean; conflictingBooking?: BookingRequest };
  submitBooking: (data: {
    facilityId: string;
    eventName: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    attendees: number;
    requesterName: string;
    requesterRole: 'Student' | 'Faculty';
    requesterEmail: string;
    organization?: string;
    notes?: string;
  }) => { success: boolean; booking?: BookingRequest; error?: string };
  approveBooking: (bookingId: string) => { success: boolean; error?: string };
  rejectBooking: (bookingId: string, reason: string) => { success: boolean; error?: string };
  cancelBooking: (bookingId: string) => void;
  resetBookingsToDefault: () => void;

  // Usability Testing
  participants: ParticipantRecord[];
  activeParticipantId: number;
  setActiveParticipantId: (id: number) => void;
  activeParticipant: ParticipantRecord;
  updateTaskObservation: (
    participantId: number,
    taskId: number,
    updates: Partial<TaskObservation>
  ) => void;
  updateOpenEnded: (
    participantId: number,
    updates: Partial<OpenEndedResponses>
  ) => void;
  updateRatings: (
    participantId: number,
    updates: Partial<ParticipantRating>
  ) => void;
  updateParticipantInfo: (
    participantId: number,
    userType: 'Student' | 'Faculty',
    dept: string
  ) => void;
  updateParticipantNotes: (
    participantId: number,
    testerNotes: string,
    interviewSummary: string
  ) => void;
  resetParticipantsToDefault: () => void;
  exportValidationDataCsv: () => void;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Prototype Disclaimer Info
  disclaimerDismissed: boolean;
  setDisclaimerDismissed: (d: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BOOKINGS_STORAGE_KEY = 'smartspace_mvp_bookings_v3';
const PARTICIPANTS_STORAGE_KEY = 'smartspace_mvp_participants_v3';
const INSTITUTION_STORAGE_KEY = 'smartspace_mvp_active_institution_v3';
const AUTH_STORAGE_KEY = 'smartspace_mvp_auth_session_v3';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication & Demo Session
  const [currentUser, setCurrentUser] = useState<DemoUserSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse auth session:', e);
    }
    // Default to a demo student session so the user can immediately experience the product,
    // but they can click "Landing & Login" or "Log Out" anytime!
    return {
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@ctu.edu.ph',
      role: 'student',
      organization: 'BS Information Technology',
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem(AUTH_STORAGE_KEY) || true;
  });

  // Active institution
  const [institutionId, setInstitutionIdState] = useState<string>(() => {
    return localStorage.getItem(INSTITUTION_STORAGE_KEY) || 'ctu-main';
  });

  // Active Role
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'student');

  // Active View
  const [activeView, setActiveView] = useState<AppView>('facilities');

  // Selected facility for modal / prefilling
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Prototype banner state
  const [disclaimerDismissed, setDisclaimerDismissed] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const loginAs = (role: UserRole, email?: string, name?: string) => {
    let userSession: DemoUserSession;
    if (role === 'admin') {
      userSession = {
        name: name || 'Engr. R. Santos',
        email: email || 'admin.facilities@ctu.edu.ph',
        role: 'admin',
        organization: 'Physical Plant & Campus Facilities Office',
      };
      setCurrentRole('admin');
      setActiveView('admin-requests');
    } else {
      userSession = {
        name: name || (role === 'faculty' ? 'Dr. Maria Fernandez' : 'Juan Dela Cruz'),
        email: email || (role === 'faculty' ? 'maria.fernandez@ctu.edu.ph' : 'juan.delacruz@ctu.edu.ph'),
        role,
        organization: role === 'faculty' ? 'College of Technology' : 'BS Information Technology',
      };
      setCurrentRole(role);
      setActiveView('facilities');
    }

    setCurrentUser(userSession);
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
    } catch (e) {
      console.warn('Failed to save auth session:', e);
    }

    addToast(
      'success',
      'Demo Session Started',
      `Logged in as ${userSession.name} (${role === 'admin' ? 'Facility Administrator' : 'User'}). Simulated demo environment.`
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setActiveView('landing');
    addToast('info', 'Logged Out', 'Returned to the SmartSpace landing & demo login page.');
  };

  // Bookings state
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored bookings, fallback to initial:', e);
    }
    return INITIAL_BOOKINGS;
  });

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to save bookings to localStorage:', e);
    }
  }, [bookings]);

  // Participants state
  const [participants, setParticipants] = useState<ParticipantRecord[]>(() => {
    try {
      const stored = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored participants, fallback to initial:', e);
    }
    return INITIAL_PARTICIPANTS;
  });

  // Save participants to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants));
    } catch (e) {
      console.warn('Failed to save participants to localStorage:', e);
    }
  }, [participants]);

  // Active participant
  const [activeParticipantId, setActiveParticipantId] = useState<number>(1);

  // Set institution helper
  const setInstitutionId = (id: string) => {
    setInstitutionIdState(id);
    localStorage.setItem(INSTITUTION_STORAGE_KEY, id);
    setSelectedFacility(null);
  };

  const currentInstitution = useMemo(() => {
    return DEMO_INSTITUTIONS.find((i) => i.id === institutionId) || DEMO_INSTITUTIONS[0];
  }, [institutionId]);

  // Filter facilities by active institution
  const institutionFacilities = useMemo(() => {
    return INITIAL_FACILITIES.filter((f) => f.institutionId === institutionId);
  }, [institutionId]);

  // Filter bookings by active institution
  const institutionBookings = useMemo(() => {
    return bookings.filter((b) => b.institutionId === institutionId);
  }, [bookings, institutionId]);

  const userBookings = useMemo(() => {
    return institutionBookings;
  }, [institutionBookings]);

  // Time overlap utility: Returns true if two time ranges on the same date overlap
  const checkTimeConflict = (
    facilityId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): { hasConflict: boolean; conflictingBooking?: BookingRequest } => {
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + (m || 0);
    };

    const targetStart = toMinutes(startTime);
    const targetEnd = toMinutes(endTime);

    // Only compare against APPROVED bookings for the same facility on the same date
    const approvedSameDay = bookings.filter(
      (b) =>
        b.institutionId === institutionId &&
        b.facilityId === facilityId &&
        b.date === date &&
        b.status === 'approved' &&
        (!excludeBookingId || b.id !== excludeBookingId)
    );

    for (const b of approvedSameDay) {
      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);

      if (targetStart < bEnd && targetEnd > bStart) {
        return { hasConflict: true, conflictingBooking: b };
      }
    }

    return { hasConflict: false };
  };

  // Submit a new booking request
  const submitBooking = (data: {
    facilityId: string;
    eventName: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    attendees: number;
    requesterName: string;
    requesterRole: 'Student' | 'Faculty';
    requesterEmail: string;
    organization?: string;
    notes?: string;
  }) => {
    const facility = institutionFacilities.find((f) => f.id === data.facilityId);
    if (!facility) {
      return { success: false, error: 'Selected facility was not found in the current workspace.' };
    }

    // Validation
    if (!data.eventName.trim()) {
      return { success: false, error: 'Event or activity title is required.' };
    }
    if (!data.date) {
      return { success: false, error: 'Reservation date is required.' };
    }
    if (!data.startTime || !data.endTime) {
      return { success: false, error: 'Both start time and end time are required.' };
    }

    const [sh, sm] = data.startTime.split(':').map(Number);
    const [eh, em] = data.endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;

    if (endMins <= startMins) {
      return { success: false, error: 'End time must be later than start time.' };
    }

    if (data.attendees <= 0) {
      return { success: false, error: 'Expected attendees must be at least 1 person.' };
    }

    if (data.attendees > facility.capacity) {
      return {
        success: false,
        error: `Expected attendees (${data.attendees}) exceed the maximum seating capacity (${facility.capacity} seats) for ${facility.name}.`,
      };
    }

    // Check conflict with existing approved bookings
    const conflict = checkTimeConflict(data.facilityId, data.date, data.startTime, data.endTime);
    if (conflict.hasConflict && conflict.conflictingBooking) {
      return {
        success: false,
        error: `Schedule Conflict: This slot overlaps with an already APPROVED booking "${conflict.conflictingBooking.eventName}" (${conflict.conflictingBooking.startTime} – ${conflict.conflictingBooking.endTime}). Please select an alternate date or time range.`,
      };
    }

    // Generate unique demo reference
    const prefix = currentInstitution.shortName.replace(/[^A-Z]/g, '') || 'SS';
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `${prefix}-${year}-${randomSuffix}`;

    const newBooking: BookingRequest = {
      id: 'req-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      referenceNumber,
      institutionId,
      facilityId: data.facilityId,
      facilityName: facility.name,
      eventName: data.eventName.trim(),
      purpose: data.purpose.trim() || 'Academic Activity',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      attendees: data.attendees,
      requesterName: data.requesterName.trim() || (currentUser?.name || 'Demo Requester'),
      requesterRole: data.requesterRole,
      requesterEmail: data.requesterEmail.trim() || (currentUser?.email || 'user@ctu.edu.ph'),
      organization: data.organization?.trim(),
      notes: data.notes?.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    addToast(
      'success',
      'Request Submitted (Pending)',
      `Booking request ${referenceNumber} logged. It is now awaiting Administrator review.`
    );

    return { success: true, booking: newBooking };
  };

  // Administrator approval
  const approveBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'Booking record not found.' };
    }

    // Double check conflict before approving
    const conflict = checkTimeConflict(
      booking.facilityId,
      booking.date,
      booking.startTime,
      booking.endTime,
      booking.id
    );

    if (conflict.hasConflict && conflict.conflictingBooking) {
      const err = `Cannot approve request: Schedule conflicts with existing approved reservation "${conflict.conflictingBooking.eventName}" (${conflict.conflictingBooking.startTime} - ${conflict.conflictingBooking.endTime}).`;
      addToast('error', 'Approval Blocked (Conflict)', err);
      return { success: false, error: err };
    }

    const permitRef = `PERMIT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'approved',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Engr. R. Santos (Demo Facility Administrator)',
            permitReference: permitRef,
            rejectionReason: undefined,
          };
        }
        return b;
      })
    );

    addToast(
      'success',
      'Request Approved',
      `Booking ${booking.referenceNumber} is officially Approved (Permit: ${permitRef}).`
    );

    return { success: true };
  };

  // Administrator rejection
  const rejectBooking = (bookingId: string, reason: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'Booking record not found.' };
    }

    if (!reason.trim()) {
      return { success: false, error: 'A justification reason is required when rejecting a reservation.' };
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Engr. R. Santos (Demo Facility Administrator)',
            rejectionReason: reason.trim(),
          };
        }
        return b;
      })
    );

    addToast(
      'info',
      'Request Rejected',
      `Booking ${booking.referenceNumber} marked as Rejected. Reason recorded for applicant.`
    );

    return { success: true };
  };

  // User cancels request
  const cancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    addToast('info', 'Request Cancelled', `Booking ${target?.referenceNumber || ''} was removed.`);
  };

  // Reset bookings
  const resetBookingsToDefault = () => {
    setBookings(INITIAL_BOOKINGS);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    addToast('info', 'Bookings Reset', 'Reservation records have been reset to default demo state.');
  };

  // Participant updates
  const activeParticipant = useMemo(() => {
    return participants.find((p) => p.id === activeParticipantId) || participants[0];
  }, [participants, activeParticipantId]);

  const updateTaskObservation = (
    participantId: number,
    taskId: number,
    updates: Partial<TaskObservation>
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          const currentTask = p.tasks[taskId] || {
            taskId,
            completed: null,
            neededAssistance: null,
            completionTimeSeconds: null,
            difficultyNotes: '',
            participantComments: '',
          };
          return {
            ...p,
            tasks: {
              ...p.tasks,
              [taskId]: {
                ...currentTask,
                ...updates,
              },
            },
          };
        }
        return p;
      })
    );
  };

  const updateOpenEnded = (
    participantId: number,
    updates: Partial<OpenEndedResponses>
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            openEnded: {
              ...p.openEnded,
              ...updates,
            },
          };
        }
        return p;
      })
    );
  };

  const updateRatings = (
    participantId: number,
    updates: Partial<ParticipantRating>
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            ratings: {
              ...p.ratings,
              ...updates,
            },
          };
        }
        return p;
      })
    );
  };

  const updateParticipantInfo = (
    participantId: number,
    userType: 'Student' | 'Faculty',
    dept: string
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            userType,
            collegeOrDepartment: dept,
          };
        }
        return p;
      })
    );
  };

  const updateParticipantNotes = (
    participantId: number,
    testerNotes: string,
    interviewSummary: string
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            testerNotes,
            interviewSummary,
          };
        }
        return p;
      })
    );
  };

  const resetParticipantsToDefault = () => {
    setParticipants(INITIAL_PARTICIPANTS);
    localStorage.removeItem(PARTICIPANTS_STORAGE_KEY);
    addToast(
      'info',
      'Validation Data Reset',
      'All 5 participant task recordings, open-ended answers, and ratings have been reset.'
    );
  };

  // CSV Export
  const exportValidationDataCsv = () => {
    const headers = [
      'Participant ID',
      'User Type',
      'Department / College',
      'Task 1 (Find Facility) Done',
      'Task 1 Assistance',
      'Task 1 Time (s)',
      'Task 2 (Book Request) Done',
      'Task 2 Assistance',
      'Task 2 Time (s)',
      'Task 3 (Check Pending) Done',
      'Task 3 Assistance',
      'Task 3 Time (s)',
      'Task 4 (Admin Approve/Reject) Done',
      'Task 4 Assistance',
      'Task 4 Time (s)',
      'Task 5 (Verify Status) Done',
      'Task 5 Assistance',
      'Task 5 Time (s)',
      'Task 6 (View Records/Reports) Done',
      'Task 6 Assistance',
      'Task 6 Time (s)',
      'Rating: Ease of Use (1-5)',
      'Rating: Usefulness (1-5)',
      'Rating: Overall Experience (1-5)',
      'Q Easy to Find Facility',
      'Q Availability Clear',
      'Q Booking Form Clear',
      'Q Status Easy to Locate',
      'Q Confusion or Difficulty',
      'Q What to Change',
      'Q1 Current Process',
      'Q2 Current Difficulties',
      'Tester Notes',
      'Interview Summary',
    ];

    const rows = participants.map((p) => {
      const t = p.tasks;
      const fmtBool = (val: boolean | null) => (val === null ? 'Not recorded' : val ? 'Yes' : 'No');
      const fmtNum = (val: number | null) => (val === null ? 'Not recorded' : val.toString());

      return [
        `"${p.identifier}"`,
        `"${p.userType}"`,
        `"${p.collegeOrDepartment}"`,
        fmtBool(t[1]?.completed),
        fmtBool(t[1]?.neededAssistance),
        fmtNum(t[1]?.completionTimeSeconds),
        fmtBool(t[2]?.completed),
        fmtBool(t[2]?.neededAssistance),
        fmtNum(t[2]?.completionTimeSeconds),
        fmtBool(t[3]?.completed),
        fmtBool(t[3]?.neededAssistance),
        fmtNum(t[3]?.completionTimeSeconds),
        fmtBool(t[4]?.completed),
        fmtBool(t[4]?.neededAssistance),
        fmtNum(t[4]?.completionTimeSeconds),
        fmtBool(t[5]?.completed),
        fmtBool(t[5]?.neededAssistance),
        fmtNum(t[5]?.completionTimeSeconds),
        fmtBool(t[6]?.completed),
        fmtBool(t[6]?.neededAssistance),
        fmtNum(t[6]?.completionTimeSeconds),
        fmtNum(p.ratings.easeOfUse),
        fmtNum(p.ratings.usefulness),
        fmtNum(p.ratings.overallExperience),
        `"${(p.openEnded.qFindFacilityEasy || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.qAvailabilityClear || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.qBookingFormClear || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.qStatusEasyToLocate || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.qConfusionOrDifficulty || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.qWhatToChange || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.q1CurrentProcess || '').replace(/"/g, '""')}"`,
        `"${(p.openEnded.q2CurrentDifficulties || '').replace(/"/g, '""')}"`,
        `"${(p.testerNotes || '').replace(/"/g, '""')}"`,
        `"${(p.interviewSummary || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartspace_validation_data_case_study_4_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Exported', 'Downloaded validation session data for Case Study 4.');
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        loginAs,
        logout,
        currentInstitution,
        allInstitutions: DEMO_INSTITUTIONS,
        setInstitutionId,
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        selectedFacility,
        setSelectedFacility,
        institutionFacilities,
        allBookings: bookings,
        institutionBookings,
        userBookings,
        checkTimeConflict,
        submitBooking,
        approveBooking,
        rejectBooking,
        cancelBooking,
        resetBookingsToDefault,
        participants,
        activeParticipantId,
        setActiveParticipantId,
        activeParticipant,
        updateTaskObservation,
        updateOpenEnded,
        updateRatings,
        updateParticipantInfo,
        updateParticipantNotes,
        resetParticipantsToDefault,
        exportValidationDataCsv,
        toasts,
        addToast,
        removeToast,
        disclaimerDismissed,
        setDisclaimerDismissed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
