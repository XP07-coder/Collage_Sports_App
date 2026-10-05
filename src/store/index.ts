import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Team, JoinRequest, Tournament, Match, Auction, Notification, AuditLog, ChatMessage, Sport, Venue, EventRegistration, TeamEventRegistration } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Partial<User>) => boolean;
  updateUser: (id: string, data: Partial<User>) => void;
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;

  // Teams
  teams: Team[];
  createTeam: (team: Partial<Team>) => boolean;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Join Requests
  joinRequests: JoinRequest[];
  sendJoinRequest: (playerId: string, teamId: string) => boolean;
  respondToJoinRequest: (requestId: string, status: 'accepted' | 'rejected') => void;

  // Tournaments
  tournaments: Tournament[];
  createTournament: (t: Partial<Tournament>) => void;
  updateTournament: (id: string, data: Partial<Tournament>) => void;

  // Event Registrations
  eventRegistrations: EventRegistration[];
  submitEventRegistration: (playerId: string, tournamentId: string, sport: string) => boolean;
  approvePayment: (registrationId: string, adminId: string) => boolean;
  rejectPayment: (registrationId: string, adminId: string) => void;
  approveRegistration: (registrationId: string, adminId: string) => void;
  rejectRegistration: (registrationId: string, adminId: string) => void;
  isPlayerEligible: (playerId: string, tournamentId: string, sport: string) => boolean;

  // Team Event Registrations
  teamEventRegistrations: TeamEventRegistration[];
  submitTeamEventRegistration: (teamId: string, tournamentId: string, sport: string) => boolean;
  approveTeamPayment: (regId: string, adminId: string) => void;

  // Matches
  matches: Match[];
  createMatch: (m: Partial<Match>) => void;
  updateMatch: (id: string, data: Partial<Match>) => void;
  updateMatchScore: (matchId: string, setNumber: number, scoreA: number, scoreB: number) => void;

  // Auctions
  auctions: Auction[];
  createAuction: (a: Partial<Auction>) => void;
  placeBid: (auctionId: string, teamId: string, amount: number) => boolean;

  // Notifications
  notifications: Notification[];
  addNotification: (userId: string, title: string, message: string) => void;
  markNotificationRead: (id: string) => void;

  // Audit
  auditLogs: AuditLog[];
  addAuditLog: (log: Partial<AuditLog>) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (userId: string, userName: string, message: string, tournamentId: string) => void;

  // Sports
  sports: Sport[];
  addSport: (sport: Partial<Sport>) => void;

  // Venues
  venues: Venue[];
  addVenue: (venue: Partial<Venue>) => void;
}

const defaultSports: Sport[] = [
  { id: '1', name: 'Badminton', isSetBased: true, maxSets: 3, pointsPerSet: 21 },
  { id: '2', name: 'Volleyball', isSetBased: true, maxSets: 5, pointsPerSet: 25 },
  { id: '3', name: 'Basketball', isSetBased: false, maxSets: 4, pointsPerSet: 12 },
  { id: '4', name: 'Football', isSetBased: false, maxSets: 2, pointsPerSet: 45 },
  { id: '5', name: 'Cricket', isSetBased: false, maxSets: 2, pointsPerSet: 20 },
  { id: '6', name: 'Table Tennis', isSetBased: true, maxSets: 5, pointsPerSet: 11 },
  { id: '7', name: 'Kabaddi', isSetBased: false, maxSets: 2, pointsPerSet: 20 },
];

const defaultAdmin: User = {
  id: 'admin-001',
  email: 'admin@campus.edu',
  password: 'admin123',
  role: 'admin',
  fullName: 'System Administrator',
  phone: '9999999999',
  collegeId: 'ADMIN001',
  course: 'Administration',
  branch: 'Management',
  year: 'N/A',
  gender: 'Other',
  dob: '1990-01-01',
  bio: 'System Administrator',
  avatar: '',
  sports: [],
  position: '',
  verified: true,
  active: true,
  createdAt: new Date().toISOString(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [defaultAdmin],
      teams: [],
      joinRequests: [],
      tournaments: [],
      eventRegistrations: [],
      teamEventRegistrations: [],
      matches: [],
      auctions: [],
      notifications: [],
      auditLogs: [],
      chatMessages: [],
      sports: defaultSports,
      venues: [],

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user && user.active) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      register: (userData) => {
        const existing = get().users.find(u => u.email === userData.email);
        if (existing) return false;
        const newUser: User = {
          id: generateId(),
          email: userData.email || '',
          password: userData.password || '',
          role: userData.role || 'player',
          fullName: userData.fullName || '',
          phone: userData.phone || '',
          collegeId: userData.collegeId || '',
          course: userData.course || '',
          branch: userData.branch || '',
          year: userData.year || '',
          gender: userData.gender || '',
          dob: userData.dob || '',
          bio: userData.bio || '',
          avatar: userData.avatar || '',
          sports: userData.sports || [],
          position: userData.position || '',
          verified: true,
          active: true,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ users: [...state.users, newUser] }));
        get().addAuditLog({ userId: newUser.id, userName: newUser.fullName, action: 'Registered', entityType: 'user', entityId: newUser.id, oldValue: '', newValue: JSON.stringify({ role: newUser.role }) });
        get().addNotification(newUser.id, 'Welcome!', 'Your account has been created successfully. Complete your profile and register for events.');
        return true;
      },

      updateUser: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } as User : state.currentUser,
        }));
        const user = get().users.find(u => u.id === id);
        if (user) {
          get().addAuditLog({ userId: id, userName: user.fullName, action: 'Updated Profile', entityType: 'user', entityId: id, oldValue: '', newValue: JSON.stringify(Object.keys(data)) });
        }
      },

      suspendUser: (id) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, active: false } : u),
        }));
        const user = get().users.find(u => u.id === id);
        if (user) {
          get().addAuditLog({ userId: get().currentUser?.id || '', userName: get().currentUser?.fullName || '', action: 'Suspended User', entityType: 'user', entityId: id, oldValue: 'active', newValue: 'suspended' });
        }
      },

      activateUser: (id) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, active: true } : u),
        }));
      },

      createTeam: (teamData) => {
        const ownerTeams = get().teams.filter(t => t.ownerId === teamData.ownerId);
        if (ownerTeams.length > 0 && get().currentUser?.role !== 'admin') return false;
        const newTeam: Team = {
          id: generateId(),
          name: teamData.name || '',
          description: teamData.description || '',
          sports: teamData.sports || [],
          college: teamData.college || '',
          ownerId: teamData.ownerId || '',
          email: teamData.email || '',
          contact: teamData.contact || '',
          logo: teamData.logo || '',
          members: [],
          purse: 800,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ teams: [...state.teams, newTeam] }));
        get().addAuditLog({ userId: teamData.ownerId || '', userName: get().currentUser?.fullName || '', action: 'Created Team', entityType: 'team', entityId: newTeam.id, oldValue: '', newValue: newTeam.name });
        return true;
      },

      updateTeam: (id, data) => {
        const team = get().teams.find(t => t.id === id);
        set(state => ({ teams: state.teams.map(t => t.id === id ? { ...t, ...data } : t) }));
        if (team) {
          get().addAuditLog({ userId: get().currentUser?.id || '', userName: get().currentUser?.fullName || '', action: 'Updated Team', entityType: 'team', entityId: id, oldValue: '', newValue: JSON.stringify(Object.keys(data)) });
        }
      },

      deleteTeam: (id) => {
        set(state => ({ teams: state.teams.filter(t => t.id !== id) }));
      },

      sendJoinRequest: (playerId, teamId) => {
        const existing = get().joinRequests.find(r => r.playerId === playerId && r.teamId === teamId && r.status === 'pending');
        if (existing) return false;
        const isMember = get().teams.find(t => t.id === teamId)?.members.includes(playerId);
        if (isMember) return false;
        const newRequest: JoinRequest = {
          id: generateId(),
          playerId,
          teamId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ joinRequests: [...state.joinRequests, newRequest] }));
        const team = get().teams.find(t => t.id === teamId);
        if (team) {
          get().addNotification(team.ownerId, 'New Join Request', `A player wants to join ${team.name}`);
        }
        return true;
      },

      respondToJoinRequest: (requestId, status) => {
        const request = get().joinRequests.find(r => r.id === requestId);
        if (!request) return;
        set(state => ({
          joinRequests: state.joinRequests.map(r => r.id === requestId ? { ...r, status } : r),
        }));
        if (status === 'accepted') {
          const team = get().teams.find(t => t.id === request.teamId);
          if (team) {
            get().updateTeam(team.id, { members: [...team.members, request.playerId] });
            get().addNotification(request.playerId, 'Join Request Accepted', `You have been accepted into ${team.name}!`);
          }
        } else {
          get().addNotification(request.playerId, 'Join Request Rejected', 'Your join request was not accepted.');
        }
      },

      createTournament: (tData) => {
        const newTournament: Tournament = {
          id: generateId(),
          name: tData.name || '',
          description: tData.description || '',
          sports: tData.sports || [],
          startDate: tData.startDate || '',
          endDate: tData.endDate || '',
          registrationDeadline: tData.registrationDeadline || '',
          location: tData.location || '',
          status: tData.status || 'draft',
          createdBy: tData.createdBy || '',
          teams: [],
          players: [],
          pointsForWin: tData.pointsForWin || 3,
          pointsForDraw: tData.pointsForDraw || 1,
          pointsForLoss: tData.pointsForLoss || 0,
          registrationFee: tData.registrationFee || 100,
          teamRegistrationFee: tData.teamRegistrationFee || 0,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ tournaments: [...state.tournaments, newTournament] }));
        get().addAuditLog({ userId: tData.createdBy || '', userName: get().currentUser?.fullName || '', action: 'Created Tournament', entityType: 'tournament', entityId: newTournament.id, oldValue: '', newValue: newTournament.name });
      },

      updateTournament: (id, data) => {
        set(state => ({ tournaments: state.tournaments.map(t => t.id === id ? { ...t, ...data } : t) }));
      },

      submitEventRegistration: (playerId, tournamentId, sport) => {
        // Check for duplicate registration
        const existing = get().eventRegistrations.find(
          r => r.playerId === playerId && r.tournamentId === tournamentId && r.sport === sport && r.registrationStatus !== 'rejected' && r.registrationStatus !== 'cancelled'
        );
        if (existing) return false;

        const tournament = get().tournaments.find(t => t.id === tournamentId);
        if (!tournament) return false;

        const now = new Date().toISOString();
        const newReg: EventRegistration = {
          id: generateId(),
          playerId,
          tournamentId,
          sport,
          registrationStatus: 'payment_pending',
          paymentStatus: 'pending',
          registrationFee: tournament.registrationFee,
          submittedAt: now,
          approvedAt: null,
          approvedBy: null,
          rejectedAt: null,
          rejectedBy: null,
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({
          eventRegistrations: [...state.eventRegistrations, newReg],
          tournaments: state.tournaments.map(t => t.id === tournamentId ? { ...t, players: [...t.players, playerId] } : t),
        }));
        get().addNotification(playerId, 'Event Registration Submitted', `Your registration for ${tournament.name} (${sport}) has been submitted. Payment approval is pending.`);
        get().addAuditLog({ userId: playerId, userName: get().users.find(u => u.id === playerId)?.fullName || '', action: 'Submitted Event Registration', entityType: 'event_registration', entityId: newReg.id, oldValue: '', newValue: JSON.stringify({ tournament: tournament.name, sport, fee: tournament.registrationFee }) });
        return true;
      },

      approvePayment: (registrationId, adminId) => {
        const reg = get().eventRegistrations.find(r => r.id === registrationId);
        if (!reg) return false;
        const now = new Date().toISOString();
        set(state => ({
          eventRegistrations: state.eventRegistrations.map(r =>
            r.id === registrationId ? { ...r, paymentStatus: 'approved', registrationStatus: 'approved', approvedAt: now, approvedBy: adminId, updatedAt: now } : r
          ),
        }));
        const player = get().users.find(u => u.id === reg.playerId);
        const tournament = get().tournaments.find(t => t.id === reg.tournamentId);
        get().addNotification(reg.playerId, 'Payment Approved! ✓', `Your registration fee for ${tournament?.name} (${reg.sport}) has been approved. You are now ELIGIBLE to participate!`);
        get().addAuditLog({ userId: adminId, userName: get().currentUser?.fullName || '', action: 'Approved Payment', entityType: 'event_registration', entityId: registrationId, oldValue: `PENDING ₹${reg.registrationFee}`, newValue: `APPROVED` });
        return true;
      },

      rejectPayment: (registrationId, adminId) => {
        const reg = get().eventRegistrations.find(r => r.id === registrationId);
        if (!reg) return;
        const now = new Date().toISOString();
        set(state => ({
          eventRegistrations: state.eventRegistrations.map(r =>
            r.id === registrationId ? { ...r, paymentStatus: 'rejected', registrationStatus: 'rejected', rejectedAt: now, rejectedBy: adminId, updatedAt: now } : r
          ),
        }));
        const tournament = get().tournaments.find(t => t.id === reg.tournamentId);
        get().addNotification(reg.playerId, 'Payment Rejected', `Your registration fee for ${tournament?.name} (${reg.sport}) has been rejected.`);
        get().addAuditLog({ userId: adminId, userName: get().currentUser?.fullName || '', action: 'Rejected Payment', entityType: 'event_registration', entityId: registrationId, oldValue: `PENDING ₹${reg.registrationFee}`, newValue: `REJECTED` });
      },

      approveRegistration: (registrationId, adminId) => {
        const reg = get().eventRegistrations.find(r => r.id === registrationId);
        if (!reg) return;
        const now = new Date().toISOString();
        set(state => ({
          eventRegistrations: state.eventRegistrations.map(r =>
            r.id === registrationId ? { ...r, registrationStatus: 'approved', approvedAt: now, approvedBy: adminId, updatedAt: now } : r
          ),
        }));
      },

      rejectRegistration: (registrationId, adminId) => {
        const reg = get().eventRegistrations.find(r => r.id === registrationId);
        if (!reg) return;
        const now = new Date().toISOString();
        set(state => ({
          eventRegistrations: state.eventRegistrations.map(r =>
            r.id === registrationId ? { ...r, registrationStatus: 'rejected', rejectedAt: now, rejectedBy: adminId, updatedAt: now } : r
          ),
        }));
      },

      isPlayerEligible: (playerId, tournamentId, sport) => {
        const player = get().users.find(u => u.id === playerId);
        if (!player || !player.active) return false;
        const reg = get().eventRegistrations.find(
          r => r.playerId === playerId && r.tournamentId === tournamentId && r.sport === sport
        );
        if (!reg) return false;
        if (reg.registrationStatus !== 'approved') return false;
        if (reg.paymentStatus !== 'approved' && reg.registrationFee > 0) return false;
        return true;
      },

      submitTeamEventRegistration: (teamId, tournamentId, sport) => {
        const existing = get().teamEventRegistrations.find(
          r => r.teamId === teamId && r.tournamentId === tournamentId && r.sport === sport && r.registrationStatus !== 'rejected' && r.registrationStatus !== 'cancelled'
        );
        if (existing) return false;

        const tournament = get().tournaments.find(t => t.id === tournamentId);
        if (!tournament) return false;

        const now = new Date().toISOString();
        const fee = tournament.teamRegistrationFee;
        const newReg: TeamEventRegistration = {
          id: generateId(),
          teamId,
          tournamentId,
          sport,
          registrationStatus: fee > 0 ? 'payment_pending' : 'approved',
          paymentStatus: fee > 0 ? 'pending' : 'not_required',
          registrationFee: fee,
          submittedAt: now,
          approvedAt: fee === 0 ? now : null,
          approvedBy: fee === 0 ? 'system' : null,
          createdAt: now,
        };
        set(state => ({
          teamEventRegistrations: [...state.teamEventRegistrations, newReg],
          tournaments: state.tournaments.map(t => t.id === tournamentId ? { ...t, teams: [...t.teams, teamId] } : t),
        }));
        return true;
      },

      approveTeamPayment: (regId, adminId) => {
        const now = new Date().toISOString();
        set(state => ({
          teamEventRegistrations: state.teamEventRegistrations.map(r =>
            r.id === regId ? { ...r, paymentStatus: 'approved' as const, registrationStatus: 'approved' as const, approvedAt: now, approvedBy: adminId } : r
          ),
        }));
      },

      createMatch: (mData) => {
        const newMatch: Match = {
          id: generateId(),
          tournamentId: mData.tournamentId || '',
          teamA: mData.teamA || '',
          teamB: mData.teamB || '',
          sport: mData.sport || '',
          venue: mData.venue || '',
          scheduledDate: mData.scheduledDate || '',
          refereeId: mData.refereeId || '',
          status: mData.status || 'scheduled',
          sets: mData.sets || [{ setNumber: 1, scoreA: 0, scoreB: 0, completed: false }],
          winner: null,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ matches: [...state.matches, newMatch] }));
      },

      updateMatch: (id, data) => {
        set(state => ({ matches: state.matches.map(m => m.id === id ? { ...m, ...data } : m) }));
      },

      updateMatchScore: (matchId, setNumber, scoreA, scoreB) => {
        const match = get().matches.find(m => m.id === matchId);
        if (!match) return;
        const sport = get().sports.find(s => s.name === match.sport);
        const maxSets = sport?.maxSets || 3;
        const pointsPerSet = sport?.pointsPerSet || 21;

        const updatedSets = match.sets.map(s =>
          s.setNumber === setNumber ? { ...s, scoreA, scoreB, completed: scoreA >= pointsPerSet || scoreB >= pointsPerSet } : s
        );

        const completedSets = updatedSets.filter(s => s.completed).length;
        const setsNeededToWin = Math.ceil(maxSets / 2);
        if (completedSets >= updatedSets.length && completedSets < maxSets && completedSets < setsNeededToWin) {
          updatedSets.push({ setNumber: updatedSets.length + 1, scoreA: 0, scoreB: 0, completed: false });
        }

        const setsWonA = updatedSets.filter(s => s.completed && s.scoreA > s.scoreB).length;
        const setsWonB = updatedSets.filter(s => s.completed && s.scoreB > s.scoreA).length;
        let winner: string | null = null;
        let status: Match['status'] = 'live';

        if (setsWonA >= setsNeededToWin) {
          winner = match.teamA;
          status = 'completed';
        } else if (setsWonB >= setsNeededToWin) {
          winner = match.teamB;
          status = 'completed';
        }

        set(state => ({
          matches: state.matches.map(m =>
            m.id === matchId ? { ...m, sets: updatedSets, winner, status } : m
          ),
        }));
      },

      createAuction: (aData) => {
        const newAuction: Auction = {
          id: generateId(),
          tournamentId: aData.tournamentId || '',
          playerId: aData.playerId || '',
          basePrice: aData.basePrice || 50,
          soldTo: null,
          soldPrice: null,
          status: 'available',
          bids: [],
        };
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
        set(state => ({
          auctions: state.auctions.map(a =>
            a.id === auctionId ? { ...a, bids: [...a.bids, newBid] } : a
          ),
        }));
        return true;
      },

      addNotification: (userId, title, message) => {
        const notif: Notification = {
          id: generateId(),
          userId,
          title,
          message,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [...state.notifications, notif] }));
      },

      markNotificationRead: (id) => {
        set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
      },

      addAuditLog: (logData) => {
        const log: AuditLog = {
          id: generateId(),
          userId: logData.userId || '',
          userName: logData.userName || '',
          action: logData.action || '',
          entityType: logData.entityType || '',
          entityId: logData.entityId || '',
          oldValue: logData.oldValue || '',
          newValue: logData.newValue || '',
          timestamp: new Date().toISOString(),
        };
        set(state => ({ auditLogs: [...state.auditLogs, log] }));
      },

      sendChatMessage: (userId, userName, message, tournamentId) => {
        const msg: ChatMessage = {
          id: generateId(),
          userId,
          userName,
          message,
          tournamentId,
          timestamp: new Date().toISOString(),
        };
        set(state => ({ chatMessages: [...state.chatMessages, msg] }));
      },

      addSport: (sportData) => {
        const sport: Sport = {
          id: generateId(),
          name: sportData.name || '',
          isSetBased: sportData.isSetBased || false,
          maxSets: sportData.maxSets || 3,
          pointsPerSet: sportData.pointsPerSet || 21,
        };
        set(state => ({ sports: [...state.sports, sport] }));
      },

      addVenue: (venueData) => {
        const venue: Venue = {
          id: generateId(),
          name: venueData.name || '',
          location: venueData.location || '',
          capacity: venueData.capacity || 100,
        };
        set(state => ({ venues: [...state.venues, venue] }));
      },
    }),
    {
      name: 'campus-sports-storage',
    }
  )
);
