
import React, { useState } from 'react';
import { Icons } from '../../../constants';

const PendingSignatures: React.FC = () => {
  // Mock Data
  const [documents, setDocuments] = useState([
      { id: 1, name: 'Laudo de Alta - Paciente João Silva', type: 'Laudos', size: '450 KB', requester: 'Enf. Juliana Costa', deadline: 'Hoje, 18:00' },
      { id: 2, name: 'Prescrição Médica #9921', type: 'Receitas', size: '120 KB', requester: 'Dr. Roberto Silva', deadline: 'Amanhã' },
      { id: 3, name: 'Solicitação de Exame - Maria Souza', type: 'Exames', size: '1.2 MB', requester: 'Dra. Ana', deadline: 'Hoje, 19:30' },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSelect = (id: number) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(i => i !== id));
      } else {
          setSelectedIds(prev => [...prev, id]);
      }
  };

  const toggleSelectAll = () => {
      if (selectedIds.length === documents.length) {
          setSelectedIds([]);
      } else {
          setSelectedIds(documents.map(d => d.id));
      }
  };

  const handleSign = () => {
      if (selectedIds.length === 0) return;
      setIsSigningModalOpen(true);
  };

  const confirmSign = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      setTimeout(() => {
          setDocuments(prev => prev.filter(d => !selectedIds.includes(d.id)));
          setSelectedIds([]);
          setIsProcessing(false);
          setIsSigningModalOpen(false);
          alert("Documentos assinados digitalmente com sucesso!");
      }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Assinaturas Pendentes</h2>
           <p className="text-gray-500 text-sm">Documentos que aguardam sua validação com e-CPF/CRM.</p>
        </div>
        <button 
            onClick={handleSign}
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm text-sm font-medium transition-colors ${selectedIds.length > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
            <Icons.PenTool className="w-4 h-4" />
            Assinar Selecionados ({selectedIds.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold w-8">
                            <input 
                                type="checkbox" 
                                className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                                checked={documents.length > 0 && selectedIds.length === documents.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Documento</th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Solicitado Por</th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Data Limite</th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold text-right">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {documents.length > 0 ? (
                        documents.map(doc => (
                            <tr key={doc.id} className={`transition-colors ${selectedIds.includes(doc.id) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                <td className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                                        checked={selectedIds.includes(doc.id)}
                                        onChange={() => toggleSelect(doc.id)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{doc.name}</div>
                                    <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{doc.requester}</td>
                                <td className="px-6 py-4 text-sm text-red-600 font-medium flex items-center gap-1">
                                    <Icons.Clock className="w-3 h-3" /> {doc.deadline}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:underline text-sm font-medium mr-4">Revisar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                <Icons.CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
                                <p>Tudo em dia! Nenhuma assinatura pendente.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>

      {/* Signing Modal */}
      {isSigningModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Assinatura Digital</h3>
                      <button onClick={() => setIsSigningModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <Icons.XCircle className="w-6 h-6" />
                      </button>
                  </div>
                  <form onSubmit={confirmSign} className="p-6">
                      <div className="mb-4 text-center">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Icons.ShieldCheck className="w-8 h-8" />
                          </div>
                          <p className="text-gray-800 font-medium">Você está prestes a assinar {selectedIds.length} documento(s).</p>
                          <p className="text-sm text-gray-500 mt-1">Esta ação tem validade jurídica e não pode ser desfeita.</p>
                      </div>
                      
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Certificado Digital</label>
                          <select className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white">
                              <option>ICP-Brasil A3 - Roberto Silva (Válido até 2025)</option>
                          </select>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">PIN / Senha</label>
                          <input type="password" required className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••" />
                      </div>

                      <div className="flex gap-3">
                          <button type="button" onClick={() => setIsSigningModalOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancelar</button>
                          <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm flex justify-center items-center gap-2"
                          >
                              {isProcessing ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.PenTool className="w-4 h-4" />}
                              Confirmar Assinatura
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default PendingSignatures;
