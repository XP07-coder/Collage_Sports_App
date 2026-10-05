import { useStore } from '../store';
import { Shield, Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventRegistrations() {
  const { eventRegistrations, users, tournaments, teams, currentUser, approvePayment, rejectPayment, teamEventRegistrations, approveTeamPayment, games } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [selectedReg, setSelectedReg] = useState<string | null>(null);
  const [tab, setTab] = useState<'players' | 'teams'>('players');

  const filteredPlayerRegs = eventRegistrations.filter(r => {
    const player = users.find(u => u.id === r.playerId);
    const tournament = tournaments.find(t => t.id === r.tournamentId);
    const matchesSearch = search.toLowerCase();
    const matchesFilter = (!filterStatus || r.registrationStatus === filterStatus) && (!filterPayment || r.paymentStatus === filterPayment);
    return matchesFilter && (player?.fullName.toLowerCase().includes(matchesSearch) || tournament?.name.toLowerCase().includes(matchesSearch));
  });

  const filteredTeamRegs = teamEventRegistrations.filter(r => {
    const team = teams.find(t => t.id === r.teamId);
    const tournament = tournaments.find(t => t.id === r.tournamentId);
    const matchesSearch = search.toLowerCase();
    return (!filterStatus || r.registrationStatus === filterStatus) && (team?.name.toLowerCase().includes(matchesSearch) || tournament?.name.toLowerCase().includes(matchesSearch));
  });

  const selectedRegistration = eventRegistrations.find(r => r.id === selectedReg);
  const selectedPlayer = selectedRegistration ? users.find(u => u.id === selectedRegistration.playerId) : null;
  const selectedTournament = selectedRegistration ? tournaments.find(t => t.id === selectedRegistration.tournamentId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Shield className="w-6 h-6 text-indigo-500" /><h1 className="text-2xl font-bold">Registration Management</h1></div>
      <div className="flex gap-2">
        <button onClick={() => setTab('players')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'players' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Player Registrations ({eventRegistrations.length})</button>
        <button onClick={() => setTab('teams')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'teams' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Team Registrations ({teamEventRegistrations.length})</button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" /></div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="">All Status</option><option value="PAYMENT_PENDING">Payment Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select>
        {tab === 'players' && <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="">All Payments</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select>}
      </div>
      {tab === 'players' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tournament</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fee</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Payment</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Eligible</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlayerRegs.map(reg => {
                  const player = users.find(u => u.id === reg.playerId);
                  const tournament = tournaments.find(t => t.id === reg.tournamentId);
                  const game = games.find(g => g.id === reg.gameId);
                  const isEligible = reg.registrationStatus === 'APPROVED' && (reg.paymentStatus === 'APPROVED' || reg.registrationFee === 0);
                  return (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-white">{player?.fullName.charAt(0)}</span></div><div><p className="text-sm font-medium">{player?.fullName}</p><p className="text-xs text-gray-400">{player?.collegeId}</p></div></div></td>
                      <td className="px-4 py-3 text-sm">{game?.icon} {game?.name}</td>
                      <td className="px-4 py-3 text-sm">{tournament?.name}</td>
                      <td className="px-4 py-3 text-sm text-center">₹{reg.registrationFee}</td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${reg.paymentStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : reg.paymentStatus === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{reg.paymentStatus}</span></td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${reg.registrationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : reg.registrationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{reg.registrationStatus}</span></td>
                      <td className="px-4 py-3 text-center">{isEligible ? <CheckCircle className="w-5 h-5 mx-auto text-green-600" /> : <XCircle className="w-5 h-5 mx-auto text-red-500" />}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setSelectedReg(reg.id)} className="p-1 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></button>
                          {reg.paymentStatus === 'PENDING' && (
                            <div className="flex gap-1">
                              <button onClick={() => approvePayment(reg.id, currentUser?.id || '')} className="p-1 hover:bg-green-100 rounded text-green-600"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => rejectPayment(reg.id, currentUser?.id || '')} className="p-1 hover:bg-red-100 rounded text-red-600"><XCircle className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredPlayerRegs.length === 0 && <p className="text-center py-8 text-gray-500">No registrations found</p>}
        </div>
      )}
      {tab === 'teams' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tournament</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fee</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Payment</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTeamRegs.map(reg => {
                  const team = teams.find(t => t.id === reg.teamId);
                  const tournament = tournaments.find(t => t.id === reg.tournamentId);
                  const game = games.find(g => g.id === reg.gameId);
                  return (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{team?.name}</td>
                      <td className="px-4 py-3 text-sm">{game?.icon} {game?.name}</td>
                      <td className="px-4 py-3 text-sm">{tournament?.name}</td>
                      <td className="px-4 py-3 text-sm text-center">₹{reg.registrationFee}</td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${reg.paymentStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{reg.paymentStatus}</span></td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${reg.registrationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{reg.registrationStatus}</span></td>
                      <td className="px-4 py-3 text-center">{reg.paymentStatus === 'PENDING' && <button onClick={() => approveTeamPayment(reg.id, currentUser?.id || '')} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Approve</button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTeamRegs.length === 0 && <p className="text-center py-8 text-gray-500">No team registrations found</p>}
        </div>
      )}
      {selectedReg && selectedRegistration && selectedPlayer && selectedTournament && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-bold text-lg mb-4">Registration Details</h3>
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center"><span className="text-lg font-bold text-white">{selectedPlayer.fullName.charAt(0)}</span></div>
              <div><p className="font-semibold">{selectedPlayer.fullName}</p><p className="text-xs text-gray-500">ID: {selectedPlayer.collegeId}</p></div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tournament:</span><span className="font-medium">{selectedTournament.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Game:</span><span className="font-medium">{games.find(g => g.id === selectedRegistration.gameId)?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fee:</span><span className="font-bold text-lg">₹{selectedRegistration.registrationFee}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Payment:</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedRegistration.paymentStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : selectedRegistration.paymentStatus === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedRegistration.paymentStatus}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Status:</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedRegistration.registrationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{selectedRegistration.registrationStatus}</span></div>
            </div>
            <div className={`mt-4 p-3 rounded-lg ${selectedRegistration.registrationStatus === 'APPROVED' && selectedRegistration.paymentStatus === 'APPROVED' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm font-medium ${selectedRegistration.registrationStatus === 'APPROVED' && selectedRegistration.paymentStatus === 'APPROVED' ? 'text-green-700' : 'text-red-700'}`}>
                {selectedRegistration.registrationStatus === 'APPROVED' && selectedRegistration.paymentStatus === 'APPROVED' ? '✓ ELIGIBLE' : '✗ NOT ELIGIBLE'}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => navigate(`/player/${selectedPlayer.id}`)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm">View Profile</button>
              {selectedRegistration.paymentStatus === 'PENDING' && (
                <div className="flex gap-2">
                  <button onClick={() => { approvePayment(selectedReg, currentUser?.id || ''); setSelectedReg(null); }} className="py-2 px-4 bg-green-600 text-white rounded-lg text-sm">Approve</button>
                  <button onClick={() => { rejectPayment(selectedReg, currentUser?.id || ''); setSelectedReg(null); }} className="py-2 px-4 bg-red-600 text-white rounded-lg text-sm">Reject</button>
                </div>
              )}
              <button onClick={() => setSelectedReg(null)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
