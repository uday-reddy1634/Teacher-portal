export type StudentStatus = 'present' | 'absent';

export interface Scholar {
  id: string;
  rollNumber: string;
  name: string;
  initials: string;
  track: string;
  avatar: string;
  status: StudentStatus;
  grade: string;      // e.g. "Grade 11", "Grade 12", "Grade 10"
  subject: string;    // e.g. "AP Physics C", "AP Calculus BC", "Quantum Mechanics"
  section: string;    // e.g. "Section A", "Section B", "Section C"
  grades: {
    quiz1: number;
    pset3: number;
    labPrac2: number;
    midterm: number;
    unit4Exam: number;
  };
  remarks: string;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  period: string;
  title: string;
  time: string;
  room: string;
  cohort: string;
  registeredCount: number;
  status: 'completed' | 'active' | 'upcoming';
  topic?: string;
  badge?: string;
}

export interface FeedbackItem {
  id: string;
  scholarId: string;
  scholarName: string;
  scholarAvatar?: string;
  cohort: string;
  timestamp: string;
  typology: 'commendation' | 'conceptual' | 'intervention';
  note: string;
  channels: {
    studentPortal: boolean;
    guardianSms: boolean;
    deanDossier: boolean;
  };
  readReceipt?: string;
  deliveryStatus: string;
}

export interface CurricularModule {
  id: string;
  title: string;
  category: 'Worksheet [Mid]' | 'Problem Set' | 'Lab Protocol' | 'Lecture Notes & Stream' | 'Worksheet Packet';
  dueDate: string;
  description: string;
  submissionsCount: number;
  totalCount: number;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  statusTag: string;
  engagementPercent?: number;
}

export interface CohortFilter {
  grade: string;
  subject: string;
  section: string;
  date: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  callNumber: string;
  subject: string;
  level: string;
  category: 'Textbook' | 'Reference' | 'Research Journal' | 'Past Paper' | 'Lab Manual' | 'Thesis Archive';
  format: 'Digital E-Book' | 'Physical Hardcover' | 'Dual (Digital & Print)';
  status: 'available' | 'reserved' | 'borrowed';
  shelfLocation: string;
  copiesAvailable: number;
  totalCopies: number;
  borrower?: {
    scholarName: string;
    rollNumber: string;
    dueDate: string;
  };
  synopsis: string;
  publishYear: number;
  pages: number;
  fileSize?: string;
  fileName?: string;
  coverImage?: string;
}
