export type Role = 'admin' | 'player' | 'team_owner' | 'referee' | 'spectator';

// Game Categories
export type GameCategory = 'TRADITIONAL_SPORT' | 'BOARD_GAME' | 'ONLINE_GAME' | 'BATTLE_ROYALE';

// Game Formats
export type GameFormat = 'SET_BASED' | 'POINT_BASED' | 'GOAL_BASED' | 'RUN_BASED' | 'WIN_DRAW_LOSS' | 'PLACEMENT_BASED' | 'PLACEMENT_AND_KILLS' | 'ROUND_BASED' | 'TIME_BASED' | 'CUSTOM';

// Participation Type
export type ParticipationType = 'INDIVIDUAL' | 'TEAM' | 'SQUAD' | 'BOTH';

// Registration Fee Type
export type RegistrationFeeType = 'PLAYER' | 'TEAM';

// Payment Statuses
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAIVED' | 'REFUNDED';

// Registration Statuses
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
  sports: string[]; // Game IDs
  position: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  sports: string[]; // Game IDs
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

// Game entity - replaces Sport
export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  format: GameFormat;
  participationType: ParticipationType;
  description: string;
  icon: string; // emoji or icon identifier
  isActive: boolean;
  // Scoring configuration
  scoringConfig: ScoringConfig;
  createdAt: string;
}

export interface ScoringConfig {
  // For SET_BASED
  maxSets?: number;
  pointsPerSet?: number;
  // For POINT_BASED / GOAL_BASED
  periodsCount?: number;
  periodDuration?: number; // minutes
  // For RUN_BASED
  oversCount?: number;
  playersPerSide?: number;
  // For PLACEMENT_AND_KILLS
  killPoints?: number;
  placementPoints?: Record<number, number>; // placement -> points
  // For WIN_DRAW_LOSS
  winPoints?: number;
  drawPoints?: number;
  lossPoints?: number;
  // Custom
  customRules?: string;
}

// Registration Fee - per tournament + game + type
export interface RegistrationFee {
  id: string;
  tournamentId: string;
  gameId: string;
  feeType: RegistrationFeeType; // PLAYER or TEAM
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
  games: string[]; // Game IDs (was sports)
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
  gameId: string; // was sport
  registrationType: 'PLAYER';
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registrationFee: number; // Historical fee at time of registration
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
  gameId: string; // was sport
  registrationType: 'TEAM';
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registrationFee: number; // Historical fee at time of registration
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
  gameId: string; // was sport
  teamA: string;
  teamB: string;
  venue: string;
  scheduledDate: string;
  refereeId: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  sets: MatchSet[];
  winner: string | null;
  // Battle Royale specific
  battleRoyaleData?: BattleRoyaleMatchData;
  createdAt: string;
}

export interface MatchSet {
  setNumber: number;
  scoreA: number;
  scoreB: number;
  completed: boolean;
}

export interface BattleRoyaleMatchData {
  roundNumber: number;
  totalRounds: number;
  participants: BattleRoyaleParticipant[];
}

export interface BattleRoyaleParticipant {
  teamId: string;
  placement: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  bonusPoints: number;
  totalPoints: number;
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

// Keep Sport as alias for backward compatibility
export type Sport = Game;

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
}
