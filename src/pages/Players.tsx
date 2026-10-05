import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { UserCircle, Search, Shield, Mail, Eye } from 'lucide-react';

export default function Players() {
  const { users, teams, currentUser } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const players = users.filter(u => u.role === 'player');
  const filtered = players.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()) || p.sports?.some(s => s.toLowerCase().includes(search.toLowerCase())) || p.collegeId.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCircle className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">Players</h1>
        <span className="text-sm text-gray-500">({filtered.length} players)</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, sport, or college ID..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(player => {
          const playerTeam = teams.find(t => t.members.includes(player.id));
          return (
            <div key={player.id} onClick={() => navigate(`/player/${player.id}`)} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{player.fullName.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{player.fullName}</h3>
                  <p className="text-xs text-gray-500">{player.collegeId}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Shield className="w-3 h-3" />{player.sports?.join(', ') || 'Not specified'}</p>
                <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{player.email}</p>
                <p className="text-xs text-gray-400">{player.course} {player.branch && `• ${player.branch}`} {player.year && `• ${player.year}`}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                {playerTeam ? (
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{playerTeam.name}</span>
                ) : (
                  <span className="text-xs text-gray-400">No team</span>
                )}
                {currentUser?.role === 'admin' && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${player.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {player.active ? 'Active' : 'Suspended'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No players found</p>
        </div>
      )}
    </div>
  );
}
