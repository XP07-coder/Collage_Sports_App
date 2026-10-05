import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Shield, Calendar, Trophy, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, teams, matches, tournaments, eventRegistrations, currentUser, games } = useStore();
  const player = users.find(u => u.id === id);
  if (!player) return (<div className="text-center py-16"><p className="text-gray-500">Player not found</p><button onClick={() => navigate('/players')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Back</button></div>);

  const playerTeams = teams.filter(t => t.members.includes(player.id));
  const playerMatches = matches.filter(m => playerTeams.some(t => t.id === m.teamA || t.id === m.teamB));
  const completedMatches = playerMatches.filter(m => m.status === 'completed');
  const wins = completedMatches.filter(m => m.winner && playerTeams.some(t => t.id === m.winner)).length;
  const losses = completedMatches.filter(m => m.winner && !playerTeams.some(t => t.id === m.winner)).length;
  const registrations = eventRegistrations.filter(r => r.playerId === player.id);
  const isOwner = currentUser?.id === player.id;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"><ArrowLeft className="w-4 h-4" />Back</button>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-blue-100">{player.avatar ? <img src={player.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-white">{player.fullName.charAt(0)}</span>}</div>
          <div className="text-center md:text-left flex-1"><h1 className="text-2xl font-bold">{player.fullName}</h1><p className="text-sm text-gray-500 mt-1">ID: {player.id.slice(0, 8).toUpperCase()}</p><div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">{(player.games || []).map(gid => { const game = games.find(g => g.id === gid); return <span key={gid} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">✓ {game?.icon} {game?.name || gid}</span>; })}</div><div className="flex items-center gap-4 mt-3 text-sm text-gray-500 justify-center md:justify-start"><span className="flex items-center gap-1"><Shield className="w-3 h-3" />{player.collegeId}</span>{player.course && <span>{player.course} {player.branch}</span>}</div></div>
          <div className="flex flex-col items-center gap-2"><span className={`px-3 py-1 rounded-full text-xs font-medium ${player.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{player.active ? '✓ Active' : '✗ Suspended'}</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><Users className="w-6 h-6 text-purple-500 mx-auto mb-1" /><p className="text-2xl font-bold">{playerTeams.length}</p><p className="text-xs text-gray-500">Teams</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><Calendar className="w-6 h-6 text-blue-500 mx-auto mb-1" /><p className="text-2xl font-bold">{playerMatches.length}</p><p className="text-xs text-gray-500">Matches</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><Trophy className="w-6 h-6 text-green-500 mx-auto mb-1" /><p className="text-2xl font-bold">{wins}</p><p className="text-xs text-gray-500">Wins</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><Trophy className="w-6 h-6 text-red-500 mx-auto mb-1" /><p className="text-2xl font-bold">{losses}</p><p className="text-xs text-gray-500">Losses</p></div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Tournament Participation</h3>
        {registrations.length === 0 ? <p className="text-sm text-gray-500">No registrations</p> : (
          <div className="space-y-2">{registrations.map(reg => { const tournament = tournaments.find(t => t.id === reg.tournamentId); const game = games.find(g => g.id === reg.gameId); return (<div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium text-sm">{tournament?.name}</p><p className="text-xs text-gray-500">{game?.icon} {game?.name} • Fee: ₹{reg.registrationFee}</p></div><div className="flex flex-col items-end gap-1"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${reg.paymentStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : reg.paymentStatus === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{reg.paymentStatus === 'APPROVED' ? '✓ Paid' : reg.paymentStatus === 'REJECTED' ? '✗ Rejected' : '⏳ Pending'}</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${reg.registrationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{reg.registrationStatus}</span></div></div>); })}</div>
        )}
      </div>
      {registrations.some(r => r.paymentStatus === 'PENDING') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"><div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-medium text-yellow-800">⚠ Registration Pending</h4><p className="text-sm text-yellow-700 mt-1">Your registration fee has not yet been approved by the administrator. You cannot participate until approved.</p></div></div></div>
      )}
    </div>
  );
}
