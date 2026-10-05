import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, Radio, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { users, teams, tournaments, matches, auditLogs } = useStore();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Teams', value: teams.length, icon: Users, color: 'bg-purple-500' },
    { label: 'Tournaments', value: tournaments.length, icon: Trophy, color: 'bg-yellow-500' },
    { label: 'Matches', value: matches.length, icon: Calendar, color: 'bg-green-500' },
    { label: 'Live Matches', value: matches.filter(m => m.status === 'live').length, icon: Radio, color: 'bg-red-500' },
    { label: 'Audit Logs', value: auditLogs.length, icon: Activity, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/tournaments')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              Manage Tournaments
            </button>
            <button onClick={() => navigate('/teams')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              Manage Teams
            </button>
            <button onClick={() => navigate('/players')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              Manage Players
            </button>
            <button onClick={() => navigate('/registrations')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              View Registrations
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Application</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <span className="text-sm text-gray-600">
                {(JSON.stringify(localStorage.getItem('campus-sports-storage') || '').length / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
