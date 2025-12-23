
import React, { useState } from 'react';
import { Icons, MOCK_VIOLENCE_CASES } from '../../../constants';
import { ViolenceCase } from '../../../types';

interface ViolenciaModuleProps {
  onBack: () => void;
}

const ViolenciaModule: React.FC<ViolenciaModuleProps> = ({ onBack }) => {
  const [cases, setCases] = useState<ViolenceCase[]>(MOCK_VIOLENCE_CASES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<Partial<ViolenceCase>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenAdd = () => {
      setCurrentCase({ 
          riskLevel: 'Médio', 
          status: 'Em Acompanhamento', 
          type: 'Física', 
          isConfidential: true,
          referrals: []
      });
      setIsEditing(false);
      setIsModalOpen(true);
  };

  const handleOpenEdit = (vCase: ViolenceCase) => {
      setCurrentCase({ ...vCase });
      setIsEditing(true);
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Tem certeza que deseja excluir este registro?')) {
          setCases(prev => prev.filter(c => c.id !== id));
      }
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentCase.patientName) return;

      if (isEditing && currentCase.id) {
          setCases(prev => prev.map(c => c.id === currentCase.id ? { ...c, ...currentCase } as ViolenceCase : c));
      } else {
          const newCase: ViolenceCase = {
              ...currentCase,
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toLocaleDateString('pt-BR'),
              referrals: currentCase.referrals || []
          } as ViolenceCase;
          setCases(prev => [newCase, ...prev]);
      }
      setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors text-sm font-medium mb-2"
            >
                <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-purple-200 shadow-sm transition-colors">
                <Icons.ArrowLeft className="w-4 h-4" />
                </div>
                Voltar ao Menu Principal
            </button>
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-700 rounded-lg text-white shadow-md">
                    <Icons.EyeOff className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Acompanhamento de Violências
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Registro sigiloso, notificação compulsória e articulação com a rede de proteção.
                    </p>
                </div>
            </div>
          </div>

          <button 
            onClick={handleOpenAdd}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 text-sm flex items-center gap-2"
          >
             <Icons.ShieldAlert className="w-4 h-4" /> Registrar Novo Caso
          </button>
        </div>

        {/* Content */}
        <div className="animate-fade-in space-y-6">
             {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-500 text-xs font-bold uppercase">Casos (30 dias)</p>
                        <Icons.EyeOff className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{cases.length}</p>
                </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-500 text-xs font-bold uppercase">Alto Risco</p>
                        <Icons.Siren className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{cases.filter(c => c.riskLevel === 'Alto').length}</p>
                </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-500 text-xs font-bold uppercase">Encaminhados</p>
                        <Icons.Share2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{cases.filter(c => c.status === 'Encaminhado').length}</p>
                </div>
            </div>

            {/* Main List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-purple-900">Registro de Casos</h3>
                        <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                            <Icons.Lock className="w-3 h-3" /> Sigilo Absoluto
                        </span>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Buscar caso..." className="pl-8 pr-3 py-1.5 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <Icons.Search className="w-4 h-4 text-purple-400 absolute left-2.5 top-2" />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Vítima (Sigilo)</th>
                            <th className="px-6 py-4">Tipo de Violência</th>
                            <th className="px-6 py-4">Risco</th>
                            <th className="px-6 py-4">Rede de Proteção</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                        {cases.map(caseItem => (
                            <tr key={caseItem.id} className="hover:bg-purple-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {caseItem.isConfidential ? (
                                            <div className="p-1.5 bg-gray-100 rounded text-purple-600" title="Identidade Preservada">
                                                <Icons.Lock className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <div className="p-1.5 bg-gray-100 rounded text-gray-400">
                                                <Icons.Eye className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-gray-900">{caseItem.patientName}</div>
                                            <div className="text-xs text-gray-500">{caseItem.age} anos • {caseItem.gender} • {caseItem.date}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                        caseItem.type === 'Física' ? 'bg-red-50 text-red-700 border-red-100' :
                                        caseItem.type === 'Sexual' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        caseItem.type === 'Autoprovocada' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                        'bg-gray-50 text-gray-700 border-gray-100'
                                    }`}>
                                        {caseItem.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`font-bold text-xs ${
                                            caseItem.riskLevel === 'Alto' ? 'text-red-600 animate-pulse' : 
                                            caseItem.riskLevel === 'Médio' ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                            {caseItem.riskLevel}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {caseItem.referrals.map(ref => (
                                            <span key={ref} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                                                {ref}
                                            </span>
                                        ))}
                                        {caseItem.referrals.length === 0 && <span className="text-gray-400 text-xs">-</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700 font-medium text-xs">
                                    {caseItem.status}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEdit(caseItem)} className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-100 rounded" title="Editar">
                                            <Icons.Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(caseItem.id)} className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-100 rounded" title="Excluir">
                                            <Icons.Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
            </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {isEditing ? 'Editar Caso' : 'Registrar Violência'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome (Vítima)</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={currentCase.patientName || ''}
                    onChange={e => setCurrentCase({ ...currentCase, patientName: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-purple-900">
                      <input 
                        type="checkbox" 
                        checked={currentCase.isConfidential}
                        onChange={e => setCurrentCase({...currentCase, isConfidential: e.target.checked})}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      Manter Sigilo de Identidade
                  </label>
                  <Icons.Lock className="w-4 h-4 text-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                    <input 
                        type="number" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        value={currentCase.age}
                        onChange={e => setCurrentCase({ ...currentCase, age: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                        value={currentCase.gender}
                        onChange={e => setCurrentCase({ ...currentCase, gender: e.target.value })}
                    >
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="Outros">Outros</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Violência</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                    value={currentCase.type}
                    onChange={e => setCurrentCase({ ...currentCase, type: e.target.value as any })}
                >
                    <option value="Física">Física</option>
                    <option value="Psicológica">Psicológica</option>
                    <option value="Sexual">Sexual</option>
                    <option value="Negligência">Negligência</option>
                    <option value="Autoprovocada">Autoprovocada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Risco</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                    value={currentCase.riskLevel}
                    onChange={e => setCurrentCase({ ...currentCase, riskLevel: e.target.value as any })}
                >
                    <option value="Baixo">Baixo</option>
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
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
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-sm transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ViolenciaModule;
