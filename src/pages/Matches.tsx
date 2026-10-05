import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Calendar, Plus, Search, Play, CheckCircle } from 'lucide-react';

export default function Matches() {
  const { matches, teams, tournaments, users, currentUser, createMatch, updateMatch, updateMatchScore, games } = useStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ tournamentId: '', teamA: '', teamB: '', venue: '', scheduledDate: '', refereeId: '' });

  const filtered = matches.filter(m => { const teamA = teams.find(t => t.id === m.teamA); const teamB = teams.find(t => t.id === m.teamB); const game = games.find(g => g.id === m.gameId); const searchLower = search.toLowerCase(); return teamA?.name.toLowerCase().includes(searchLower) || teamB?.name.toLowerCase().includes(searchLower) || game?.name.toLowerCase().includes(searchLower); });
  const handleCreate = () => { if (!form.tournamentId || !form.teamA || !form.teamB) return; const tournament = tournaments.find(t => t.id === form.tournamentId); createMatch({ ...form, gameId: (tournament?.games || [])[0] || '', status: 'scheduled' }); setShowCreate(false); setForm({ tournamentId: '', teamA: '', teamB: '', venue: '', scheduledDate: '', refereeId: '' }); };
  const referees = users.filter(u => u.role === 'referee');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Calendar className="w-6 h-6 text-green-500" /><h1 className="text-2xl font-bold">Matches</h1></div>{currentUser?.role === 'admin' && <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"><Plus className="w-4 h-4" />Schedule</button>}</div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
      {showCreate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-4">Schedule Match</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={form.tournamentId} onChange={e => setForm({ ...form, tournamentId: e.target.value })} className="px-3 py-2 border rounded-lg"><option value="">Select Tournament *</option>{tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
            <select value={form.teamA} onChange={e => setForm({ ...form, teamA: e.target.value })} className="px-3 py-2 border rounded-lg"><option value="">Team A *</option>{form.tournamentId && (tournaments.find(t => t.id === form.tournamentId)?.teams || []).map(tid => { const team = teams.find(t => t.id === tid); return <option key={tid} value={tid}>{team?.name}</option>; })}</select>
            <select value={form.teamB} onChange={e => setForm({ ...form, teamB: e.target.value })} className="px-3 py-2 border rounded-lg"><option value="">Team B *</option>{form.tournamentId && (tournaments.find(t => t.id === form.tournamentId)?.teams || []).map(tid => { const team = teams.find(t => t.id === tid); return <option key={tid} value={tid}>{team?.name}</option>; })}</select>
            <input type="text" placeholder="Venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="date" value={form.scheduledDate} onChange={e => setForm({ ...form, scheduledDate: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <select value={form.refereeId} onChange={e => setForm({ ...form, refereeId: e.target.value })} className="px-3 py-2 border rounded-lg"><option value="">Assign Referee</option>{referees.map(r => <option key={r.id} value={r.id}>{r.fullName}</option>)}</select>
          </div>
          <div className="flex gap-2 mt-4"><button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg">Schedule</button><button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button></div>
        </div>
      )}
      <div className="space-y-3">
        {filtered.map(match => {
          const teamA = teams.find(t => t.id === match.teamA);
          const teamB = teams.find(t => t.id === match.teamB);
          const game = games.find(g => g.id === match.gameId);
          return (
            <div key={match.id} onClick={() => navigate(`/match/${match.id}`)} className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-400">{game?.icon} {game?.name}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${match.status === 'live' ? 'bg-red-100 text-red-700 animate-pulse' : match.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{match.status === 'live' && '🔴 '}{match.status.toUpperCase()}</span></div>
              <div className="flex items-center justify-between"><div className="text-center flex-1"><p className="font-semibold">{teamA?.name}</p></div><div className="px-4 text-center"><p className="text-xs text-gray-400">vs</p>{match.winner && <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-1" />}</div><div className="text-center flex-1"><p className="font-semibold">{teamB?.name}</p></div></div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-gray-500"><Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No matches found</p></div>}
    </div>
  );
}
