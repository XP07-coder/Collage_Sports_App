import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Users, Calendar, Trophy, Edit, Shield, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams, users, matches, tournaments, currentUser, updateTeam, eventRegistrations, teamEventRegistrations } = useStore();
  const team = teams.find(t => t.id === id);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', college: '', contact: '' });

  if (!team) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Team not found</p>
      <button onClick={() => navigate('/teams')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Back to Teams</button>
    </div>
  );

  const owner = users.find(u => u.id === team.ownerId);
  const members = users.filter(u => team.members.includes(u.id));
  const teamMatches = matches.filter(m => m.teamA === team.id || m.teamB === team.id);
  const completedMatches = teamMatches.filter(m => m.status === 'completed');
  const wins = completedMatches.filter(m => m.winner === team.id).length;
  const losses = completedMatches.filter(m => m.winner && m.winner !== team.id).length;
  const points = wins * 3;
  const isOwner = currentUser?.id === team.ownerId;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isOwner || isAdmin;

  const teamRegs = teamEventRegistrations.filter(r => r.teamId === team.id);

  const startEdit = () => {
    setEditForm({ name: team.name, description: team.description, college: team.college, contact: team.contact });
    setEditing(true);
  };

  const saveEdit = () => {
    updateTeam(team.id, editForm);
    setEditing(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { alert('Invalid file type'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File too large (max 5MB)'); return; }
    const reader = new FileReader();
    reader.onload = () => updateTeam(team.id, { logo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Team Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center overflow-hidden ring-4 ring-purple-100">
              {team.logo ? (
                <img src={team.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">{team.name.charAt(0)}</span>
              )}
            </div>
            {canEdit && (
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700">
                <Edit className="w-4 h-4 text-white" />
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleLogoUpload} className="hidden" />
              </label>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            {editing ? (
              <div className="space-y-2">
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-xl font-bold" />
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg" rows={2} />
                <input type="text" value={editForm.college} onChange={e => setEditForm({...editForm, college: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg" placeholder="College" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>
                  {canEdit && (
                    <button onClick={startEdit} className="p-1 hover:bg-gray-100 rounded" title="Edit Team">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Team ID: {team.id.slice(0, 8).toUpperCase()}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {team.sports.map(s => (
                    <span key={s} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">✓ {s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 justify-center md:justify-start">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" />Owner: {owner?.fullName}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{team.college}</span>
                </div>
                {team.description && <p className="text-sm text-gray-600 mt-3">{team.description}</p>}
              </>
            )}
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">₹{team.purse}</p>
            <p className="text-xs text-gray-500">Purse</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{team.members.length}</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Calendar className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{teamMatches.length}</p>
          <p className="text-xs text-gray-500">Matches</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{wins}W / {losses}L</p>
          <p className="text-xs text-gray-500">Record</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Trophy className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{points}</p>
          <p className="text-xs text-gray-500">Points</p>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" /> Team Members ({members.length})
        </h3>
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">No members yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {members.map(member => (
              <div key={member.id} onClick={() => navigate(`/player/${member.id}`)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{member.fullName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{member.fullName}</p>
                  <p className="text-xs text-gray-500">{member.sports?.join(', ')}</p>
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
        {teamRegs.length === 0 ? (
          <p className="text-sm text-gray-500">Not registered for any tournaments</p>
        ) : (
          <div className="space-y-2">
            {teamRegs.map(reg => {
              const tournament = tournaments.find(t => t.id === reg.tournamentId);
              return (
                <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tournament?.name}</p>
                    <p className="text-xs text-gray-500">{reg.sport}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reg.registrationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    reg.registrationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reg.registrationStatus}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Matches */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-500" /> Matches
        </h3>
        {teamMatches.length === 0 ? (
          <p className="text-sm text-gray-500">No matches yet</p>
        ) : (
          <div className="space-y-2">
            {teamMatches.slice(0, 10).map(m => {
              const opponent = teams.find(t => t.id === (m.teamA === team.id ? m.teamB : m.teamA));
              return (
                <div key={m.id} onClick={() => navigate(`/match/${m.id}`)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <p className="text-sm font-medium">vs {opponent?.name}</p>
                    <p className="text-xs text-gray-500">{m.sport} • {m.venue}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    m.status === 'completed' ? (m.winner === team.id ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') :
                    m.status === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {m.status === 'completed' ? (m.winner === team.id ? 'Won' : 'Lost') : m.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
