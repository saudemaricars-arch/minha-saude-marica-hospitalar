
import React, { useState } from 'react';
import { Icons } from '../../../constants';

interface BackupItem {
    id: number;
    date: string;
    type: 'Completo' | 'Incremental' | 'Manual';
    size: string;
    status: 'Sucesso' | 'Falha' | 'Em Andamento';
}

const BackupRestore: React.FC = () => {
  const [backups, setBackups] = useState<BackupItem[]>([
      { id: 1, date: 'Hoje, 03:00', type: 'Completo', size: '2.4 GB', status: 'Sucesso' },
      { id: 2, date: 'Ontem, 03:00', type: 'Completo', size: '2.3 GB', status: 'Sucesso' },
      { id: 3, date: 'Anteontem, 03:00', type: 'Completo', size: '2.3 GB', status: 'Sucesso' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBackup = () => {
      setIsGenerating(true);
      // Simulate backend process
      setTimeout(() => {
          const newBackup: BackupItem = {
              id: Date.now(),
              date: 'Agora',
              type: 'Manual',
              size: '2.4 GB',
              status: 'Sucesso'
          };
          setBackups(prev => [newBackup, ...prev]);
          setIsGenerating(false);
          alert('Backup manual gerado com sucesso!');
      }, 2000);
  };

  const handleDownload = (id: number) => {
      alert('Iniciando download seguro do pacote de backup...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Backup e Restauração</h2>
           <p className="text-gray-500 text-sm">Garanta a segurança dos dados com cópias periódicas.</p>
        </div>
        <button 
            onClick={handleGenerateBackup}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isGenerating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Database className="w-4 h-4" />}
            {isGenerating ? 'Gerando...' : 'Gerar Backup Manual'}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
         <Icons.ShieldCheck className="w-6 h-6 text-blue-600 mt-1" />
         <div>
            <h3 className="font-bold text-blue-900">Backup Automático Ativo</h3>
            <p className="text-sm text-blue-700 mt-1">O sistema realiza backups incrementais a cada 6 horas e backups completos diariamente às 03:00 AM.</p>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-800 bg-gray-50">Histórico de Backups</div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-200 text-gray-500 text-xs uppercase">
                <tr>
                    <th className="px-6 py-3">Data/Hora</th>
                    <th className="px-6 py-3">Tipo</th>
                    <th className="px-6 py-3">Tamanho</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {backups.map((bkp) => (
                    <tr key={bkp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{bkp.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{bkp.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{bkp.size}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${bkp.status === 'Sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {bkp.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => handleDownload(bkp.id)}
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium flex items-center justify-end gap-1 ml-auto"
                            >
                            <Icons.Download className="w-4 h-4" /> Download
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default BackupRestore;