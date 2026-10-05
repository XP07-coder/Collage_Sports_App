export type Role = 'admin' | 'player' | 'team_owner' | 'referee' | 'spectator';

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  fullName: string;
  phone: string;
  collegeId: string;
  course: string;
  branch: string;
  year: string;
  gender: string;
  dob: string;
  bio: string;
  avatar: string;
  sports: string[]; // Multi-sport support
  position: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  sports: string[]; // Multi-sport support
  college: string;
  ownerId: string;
  email: string;
  contact: string;
  logo: string;
  members: string[];
  purse: number;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  playerId: string;
  teamId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  sports: string[]; // Multi-sport support
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  status: 'draft' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled' | 'archived';
  createdBy: string;
  teams: string[];
  players: string[]; // registered player IDs
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  registrationFee: number;
  teamRegistrationFee: number;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  playerId: string;
  tournamentId: string;
  sport: string;
  registrationStatus: 'draft' | 'submitted' | 'payment_pending' | 'approved' | 'rejected' | 'cancelled';
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'waived' | 'refunded';
  registrationFee: number;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamEventRegistration {
  id: string;
  teamId: string;
  tournamentId: string;
  sport: string;
  registrationStatus: 'submitted' | 'payment_pending' | 'approved' | 'rejected' | 'cancelled';
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'waived' | 'not_required';
  registrationFee: number;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  createdAt: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  teamA: string;
  teamB: string;
  sport: string;
  venue: string;
  scheduledDate: string;
  refereeId: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  sets: MatchSet[];
  winner: string | null;
  createdAt: string;
}

export interface MatchSet {
  setNumber: number;
  scoreA: number;
  scoreB: number;
  completed: boolean;
}

export interface Auction {
  id: string;
  tournamentId: string;
  playerId: string;
  basePrice: number;
  soldTo: string | null;
  soldPrice: number | null;
  status: 'available' | 'sold' | 'unsold';
  bids: AuctionBid[];
}

export interface AuctionBid {
  id: string;
  teamId: string;
  amount: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  tournamentId: string;
  timestamp: string;
}

export interface Sport {
  id: string;
  name: string;
  isSetBased: boolean;
  maxSets: number;
  pointsPerSet: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
}
