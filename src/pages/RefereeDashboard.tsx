import { useStore } from '../store';
import { Flag, Calendar, Radio, CheckCircle } from 'lucide-react';

export default function RefereeDashboard() {
  const { currentUser, matches, teams, games } = useStore();
  const myMatches = matches.filter(m => m.refereeId === currentUser?.id);
  const liveMatches = myMatches.filter(m => m.status === 'live');
  const upcomingMatches = myMatches.filter(m => m.status === 'scheduled');

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-gray-800">Referee Dashboard</h1><p className="text-gray-600 mt-1">Manage your matches</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Radio className="w-8 h-8 text-red-500 mb-2" /><p className="text-2xl font-bold">{liveMatches.length}</p><p className="text-xs text-gray-500">Live</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Calendar className="w-8 h-8 text-blue-500 mb-2" /><p className="text-2xl font-bold">{upcomingMatches.length}</p><p className="text-xs text-gray-500">Upcoming</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><CheckCircle className="w-8 h-8 text-green-500 mb-2" /><p className="text-2xl font-bold">{myMatches.filter(m => m.status === 'completed').length}</p><p className="text-xs text-gray-500">Completed</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><Flag className="w-8 h-8 text-purple-500 mb-2" /><p className="text-2xl font-bold">{myMatches.length}</p><p className="text-xs text-gray-500">Total</p></div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold mb-3">Assigned Matches</h3>
        {myMatches.length === 0 ? (<p className="text-sm text-gray-500">No matches assigned</p>) : (
          <div className="space-y-2">{myMatches.map(m => {
            const teamA = teams.find(t => t.id === m.teamA);
            const teamB = teams.find(t => t.id === m.teamB);
            const game = games.find(g => g.id === m.gameId);
            return (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="text-sm font-medium">{teamA?.name} vs {teamB?.name}</p><p className="text-xs text-gray-500">{game?.icon} {game?.name} • {m.venue}</p></div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.status === 'live' ? 'bg-red-100 text-red-700' : m.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{m.status}</span>
              </div>
            );
          })}</div>
        )}
      </div>
    </div>
  );
}
