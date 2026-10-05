import { useStore } from '../store';
import { Shield, Users, Calendar, Trophy, UserCheck } from 'lucide-react';

export default function TeamOwnerDashboard() {
  const { currentUser, teams, matches, joinRequests, tournaments, games } = useStore();
  const myTeam = teams.find(t => t.ownerId === currentUser?.id);
  const pendingRequests = joinRequests.filter(r => r.teamId === myTeam?.id && r.status === 'pending');
  const myMatches = matches.filter(m => m.teamA === myTeam?.id || m.teamB === myTeam?.id);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-gray-800">Team Owner Dashboard</h1><p className="text-gray-600 mt-1">Manage your team</p></div>
      {myTeam ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border"><Users className="w-8 h-8 text-blue-500 mb-2" /><p className="text-2xl font-bold">{myTeam.members.length}</p><p className="text-xs text-gray-500">Members</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border"><UserCheck className="w-8 h-8 text-orange-500 mb-2" /><p className="text-2xl font-bold">{pendingRequests.length}</p><p className="text-xs text-gray-500">Requests</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border"><Calendar className="w-8 h-8 text-green-500 mb-2" /><p className="text-2xl font-bold">{myMatches.length}</p><p className="text-xs text-gray-500">Matches</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border"><Trophy className="w-8 h-8 text-yellow-500 mb-2" /><p className="text-2xl font-bold">₹{myTeam.purse}</p><p className="text-xs text-gray-500">Purse</p></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center"><span className="text-3xl font-bold text-white">{myTeam.name.charAt(0)}</span></div>
              <div><h3 className="text-xl font-bold">{myTeam.name}</h3><p className="text-sm text-gray-500">{(myTeam.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(', ')}</p><p className="text-sm text-gray-500">{myTeam.college}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold mb-3">Pending Join Requests</h3>
            {pendingRequests.length === 0 ? (<p className="text-sm text-gray-500">No pending requests</p>) : (
              <div className="space-y-2">{pendingRequests.map(req => {
                const player = useStore.getState().users.find(u => u.id === req.playerId);
                return (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div><p className="text-sm font-medium">{player?.fullName}</p><p className="text-xs text-gray-500">{(player?.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(', ')}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => useStore.getState().respondToJoinRequest(req.id, 'accepted')} className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg">Accept</button>
                      <button onClick={() => useStore.getState().respondToJoinRequest(req.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">Reject</button>
                    </div>
                  </div>
                );
              })}</div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center"><Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="text-lg font-semibold">No Team Yet</h3><p className="text-sm text-gray-500 mt-1">Go to Teams page to create your team</p></div>
      )}
    </div>
  );
}
