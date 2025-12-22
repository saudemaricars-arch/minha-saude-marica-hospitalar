
import React, { useState, useEffect } from 'react';
import { maternityService, MaternityVisit } from '../../../services/maternityService';
import { Icons } from '../../../constants';

interface MaternityVisitModuleProps {
    onBack: () => void;
}

const MaternityVisitModule: React.FC<MaternityVisitModuleProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'visits' | 'schedule'>('visits');
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [visits, setVisits] = useState<MaternityVisit[]>([]);
    const [selectedVisit, setSelectedVisit] = useState<MaternityVisit | null>(null);

    // Fetch Data
    useEffect(() => {
        loadVisits();
    }, []);

    const loadVisits = async () => {
        try {
            const data = await maternityService.fetchVisits();
            setVisits(data);
        } catch (error) {
            console.error('Error loading visits:', error);
        }
    };

    // Helper Stats
    const totalInpatients = visits.length;
    const pendingVisits = visits.filter(v => v.status === 'pendente').length;
    const highRisk = visits.filter(v => v.risk_level === 'Alto').length;

    const handleOpenVisit = (visit: MaternityVisit) => {
        setSelectedVisit(visit);
        setIsVisitModalOpen(true);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Puérperas Internadas</h3>
                                    <Icons.Users className="w-5 h-5 text-rose-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{totalInpatients}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Visitas Pendentes</h3>
                                    <Icons.ClipboardList className="w-5 h-5 text-yellow-600" />
                                </div>
                                <p className="text-3xl font-bold text-yellow-600">{pendingVisits}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Alto Risco</h3>
                                    <Icons.AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <p className="text-3xl font-bold text-red-600">{highRisk}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Aleitamento Exclusivo</h3>
                                    <Icons.Heart className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-green-600">85%</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Intercorrências Recentes</h3>
                            <div className="space-y-3">
                                {visits.filter(v => v.alerts && v.alerts.length > 0).map(v => (
                                    <div key={v.id} className="flex items-start gap-4 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                                        <div className="p-2 bg-white rounded-full text-rose-600 shadow-sm">
                                            <Icons.AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{v.mother_name} - Leito {v.room}</p>
                                            <div className="flex gap-2 mt-1">
                                                {v.alerts?.map(alert => (
                                                    <span key={alert} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">{alert}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'visits':
                return (
                    <div className="animate-fade-in bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-gray-800">Roteiro de Visitas Diárias</h3>
                                <select className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white">
                                    <option>Todas as Equipes</option>
                                    <option>Equipe Azul</option>
                                    <option>Equipe Vermelha</option>
                                </select>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Leito / Quarto</th>
                                    <th className="px-6 py-4">Puérpera / Bebê</th>
                                    <th className="px-6 py-4">Puerpério</th>
                                    <th className="px-6 py-4">Risco</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {visits.map(visit => (
                                    <tr key={visit.id} className="hover:bg-rose-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">{visit.room}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{visit.mother_name}</div>
                                            <div className="text-xs text-gray-500">{visit.baby_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                                {visit.days_post_partum}º Dia ({visit.type})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${visit.risk_level === 'Alto' ? 'bg-red-100 text-red-700' :
                                                visit.risk_level === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {visit.risk_level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {visit.status === 'realizada' ? (
                                                <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                                    <Icons.CheckCircle className="w-4 h-4" /> Realizada
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold">
                                                    <Icons.Clock className="w-4 h-4" /> Pendente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleOpenVisit(visit)}
                                                className="text-rose-600 hover:text-rose-800 font-bold text-sm bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors"
                                            >
                                                Iniciar Visita
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'schedule':
                return (
                    <div className="animate-fade-in bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
                        <Icons.Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Agenda Multidisciplinar em desenvolvimento.</p>
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
                            className="group flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors text-sm font-medium mb-2"
                        >
                            <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-rose-200 shadow-sm transition-colors">
                                <Icons.ArrowLeft className="w-4 h-4" />
                            </div>
                            Voltar ao Menu Principal
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-600 rounded-lg text-white shadow-md">
                                <Icons.Baby className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Visita Maternidade
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Acompanhamento integral do binômio mãe-bebê.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.BarChart2 className="w-4 h-4" /> Visão Geral
                        </button>
                        <button
                            onClick={() => setActiveTab('visits')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'visits' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.ClipboardList className="w-4 h-4" /> Minhas Visitas
                        </button>
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'schedule' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.Calendar className="w-4 h-4" /> Agenda
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in">
                    {renderContent()}
                </div>

                {/* Visit Form Modal */}
                {isVisitModalOpen && selectedVisit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
                            <div className="bg-rose-600 text-white p-6 flex justify-between items-start flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Icons.ClipboardList className="w-6 h-6" /> Registro de Visita Puerperal
                                    </h2>
                                    <p className="opacity-90 text-sm mt-1">
                                        {selectedVisit.mother_name} & {selectedVisit.baby_name} • Leito {selectedVisit.room}
                                    </p>
                                </div>
                                <button onClick={() => setIsVisitModalOpen(false)} className="text-white/80 hover:text-white">
                                    <Icons.XCircle className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Mother Assessment */}
                                    <div className="space-y-4">
                                        <h3 className="text-rose-800 font-bold text-lg border-b border-rose-200 pb-2">1. Avaliação Materna</h3>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mamas</label>
                                                    <select className="w-full border-gray-300 rounded-md text-sm p-2 bg-gray-50">
                                                        <option>Normais</option>
                                                        <option>Ingurgitadas</option>
                                                        <option>Fissuras</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Útero</label>
                                                    <select className="w-full border-gray-300 rounded-md text-sm p-2 bg-gray-50">
                                                        <option>Contraído</option>
                                                        <option>Hipotônico</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lóquios (Aspecto/Quantidade)</label>
                                                <input type="text" className="w-full border-gray-300 rounded-md text-sm p-2" placeholder="Ex: Rubra, moderado..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ferida Operatória / Períneo</label>
                                                <textarea className="w-full border-gray-300 rounded-md text-sm p-2 h-20 resize-none" placeholder="Observações..."></textarea>
                                            </div>
                                        </div>

                                        <h3 className="text-rose-800 font-bold text-lg border-b border-rose-200 pb-2 mt-6">3. Saúde Mental</h3>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Escala de Edinburgh (EPDS)</span>
                                                <input type="number" className="w-20 border-gray-300 rounded-md text-sm p-2" placeholder="Score" />
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                                <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                                                Solicitar Psicologia
                                            </label>
                                        </div>
                                    </div>

                                    {/* Baby & Breastfeeding Assessment */}
                                    <div className="space-y-4">
                                        <h3 className="text-blue-800 font-bold text-lg border-b border-blue-200 pb-2">2. Avaliação Neonatal</h3>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso Hoje (g)</label>
                                                    <input type="number" className="w-full border-gray-300 rounded-md text-sm p-2" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Eliminações</label>
                                                    <select className="w-full border-gray-300 rounded-md text-sm p-2 bg-gray-50">
                                                        <option>Presentes</option>
                                                        <option>Ausentes</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Icterícia / Pele</label>
                                                <input type="text" className="w-full border-gray-300 rounded-md text-sm p-2" placeholder="Zona de Kramer..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Coto Umbilical</label>
                                                <select className="w-full border-gray-300 rounded-md text-sm p-2 bg-gray-50">
                                                    <option>Mumificado</option>
                                                    <option>Úmido</option>
                                                    <option>Sinais flogísticos</option>
                                                </select>
                                            </div>
                                        </div>

                                        <h3 className="text-green-800 font-bold text-lg border-b border-green-200 pb-2 mt-6">4. Aleitamento</h3>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                                <label className="border p-2 rounded cursor-pointer hover:bg-gray-50">
                                                    <input type="checkbox" className="block mx-auto mb-1" /> Pega Correta
                                                </label>
                                                <label className="border p-2 rounded cursor-pointer hover:bg-gray-50">
                                                    <input type="checkbox" className="block mx-auto mb-1" /> Posição Adeq.
                                                </label>
                                                <label className="border p-2 rounded cursor-pointer hover:bg-gray-50">
                                                    <input type="checkbox" className="block mx-auto mb-1" /> Sucção Efetiva
                                                </label>
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                                                <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                                                Encaminhar ao Banco de Leite
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setIsVisitModalOpen(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            if (selectedVisit) {
                                                await maternityService.updateStatus(selectedVisit.id, 'realizada');
                                                setIsVisitModalOpen(false);
                                                loadVisits();
                                            }
                                        }
                                        } catch (e: any) {
                                    console.error(e);
                                alert("Erro ao salvar visita: " + (e.message || 'Erro desconhecido'));
                                        }
                                    }}
                                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold shadow hover:bg-rose-700"
                                >
                                Salvar Registro & Concluir
                            </button>
                        </div>
                    </div>
                    </div>
                )}

        </div>
        </div >
    );
};

export default MaternityVisitModule;
