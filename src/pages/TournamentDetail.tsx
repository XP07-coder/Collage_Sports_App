import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Trophy, Plus, Search, Calendar, MapPin, Users, Radio, CheckCircle, Eye, DollarSign } from 'lucide-react';
import { useGameNames } from '../utils/gameHelpers';

export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments, teams, users, matches, games, eventRegistrations, currentUser, submitEventRegistration, getRegistrationFee, registrationFees } = useStore();
  const tournament = tournaments.find(t => t.id === id);
  const [tab, setTab] = useState<'overview' | 'teams' | 'players' | 'matches' | 'fees'>('overview');

  if (!tournament) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Tournament not found</p>
      <button onClick={() => navigate('/tournaments')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Back</button>
    </div>
  );

  const tTeams = teams.filter(t => (tournament.teams || []).includes(t.id));
  const tMatches = matches.filter(m => m.tournamentId === tournament.id);
  const tRegistrations = eventRegistrations.filter(r => r.tournamentId === tournament.id);
  const liveMatches = tMatches.filter(m => m.status === 'live');
  const completedMatches = tMatches.filter(m => m.status === 'completed');
  const isPlayer = currentUser?.role === 'player';
  const isAdmin = currentUser?.role === 'admin';
  const canRegister = tournament.status === 'registration_open' && isPlayer;
  const alreadyRegistered = (gameId: string) => tRegistrations.some(r => r.playerId === currentUser?.id && r.gameId === gameId);
  const gameNames = (tournament.games || []).map(gid => games.find(g => g.id === gid)?.name || gid);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'teams', label: `Teams (${tTeams.length})` },
    { key: 'players', label: `Players (${tRegistrations.length})` },
    { key: 'matches', label: `Matches (${tMatches.length})` },
    ...(isAdmin ? [{ key: 'fees', label: '💰 Fees' }] : []),
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{tournament.name}</h1>
            <p className="text-indigo-200 mt-1">{gameNames.join(', ')}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-indigo-200">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{tournament.startDate} → {tournament.endDate}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tournament.location || 'TBD'}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{(tournament.teams || []).length} teams</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            tournament.status === 'ongoing' ? 'bg-green-400/20 text-green-200' :
            tournament.status === 'registration_open' ? 'bg-blue-400/20 text-blue-200' :
            tournament.status === 'completed' ? 'bg-purple-400/20 text-purple-200' :
            'bg-white/20 text-white'
          }`}>{tournament.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        {tournament.description && <p className="text-indigo-100 mt-4 text-sm">{tournament.description}</p>}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className="text-2xl font-bold text-indigo-600">{(tournament.teams || []).length}</p>
              <p className="text-xs text-gray-500">Teams</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className="text-2xl font-bold text-blue-600">{tRegistrations.length}</p>
              <p className="text-xs text-gray-500">Registrations</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className="text-2xl font-bold text-green-600">{completedMatches.length}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className="text-2xl font-bold text-red-600">{liveMatches.length}</p>
              <p className="text-xs text-gray-500">Live</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold mb-3">Points Configuration</h3>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Win: {tournament.pointsForWin} pts</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">Draw: {tournament.pointsForDraw} pts</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Loss: {tournament.pointsForLoss} pts</span>
            </div>
          </div>

          {canRegister && (
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold mb-3">Register for this Tournament</h3>
              <div className="space-y-2">
                {(tournament.games || []).map(gameId => {
                  const game = games.find(g => g.id === gameId);
                  const fee = getRegistrationFee(tournament.id, gameId, 'PLAYER');
                  return (
                    <div key={gameId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{game?.icon} {game?.name || gameId}</p>
                        <p className="text-xs text-gray-500">Fee: ₹{fee}</p>
                      </div>
                      {alreadyRegistered(gameId) ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3 inline mr-1" />Registered
                        </span>
                      ) : (
                        <button onClick={() => submitEventRegistration(currentUser!.id, tournament.id, gameId)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                          Register
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'fees' && isAdmin && (
        <FeesTab tournamentId={tournament.id} />
      )}

      {tab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tTeams.map(team => (
            <div key={team.id} onClick={() => navigate(`/team/${team.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{team.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-xs text-gray-500">{(team.sports || []).map(sid => games.find(g => g.id === sid)?.name || sid).join(', ')} • {(team.members || []).length} members</p>
                </div>
              </div>
            </div>
          ))}
          {tTeams.length === 0 && <p className="text-gray-500 text-center py-8 col-span-2">No teams registered yet</p>}
        </div>
      )}

      {tab === 'players' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tRegistrations.map(reg => {
            const player = users.find(u => u.id === reg.playerId);
            const game = games.find(g => g.id === reg.gameId);
            if (!player) return null;
            return (
              <div key={reg.id} onClick={() => navigate(`/player/${player.id}`)}
                className="bg-white rounded-xl p-3 shadow-sm border cursor-pointer hover:shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{player.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{player.fullName}</p>
                    <p className="text-xs text-gray-500">{game?.icon} {game?.name} • ₹{reg.registrationFee}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  reg.registrationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  reg.registrationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{reg.registrationStatus}</span>
              </div>
            );
          })}
          {tRegistrations.length === 0 && <p className="text-gray-500 text-center py-8 col-span-2">No player registrations yet</p>}
        </div>
      )}

      {tab === 'matches' && (
        <div className="space-y-3">
          {tMatches.map(m => {
            const teamA = teams.find(t => t.id === m.teamA);
            const teamB = teams.find(t => t.id === m.teamB);
            const game = games.find(g => g.id === m.gameId);
            return (
              <div key={m.id} onClick={() => navigate(`/match/${m.id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{game?.icon} {game?.name}</span>
                    <span className="font-medium text-sm">{teamA?.name}</span>
                    <span className="text-xs text-gray-400">vs</span>
                    <span className="font-medium text-sm">{teamB?.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    m.status === 'live' ? 'bg-red-100 text-red-700' :
                    m.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{m.status === 'live' && '🔴 '}{m.status}</span>
                </div>
                {m.winner && <p className="text-xs text-green-600 mt-1">Winner: {teams.find(t => t.id === m.winner)?.name}</p>}
              </div>
            );
          })}
          {tMatches.length === 0 && <p className="text-gray-500 text-center py-8">No matches scheduled yet</p>}
        </div>
      )}
    </div>
  );
}

// Fees management sub-component
function FeesTab({ tournamentId }: { tournamentId: string }) {
  const { games, registrationFees, setRegistrationFee, tournaments } = useStore();
  const tournament = tournaments.find(t => t.id === tournamentId);
  const tournamentGames = (tournament?.games || []).map(gid => games.find(g => g.id === gid)).filter(Boolean);
  const [editingFee, setEditingFee] = useState<{ gameId: string; feeType: 'PLAYER' | 'TEAM'; amount: string } | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" /> Registration Fees
        </h3>
        <div className="space-y-3">
          {tournamentGames.map(game => {
            if (!game) return null;
            const playerFee = registrationFees.find(f => f.tournamentId === tournamentId && f.gameId === game.id && f.feeType === 'PLAYER');
            const teamFee = registrationFees.find(f => f.tournamentId === tournamentId && f.gameId === game.id && f.feeType === 'TEAM');
            return (
              <div key={game.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{game.icon} {game.name}</span>
                  <span className="text-xs text-gray-400">{game.participationType}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Player Fee:</span>
                    {editingFee?.gameId === game.id && editingFee.feeType === 'PLAYER' ? (
                      <div className="flex gap-1">
                        <input type="number" value={editingFee.amount} onChange={e => setEditingFee({...editingFee, amount: e.target.value})}
                          className="w-20 px-2 py-1 border rounded text-sm" />
                        <button onClick={() => { setRegistrationFee(tournamentId, game.id, 'PLAYER', +editingFee.amount); setEditingFee(null); }}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs">Save</button>
                      </div>
                    ) : (
                      <span className="font-medium cursor-pointer hover:text-indigo-600" onClick={() => setEditingFee({ gameId: game.id, feeType: 'PLAYER', amount: String(playerFee?.amount || 0) })}>
                        ₹{playerFee?.amount || 0}
                      </span>
                    )}
                  </div>
                  {game.participationType !== 'INDIVIDUAL' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Fee:</span>
                      {editingFee?.gameId === game.id && editingFee.feeType === 'TEAM' ? (
                        <div className="flex gap-1">
                          <input type="number" value={editingFee.amount} onChange={e => setEditingFee({...editingFee, amount: e.target.value})}
                            className="w-20 px-2 py-1 border rounded text-sm" />
                          <button onClick={() => { setRegistrationFee(tournamentId, game.id, 'TEAM', +editingFee.amount); setEditingFee(null); }}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs">Save</button>
                        </div>
                      ) : (
                        <span className="font-medium cursor-pointer hover:text-indigo-600" onClick={() => setEditingFee({ gameId: game.id, feeType: 'TEAM', amount: String(teamFee?.amount || 0) })}>
                          ₹{teamFee?.amount || 0}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
