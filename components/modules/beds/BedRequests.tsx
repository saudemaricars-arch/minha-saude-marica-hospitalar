
import React, { useState } from 'react';
import { Icons, MOCK_BED_REQUESTS } from '../../../constants';
import { BedRequest, BedType } from '../../../types';

const BedRequests: React.FC = () => {
  const [requests, setRequests] = useState<BedRequest[]>(MOCK_BED_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<Partial<BedRequest>>({ priority: 'Média', requiredType: 'Enfermaria' });

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newRequest.patientName || !newRequest.requesterUnit) return;

      const request: BedRequest = {
          id: Math.random().toString(36).substr(2, 9),
          patientName: newRequest.patientName,
          priority: newRequest.priority as any,
          requiredType: newRequest.requiredType as BedType,
          requesterUnit: newRequest.requesterUnit,
          requestTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setRequests(prev => [request, ...prev]);
      setIsModalOpen(false);
      setNewRequest({ priority: 'Média', requiredType: 'Enfermaria' });
  };

  const handleAllocate = (id: string) => {
      if(confirm("Confirmar alocação de leito para este paciente?")) {
          setRequests(prev => prev.filter(r => r.id !== id));
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
         <div>
            <h3 className="font-bold text-gray-900 text-lg">Solicitações Pendentes</h3>
            <p className="text-gray-500 text-sm">Pacientes aguardando leito internamente.</p>
         </div>
         <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-red-700 flex items-center gap-2"
         >
            <Icons.PlusCircle className="w-4 h-4" /> Nova Solicitação
         </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
               <tr>
                  <th className="px-6 py-4">Prioridade</th>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Origem</th>
                  <th className="px-6 py-4">Leito Requerido</th>
                  <th className="px-6 py-4">Horário</th>
                  <th className="px-6 py-4 text-right">Ação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
               {requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                           req.priority === 'Alta' ? 'bg-red-100 text-red-700' : 
                           req.priority === 'Média' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                           {req.priority}
                        </span>
                     </td>
                     <td className="px-6 py-4 font-bold text-gray-900">{req.patientName}</td>
                     <td className="px-6 py-4 text-gray-600">{req.requesterUnit}</td>
                     <td className="px-6 py-4 text-gray-800 font-medium">{req.requiredType}</td>
                     <td className="px-6 py-4 font-mono text-gray-500">{req.requestTime}</td>
                     <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => handleAllocate(req.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto hover:underline"
                        >
                           <Icons.CheckCircle className="w-4 h-4" /> Alocar
                        </button>
                     </td>
                  </tr>
               ))}
               {requests.length === 0 && (
                   <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                           Nenhuma solicitação pendente.
                       </td>
                   </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Nova Solicitação de Leito</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={newRequest.patientName || ''}
                    onChange={e => setNewRequest({ ...newRequest, patientName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Solicitante</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Ex: Emergência"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={newRequest.requesterUnit || ''}
                        onChange={e => setNewRequest({ ...newRequest, requesterUnit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                        value={newRequest.priority}
                        onChange={e => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                    >
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Leito</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                    value={newRequest.requiredType}
                    onChange={e => setNewRequest({ ...newRequest, requiredType: e.target.value as any })}
                >
                    <option value="Enfermaria">Enfermaria</option>
                    <option value="UTI">UTI</option>
                    <option value="Isolamento">Isolamento</option>
                    <option value="Apartamento">Apartamento</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-sm transition-colors"
                >
                  Solicitar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedRequests;
