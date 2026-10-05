import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Users, Plus, Search, UserPlus, Eye } from 'lucide-react';

export default function Teams() {
  const { teams, currentUser, sports, createTeam, sendJoinRequest, users } = useStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', sports: [] as string[], college: '', email: '', contact: '' });

  const filtered = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || (t.sports || []).some(s => s.toLowerCase().includes(search.toLowerCase())));

  const handleCreate = () => {
    if (!form.name || form.sports.length === 0) return;
    const result = createTeam({ ...form, ownerId: currentUser?.id });
    if (result) {
      setShowCreate(false);
      setForm({ name: '', description: '', sports: [], college: '', email: '', contact: '' });
    }
  };

  const toggleSport = (sportName: string) => {
    setForm(f => ({
      ...f,
      sports: f.sports.includes(sportName) ? f.sports.filter(s => s !== sportName) : [...f.sports, sportName]
    }));
  };

  const canCreateTeam = currentUser?.role === 'team_owner' && !teams.find(t => t.ownerId === currentUser?.id) || currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-800">Teams</h1>
        </div>
        {canCreateTeam && (
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="w-4 h-4" /> Create Team
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Create New Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Team Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="College" value={form.college} onChange={e => setForm({...form, college: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="email" placeholder="Team Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Contact" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg md:col-span-2" rows={2} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Sports *</label>
            <div className="flex flex-wrap gap-2">
              {sports.map(s => (
                <button key={s.id} type="button" onClick={() => toggleSport(s.name)}
                  className={`px-3 py-1 rounded-full text-sm border-2 transition-all ${
                    form.sports.includes(s.name) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {form.sports.includes(s.name) ? '✓ ' : ''}{s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Create Team</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(team => {
          const owner = users.find(u => u.id === team.ownerId);
          const isMember = team.members.includes(currentUser?.id || '');
          const hasPendingRequest = useStore.getState().joinRequests.some(r => r.playerId === currentUser?.id && r.teamId === team.id && r.status === 'pending');
          return (
            <div key={team.id} onClick={() => navigate(`/team/${team.id}`)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                  {team.logo ? <img src={team.logo} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-white">{team.name.charAt(0)}</span>}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{team.name}</h3>
                  <p className="text-sm text-gray-500">{(team.sports || []).join(', ')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{team.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{team.members.length} members</span>
                <span>Owner: {owner?.fullName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-green-600 font-medium">Purse: ₹{team.purse}</span>
                {currentUser?.role === 'player' && !isMember && !hasPendingRequest && (
                  <button onClick={() => sendJoinRequest(currentUser.id, team.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <UserPlus className="w-3 h-3" /> Join
                  </button>
                )}
                {isMember && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Member</span>}
                {hasPendingRequest && <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>}
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No teams found</p>
        </div>
      )}
    </div>
  );
}
