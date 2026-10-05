import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Shield, Calendar, Trophy, Users, MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, teams, matches, tournaments, eventRegistrations, currentUser } = useStore();
  const player = users.find(u => u.id === id);

  if (!player) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Player not found</p>
      <button onClick={() => navigate('/players')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Back to Players</button>
    </div>
  );

  const playerTeams = teams.filter(t => t.members.includes(player.id));
  const playerMatches = matches.filter(m => {
    const teamIds = playerTeams.map(t => t.id);
    return teamIds.includes(m.teamA) || teamIds.includes(m.teamB);
  });
  const completedMatches = playerMatches.filter(m => m.status === 'completed');
  const wins = completedMatches.filter(m => m.winner && playerTeams.some(t => t.id === m.winner)).length;
  const losses = completedMatches.filter(m => m.winner && !playerTeams.some(t => t.id === m.winner)).length;
  const registrations = eventRegistrations.filter(r => r.playerId === player.id);
  const isOwner = currentUser?.id === player.id;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-blue-100">
            {player.avatar ? (
              <img src={player.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">{player.fullName.charAt(0)}</span>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{player.fullName}</h1>
            <p className="text-sm text-gray-500 mt-1">Player ID: {player.id.slice(0, 8).toUpperCase()}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {(player.sports || []).map(s => (
                <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">✓ {s}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 justify-center md:justify-start">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{player.collegeId}</span>
              {player.course && <span>{player.course} {player.branch}</span>}
              {player.year && <span>• {player.year} Year</span>}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${player.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {player.active ? '✓ Active' : '✗ Suspended'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${player.verified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
              {player.verified ? '✓ Verified' : 'Not Verified'}
            </span>
          </div>
        </div>
        {player.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{player.bio}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Users className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{playerTeams.length}</p>
          <p className="text-xs text-gray-500">Teams</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{playerMatches.length}</p>
          <p className="text-xs text-gray-500">Matches</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Trophy className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{wins}</p>
          <p className="text-xs text-gray-500">Wins</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Trophy className="w-6 h-6 text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{losses}</p>
          <p className="text-xs text-gray-500">Losses</p>
        </div>
      </div>

      {/* Teams */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" /> Teams
        </h3>
        {playerTeams.length === 0 ? (
          <p className="text-sm text-gray-500">Not a member of any team</p>
        ) : (
          <div className="space-y-2">
            {playerTeams.map(team => (
              <div key={team.id} onClick={() => navigate(`/team/${team.id}`)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{team.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{team.name}</p>
                  <p className="text-xs text-gray-500">{(team.sports || []).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tournament Participation */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Tournament Participation
        </h3>
        {registrations.length === 0 ? (
          <p className="text-sm text-gray-500">No tournament registrations</p>
        ) : (
          <div className="space-y-2">
            {registrations.map(reg => {
              const tournament = tournaments.find(t => t.id === reg.tournamentId);
              return (
                <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tournament?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{reg.sport} • Fee: ₹{reg.registrationFee}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      reg.paymentStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      reg.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reg.paymentStatus === 'approved' ? '✓ Paid' : reg.paymentStatus === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      reg.registrationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      reg.registrationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {reg.registrationStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Eligibility Notice */}
      {registrations.some(r => r.paymentStatus === 'pending') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">⚠ Registration Pending</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your registration has been submitted, but the registration fee has not yet been approved by the administrator.
                You cannot participate in matches until the administrator approves your payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info (visible to admin or self) */}
      {(isAdmin || isOwner) && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-400">Email:</span> <span className="font-medium">{player.email}</span></div>
            <div><span className="text-gray-400">Phone:</span> <span className="font-medium">{player.phone}</span></div>
            <div><span className="text-gray-400">Gender:</span> <span className="font-medium">{player.gender || 'N/A'}</span></div>
            <div><span className="text-gray-400">DOB:</span> <span className="font-medium">{player.dob || 'N/A'}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
