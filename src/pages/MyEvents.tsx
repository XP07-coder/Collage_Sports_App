import { useStore } from '../store';
import { Trophy, Calendar, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyEvents() {
  const { currentUser, eventRegistrations, tournaments, teams } = useStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const myRegistrations = eventRegistrations.filter(r => r.playerId === currentUser.id);
  const myTeam = teams.find(t => t.members.includes(currentUser.id));

  const getStatusIcon = (reg: typeof myRegistrations[0]) => {
    if (reg.registrationStatus === 'approved' && reg.paymentStatus === 'approved') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (reg.registrationStatus === 'rejected' || reg.paymentStatus === 'rejected') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  const getEligibility = (reg: typeof myRegistrations[0]) => {
    return reg.registrationStatus === 'approved' && (reg.paymentStatus === 'approved' || reg.registrationFee === 0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-2xl font-bold text-indigo-600">{myRegistrations.length}</p>
          <p className="text-xs text-gray-500">Total Registrations</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-2xl font-bold text-green-600">{myRegistrations.filter(r => getEligibility(r)).length}</p>
          <p className="text-xs text-gray-500">Eligible</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-2xl font-bold text-yellow-600">{myRegistrations.filter(r => r.paymentStatus === 'pending').length}</p>
          <p className="text-xs text-gray-500">Pending Approval</p>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {myRegistrations.map(reg => {
          const tournament = tournaments.find(t => t.id === reg.tournamentId);
          const eligible = getEligibility(reg);
          return (
            <div key={reg.id} className="bg-white rounded-xl p-5 shadow-sm border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(reg)}
                  <div>
                    <h3 className="font-semibold text-lg">{tournament?.name || 'Unknown Tournament'}</h3>
                    <p className="text-sm text-gray-500">{reg.sport} • Fee: ₹{reg.registrationFee}</p>
                    <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(reg.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/tournament/${reg.tournamentId}`)}
                  className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
                  View Tournament
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Payment</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    reg.paymentStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    reg.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reg.paymentStatus === 'approved' ? '✓ Approved' : reg.paymentStatus === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Registration</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    reg.registrationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    reg.registrationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {reg.registrationStatus}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Eligibility</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {eligible ? '✓ ELIGIBLE' : '✗ NOT ELIGIBLE'}
                  </span>
                </div>
              </div>

              {/* Warning for pending */}
              {!eligible && reg.paymentStatus === 'pending' && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      Your registration fee has not yet been approved by the administrator. You cannot participate in matches until approved.
                    </p>
                  </div>
                </div>
              )}

              {reg.registrationStatus === 'rejected' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      Your registration has been rejected. Please contact the administrator for more information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {myRegistrations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No Event Registrations</h3>
          <p className="text-gray-400 mt-2">Browse tournaments and register for events to participate</p>
          <button onClick={() => navigate('/tournaments')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Browse Tournaments
          </button>
        </div>
      )}
    </div>
  );
}
