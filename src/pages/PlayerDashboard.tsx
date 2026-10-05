import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { User, Trophy, Calendar, Users, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PlayerDashboard() {
  const { currentUser, teams, matches, tournaments, notifications, eventRegistrations } = useStore();
  const navigate = useNavigate();
  const myTeam = teams.find(t => t.members.includes(currentUser?.id || ''));
  const myMatches = matches.filter(m => m.teamA === myTeam?.id || m.teamB === myTeam?.id);
  const upcomingMatches = myMatches.filter(m => m.status === 'scheduled' || m.status === 'live');
  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {currentUser?.fullName}</h1>
          <p className="text-sm text-gray-500">Player Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Users className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-2xl font-bold">{myTeam ? 1 : 0}</p>
          <p className="text-xs text-gray-500">My Team</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Calendar className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{upcomingMatches.length}</p>
          <p className="text-xs text-gray-500">Upcoming Matches</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">{tournaments.filter(t => (t.teams || []).includes(myTeam?.id || '')).length}</p>
          <p className="text-xs text-gray-500">Tournaments</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Bell className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-2xl font-bold">{unreadNotifs}</p>
          <p className="text-xs text-gray-500">Notifications</p>
        </div>
      </div>

      {/* My Team */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">My Team</h3>
        {myTeam ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">{myTeam.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-lg">{myTeam.name}</p>
              <p className="text-sm text-gray-500">{myTeam.sports?.join(', ')} • {myTeam.college}</p>
              <p className="text-xs text-gray-400">{myTeam.members.length} members</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">You haven't joined a team yet. Browse teams and send a join request!</p>
        )}
      </div>

      {/* My Event Registrations */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">My Events</h3>
          <button onClick={() => navigate('/events')} className="text-xs text-indigo-600 hover:text-indigo-700">View All →</button>
        </div>
        {eventRegistrations.filter(r => r.playerId === currentUser?.id).length === 0 ? (
          <p className="text-sm text-gray-500">No event registrations. <button onClick={() => navigate('/tournaments')} className="text-indigo-600 underline">Browse tournaments</button></p>
        ) : (
          <div className="space-y-2">
            {eventRegistrations.filter(r => r.playerId === currentUser?.id).slice(0, 3).map(reg => {
              const tournament = tournaments.find(t => t.id === reg.tournamentId);
              const eligible = reg.registrationStatus === 'approved' && (reg.paymentStatus === 'approved' || reg.registrationFee === 0);
              return (
                <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{tournament?.name}</p>
                    <p className="text-xs text-gray-500">{reg.sport} • ₹{reg.registrationFee}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {eligible ? (
                      <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" /> Eligible</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-yellow-600"><AlertTriangle className="w-3 h-3" /> Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Matches */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Upcoming Matches</h3>
        {upcomingMatches.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming matches</p>
        ) : (
          <div className="space-y-2">
            {upcomingMatches.slice(0, 5).map(m => {
              const teamA = teams.find(t => t.id === m.teamA);
              const teamB = teams.find(t => t.id === m.teamB);
              return (
                <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{teamA?.name}</span>
                    <span className="text-xs text-gray-400">vs</span>
                    <span className="text-sm font-medium">{teamB?.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    m.status === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {m.status === 'live' ? '🔴 LIVE' : 'Scheduled'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
