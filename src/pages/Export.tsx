import { useState } from 'react';
import { useStore } from '../store';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Export() {
  const { users, teams, tournaments, matches, auctions, auditLogs, sports } = useStore();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [selectedData, setSelectedData] = useState({
    players: true, teams: true, tournaments: true, matches: true, auctions: true, auditLogs: true,
  });

  const handleExport = () => {
    setExporting(true);
    const wb = XLSX.utils.book_new();

    if (selectedData.players) {
      const players = users.filter(u => u.role === 'player').map(u => ({
        Name: u.fullName, Email: u.email, Phone: u.phone, 'College ID': u.collegeId,
        Course: u.course, Branch: u.branch, Year: u.year, Gender: u.gender,
        Sport: u.sport, Position: u.position, Status: u.active ? 'Active' : 'Suspended',
        'Registered': u.createdAt,
      }));
      const ws = XLSX.utils.json_to_sheet(players);
      XLSX.utils.book_append_sheet(wb, ws, 'Players');
    }

    if (selectedData.teams) {
      const teamData = teams.map(t => ({
        Name: t.name, Sport: t.sport, College: t.college, Email: t.email,
        Contact: t.contact, Members: t.members.length, Purse: t.purse,
        Owner: users.find(u => u.id === t.ownerId)?.fullName || 'N/A',
        Created: t.createdAt,
      }));
      const ws = XLSX.utils.json_to_sheet(teamData);
      XLSX.utils.book_append_sheet(wb, ws, 'Teams');
    }

    if (selectedData.tournaments) {
      const tData = tournaments.map(t => ({
        Name: t.name, Sport: t.sport, Location: t.location, Status: t.status,
        'Start Date': t.startDate, 'End Date': t.endDate,
        Teams: t.teams.length, 'Win Pts': t.pointsForWin, 'Draw Pts': t.pointsForDraw,
        Created: t.createdAt,
      }));
      const ws = XLSX.utils.json_to_sheet(tData);
      XLSX.utils.book_append_sheet(wb, ws, 'Tournaments');
    }

    if (selectedData.matches) {
      const mData = matches.map(m => ({
        Tournament: tournaments.find(t => t.id === m.tournamentId)?.name || 'N/A',
        'Team A': teams.find(t => t.id === m.teamA)?.name || 'N/A',
        'Team B': teams.find(t => t.id === m.teamB)?.name || 'N/A',
        Sport: m.sport, Venue: m.venue, Date: m.scheduledDate,
        Status: m.status, Winner: m.winner ? teams.find(t => t.id === m.winner)?.name : 'N/A',
        Referee: users.find(u => u.id === m.refereeId)?.fullName || 'N/A',
      }));
      const ws = XLSX.utils.json_to_sheet(mData);
      XLSX.utils.book_append_sheet(wb, ws, 'Matches');
    }

    if (selectedData.auctions) {
      const aData = auctions.map(a => ({
        Player: users.find(u => u.id === a.playerId)?.fullName || 'N/A',
        Tournament: tournaments.find(t => t.id === a.tournamentId)?.name || 'N/A',
        'Base Price': a.basePrice, Status: a.status,
        'Sold To': a.soldTo ? teams.find(t => t.id === a.soldTo)?.name : 'N/A',
        'Sold Price': a.soldPrice || 'N/A', 'Total Bids': a.bids.length,
      }));
      const ws = XLSX.utils.json_to_sheet(aData);
      XLSX.utils.book_append_sheet(wb, ws, 'Auctions');
    }

    if (selectedData.auditLogs) {
      const lData = auditLogs.map(l => ({
        User: l.userName, Action: l.action, 'Entity Type': l.entityType,
        'Entity ID': l.entityId, 'Old Value': l.oldValue, 'New Value': l.newValue,
        Timestamp: l.timestamp,
      }));
      const ws = XLSX.utils.json_to_sheet(lData);
      XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs');
    }

    XLSX.writeFile(wb, `Campus_Sports_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    setTimeout(() => { setExporting(false); setExported(true); }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Download className="w-6 h-6 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Export Data</h1>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Select Data to Export</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { key: 'players', label: 'Players', count: users.filter(u => u.role === 'player').length },
            { key: 'teams', label: 'Teams', count: teams.length },
            { key: 'tournaments', label: 'Tournaments', count: tournaments.length },
            { key: 'matches', label: 'Matches', count: matches.length },
            { key: 'auctions', label: 'Auctions', count: auctions.length },
            { key: 'auditLogs', label: 'Audit Logs', count: auditLogs.length },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" checked={(selectedData as any)[item.key]}
                onChange={e => setSelectedData({...selectedData, [item.key]: e.target.checked})}
                className="w-4 h-4 text-green-600 rounded" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-400">{item.count} records</p>
              </div>
            </label>
          ))}
        </div>

        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {exporting ? (
            <><span className="animate-spin">⏳</span> Exporting...</>
          ) : exported ? (
            <><CheckCircle className="w-5 h-5" /> Exported Successfully!</>
          ) : (
            <><FileSpreadsheet className="w-5 h-5" /> Export to Excel</>
          )}
        </button>

        {exported && (
          <p className="mt-3 text-sm text-green-600">File downloaded: Campus_Sports_Export_{new Date().toISOString().split('T')[0]}.xlsx</p>
        )}
      </div>

      {/* Database Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Database Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-xs text-blue-500">Total Users</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{teams.length}</p>
            <p className="text-xs text-purple-500">Teams</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{tournaments.length}</p>
            <p className="text-xs text-yellow-500">Tournaments</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{matches.length}</p>
            <p className="text-xs text-green-500">Matches</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Storage:</span> localStorage (browser-based persistence)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            In production, this would be MySQL with SQLAlchemy ORM
          </p>
        </div>
      </div>
    </div>
  );
}
