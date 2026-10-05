export type Role = 'admin' | 'player' | 'team_owner' | 'referee' | 'spectator';
export type GameCategory = 'TRADITIONAL_SPORT' | 'BOARD_GAME' | 'ONLINE_GAME' | 'BATTLE_ROYALE';
export type GameFormat = 'SET_BASED' | 'POINT_BASED' | 'GOAL_BASED' | 'RUN_BASED' | 'WIN_DRAW_LOSS' | 'PLACEMENT_BASED' | 'PLACEMENT_AND_KILLS' | 'ROUND_BASED' | 'TIME_BASED' | 'CUSTOM';
export type ParticipationType = 'INDIVIDUAL' | 'TEAM' | 'SQUAD' | 'BOTH';
export type RegistrationFeeType = 'PLAYER' | 'TEAM';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAIVED' | 'REFUNDED';
export type RegistrationStatus = 'DRAFT' | 'SUBMITTED' | 'PAYMENT_PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

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
  games: string[]; // Game IDs
  position: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  games: string[]; // Game IDs
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

export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  format: GameFormat;
  participationType: ParticipationType;
  description: string;
  icon: string;
  isActive: boolean;
  scoringConfig: {
    maxSets?: number;
    pointsPerSet?: number;
    periodsCount?: number;
    periodDuration?: number;
    oversCount?: number;
    playersPerSide?: number;
    killPoints?: number;
    placementPoints?: Record<number, number>;
    winPoints?: number;
    drawPoints?: number;
    lossPoints?: number;
    customRules?: string;
  };
  createdAt: string;
}

export interface RegistrationFee {
  id: string;
  tournamentId: string;
  gameId: string;
  feeType: RegistrationFeeType;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  games: string[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  status: 'draft' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled' | 'archived';
  createdBy: string;
  teams: string[];
  players: string[];
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  playerId: string;
  tournamentId: string;
  gameId: string;
  registrationType: 'PLAYER';
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registrationFee: number;
  amountPaid: number;
  paymentReference: string;
  paymentMethod: string;
  rejectionReason: string;
  eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE';
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
  gameId: string;
  registrationType: 'TEAM';
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registrationFee: number;
  amountPaid: number;
  paymentReference: string;
  paymentMethod: string;
  rejectionReason: string;
  eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE';
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  gameId: string;
  teamA: string;
  teamB: string;
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

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
}
