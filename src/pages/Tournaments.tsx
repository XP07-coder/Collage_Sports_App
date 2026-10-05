import { useState } from 'react';
import { useStore } from '../store';
import { Trophy, Plus, Search, Calendar, MapPin } from 'lucide-react';

export default function Tournaments() {
  const { tournaments, currentUser, sports, createTournament, updateTournament, registerTeamForTournament, teams } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', sport: '', startDate: '', endDate: '', location: '', pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0 });

  const filtered = tournaments.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.sport.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!form.name || !form.sport) return;
    createTournament({ ...form, createdBy: currentUser?.id || '', status: 'draft' });
    setShowCreate(false);
    setForm({ name: '', description: '', sport: '', startDate: '', endDate: '', location: '', pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0 });
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    registration_open: 'bg-blue-100 text-blue-700',
    registration_closed: 'bg-yellow-100 text-yellow-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
    archived: 'bg-gray-200 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-800">Tournaments</h1>
        </div>
        {currentUser?.role === 'admin' && (
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Create Tournament
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tournaments..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Create New Tournament</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Tournament Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <select value={form.sport} onChange={e => setForm({...form, sport: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select Sport *</option>
              {sports.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Start Date" />
            <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" placeholder="End Date" />
            <input type="text" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg md:col-span-2" rows={2} />
            <div className="flex gap-2">
              <label className="text-sm">Win: <input type="number" value={form.pointsForWin} onChange={e => setForm({...form, pointsForWin: +e.target.value})} className="w-16 px-2 py-1 border rounded" /></label>
              <label className="text-sm">Draw: <input type="number" value={form.pointsForDraw} onChange={e => setForm({...form, pointsForDraw: +e.target.value})} className="w-16 px-2 py-1 border rounded" /></label>
              <label className="text-sm">Loss: <input type="number" value={form.pointsForLoss} onChange={e => setForm({...form, pointsForLoss: +e.target.value})} className="w-16 px-2 py-1 border rounded" /></label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Create</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      {/* Tournament List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.sport}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status] || 'bg-gray-100'}`}>
                {t.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{t.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.startDate || 'TBD'}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.location || 'TBD'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t.teams.length} teams registered</span>
              {currentUser?.role === 'admin' && (
                <select value={t.status} onChange={e => updateTournament(t.id, { status: e.target.value as any })}
                  className="text-xs border rounded px-2 py-1">
                  <option value="draft">Draft</option>
                  <option value="registration_open">Registration Open</option>
                  <option value="registration_closed">Registration Closed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
              {(currentUser?.role === 'team_owner') && t.status === 'registration_open' && (
                <button onClick={() => {
                  const myTeam = teams.find(tm => tm.ownerId === currentUser.id);
                  if (myTeam && !t.teams.includes(myTeam.id)) registerTeamForTournament(t.id, myTeam.id);
                }} className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Register Team
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No tournaments found</p>
        </div>
      )}
    </div>
  );
}
