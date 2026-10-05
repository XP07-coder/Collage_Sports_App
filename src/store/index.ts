import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Team, JoinRequest, Tournament, Match, Auction, Notification, AuditLog,
  ChatMessage, Game, Venue, EventRegistration, TeamEventRegistration, RegistrationFee,
  PaymentStatus, RegistrationStatus
} from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const defaultGames: Game[] = [
  { id: 'g1', name: 'Badminton', category: 'TRADITIONAL_SPORT', format: 'SET_BASED', participationType: 'BOTH', description: 'Racket sport', icon: '🏸', isActive: true, scoringConfig: { maxSets: 3, pointsPerSet: 21 }, createdAt: new Date().toISOString() },
  { id: 'g2', name: 'Volleyball', category: 'TRADITIONAL_SPORT', format: 'SET_BASED', participationType: 'TEAM', description: 'Team sport', icon: '🏐', isActive: true, scoringConfig: { maxSets: 5, pointsPerSet: 25 }, createdAt: new Date().toISOString() },
  { id: 'g3', name: 'Basketball', category: 'TRADITIONAL_SPORT', format: 'POINT_BASED', participationType: 'TEAM', description: 'Team sport', icon: '🏀', isActive: true, scoringConfig: { periodsCount: 4, periodDuration: 10 }, createdAt: new Date().toISOString() },
  { id: 'g4', name: 'Football', category: 'TRADITIONAL_SPORT', format: 'GOAL_BASED', participationType: 'TEAM', description: 'The beautiful game', icon: '⚽', isActive: true, scoringConfig: { periodsCount: 2, periodDuration: 45 }, createdAt: new Date().toISOString() },
  { id: 'g5', name: 'Cricket', category: 'TRADITIONAL_SPORT', format: 'RUN_BASED', participationType: 'TEAM', description: 'Bat and ball', icon: '🏏', isActive: true, scoringConfig: { oversCount: 20, playersPerSide: 11 }, createdAt: new Date().toISOString() },
  { id: 'g6', name: 'Table Tennis', category: 'TRADITIONAL_SPORT', format: 'SET_BASED', participationType: 'BOTH', description: 'Indoor racket', icon: '🏓', isActive: true, scoringConfig: { maxSets: 5, pointsPerSet: 11 }, createdAt: new Date().toISOString() },
  { id: 'g7', name: 'Kabaddi', category: 'TRADITIONAL_SPORT', format: 'POINT_BASED', participationType: 'TEAM', description: 'Contact sport', icon: '🤼', isActive: true, scoringConfig: { periodsCount: 2, periodDuration: 20 }, createdAt: new Date().toISOString() },
  { id: 'g8', name: 'Chess', category: 'BOARD_GAME', format: 'WIN_DRAW_LOSS', participationType: 'INDIVIDUAL', description: 'Strategy game', icon: '♟️', isActive: true, scoringConfig: { winPoints: 1, drawPoints: 0.5, lossPoints: 0 }, createdAt: new Date().toISOString() },
];

const defaultAdmin: User = {
  id: 'admin-001', email: 'admin@campus.edu', password: 'admin123', role: 'admin',
  fullName: 'System Administrator', phone: '9999999999', collegeId: 'ADMIN001',
  course: 'Administration', branch: 'Management', year: 'N/A', gender: 'Other',
  dob: '1990-01-01', bio: 'System Administrator', avatar: '', games: [], position: '',
  verified: true, active: true, createdAt: new Date().toISOString(),
};

interface AppState {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Partial<User>) => boolean;
  updateUser: (id: string, data: Partial<User>) => void;

  teams: Team[];
  createTeam: (team: Partial<Team>) => boolean;
  updateTeam: (id: string, data: Partial<Team>) => void;

  joinRequests: JoinRequest[];
  sendJoinRequest: (playerId: string, teamId: string) => boolean;
  respondToJoinRequest: (requestId: string, status: 'accepted' | 'rejected') => void;

  games: Game[];
  addGame: (game: Partial<Game>) => void;
  updateGame: (id: string, data: Partial<Game>) => void;

  registrationFees: RegistrationFee[];
  setRegistrationFee: (tournamentId: string, gameId: string, feeType: 'PLAYER' | 'TEAM', amount: number) => void;
  getRegistrationFee: (tournamentId: string, gameId: string, feeType: 'PLAYER' | 'TEAM') => number;

  tournaments: Tournament[];
  createTournament: (t: Partial<Tournament>) => void;
  updateTournament: (id: string, data: Partial<Tournament>) => void;

  eventRegistrations: EventRegistration[];
  submitEventRegistration: (playerId: string, tournamentId: string, gameId: string) => boolean;
  approvePayment: (registrationId: string, adminId: string) => boolean;
  rejectPayment: (registrationId: string, adminId: string, reason?: string) => void;
  isPlayerEligible: (playerId: string, tournamentId: string, gameId: string) => boolean;

  teamEventRegistrations: TeamEventRegistration[];
  submitTeamEventRegistration: (teamId: string, tournamentId: string, gameId: string) => boolean;
  approveTeamPayment: (regId: string, adminId: string) => void;

  matches: Match[];
  createMatch: (m: Partial<Match>) => void;
  updateMatch: (id: string, data: Partial<Match>) => void;
  updateMatchScore: (matchId: string, setNumber: number, scoreA: number, scoreB: number) => void;

  auctions: Auction[];
  createAuction: (a: Partial<Auction>) => void;
  placeBid: (auctionId: string, teamId: string, amount: number) => boolean;

  notifications: Notification[];
  addNotification: (userId: string, title: string, message: string) => void;
  markNotificationRead: (id: string) => void;

  auditLogs: AuditLog[];
  addAuditLog: (log: Partial<AuditLog>) => void;

  chatMessages: ChatMessage[];
  sendChatMessage: (userId: string, userName: string, message: string, tournamentId: string) => void;

  venues: Venue[];
  addVenue: (venue: Partial<Venue>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [defaultAdmin],
      teams: [],
      joinRequests: [],
      games: defaultGames,
      registrationFees: [],
      tournaments: [],
      eventRegistrations: [],
      teamEventRegistrations: [],
      matches: [],
      auctions: [],
      notifications: [],
      auditLogs: [],
      chatMessages: [],
      venues: [],

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user && user.active) { set({ currentUser: user }); return true; }
        return false;
      },
      logout: () => set({ currentUser: null }),

      register: (userData) => {
        const existing = get().users.find(u => u.email === userData.email);
        if (existing) return false;
        const newUser: User = {
          id: generateId(), email: userData.email || '', password: userData.password || '',
          role: userData.role || 'player', fullName: userData.fullName || '',
          phone: userData.phone || '', collegeId: userData.collegeId || '',
          course: userData.course || '', branch: userData.branch || '',
          year: userData.year || '', gender: userData.gender || '',
          dob: userData.dob || '', bio: userData.bio || '', avatar: userData.avatar || '',
          games: userData.games || [], position: userData.position || '',
          verified: true, active: true, createdAt: new Date().toISOString(),
        };
        set(state => ({ users: [...state.users, newUser] }));
        get().addNotification(newUser.id, 'Welcome!', 'Your account has been created.');
        return true;
      },

      updateUser: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } as User : state.currentUser,
        }));
      },

      createTeam: (teamData) => {
        const ownerTeams = get().teams.filter(t => t.ownerId === teamData.ownerId);
        if (ownerTeams.length > 0 && get().currentUser?.role !== 'admin') return false;
        const newTeam: Team = {
          id: generateId(), name: teamData.name || '', description: teamData.description || '',
          games: teamData.games || [], college: teamData.college || '',
          ownerId: teamData.ownerId || '', email: teamData.email || '',
          contact: teamData.contact || '', logo: teamData.logo || '',
          members: [], purse: 800, createdAt: new Date().toISOString(),
        };
        set(state => ({ teams: [...state.teams, newTeam] }));
        return true;
      },

      updateTeam: (id, data) => {
        set(state => ({ teams: state.teams.map(t => t.id === id ? { ...t, ...data } : t) }));
      },

      sendJoinRequest: (playerId, teamId) => {
        const existing = get().joinRequests.find(r => r.playerId === playerId && r.teamId === teamId && r.status === 'pending');
        if (existing) return false;
        const newRequest: JoinRequest = { id: generateId(), playerId, teamId, status: 'pending', createdAt: new Date().toISOString() };
        set(state => ({ joinRequests: [...state.joinRequests, newRequest] }));
        return true;
      },

      respondToJoinRequest: (requestId, status) => {
        const request = get().joinRequests.find(r => r.id === requestId);
        if (!request) return;
        set(state => ({ joinRequests: state.joinRequests.map(r => r.id === requestId ? { ...r, status } : r) }));
        if (status === 'accepted') {
          const team = get().teams.find(t => t.id === request.teamId);
          if (team) get().updateTeam(team.id, { members: [...team.members, request.playerId] });
        }
      },

      addGame: (gameData) => {
        const newGame: Game = {
          id: generateId(), name: gameData.name || '', category: gameData.category || 'TRADITIONAL_SPORT',
          format: gameData.format || 'SET_BASED', participationType: gameData.participationType || 'BOTH',
          description: gameData.description || '', icon: gameData.icon || '🎮',
          isActive: true, scoringConfig: gameData.scoringConfig || {}, createdAt: new Date().toISOString(),
        };
        set(state => ({ games: [...state.games, newGame] }));
      },

      updateGame: (id, data) => {
        set(state => ({ games: state.games.map(g => g.id === id ? { ...g, ...data } : g) }));
      },

      setRegistrationFee: (tournamentId, gameId, feeType, amount) => {
        const existing = get().registrationFees.find(f => f.tournamentId === tournamentId && f.gameId === gameId && f.feeType === feeType);
        if (existing) {
          set(state => ({ registrationFees: state.registrationFees.map(f => f.id === existing.id ? { ...f, amount, updatedAt: new Date().toISOString() } : f) }));
        } else {
          const newFee: RegistrationFee = {
            id: generateId(), tournamentId, gameId, feeType, amount,
            isActive: true, createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), createdBy: get().currentUser?.id || '',
          };
          set(state => ({ registrationFees: [...state.registrationFees, newFee] }));
        }
      },

      getRegistrationFee: (tournamentId, gameId, feeType) => {
        const fee = get().registrationFees.find(f => f.tournamentId === tournamentId && f.gameId === gameId && f.feeType === feeType && f.isActive);
        return fee?.amount || 0;
      },

      createTournament: (tData) => {
        const newTournament: Tournament = {
          id: generateId(), name: tData.name || '', description: tData.description || '',
          games: tData.games || [], startDate: tData.startDate || '',
          endDate: tData.endDate || '', registrationDeadline: tData.registrationDeadline || '',
          location: tData.location || '', status: tData.status || 'draft',
          createdBy: tData.createdBy || '', teams: [], players: [],
          pointsForWin: tData.pointsForWin || 3, pointsForDraw: tData.pointsForDraw || 1,
          pointsForLoss: tData.pointsForLoss || 0, createdAt: new Date().toISOString(),
        };
        set(state => ({ tournaments: [...state.tournaments, newTournament] }));
      },

      updateTournament: (id, data) => {
        set(state => ({ tournaments: state.tournaments.map(t => t.id === id ? { ...t, ...data } : t) }));
      },

      submitEventRegistration: (playerId, tournamentId, gameId) => {
        const existing = get().eventRegistrations.find(r => r.playerId === playerId && r.tournamentId === tournamentId && r.gameId === gameId && r.registrationStatus !== 'REJECTED' && r.registrationStatus !== 'CANCELLED');
        if (existing) return false;
        const fee = get().getRegistrationFee(tournamentId, gameId, 'PLAYER');
        const now = new Date().toISOString();
        const newReg: EventRegistration = {
          id: generateId(), playerId, tournamentId, gameId, registrationType: 'PLAYER',
          registrationStatus: fee > 0 ? 'PAYMENT_PENDING' : 'APPROVED',
          paymentStatus: fee > 0 ? 'PENDING' : 'APPROVED',
          registrationFee: fee, amountPaid: 0, paymentReference: '', paymentMethod: '', rejectionReason: '',
          eligibilityStatus: fee > 0 ? 'NOT_ELIGIBLE' : 'ELIGIBLE',
          submittedAt: now, approvedAt: fee === 0 ? now : null, approvedBy: fee === 0 ? 'system' : null,
          rejectedAt: null, rejectedBy: null, createdAt: now, updatedAt: now,
        };
        set(state => ({ eventRegistrations: [...state.eventRegistrations, newReg] }));
        return true;
      },

      approvePayment: (registrationId, adminId) => {
        const reg = get().eventRegistrations.find(r => r.id === registrationId);
        if (!reg) return false;
        const now = new Date().toISOString();
        set(state => ({
          eventRegistrations: state.eventRegistrations.map(r =>
            r.id === registrationId ? { ...r, paymentStatus: 'APPROVED' as PaymentStatus, registrationStatus: 'APPROVED' as RegistrationStatus, eligibilityStatus: 'ELIGIBLE' as const, approvedAt: now, approvedBy: adminId, updatedAt: now } : r
          ),
        }));
        return true;
      },

      rejectPayment: (registrationId, adminId, reason) => {
        const reg = get().eventRegistrations.find(r => r.id === registrationId);
        if (!reg) return;
        const now = new Date().toISOString();
        set(state => ({
          eventRegistrations: state.eventRegistrations.map(r =>
            r.id === registrationId ? { ...r, paymentStatus: 'REJECTED' as PaymentStatus, registrationStatus: 'REJECTED' as RegistrationStatus, eligibilityStatus: 'NOT_ELIGIBLE' as const, rejectedAt: now, rejectedBy: adminId, rejectionReason: reason || '', updatedAt: now } : r
          ),
        }));
      },

      isPlayerEligible: (playerId, tournamentId, gameId) => {
        const reg = get().eventRegistrations.find(r => r.playerId === playerId && r.tournamentId === tournamentId && r.gameId === gameId);
        if (!reg) return false;
        return reg.registrationStatus === 'APPROVED' && (reg.paymentStatus === 'APPROVED' || reg.registrationFee === 0);
      },

      submitTeamEventRegistration: (teamId, tournamentId, gameId) => {
        const existing = get().teamEventRegistrations.find(r => r.teamId === teamId && r.tournamentId === tournamentId && r.gameId === gameId && r.registrationStatus !== 'REJECTED' && r.registrationStatus !== 'CANCELLED');
        if (existing) return false;
        const fee = get().getRegistrationFee(tournamentId, gameId, 'TEAM');
        const now = new Date().toISOString();
        const newReg: TeamEventRegistration = {
          id: generateId(), teamId, tournamentId, gameId, registrationType: 'TEAM',
          registrationStatus: fee > 0 ? 'PAYMENT_PENDING' : 'APPROVED',
          paymentStatus: fee > 0 ? 'PENDING' : 'APPROVED',
          registrationFee: fee, amountPaid: 0, paymentReference: '', paymentMethod: '', rejectionReason: '',
          eligibilityStatus: fee > 0 ? 'NOT_ELIGIBLE' : 'ELIGIBLE',
          submittedAt: now, approvedAt: fee === 0 ? now : null, approvedBy: fee === 0 ? 'system' : null,
          rejectedAt: null, rejectedBy: null, createdAt: now, updatedAt: now,
        };
        set(state => ({ teamEventRegistrations: [...state.teamEventRegistrations, newReg] }));
        return true;
      },

      approveTeamPayment: (regId, adminId) => {
        const now = new Date().toISOString();
        set(state => ({
          teamEventRegistrations: state.teamEventRegistrations.map(r =>
            r.id === regId ? { ...r, paymentStatus: 'APPROVED' as PaymentStatus, registrationStatus: 'APPROVED' as RegistrationStatus, eligibilityStatus: 'ELIGIBLE' as const, approvedAt: now, approvedBy: adminId, updatedAt: now } : r
          ),
        }));
      },

      createMatch: (mData) => {
        const newMatch: Match = {
          id: generateId(), tournamentId: mData.tournamentId || '', gameId: mData.gameId || '',
          teamA: mData.teamA || '', teamB: mData.teamB || '', venue: mData.venue || '',
          scheduledDate: mData.scheduledDate || '', refereeId: mData.refereeId || '',
          status: mData.status || 'scheduled',
          sets: mData.sets || [{ setNumber: 1, scoreA: 0, scoreB: 0, completed: false }],
          winner: null, createdAt: new Date().toISOString(),
        };
        set(state => ({ matches: [...state.matches, newMatch] }));
      },

      updateMatch: (id, data) => {
        set(state => ({ matches: state.matches.map(m => m.id === id ? { ...m, ...data } : m) }));
      },

      updateMatchScore: (matchId, setNumber, scoreA, scoreB) => {
        const match = get().matches.find(m => m.id === matchId);
        if (!match) return;
        const game = get().games.find(g => g.id === match.gameId);
        const maxSets = game?.scoringConfig?.maxSets || 3;
        const pointsPerSet = game?.scoringConfig?.pointsPerSet || 21;
        const updatedSets = match.sets.map(s => s.setNumber === setNumber ? { ...s, scoreA, scoreB, completed: scoreA >= pointsPerSet || scoreB >= pointsPerSet } : s);
        const completedSets = updatedSets.filter(s => s.completed).length;
        const setsNeededToWin = Math.ceil(maxSets / 2);
        if (completedSets >= updatedSets.length && completedSets < maxSets && completedSets < setsNeededToWin) {
          updatedSets.push({ setNumber: updatedSets.length + 1, scoreA: 0, scoreB: 0, completed: false });
        }
        const setsWonA = updatedSets.filter(s => s.completed && s.scoreA > s.scoreB).length;
        const setsWonB = updatedSets.filter(s => s.completed && s.scoreB > s.scoreA).length;
        let winner: string | null = null;
        let status: Match['status'] = 'live';
        if (setsWonA >= setsNeededToWin) { winner = match.teamA; status = 'completed'; }
        else if (setsWonB >= setsNeededToWin) { winner = match.teamB; status = 'completed'; }
        set(state => ({ matches: state.matches.map(m => m.id === matchId ? { ...m, sets: updatedSets, winner, status } : m) }));
      },

      createAuction: (aData) => {
        const newAuction: Auction = { id: generateId(), tournamentId: aData.tournamentId || '', playerId: aData.playerId || '', basePrice: aData.basePrice || 50, soldTo: null, soldPrice: null, status: 'available', bids: [] };
        set(state => ({ auctions: [...state.auctions, newAuction] }));
      },

      placeBid: (auctionId, teamId, amount) => {
        const auction = get().auctions.find(a => a.id === auctionId);
        if (!auction || auction.status !== 'available') return false;
        const team = get().teams.find(t => t.id === teamId);
        if (!team || team.purse < amount) return false;
        const highestBid = auction.bids.reduce((max, b) => Math.max(max, b.amount), 0);
        if (amount <= highestBid) return false;
        const newBid = { id: generateId(), teamId, amount, timestamp: new Date().toISOString() };
        set(state => ({ auctions: state.auctions.map(a => a.id === auctionId ? { ...a, bids: [...a.bids, newBid] } : a) }));
        return true;
      },

      addNotification: (userId, title, message) => {
        const notif: Notification = { id: generateId(), userId, title, message, read: false, createdAt: new Date().toISOString() };
        set(state => ({ notifications: [...state.notifications, notif] }));
      },

      markNotificationRead: (id) => {
        set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
      },

      addAuditLog: (logData) => {
        const log: AuditLog = { id: generateId(), userId: logData.userId || '', userName: logData.userName || '', action: logData.action || '', entityType: logData.entityType || '', entityId: logData.entityId || '', oldValue: logData.oldValue || '', newValue: logData.newValue || '', timestamp: new Date().toISOString() };
        set(state => ({ auditLogs: [...state.auditLogs, log] }));
      },

      sendChatMessage: (userId, userName, message, tournamentId) => {
        const msg: ChatMessage = { id: generateId(), userId, userName, message, tournamentId, timestamp: new Date().toISOString() };
        set(state => ({ chatMessages: [...state.chatMessages, msg] }));
      },

      addVenue: (venueData) => {
        const venue: Venue = { id: generateId(), name: venueData.name || '', location: venueData.location || '', capacity: venueData.capacity || 100 };
        set(state => ({ venues: [...state.venues, venue] }));
      },
    }),
    {
      name: 'campus-sports-storage',
      version: 4,
    }
  )
);
