export type Role = 'STUDENT' | 'ADMIN' | 'GUARD';

export type Facility = 'FUTSAL_1' | 'FUTSAL_2' | 'VOLEY';

export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'ABSENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  penaltyUntil?: string | null; // ISO string representing when the penalty ends
  penaltyAppealReason?: string;
  penaltyAppealStatus?: 'PENDING' | 'REJECTED' | null;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  facility: Facility;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (start time, assuming 1 hour slots for simplicity)
  status: ReservationStatus;
  rejectReason?: string;
  isFixed?: boolean;
  fileName?: string;
  fileData?: string;
  signedFileName?: string;
}

export interface AppState {
  users: User[];
  reservations: Reservation[];
  currentUser: User | null;
}
