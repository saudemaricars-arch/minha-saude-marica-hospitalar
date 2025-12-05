
import React, { useState } from 'react';
import { Icons } from '../../../constants';

interface IntegrationItem {
    id: string;
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'maintenance' | 'error';
    lastSync: string;
    icon: string;
    color: string;
}

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
      { id: '1', name: 'Laboratório Central (LIS)', description: 'Importação automática de resultados via HL7.', status: 'connected', lastSync: '2 min atrás', icon: 'TestTube', color: 'blue' },
      { id: '2', name: 'Farmácia Municipal', description: 'Controle de estoque e dispensação integrado.', status: 'connected', lastSync: '10 min atrás', icon: 'CreditCard', color: 'green' },
      { id: '3', name: 'Portal CADSUS', description: 'Validação de Cartão Nacional de Saúde (CNS).', status: 'maintenance', lastSync: 'Pausado', icon: 'Globe', color: 'gray' },
      { id: '4', name: 'Sistema de Faturamento', description: 'Exportação de BPA e AIH.', status: 'disconnected', lastSync: 'Nunca', icon: 'FileText', color: 'purple' },
  ]);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState<IntegrationItem | null>(null);

  const handleToggleConnection = (id: string) => {
      setLoadingId(id);
      setTimeout(() => {
          setIntegrations(prev => prev.map(item => {
              if (item.id === id) {
                  return {
                      ...item,
                      status: item.status === 'connected' ? 'disconnected' : 'connected',
                      lastSync: item.status === 'connected' ? 'Desconectado' : 'Agora'
                  };
              }
              return item;
          }));
          setLoadingId(null);
      }, 1500);
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'connected': return 'bg-green-100 text-green-800';
          case 'disconnected': return 'bg-gray-100 text-gray-600';
          case 'maintenance': return 'bg-yellow-100 text-yellow-800';
          case 'error': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Integrações Externas</h2>
           <p className="text-gray-500 text-sm">Conectividade com serviços de terceiros e APIs.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium">
            <Icons.Link className="w-4 h-4" />
            Nova Conexão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {integrations.map(item => {
             const IconComponent = Icons[item.icon] || Icons.Link;
             return (
                <div key={item.id} className={`bg-white p-6 rounded-xl border transition-all ${item.status === 'disconnected' ? 'border-gray-200 opacity-80 hover:opacity-100' : 'border-gray-300 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg bg-${item.color}-50 text-${item.color}-600`}>
                            <IconComponent className="w-6 h-6" />
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(item.status)}`}>
                            {item.status === 'connected' ? 'Conectado' : item.status === 'disconnected' ? 'Desconectado' : item.status === 'maintenance' ? 'Manutenção' : 'Erro'}
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Última sync: {item.lastSync}</p>
                    <p className="text-gray-600 text-sm mb-6 min-h-[40px]">{item.description}</p>
                    
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button 
                            onClick={() => setShowLogs(item)}
                            className="flex-1 text-sm text-gray-700 border border-gray-200 px-3 py-2 rounded hover:bg-gray-50 font-medium"
                        >
                            Ver Logs
                        </button>
                        <button 
                            onClick={() => handleToggleConnection(item.id)}
                            disabled={loadingId === item.id}
                            className={`flex-1 text-sm px-3 py-2 rounded font-bold shadow-sm text-white transition-colors flex items-center justify-center gap-2 ${
                                item.status === 'connected' 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loadingId === item.id ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                item.status === 'connected' ? 'Desconectar' : 'Conectar'
                            )}
                        </button>
                    </div>
                </div>
             )
         })}
      </div>

      {/* Logs Modal */}
      {showLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-800">Logs de Integração: {showLogs.name}</h3>
                      <button onClick={() => setShowLogs(null)} className="text-gray-400 hover:text-gray-600">
                          <Icons.XCircle className="w-6 h-6" />
                      </button>
                  </div>
                  <div className="p-4 h-64 overflow-y-auto bg-gray-900 text-green-400 font-mono text-xs space-y-2">
                      <p>[INFO] 10:00:01 - Handshake initiated...</p>
                      <p>[INFO] 10:00:02 - Auth token verified.</p>
                      <p>[DATA] 10:00:03 - Received 45 packets.</p>
                      <p>[INFO] 10:05:00 - Sync completed successfully.</p>
                      {showLogs.status === 'error' && <p className="text-red-500">[ERROR] Connection timed out.</p>}
                      {showLogs.status === 'disconnected' && <p className="text-gray-500">[WARN] Service disconnected by user.</p>}
                  </div>
                  <div className="p-4 border-t border-gray-200 flex justify-end">
                      <button onClick={() => setShowLogs(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium text-sm">
                          Fechar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Integrations;
