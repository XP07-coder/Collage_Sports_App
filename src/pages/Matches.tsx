import { useState } from 'react';
import { useStore } from '../store';
import { Calendar, Plus, Search, Play, CheckCircle, XCircle } from 'lucide-react';

export default function Matches() {
  const { matches, teams, tournaments, users, currentUser, createMatch, updateMatch, updateMatchScore, sports } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [form, setForm] = useState({ tournamentId: '', teamA: '', teamB: '', venue: '', scheduledDate: '', refereeId: '' });

  const filtered = matches.filter(m => {
    const teamA = teams.find(t => t.id === m.teamA);
    const teamB = teams.find(t => t.id === m.teamB);
    const searchLower = search.toLowerCase();
    return teamA?.name.toLowerCase().includes(searchLower) || teamB?.name.toLowerCase().includes(searchLower) || m.sport.toLowerCase().includes(searchLower);
  });

  const handleCreate = () => {
    if (!form.tournamentId || !form.teamA || !form.teamB) return;
    const tournament = tournaments.find(t => t.id === form.tournamentId);
    createMatch({ ...form, sport: tournament?.sport || '', status: 'scheduled' });
    setShowCreate(false);
    setForm({ tournamentId: '', teamA: '', teamB: '', venue: '', scheduledDate: '', refereeId: '' });
  };

  const referees = users.filter(u => u.role === 'referee');
  const selectedMatchData = matches.find(m => m.id === selectedMatch);
  const canScore = currentUser?.role === 'referee' || currentUser?.role === 'admin';
  const isAssignedReferee = selectedMatchData?.refereeId === currentUser?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
        </div>
        {currentUser?.role === 'admin' && (
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4" /> Schedule Match
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search matches..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Schedule Match</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={form.tournamentId} onChange={e => setForm({...form, tournamentId: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select Tournament *</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={form.teamA} onChange={e => setForm({...form, teamA: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Team A *</option>
              {form.tournamentId && tournaments.find(t => t.id === form.tournamentId)?.teams.map(tid => {
                const team = teams.find(t => t.id === tid);
                return <option key={tid} value={tid}>{team?.name}</option>;
              })}
            </select>
            <select value={form.teamB} onChange={e => setForm({...form, teamB: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Team B *</option>
              {form.tournamentId && tournaments.find(t => t.id === form.tournamentId)?.teams.map(tid => {
                const team = teams.find(t => t.id === tid);
                return <option key={tid} value={tid}>{team?.name}</option>;
              })}
            </select>
            <input type="text" placeholder="Venue" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
            <select value={form.refereeId} onChange={e => setForm({...form, refereeId: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Assign Referee</option>
              {referees.map(r => <option key={r.id} value={r.id}>{r.fullName}</option>)}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Schedule</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Match List */}
      <div className="space-y-3">
        {filtered.map(match => {
          const teamA = teams.find(t => t.id === match.teamA);
          const teamB = teams.find(t => t.id === match.teamB);
          const tournament = tournaments.find(t => t.id === match.tournamentId);
          const referee = users.find(u => u.id === match.refereeId);
          return (
            <div key={match.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{tournament?.name} • {match.sport}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  match.status === 'live' ? 'bg-red-100 text-red-700 animate-pulse' :
                  match.status === 'completed' ? 'bg-green-100 text-green-700' :
                  match.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {match.status === 'live' && '🔴 '}{match.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="font-semibold">{teamA?.name}</p>
                  {match.status !== 'scheduled' && (
                    <p className="text-sm text-gray-500">Sets: {match.sets.filter(s => s.completed && s.scoreA > s.scoreB).length}</p>
                  )}
                </div>
                <div className="px-4 text-center">
                  <p className="text-xs text-gray-400">vs</p>
                  {match.winner && <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-1" />}
                </div>
                <div className="text-center flex-1">
                  <p className="font-semibold">{teamB?.name}</p>
                  {match.status !== 'scheduled' && (
                    <p className="text-sm text-gray-500">Sets: {match.sets.filter(s => s.completed && s.scoreB > s.scoreA).length}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  {match.venue && <span>Venue: {match.venue} </span>}
                  {referee && <span>• Ref: {referee.fullName}</span>}
                </div>
                <div className="flex gap-2">
                  {match.status === 'scheduled' && currentUser?.role === 'admin' && (
                    <button onClick={() => updateMatch(match.id, { status: 'live' })}
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <Play className="w-3 h-3" /> Start
                    </button>
                  )}
                  {match.status === 'live' && canScore && (isAssignedReferee || currentUser?.role === 'admin') && (
                    <button onClick={() => setSelectedMatch(match.id)}
                      className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Enter Score
                    </button>
                  )}
                  {match.status === 'live' && currentUser?.role === 'admin' && (
                    <button onClick={() => updateMatch(match.id, { status: 'completed' })}
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      <CheckCircle className="w-3 h-3" /> End
                    </button>
                  )}
                </div>
              </div>

              {/* Sets display */}
              {match.sets.length > 0 && match.status !== 'scheduled' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <span className="font-medium text-gray-500">Set</span>
                    <span className="font-medium text-gray-500">{teamA?.name}</span>
                    <span className="font-medium text-gray-500">{teamB?.name}</span>
                    <span className="font-medium text-gray-500">Status</span>
                    {match.sets.map(s => (
                      <>
                        <span key={`label-${s.setNumber}`} className="font-medium">Set {s.setNumber}</span>
                        <span key={`a-${s.setNumber}`} className={s.scoreA > s.scoreB ? 'text-green-600 font-bold' : ''}>{s.scoreA}</span>
                        <span key={`b-${s.setNumber}`} className={s.scoreB > s.scoreA ? 'text-green-600 font-bold' : ''}>{s.scoreB}</span>
                        <span key={`status-${s.setNumber}`}>{s.completed ? '✓' : '...'}</span>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score Entry Modal */}
      {selectedMatch && selectedMatchData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="font-semibold text-lg mb-4">Enter Score - Set {selectedMatchData.sets.length}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{teams.find(t => t.id === selectedMatchData.teamA)?.name}</label>
                  <input type="number" id="scoreA" defaultValue={selectedMatchData.sets[selectedMatchData.sets.length - 1]?.scoreA || 0}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-center text-xl font-bold" min="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{teams.find(t => t.id === selectedMatchData.teamB)?.name}</label>
                  <input type="number" id="scoreB" defaultValue={selectedMatchData.sets[selectedMatchData.sets.length - 1]?.scoreB || 0}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-center text-xl font-bold" min="0" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {
                  const sA = parseInt((document.getElementById('scoreA') as HTMLInputElement).value);
                  const sB = parseInt((document.getElementById('scoreB') as HTMLInputElement).value);
                  updateMatchScore(selectedMatch, selectedMatchData.sets.length, sA, sB);
                  setSelectedMatch(null);
                }} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Update Score</button>
                <button onClick={() => setSelectedMatch(null)} className="flex-1 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No matches found</p>
        </div>
      )}
    </div>
  );
}
