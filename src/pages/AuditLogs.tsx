import { useStore } from '../store';
import { FileText, Shield, Search } from 'lucide-react';
import { useState } from 'react';

export default function AuditLogs() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const filtered = auditLogs.filter(l => {
    const matchesSearch = l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || l.entityType === filter;
    return matchesSearch && matchesFilter;
  }).reverse();

  const entityTypes = [...new Set(auditLogs.map(l => l.entityType))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>
        <span className="text-sm text-gray-500">({auditLogs.length} entries)</span>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Types</option>
          {entityTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, 50).map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.action}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{log.entityType}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                    {log.newValue || log.oldValue || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No audit logs found</p>
        </div>
      )}
    </div>
  );
}
