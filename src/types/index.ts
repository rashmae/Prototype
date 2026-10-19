export type UserRole = 'student' | 'faculty' | 'admin';

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  campus: string;
  city: string;
  isPilot: boolean;
  statusNote: string;
}

export type FacilityType = 
  | 'Lecture Room'
  | 'Computer Laboratory'
  | 'Conference Room'
  | 'University Auditorium'
  | 'Student Activity Room'
  | 'Multimedia Presentation Hall';

export interface Facility {
  id: string;
  institutionId: string;
  name: string;
  type: FacilityType;
  building: string;
  floor: string;
  capacity: number;
  equipment: string[];
  operatingHours: {
    open: string;
    close: string;
    days: string;
  };
  rules: string[];
  bookingRequirements: string[];
  imageUrl: string;
  description: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface BookingRequest {
  id: string;
  referenceNumber: string;
  institutionId: string;
  facilityId: string;
  facilityName: string;
  eventName: string;
  purpose: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  attendees: number;
  requesterName: string;
  requesterRole: 'Student' | 'Faculty';
  requesterEmail: string;
  organization?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  permitReference?: string;
}

export interface TaskDefinition {
  id: number;
  number: number;
  title: string;
  prompt: string;
  instructions: string;
  expectedOutcome: string;
  shortcutView: 'facilities' | 'new-booking' | 'my-bookings' | 'admin-requests' | 'admin-records' | 'reports';
  requiredRole: UserRole;
}

export interface TaskObservation {
  taskId: number;
  completed: boolean | null; // null = not recorded
  neededAssistance: boolean | null; // null = not recorded
  completionTimeSeconds: number | null; // null = not recorded
  difficultyNotes: string;
  participantComments: string;
}

export interface OpenEndedResponses {
  // Usability Specific Questions
  qFindFacilityEasy: string; // Was it easy to find a suitable facility?
  qAvailabilityClear: string; // Was the availability information clear?
  qBookingFormClear: string; // Was the booking form easy to understand?
  qStatusEasyToLocate: string; // Was the booking status easy to locate?
  qConfusionOrDifficulty: string; // What caused confusion or difficulty?
  qWhatToChange: string; // What would you change about SmartSpace?

  // Background & Process Questions
  q1CurrentProcess: string;
  q2CurrentDifficulties: string;
  q3ConfusingParts: string;
  q4MostUsefulFeature: string;
  q5SuggestedChanges: string;
  q6WillingnessToUse: string;
}

export interface ParticipantRating {
  easeOfUse: number | null; // 1-5
  usefulness: number | null; // 1-5
  overallExperience: number | null; // 1-5
}

export interface ParticipantRecord {
  id: number; // 1 to 5
  identifier: string; // "Participant 1"
  userType: 'Student' | 'Faculty';
  collegeOrDepartment: string;
  tasks: Record<number, TaskObservation>;
  openEnded: OpenEndedResponses;
  ratings: ParticipantRating;
  testerNotes?: string;
  interviewSummary?: string;
  startedAt?: string;
  completedAt?: string;
  isCompleted: boolean;
}
