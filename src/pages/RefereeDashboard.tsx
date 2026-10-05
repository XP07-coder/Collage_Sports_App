import { useStore } from '../store';
import { Flag, Calendar, Radio, CheckCircle } from 'lucide-react';

export default function RefereeDashboard() {
  const { currentUser, matches, teams } = useStore();
  const myMatches = matches.filter(m => m.refereeId === currentUser?.id);
  const liveMatches = myMatches.filter(m => m.status === 'live');
  const upcomingMatches = myMatches.filter(m => m.status === 'scheduled');
  const completedMatches = myMatches.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Flag className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Referee Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your assigned matches</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Radio className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-2xl font-bold">{liveMatches.length}</p>
          <p className="text-xs text-gray-500">Live Matches</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Calendar className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{upcomingMatches.length}</p>
          <p className="text-xs text-gray-500">Upcoming</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold">{completedMatches.length}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Flag className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-2xl font-bold">{myMatches.length}</p>
          <p className="text-xs text-gray-500">Total Assigned</p>
        </div>
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Live Matches
          </h3>
          <div className="space-y-3">
            {liveMatches.map(m => {
              const teamA = teams.find(t => t.id === m.teamA);
              const teamB = teams.find(t => t.id === m.teamB);
              return (
                <div key={m.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="font-semibold">{teamA?.name}</p>
                      <p className="text-2xl font-bold text-red-600">
                        {m.sets[m.sets.length - 1]?.scoreA || 0}
                      </p>
                    </div>
                    <div className="px-4">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-bold">LIVE</span>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-semibold">{teamB?.name}</p>
                      <p className="text-2xl font-bold text-red-600">
                        {m.sets[m.sets.length - 1]?.scoreB || 0}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Upcoming Matches</h3>
        {upcomingMatches.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming matches assigned</p>
        ) : (
          <div className="space-y-2">
            {upcomingMatches.map(m => {
              const teamA = teams.find(t => t.id === m.teamA);
              const teamB = teams.find(t => t.id === m.teamB);
              return (
                <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{teamA?.name} vs {teamB?.name}</p>
                    <p className="text-xs text-gray-500">{m.sport} • {m.venue}</p>
                  </div>
                  <span className="text-xs text-gray-400">{m.scheduledDate}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
