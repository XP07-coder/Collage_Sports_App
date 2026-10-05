import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Trophy, Plus, Search, Calendar, MapPin, Eye } from 'lucide-react';

export default function Tournaments() {
  const { tournaments, currentUser, games, createTournament, updateTournament } = useStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', games: [] as string[], startDate: '', endDate: '', registrationDeadline: '', location: '' });

  const filtered = tournaments.filter(t => {
    const gameNames = (t.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(' ').toLowerCase();
    return t.name.toLowerCase().includes(search.toLowerCase()) || gameNames.includes(search.toLowerCase());
  });

  const handleCreate = () => {
    if (!form.name || form.games.length === 0) return;
    createTournament({ ...form, createdBy: currentUser?.id || '', status: 'draft' });
    setShowCreate(false);
    setForm({ name: '', description: '', games: [], startDate: '', endDate: '', registrationDeadline: '', location: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Trophy className="w-6 h-6 text-yellow-500" /><h1 className="text-2xl font-bold">Tournaments</h1></div>
        {currentUser?.role === 'admin' && <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><Plus className="w-4 h-4" />Create</button>}
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
      {showCreate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-4">Create Tournament</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="px-3 py-2 border rounded-lg" />
          </div>
          <div className="mt-4"><label className="block text-sm font-medium mb-2">Select Games *</label><div className="flex flex-wrap gap-2">{games.filter(g => g.isActive).map(g => (<button key={g.id} type="button" onClick={() => setForm(f => ({ ...f, games: f.games.includes(g.id) ? f.games.filter(x => x !== g.id) : [...f.games, g.id] }))} className={`px-3 py-1 rounded-full text-sm border-2 ${form.games.includes(g.id) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>{form.games.includes(g.id) ? '✓ ' : ''}{g.icon} {g.name}</button>))}</div></div>
          <div className="flex gap-2 mt-4"><button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg">Create</button><button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => {
          const gameNames = (t.games || []).map(gid => games.find(g => g.id === gid)?.name || gid);
          return (
            <div key={t.id} onClick={() => navigate(`/tournament/${t.id}`)} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md cursor-pointer">
              <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold text-lg">{t.name}</h3><p className="text-sm text-gray-500">{gameNames.join(', ')}</p></div><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === 'ongoing' ? 'bg-green-100 text-green-700' : t.status === 'registration_open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{t.status.replace('_', ' ')}</span></div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{t.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.startDate || 'TBD'}</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.location || 'TBD'}</span></div>
              <div className="flex items-center justify-between mt-3"><span className="text-xs text-gray-500">{(t.teams || []).length} teams</span>{currentUser?.role === 'admin' && <select value={t.status} onClick={e => e.stopPropagation()} onChange={e => updateTournament(t.id, { status: e.target.value as any })} className="text-xs border rounded px-2 py-1"><option value="draft">Draft</option><option value="registration_open">Reg Open</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="archived">Archived</option></select>}<Eye className="w-4 h-4 text-gray-400" /></div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-gray-500"><Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No tournaments found</p></div>}
    </div>
  );
}
