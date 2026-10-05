import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, Trophy, Calendar, Users, Bell } from 'lucide-react';

export default function PlayerDashboard() {
  const { currentUser, teams, matches, tournaments, notifications, eventRegistrations, games } = useStore();
  const navigate = useNavigate();
  const myTeam = teams.find(t => t.members.includes(currentUser?.id || ''));
  const myMatches = matches.filter(m => m.teamA === myTeam?.id || m.teamB === myTeam?.id);
  const upcomingMatches = myMatches.filter(m => m.status === 'scheduled' || m.status === 'live');
  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;
  const myRegs = eventRegistrations.filter(r => r.playerId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser?.fullName}</h1>
        <p className="text-gray-600 mt-1">Player Dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Users className="w-8 h-8 text-purple-500 mb-2" /><p className="text-2xl font-bold">{myTeam ? 1 : 0}</p><p className="text-xs text-gray-500">My Team</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Calendar className="w-8 h-8 text-blue-500 mb-2" /><p className="text-2xl font-bold">{upcomingMatches.length}</p><p className="text-xs text-gray-500">Upcoming</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Trophy className="w-8 h-8 text-yellow-500 mb-2" /><p className="text-2xl font-bold">{myRegs.length}</p><p className="text-xs text-gray-500">Events</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Bell className="w-8 h-8 text-red-500 mb-2" /><p className="text-2xl font-bold">{unreadNotifs}</p><p className="text-xs text-gray-500">Notifications</p></div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold mb-3">My Team</h3>
        {myTeam ? (
          <div onClick={() => navigate(`/team/${myTeam.id}`)} className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"><span className="text-2xl font-bold text-purple-600">{myTeam.name.charAt(0)}</span></div>
            <div><p className="font-semibold text-lg">{myTeam.name}</p><p className="text-sm text-gray-500">{(myTeam.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(', ')}</p></div>
          </div>
        ) : (<p className="text-sm text-gray-500">No team yet. <button onClick={() => navigate('/teams')} className="text-indigo-600 underline">Browse teams</button></p>)}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">My Events</h3><button onClick={() => navigate('/events')} className="text-xs text-indigo-600">View All →</button></div>
        {myRegs.length === 0 ? (<p className="text-sm text-gray-500">No registrations. <button onClick={() => navigate('/tournaments')} className="text-indigo-600 underline">Browse tournaments</button></p>) : (
          <div className="space-y-2">{myRegs.slice(0, 3).map(reg => {
            const t = tournaments.find(x => x.id === reg.tournamentId);
            const g = games.find(x => x.id === reg.gameId);
            const eligible = reg.registrationStatus === 'APPROVED' && (reg.paymentStatus === 'APPROVED' || reg.registrationFee === 0);
            return (
              <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="text-sm font-medium">{t?.name}</p><p className="text-xs text-gray-500">{g?.icon} {g?.name} • ₹{reg.registrationFee}</p></div>
                <span className={`text-xs px-2 py-1 rounded-full ${eligible ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{eligible ? '✓ Eligible' : '⏳ Pending'}</span>
              </div>
            );
          })}</div>
        )}
      </div>
    </div>
  );
}
