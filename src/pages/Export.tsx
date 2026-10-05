import { useState } from 'react';
import { useStore } from '../store';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Export() {
  const { users, teams, tournaments, matches, auctions, auditLogs, games } = useStore();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [selectedData, setSelectedData] = useState({ players: true, teams: true, tournaments: true, matches: true, auctions: true, auditLogs: true });

  const handleExport = () => {
    setExporting(true);
    const wb = XLSX.utils.book_new();
    if (selectedData.players) { const players = users.filter(u => u.role === 'player').map(u => ({ Name: u.fullName, Email: u.email, Phone: u.phone, 'College ID': u.collegeId, Games: (u.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(', '), Status: u.active ? 'Active' : 'Suspended' })); const ws = XLSX.utils.json_to_sheet(players); XLSX.utils.book_append_sheet(wb, ws, 'Players'); }
    if (selectedData.teams) { const teamData = teams.map(t => ({ Name: t.name, Games: (t.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(', '), College: t.college, Members: t.members.length, Purse: t.purse })); const ws = XLSX.utils.json_to_sheet(teamData); XLSX.utils.book_append_sheet(wb, ws, 'Teams'); }
    if (selectedData.tournaments) { const tData = tournaments.map(t => ({ Name: t.name, Games: (t.games || []).map(gid => games.find(g => g.id === gid)?.name || gid).join(', '), Location: t.location, Status: t.status, Teams: (t.teams || []).length })); const ws = XLSX.utils.json_to_sheet(tData); XLSX.utils.book_append_sheet(wb, ws, 'Tournaments'); }
    if (selectedData.matches) { const mData = matches.map(m => ({ Tournament: tournaments.find(t => t.id === m.tournamentId)?.name || 'N/A', 'Team A': teams.find(t => t.id === m.teamA)?.name || 'N/A', 'Team B': teams.find(t => t.id === m.teamB)?.name || 'N/A', Game: games.find(g => g.id === m.gameId)?.name || 'N/A', Status: m.status, Winner: m.winner ? teams.find(t => t.id === m.winner)?.name : 'N/A' })); const ws = XLSX.utils.json_to_sheet(mData); XLSX.utils.book_append_sheet(wb, ws, 'Matches'); }
    XLSX.writeFile(wb, `Campus_Sports_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    setTimeout(() => { setExporting(false); setExported(true); }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Download className="w-6 h-6 text-green-500" /><h1 className="text-2xl font-bold">Export Data</h1></div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Select Data to Export</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[{ key: 'players', label: 'Players', count: users.filter(u => u.role === 'player').length }, { key: 'teams', label: 'Teams', count: teams.length }, { key: 'tournaments', label: 'Tournaments', count: tournaments.length }, { key: 'matches', label: 'Matches', count: matches.length }, { key: 'auctions', label: 'Auctions', count: auctions.length }, { key: 'auditLogs', label: 'Audit Logs', count: auditLogs.length }].map(item => (
            <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="checkbox" checked={(selectedData as any)[item.key]} onChange={e => setSelectedData({ ...selectedData, [item.key]: e.target.checked })} className="w-4 h-4 text-green-600 rounded" /><div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-gray-400">{item.count} records</p></div></label>
          ))}
        </div>
        <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{exporting ? <><span className="animate-spin">⏳</span> Exporting...</> : exported ? <><CheckCircle className="w-5 h-5" /> Exported!</> : <><FileSpreadsheet className="w-5 h-5" /> Export to Excel</>}</button>
      </div>
    </div>
  );
}
