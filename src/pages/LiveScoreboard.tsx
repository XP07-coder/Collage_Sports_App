import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Radio, Trophy } from 'lucide-react';

export default function LiveScoreboard() {
  const { matches, teams, tournaments, games } = useStore();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const liveMatches = matches.filter(m => m.status === 'live');
  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  useEffect(() => { if (liveMatches.length > 0 && !selectedMatchId) setSelectedMatchId(liveMatches[0].id); }, [liveMatches, selectedMatchId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Radio className="w-6 h-6 text-red-500" /><h1 className="text-2xl font-bold">Live Scoreboard</h1>{liveMatches.length > 0 && <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{liveMatches.length} LIVE</span>}</div>
      {liveMatches.length === 0 ? (<div className="text-center py-16"><Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-600">No Live Matches</h3><p className="text-gray-400 mt-2">No matches currently in progress</p></div>) : (
        <>
          {liveMatches.length > 1 && <div className="flex gap-2 overflow-x-auto pb-2">{liveMatches.map(m => { const teamA = teams.find(t => t.id === m.teamA); const teamB = teams.find(t => t.id === m.teamB); return <button key={m.id} onClick={() => setSelectedMatchId(m.id)} className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${selectedMatchId === m.id ? 'bg-red-500 text-white' : 'bg-white border text-gray-700'}`}>{teamA?.name} vs {teamB?.name}</button>; })}</div>}
          {selectedMatch && (() => { const teamA = teams.find(t => t.id === selectedMatch.teamA); const teamB = teams.find(t => t.id === selectedMatch.teamB); const tournament = tournaments.find(t => t.id === selectedMatch.tournamentId); const game = games.find(g => g.id === selectedMatch.gameId); const setsWonA = selectedMatch.sets.filter(s => s.completed && s.scoreA > s.scoreB).length; const setsWonB = selectedMatch.sets.filter(s => s.completed && s.scoreB > s.scoreA).length; return (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
              <div className="text-center mb-6"><div className="flex items-center justify-center gap-2 mb-2"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span><span className="text-red-400 font-bold text-sm uppercase">LIVE</span></div><h2 className="text-xl md:text-2xl font-bold">{tournament?.name}</h2><p className="text-gray-400 text-sm">{game?.icon} {game?.name} • {selectedMatch.venue}</p></div>
              <div className="grid grid-cols-3 items-center gap-4 mb-8"><div className="text-center"><div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-3xl font-bold">{teamA?.name.charAt(0)}</span></div><h3 className="font-bold text-lg">{teamA?.name}</h3></div><div className="text-center"><div className="text-5xl md:text-7xl font-black"><span className="text-blue-400">{selectedMatch.sets[selectedMatch.sets.length - 1]?.scoreA || 0}</span><span className="text-gray-500 mx-2">-</span><span className="text-red-400">{selectedMatch.sets[selectedMatch.sets.length - 1]?.scoreB || 0}</span></div><p className="text-gray-400 text-sm mt-2">Current Set</p></div><div className="text-center"><div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-3xl font-bold">{teamB?.name.charAt(0)}</span></div><h3 className="font-bold text-lg">{teamB?.name}</h3></div></div>
              <div className="bg-white/10 rounded-xl p-4"><h4 className="text-sm font-medium text-gray-300 mb-3 text-center">Sets</h4><div className="space-y-2">{selectedMatch.sets.map(s => (<div key={s.setNumber} className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg"><span className="text-sm text-gray-300">Set {s.setNumber}</span><div className="flex items-center gap-4"><span className={`font-bold text-lg ${s.scoreA > s.scoreB ? 'text-blue-400' : 'text-gray-400'}`}>{s.scoreA}</span><span className="text-gray-500">-</span><span className={`font-bold text-lg ${s.scoreB > s.scoreA ? 'text-red-400' : 'text-gray-400'}`}>{s.scoreB}</span></div><span className="text-xs">{s.completed ? '✓' : '...'}</span></div>))}</div></div>
              <div className="flex items-center justify-center gap-8 mt-6"><div className="text-center"><p className="text-3xl font-bold text-blue-400">{setsWonA}</p><p className="text-xs text-gray-400">Sets</p></div><div className="text-center"><Trophy className="w-8 h-8 text-yellow-400 mx-auto" /></div><div className="text-center"><p className="text-3xl font-bold text-red-400">{setsWonB}</p><p className="text-xs text-gray-400">Sets</p></div></div>
              {selectedMatch.winner && <div className="mt-6 text-center"><div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-full"><Trophy className="w-5 h-5 text-yellow-400" /><span className="font-bold text-yellow-300">WINNER: {teams.find(t => t.id === selectedMatch.winner)?.name}</span></div></div>}
            </div>
          ); })()}
        </>
      )}
    </div>
  );
}
