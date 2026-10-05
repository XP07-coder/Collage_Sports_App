import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Users, Trophy, Calendar, Radio, Activity, Shield, UserCheck, AlertTriangle, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const { users, teams, tournaments, matches, auditLogs, joinRequests, eventRegistrations } = useStore();
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Teams', value: teams.length, icon: Shield, color: 'bg-purple-500' },
    { label: 'Tournaments', value: tournaments.length, icon: Trophy, color: 'bg-yellow-500' },
    { label: 'Matches', value: matches.length, icon: Calendar, color: 'bg-green-500' },
    { label: 'Live Matches', value: matches.filter(m => m.status === 'live').length, icon: Radio, color: 'bg-red-500' },
    { label: 'Pending Requests', value: joinRequests.filter(r => r.status === 'pending').length, icon: UserCheck, color: 'bg-orange-500' },
    { label: 'Audit Logs', value: auditLogs.length, icon: Activity, color: 'bg-indigo-500' },
    { label: 'Active Players', value: users.filter(u => u.role === 'player' && u.active).length, icon: UserCheck, color: 'bg-teal-500' },
  ];

  const recentLogs = auditLogs.slice(-5).reverse();
  const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing' || t.status === 'registration_open');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">System overview and management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Tournaments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Active Tournaments
          </h3>
          {ongoingTournaments.length === 0 ? (
            <p className="text-sm text-gray-500">No active tournaments</p>
          ) : (
            <div className="space-y-3">
              {ongoingTournaments.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.sports.join(', ')} • {t.teams.length} teams</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    t.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Recent Activity
          </h3>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 p-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{log.userName}</span> {log.action}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            System Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Application</span>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database (localStorage)</span>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Live Updates</span>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="text-sm text-gray-600">
                {(JSON.stringify(localStorage.getItem('campus-sports-storage') || '').length / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </div>

        {/* Pending Join Requests */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Pending Join Requests
          </h3>
          {joinRequests.filter(r => r.status === 'pending').length === 0 ? (
            <p className="text-sm text-gray-500">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {joinRequests.filter(r => r.status === 'pending').slice(0, 5).map(req => {
                const player = users.find(u => u.id === req.playerId);
                const team = teams.find(t => t.id === req.teamId);
                return (
                  <div key={req.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{player?.fullName}</p>
                      <p className="text-xs text-gray-500">→ {team?.name}</p>
                    </div>
                    <span className="text-xs text-orange-600">Pending</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
