import { useStore } from '../store';
import { BarChart3, Trophy, Medal } from 'lucide-react';

export default function Leaderboard() {
  const { matches, teams, tournaments } = useStore();
  const completedMatches = matches.filter(m => m.status === 'completed');

  // Calculate leaderboard from match results
  const teamStats = teams.map(team => {
    const teamMatches = completedMatches.filter(m => m.teamA === team.id || m.teamB === team.id);
    const wins = teamMatches.filter(m => m.winner === team.id).length;
    const losses = teamMatches.filter(m => m.winner && m.winner !== team.id).length;
    const draws = teamMatches.filter(m => !m.winner).length;
    const totalMatches = teamMatches.length;
    const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';
    const points = wins * 3 + draws * 1;

    return { team, wins, losses, draws, totalMatches, winRate, points };
  }).sort((a, b) => b.points - a.points || b.wins - a.wins);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
      </div>

      {teamStats.length === 0 ? (
        <div className="text-center py-16">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No Data Yet</h3>
          <p className="text-gray-400 mt-2">Complete some matches to see the leaderboard</p>
        </div>
      ) : (
        <>
          {/* Top 3 */}
          {teamStats.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 0, 2].map(idx => {
                const stat = teamStats[idx];
                if (!stat) return null;
                const medals = ['🥇', '🥈', '🥉'];
                const colors = ['from-yellow-400 to-yellow-600', 'from-gray-300 to-gray-500', 'from-orange-400 to-orange-600'];
                return (
                  <div key={idx} className={`bg-gradient-to-br ${colors[idx === 1 ? 0 : idx === 0 ? 1 : 2]} rounded-xl p-4 text-white text-center ${idx === 1 ? 'scale-110 shadow-lg' : ''}`}>
                    <span className="text-3xl">{medals[idx === 1 ? 0 : idx === 0 ? 1 : 2]}</span>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto my-2">
                      <span className="text-xl font-bold">{stat.team.name.charAt(0)}</span>
                    </div>
                    <p className="font-bold text-sm">{stat.team.name}</p>
                    <p className="text-2xl font-black mt-1">{stat.points}</p>
                    <p className="text-xs opacity-80">points</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Matches</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Wins</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Losses</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Draws</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Win Rate</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamStats.map((stat, idx) => (
                    <tr key={stat.team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                          idx === 1 ? 'bg-gray-100 text-gray-700' :
                          idx === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{stat.team.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-sm">{stat.team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{stat.totalMatches}</td>
                      <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{stat.wins}</td>
                      <td className="px-4 py-3 text-center text-sm text-red-600">{stat.losses}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">{stat.draws}</td>
                      <td className="px-4 py-3 text-center text-sm">{stat.winRate}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-indigo-600">{stat.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
