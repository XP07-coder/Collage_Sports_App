import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Calendar, MapPin, Users, Radio, Trophy, CheckCircle } from 'lucide-react';

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { matches, teams, tournaments, users, currentUser, updateMatchScore, updateMatch } = useStore();
  const match = matches.find(m => m.id === id);

  if (!match) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Match not found</p>
      <button onClick={() => navigate('/matches')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Back</button>
    </div>
  );

  const teamA = teams.find(t => t.id === match.teamA);
  const teamB = teams.find(t => t.id === match.teamB);
  const tournament = tournaments.find(t => t.id === match.tournamentId);
  const referee = users.find(u => u.id === match.refereeId);
  const setsWonA = match.sets.filter(s => s.completed && s.scoreA > s.scoreB).length;
  const setsWonB = match.sets.filter(s => s.completed && s.scoreB > s.scoreA).length;
  const canScore = (currentUser?.role === 'referee' && match.refereeId === currentUser?.id) || currentUser?.role === 'admin';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Match Header */}
      <div className={`rounded-xl p-6 text-white ${match.status === 'live' ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-gray-700 to-gray-800'}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm opacity-80">{tournament?.name}</span>
          {match.status === 'live' && (
            <span className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE
            </span>
          )}
          {match.status === 'completed' && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full text-xs font-bold">
              <CheckCircle className="w-3 h-3" /> COMPLETED
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold">{teamA?.name.charAt(0)}</span>
            </div>
            <p className="font-bold">{teamA?.name}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black">
              <span className="text-blue-300">{setsWonA}</span>
              <span className="text-white/40 mx-2">-</span>
              <span className="text-red-300">{setsWonB}</span>
            </p>
            <p className="text-xs opacity-60 mt-1">Sets</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold">{teamB?.name.charAt(0)}</span>
            </div>
            <p className="font-bold">{teamB?.name}</p>
          </div>
        </div>

        {match.winner && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="font-bold text-yellow-200">Winner: {teams.find(t => t.id === match.winner)?.name}</span>
            </span>
          </div>
        )}
      </div>

      {/* Match Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm border grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Sport</p>
          <p className="font-medium">{match.sport}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Venue</p>
          <p className="font-medium">{match.venue || 'TBD'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Date</p>
          <p className="font-medium">{match.scheduledDate || 'TBD'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Referee</p>
          <p className="font-medium">{referee?.fullName || 'Not assigned'}</p>
        </div>
      </div>

      {/* Sets Detail */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold mb-4">Sets Breakdown</h3>
        <div className="space-y-3">
          {match.sets.map((set, idx) => (
            <div key={set.setNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Set {set.setNumber}</span>
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${set.scoreA > set.scoreB ? 'text-blue-600' : 'text-gray-400'}`}>
                  {set.scoreA}
                </span>
                <span className="text-gray-300">-</span>
                <span className={`text-xl font-bold ${set.scoreB > set.scoreA ? 'text-red-600' : 'text-gray-400'}`}>
                  {set.scoreB}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${set.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {set.completed ? '✓ Complete' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Entry (for referee/admin) */}
      {canScore && match.status === 'live' && (
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-4">Update Score - Set {match.sets.length}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">{teamA?.name}</label>
              <input type="number" id="detailScoreA" defaultValue={match.sets[match.sets.length - 1]?.scoreA || 0}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-center text-xl font-bold" min="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">{teamB?.name}</label>
              <input type="number" id="detailScoreB" defaultValue={match.sets[match.sets.length - 1]?.scoreB || 0}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-center text-xl font-bold" min="0" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {
              const sA = parseInt((document.getElementById('detailScoreA') as HTMLInputElement).value);
              const sB = parseInt((document.getElementById('detailScoreB') as HTMLInputElement).value);
              updateMatchScore(match.id, match.sets.length, sA, sB);
            }} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Update Score</button>
            {currentUser?.role === 'admin' && (match.status as string) === 'scheduled' && (
              <button onClick={() => updateMatch(match.id, { status: 'live' })}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Start Match</button>
            )}
            {currentUser?.role === 'admin' && match.status === 'live' && (
              <button onClick={() => updateMatch(match.id, { status: 'completed' })}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">End Match</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
