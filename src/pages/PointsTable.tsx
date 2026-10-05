import { useState } from 'react';
import { useStore } from '../store';
import { Table, Trophy } from 'lucide-react';

export default function PointsTable() {
  const { matches, teams, tournaments } = useStore();
  const [selectedTournament, setSelectedTournament] = useState<string>(tournaments[0]?.id || '');

  const tournament = tournaments.find(t => t.id === selectedTournament);
  const tournamentMatches = matches.filter(m => m.tournamentId === selectedTournament && m.status === 'completed');
  const tournamentTeams = teams.filter(t => (tournament?.teams || []).includes(t.id));

  const pointsForWin = tournament?.pointsForWin || 3;
  const pointsForDraw = tournament?.pointsForDraw || 1;

  const tableData = tournamentTeams.map(team => {
    const teamMatches = tournamentMatches.filter(m => m.teamA === team.id || m.teamB === team.id);
    const wins = teamMatches.filter(m => m.winner === team.id).length;
    const losses = teamMatches.filter(m => m.winner && m.winner !== team.id).length;
    const draws = teamMatches.filter(m => !m.winner).length;
    const played = teamMatches.length;
    const points = wins * pointsForWin + draws * pointsForDraw;
    const setsWon = teamMatches.reduce((acc, m) => acc + m.sets.filter(s => s.completed && ((m.teamA === team.id && s.scoreA > s.scoreB) || (m.teamB === team.id && s.scoreB > s.scoreA))).length, 0);
    const setsLost = teamMatches.reduce((acc, m) => acc + m.sets.filter(s => s.completed && ((m.teamA === team.id && s.scoreB > s.scoreA) || (m.teamB === team.id && s.scoreA > s.scoreB))).length, 0);

    return { team, played, wins, losses, draws, points, setsWon, setsLost, setDiff: setsWon - setsLost };
  }).sort((a, b) => b.points - a.points || b.setDiff - a.setDiff);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Table className="w-6 h-6 text-teal-500" />
          <h1 className="text-2xl font-bold text-gray-800">Points Table</h1>
        </div>
        <select value={selectedTournament} onChange={e => setSelectedTournament(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Select Tournament</option>
          {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {!selectedTournament ? (
        <div className="text-center py-16">
          <Table className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a tournament to view points table</p>
        </div>
      ) : tableData.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No data available for this tournament yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
            <h3 className="font-bold">{tournament?.name}</h3>
            <p className="text-sm opacity-80">Win: {pointsForWin} pts | Draw: {pointsForDraw} pts | Loss: {tournament?.pointsForLoss || 0} pts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">W</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">L</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">D</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SR</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map((row, idx) => (
                  <tr key={row.team.id} className={`hover:bg-gray-50 ${idx < 4 ? 'bg-green-50/30' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{row.team.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-sm">{row.team.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{row.played}</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{row.wins}</td>
                    <td className="px-4 py-3 text-center text-sm text-red-600">{row.losses}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{row.draws}</td>
                    <td className="px-4 py-3 text-center text-sm">{row.setDiff > 0 ? `+${row.setDiff}` : row.setDiff}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-teal-600 text-lg">{row.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
