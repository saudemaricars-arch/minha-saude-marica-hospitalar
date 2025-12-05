
import React, { useState } from 'react';
import { Icons, MOCK_VACCINES, MOCK_VACCINATION_PATIENTS } from '../../../constants';
import { VaccinationPage, VaccinationPatient } from '../../../types';

interface VaccinationModuleProps {
  onBack: () => void;
}

const VaccinationModule: React.FC<VaccinationModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<VaccinationPage>('patients');
  const [patients, setPatients] = useState<VaccinationPatient[]>(MOCK_VACCINATION_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<VaccinationPatient | null>(null);
  
  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<VaccinationPatient>>({});

  // Helper Stats
  const totalDosesToday = 45;
  const delayedPatients = patients.filter(p => p.delayedVaccines > 0).length;
  const lowStockItems = MOCK_VACCINES.filter(v => v.stockLevel < 30).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied': return <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded font-bold uppercase border border-teal-200">Aplicada</span>;
      case 'Late': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold uppercase border border-red-200">Atrasada</span>;
      case 'Scheduled': return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold uppercase border border-gray-200">Agendada</span>;
      default: return <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Pendente</span>;
    }
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPatient.name || !newPatient.cns) return;

      const patient: VaccinationPatient = {
          id: Math.random().toString(36).substr(2, 9),
          name: newPatient.name,
          cns: newPatient.cns,
          birthDate: newPatient.birthDate || '',
          age: '0 meses', // dynamic calc placeholder
          complianceRate: 0,
          delayedVaccines: 0,
          records: []
      };

      setPatients(prev => [patient, ...prev]);
      setIsModalOpen(false);
      setNewPatient({});
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-500 text-xs font-bold uppercase">Doses Hoje</h3>
                            <Icons.Syringe className="w-6 h-6 text-teal-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalDosesToday}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-500 text-xs font-bold uppercase">Atrasos (Busca Ativa)</h3>
                            <Icons.Clock className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-3xl font-bold text-red-600">{delayedPatients}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-500 text-xs font-bold uppercase">Estoque Crítico</h3>
                            <Icons.AlertTriangle className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-orange-600">{lowStockItems}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Cobertura Vacinal (Meta 95%)</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'BCG', val: 98 },
                            { name: 'Poliomielite', val: 92 },
                            { name: 'Penta', val: 94 },
                            { name: 'Tríplice Viral', val: 89 },
                        ].map(t => (
                            <div key={t.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{t.name}</span>
                                    <span className={`font-bold ${t.val >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{t.val}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${t.val >= 95 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${t.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

      case 'patients':
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                    <div className="relative w-full md:w-96">
                        <Icons.Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input type="text" placeholder="Buscar por nome, CNS ou data nasc..." className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-bold shadow-sm"
                    >
                        <Icons.UserPlus className="w-4 h-4" /> Novo Cadastro
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Criança / CNS</th>
                            <th className="px-6 py-4">Idade</th>
                            <th className="px-6 py-4 text-center">Status Vacinal</th>
                            <th className="px-6 py-4 text-center">Atrasos</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {patients.map(p => (
                            <tr key={p.id} className="hover:bg-teal-50/30 transition-colors cursor-pointer" onClick={() => setSelectedPatient(p)}>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{p.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">CNS: {p.cns}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-800">{p.age}</div>
                                    <div className="text-xs text-gray-500">Nasc: {p.birthDate}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px] mx-auto">
                                        <div 
                                            className={`h-2.5 rounded-full ${p.complianceRate === 100 ? 'bg-green-500' : p.complianceRate > 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                            style={{ width: `${p.complianceRate}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">{p.complianceRate}% Completo</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {p.delayedVaccines > 0 ? (
                                        <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs border border-red-100">
                                            {p.delayedVaccines} Pendente(s)
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-bold text-xs flex items-center justify-center gap-1">
                                            <Icons.CheckCircle className="w-3 h-3" /> Em dia
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">Ver Cartão</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

      case 'stock':
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Estoque de Imunobiológicos</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Vacina</th>
                            <th className="px-6 py-4">Lote</th>
                            <th className="px-6 py-4">Validade</th>
                            <th className="px-6 py-4 text-center">Doses Disponíveis</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {MOCK_VACCINES.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-900">{v.name}</td>
                                <td className="px-6 py-4 font-mono text-gray-600">{v.batch}</td>
                                <td className="px-6 py-4 text-gray-600">{v.expirationDate}</td>
                                <td className="px-6 py-4 text-center font-bold text-lg">{v.stockLevel}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        v.status === 'Available' ? 'bg-green-100 text-green-700' :
                                        v.status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {v.status === 'Available' ? 'Normal' : v.status === 'Low' ? 'Baixo' : 'Vencido'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

      case 'campaigns':
        return (
            <div className="animate-fade-in bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
                <Icons.Megaphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Módulo de Campanhas (Campanha Nacional de Multivacinação) em breve.</p>
            </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium mb-2"
            >
                <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-teal-200 shadow-sm transition-colors">
                <Icons.ArrowLeft className="w-4 h-4" />
                </div>
                Voltar ao Menu Principal
            </button>
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-600 rounded-lg text-white shadow-md">
                    <Icons.Syringe className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Vacinação Infantil
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Controle de calendário vacinal, estoque e busca ativa.
                    </p>
                </div>
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
             <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.BarChart2 className="w-4 h-4" /> Visão Geral
             </button>
             <button 
                onClick={() => setActiveTab('patients')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'patients' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.ListOrdered className="w-4 h-4" /> Carteira Digital
             </button>
             <button 
                onClick={() => setActiveTab('stock')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'stock' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Database className="w-4 h-4" /> Estoque
             </button>
             <button 
                onClick={() => setActiveTab('campaigns')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'campaigns' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Megaphone className="w-4 h-4" /> Campanhas
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
            {renderContent()}
        </div>

        {/* Patient Vaccination Card Modal */}
        {selectedPatient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden">
                    <div className="bg-teal-600 text-white p-6 flex justify-between items-start flex-shrink-0">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Carteira de Vacinação
                            </h2>
                            <p className="opacity-90 text-sm mt-1">
                                {selectedPatient.name} • {selectedPatient.age}
                            </p>
                        </div>
                        <button onClick={() => setSelectedPatient(null)} className="text-white/80 hover:text-white">
                            <Icons.XCircle className="w-8 h-8" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">Histórico de Aplicações</h3>
                        <div className="space-y-3">
                            {selectedPatient.records.map((rec, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900">{rec.vaccineName}</p>
                                        <p className="text-sm text-gray-500">{rec.dose}</p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(rec.status)}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {rec.status === 'Applied' ? `Aplicado em: ${rec.dateApplied}` : `Agendado para: ${rec.dateScheduled}`}
                                        </p>
                                        {rec.vaccinator && <p className="text-xs text-gray-400">Por: {rec.vaccinator}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 flex items-center gap-2">
                            <Icons.Printer className="w-4 h-4" /> Imprimir Espelho
                        </button>
                        <button className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold shadow hover:bg-teal-700 flex items-center gap-2">
                            <Icons.Syringe className="w-4 h-4" /> Registrar Dose
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* New Patient Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Novo Cadastro Vacinal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPatient.name || ''}
                    onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cartão SUS (CNS)</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPatient.cns || ''}
                    onChange={e => setNewPatient({ ...newPatient, cns: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input 
                    type="date" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPatient.birthDate || ''}
                    onChange={e => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                />
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
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold shadow-sm transition-colors"
                >
                  Criar Cartão
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

export default VaccinationModule;
