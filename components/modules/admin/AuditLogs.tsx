
import React, { useState, useMemo } from 'react';
import { Icons } from '../../../constants';

interface LogEntry {
  id: number;
  user: string;
  role: string;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'PRINT';
  target: string;
  time: string; // ISO string for sorting would be better, but keeping simple string for now
  dateObj: Date; // Helper for filtering
  ip: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, user: 'Dr. Roberto Silva', role: 'Médico', action: 'UPDATE', target: 'Prontuário #12345', time: '10/05/2024 14:30', dateObj: new Date('2024-05-10T14:30:00'), ip: '192.168.1.45' },
  { id: 2, user: 'Enf. Juliana', role: 'Enfermeiro', action: 'LOGIN', target: 'Sistema', time: '10/05/2024 14:28', dateObj: new Date('2024-05-10T14:28:00'), ip: '192.168.1.22' },
  { id: 3, user: 'Admin Carlos', role: 'Admin', action: 'CREATE', target: 'Usuário [novo.medico]', time: '10/05/2024 13:15', dateObj: new Date('2024-05-10T13:15:00'), ip: '10.0.0.5' },
  { id: 4, user: 'Dr. João', role: 'Médico', action: 'PRINT', target: 'Relatório Mensal', time: '10/05/2024 11:00', dateObj: new Date('2024-05-10T11:00:00'), ip: '192.168.1.12' },
  { id: 5, user: 'Sistema', role: 'System', action: 'DELETE', target: 'Arquivos Temporários', time: '10/05/2024 03:00', dateObj: new Date('2024-05-10T03:00:00'), ip: 'LOCALHOST' },
  { id: 6, user: 'Recepção 01', role: 'Recepção', action: 'CREATE', target: 'Ficha Paciente #9988', time: '09/05/2024 08:15', dateObj: new Date('2024-05-09T08:15:00'), ip: '192.168.1.101' },
  { id: 7, user: 'Admin Carlos', role: 'Admin', action: 'EXPORT', target: 'Base de Usuários.csv', time: '09/05/2024 17:45', dateObj: new Date('2024-05-09T17:45:00'), ip: '10.0.0.5' },
  { id: 8, user: 'Dr. Roberto Silva', role: 'Médico', action: 'DELETE', target: 'Prescrição (Rascunho)', time: '08/05/2024 09:20', dateObj: new Date('2024-05-08T09:20:00'), ip: '192.168.1.45' },
];

const AuditLogs: React.FC = () => {
  const [logs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm);
      
      const matchesDate = dateFilter ? log.dateObj.toISOString().startsWith(dateFilter) : true;

      return matchesSearch && matchesDate;
    });
  }, [logs, searchTerm, dateFilter]);

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const header = ["ID", "Data/Hora", "Usuário", "Cargo", "Ação", "Alvo", "IP"];
    const rows = filteredLogs.map(l => 
      [l.id, l.time, l.user, l.role, l.action, l.target, l.ip].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `auditoria_sistema_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800 border-green-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOGIN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXPORT': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return Icons.PlusCircle;
      case 'UPDATE': return Icons.Edit;
      case 'DELETE': return Icons.Trash;
      case 'LOGIN': return Icons.UserCheck;
      case 'LOGOUT': return Icons.LogOut;
      case 'EXPORT': return Icons.Download;
      case 'PRINT': return Icons.Printer;
      default: return Icons.Activity;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Auditoria e Logs</h2>
           <p className="text-gray-500 text-sm">Rastreamento detalhado de todas as operações no sistema.</p>
        </div>
        <button 
          onClick={handleExport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
        >
            <Icons.Download className="w-4 h-4" />
            Exportar CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
         <div className="relative flex-grow">
            <Icons.Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por usuário, ação ou alvo..." 
              className="w-full pl-10 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" 
            />
         </div>
         <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 outline-none bg-white" 
         />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                 <tr>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Data/Hora</th>
                    <th className="px-6 py-4 font-semibold">Usuário</th>
                    <th className="px-6 py-4 font-semibold">Ação</th>
                    <th className="px-6 py-4 font-semibold">Alvo / Detalhes</th>
                    <th className="px-6 py-4 font-semibold text-right">IP Origem</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {filteredLogs.length > 0 ? (
                   filteredLogs.map(log => {
                      const ActionIcon = getActionIcon(log.action);
                      return (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4 text-gray-600 font-mono text-xs whitespace-nowrap">{log.time}</td>
                           <td className="px-6 py-4">
                              <p className="font-medium text-gray-800">{log.user}</p>
                              <p className="text-xs text-gray-400">{log.role}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getActionBadge(log.action)}`}>
                                 <ActionIcon className="w-3.5 h-3.5" />
                                 {log.action}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]" title={log.target}>{log.target}</td>
                           <td className="px-6 py-4 text-gray-400 text-xs text-right font-mono">{log.ip}</td>
                        </tr>
                      );
                   })
                 ) : (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                       <div className="flex flex-col items-center">
                         <Icons.Search className="w-10 h-10 opacity-20 mb-2" />
                         <p>Nenhum registro encontrado.</p>
                       </div>
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default AuditLogs;
