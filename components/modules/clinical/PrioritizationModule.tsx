
import React, { useState } from 'react';
import { Icons, MOCK_HOSPITALIZATION_QUEUE, MOCK_BED_AVAILABILITY } from '../../../constants';
import { HospitalizationPatient, RiskLevel } from '../../../types';

interface PrioritizationModuleProps {
  onBack: () => void;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  red: 'bg-red-100 text-red-800 border-red-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  white: 'bg-gray-100 text-gray-800 border-gray-200',
};

const PrioritizationModule: React.FC<PrioritizationModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'beds' | 'reports'>('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBedType, setSelectedBedType] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<HospitalizationPatient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justification, setJustification] = useState('');

  // Derived Statistics
  const totalInQueue = MOCK_HOSPITALIZATION_QUEUE.filter(p => p.status === 'aguardando').length;
  const criticalPatients = MOCK_HOSPITALIZATION_QUEUE.filter(p => p.riskLevel === 'red' || p.riskLevel === 'orange').length;
  const avgWaitTime = Math.round(MOCK_HOSPITALIZATION_QUEUE.reduce((acc, curr) => acc + curr.waitTimeHours, 0) / MOCK_HOSPITALIZATION_QUEUE.length) || 0;
  const totalBedsFree = MOCK_BED_AVAILABILITY.reduce((acc, curr) => acc + (curr.total - curr.occupied - curr.cleaning - curr.maintenance), 0);

  const filteredQueue = MOCK_HOSPITALIZATION_QUEUE.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBed = selectedBedType === 'all' || p.requestedBedType === selectedBedType;
    return matchesSearch && matchesBed;
  }).sort((a, b) => b.priorityScore - a.priorityScore); // Auto-sort by score

  const handleOpenModal = (patient: HospitalizationPatient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
    setJustification('');
  };

  const handleReclassify = () => {
    // In a real app, this would submit to API
    alert(`Prioridade alterada com sucesso.\nJustificativa: ${justification}`);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium mb-2"
            >
                <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-red-200 shadow-sm transition-colors">
                <Icons.ArrowLeft className="w-4 h-4" />
                </div>
                Voltar ao Menu Principal
            </button>
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg text-white shadow-md">
                    <Icons.TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Prioriza Internação
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Gestão inteligente de filas e alocação de leitos hospitalares.
                    </p>
                </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
             <button 
                onClick={() => setActiveTab('queue')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'queue' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.ClipboardList className="w-4 h-4" /> Fila de Espera
             </button>
             <button 
                onClick={() => setActiveTab('beds')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'beds' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Bed className="w-4 h-4" /> Mapa de Leitos
             </button>
             <button 
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'reports' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.PieChart className="w-4 h-4" /> Indicadores
             </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Fila Total</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalInQueue}</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><Icons.TrendingUp className="w-3 h-3" /> Estável</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Icons.Users className="w-6 h-6" /></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Críticos</p>
                    <h3 className="text-2xl font-bold text-red-600">{criticalPatients}</h3>
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><Icons.AlertTriangle className="w-3 h-3" /> Atenção</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Icons.Activity className="w-6 h-6" /></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tempo Médio</p>
                    <h3 className="text-2xl font-bold text-gray-900">{avgWaitTime}h</h3>
                    <p className="text-xs text-orange-500 mt-1">Acima da meta (4h)</p>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Icons.Clock className="w-6 h-6" /></div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Leitos Livres</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalBedsFree}</h3>
                    <p className="text-xs text-gray-500 mt-1">De 105 totais</p>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Icons.Bed className="w-6 h-6" /></div>
            </div>
        </div>

        {activeTab === 'queue' && (
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Main Queue List */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    {/* Filter Bar */}
                    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 bg-gray-50 rounded-t-xl">
                         <div className="relative flex-1">
                            <Icons.Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar paciente, diagnóstico ou ID..." 
                                className="w-full pl-10 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.Filter className="w-4 h-4 text-gray-500" />
                            <select 
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 bg-white outline-none"
                                value={selectedBedType}
                                onChange={(e) => setSelectedBedType(e.target.value)}
                            >
                                <option value="all">Todos os Leitos</option>
                                <option value="UTI Geral">UTI Geral</option>
                                <option value="UTI Cardio">UTI Cardio</option>
                                <option value="Enfermaria Clínica">Enfermaria Clínica</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center">Score</th>
                                    <th className="px-6 py-4">Paciente</th>
                                    <th className="px-6 py-4">Necessidade</th>
                                    <th className="px-6 py-4">Tempo Espera</th>
                                    <th className="px-6 py-4">Origem/Status</th>
                                    <th className="px-6 py-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredQueue.map(patient => (
                                    <tr key={patient.id} className="hover:bg-purple-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                                                patient.priorityScore >= 90 ? 'bg-red-50 text-red-600 border-red-200' :
                                                patient.priorityScore >= 70 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                'bg-yellow-50 text-yellow-600 border-yellow-200'
                                            }`}>
                                                {patient.priorityScore}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{patient.name}</div>
                                            <div className="text-xs text-gray-500">{patient.age} anos • {patient.gender}</div>
                                            <div className="text-xs font-medium text-gray-700 mt-1">{patient.diagnosis}</div>
                                            {patient.comorbidities.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {patient.comorbidities.map(c => (
                                                        <span key={c} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">{c}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                                                {patient.requestedBedType}
                                            </span>
                                            {patient.riskLevel === 'red' && (
                                                <div className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                                                    <Icons.AlertTriangle className="w-3 h-3" /> Urgente
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Icons.Clock className="w-4 h-4 text-gray-400" />
                                                <span className={`font-mono font-medium ${patient.waitTimeHours > 12 ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {patient.waitTimeHours}h
                                                </span>
                                            </div>
                                            {patient.waitTimeHours > 24 && (
                                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Expirado</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">{patient.origin}</div>
                                            <div className={`text-xs mt-1 capitalize ${
                                                patient.status === 'reservado' ? 'text-blue-600 font-bold' : 'text-gray-500'
                                            }`}>
                                                {patient.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(patient)}
                                                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                                                    title="Reavaliar Prioridade"
                                                >
                                                    <Icons.Sliders className="w-4 h-4" />
                                                </button>
                                                <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-2">
                                                    <Icons.CheckCircle className="w-3 h-3" /> Internar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Sidebar - Bed Availability */}
                <div className="w-full xl:w-80 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                         <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Icons.Bed className="w-4 h-4 text-gray-500" /> Disponibilidade
                        </h3>
                        <div className="space-y-4">
                            {MOCK_BED_AVAILABILITY.map((bed, idx) => {
                                const free = bed.total - bed.occupied - bed.cleaning - bed.maintenance;
                                const percentage = (bed.occupied / bed.total) * 100;
                                return (
                                    <div key={idx} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{bed.sector}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${free > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {free} Livres
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                            <div className={`h-full rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400">
                                            <span>Ocup: {bed.occupied}/{bed.total}</span>
                                            <span>Limpeza: {bed.cleaning}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Justification / Rules Widget */}
                    <div className="bg-purple-50 rounded-xl border border-purple-100 p-5">
                        <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icons.Info className="w-4 h-4" /> Critérios de Desempate
                        </h3>
                        <ul className="text-xs text-purple-800 space-y-2 list-disc pl-4">
                            <li>Score Clínico (Gravidade)</li>
                            <li>Tempo de Espera em Fila</li>
                            <li>Idade (Prioridade Legal)</li>
                            <li>Demanda de Isolamento</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {/* Modal for Reclassification */}
        {isModalOpen && selectedPatient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                    <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Icons.Sliders className="w-5 h-5" /> Reavaliar Prioridade
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                            <Icons.XCircle className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-sm font-bold text-gray-900">{selectedPatient.name}</p>
                            <p className="text-xs text-gray-500">Score Atual: <span className="font-bold">{selectedPatient.priorityScore}</span></p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Novo Score Calculado (Simulação)</label>
                            <input type="range" min="0" max="100" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Baixo (0)</span>
                                <span>Crítico (100)</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Justificativa Técnica <span className="text-red-500">*</span></label>
                            <textarea 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none text-sm"
                                placeholder="Descreva o motivo clínico para alteração da prioridade..."
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-1">Essa ação será registrada no log de auditoria.</p>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleReclassify}
                                disabled={!justification}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                Confirmar Alteração
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === 'beds' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <Icons.Bed className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Mapa de Leitos Detalhado</h3>
                <p className="text-gray-500">Visualização gráfica da planta baixa e status por quarto.</p>
            </div>
        )}

        {activeTab === 'reports' && (
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <Icons.BarChart2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Indicadores de Performance</h3>
                <p className="text-gray-500">Gráficos de tempo médio de espera, taxa de giro de leito e gargalos.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default PrioritizationModule;