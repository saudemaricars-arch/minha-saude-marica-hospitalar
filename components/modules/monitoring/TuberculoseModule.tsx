
import React, { useState } from 'react';
import { Icons, MOCK_TB_CASES } from '../../../constants';
import { TbCase } from '../../../types';

interface TuberculoseModuleProps {
    onBack: () => void;
}

const TuberculoseModule: React.FC<TuberculoseModuleProps> = ({ onBack }) => {
    const [cases, setCases] = useState<TbCase[]>(MOCK_TB_CASES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCase, setCurrentCase] = useState<Partial<TbCase>>({});
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenAdd = () => {
        setCurrentCase({
            phase: 'Intensiva',
            status: 'em_tratamento',
            treatmentMonth: 1,
            totalMonths: 6,
            tdoCompliance: 100
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (tbCase: TbCase) => {
        setCurrentCase({ ...tbCase });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja arquivar este caso?')) {
            setCases(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCase.patientName) return;

        if (isEditing && currentCase.id) {
            setCases(prev => prev.map(c => c.id === currentCase.id ? { ...c, ...currentCase } as TbCase : c));
        } else {
            const newCase: TbCase = {
                ...currentCase,
                id: Math.random().toString(36).substr(2, 9),
                lastExam: new Date().toLocaleDateString('pt-BR'),
            } as TbCase;
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
                            className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium mb-2"
                        >
                            <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-teal-200 shadow-sm transition-colors">
                                <Icons.ArrowLeft className="w-4 h-4" />
                            </div>
                            Voltar ao Menu Principal
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-600 rounded-lg text-white shadow-md">
                                <Icons.Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Acompanhamento de Tuberculose
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Gestão de casos, tratamento supervisionado (TDO) e evolução.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm">
                            Relatórios TDO
                        </button>
                        <button
                            onClick={handleOpenAdd}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold shadow hover:bg-teal-700 text-sm flex items-center gap-2"
                        >
                            <Icons.UserPlus className="w-4 h-4" /> Novo Tratamento
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="animate-fade-in space-y-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">Em Tratamento</p>
                            <p className="text-2xl font-bold text-teal-600">{cases.filter(c => c.status === 'em_tratamento').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">Fase Intensiva</p>
                            <p className="text-2xl font-bold text-blue-600">{cases.filter(c => c.phase === 'Intensiva' && c.status === 'em_tratamento').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">Abandono</p>
                            <p className="text-2xl font-bold text-red-600">{cases.filter(c => c.status === 'abandono').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase">Cura (Ano)</p>
                            <p className="text-2xl font-bold text-green-600">12</p>
                        </div>
                    </div>

                    {/* Patients Grid */}
                    <h3 className="font-bold text-gray-800 mt-6 mb-4">Pacientes Ativos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cases.map(tc => (
                            <div key={tc.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{tc.patientName}</h3>
                                        <p className="text-xs text-gray-500">Início: 20/01/2024</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${tc.status === 'em_tratamento' ? 'bg-green-100 text-green-700' :
                                            tc.status === 'abandono' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>{tc.status.replace('_', ' ')}</span>
                                </div>

                                <div className="space-y-4 mb-6 flex-1">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span className="font-bold text-teal-700">{tc.phase}</span>
                                            <span>Mês {tc.treatmentMonth}/{tc.totalMonths}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
                                            <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${(tc.treatmentMonth / tc.totalMonths) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 flex items-center gap-2"><Icons.CheckCircle className="w-4 h-4 text-gray-400" /> Adesão TDO</span>
                                            <span className={`font-bold ${tc.tdoCompliance >= 80 ? 'text-green-600' : 'text-red-600'}`}>{tc.tdoCompliance}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 flex items-center gap-2"><Icons.TestTube className="w-4 h-4 text-gray-400" /> Baciloscopia</span>
                                            <span className="text-gray-800 font-mono text-xs bg-white px-2 py-0.5 rounded border border-gray-200">{tc.lastExam}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-auto mb-3">
                                    <button onClick={() => alert('Prontuário do paciente: ' + tc.patientName)} className="py-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium">
                                        Prontuário
                                    </button>
                                    <button onClick={() => {
                                        const newCompliance = prompt('Informe a adesão ao TDO (0-100):', '100');
                                        if (newCompliance) {
                                            setCases(prev => prev.map(c => c.id === tc.id ? { ...c, tdoCompliance: parseInt(newCompliance) } : c));
                                            alert('TDO Lançado com sucesso!');
                                        }
                                    }} className="py-2 bg-teal-50 text-teal-700 border border-teal-100 rounded hover:bg-teal-100 text-sm font-bold">
                                        Lançar TDO
                                    </button>
                                </div>
                                <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEdit(tc)} className="text-xs text-gray-500 hover:text-blue-600">Editar</button>
                                    <button onClick={() => handleDelete(tc.id)} className="text-xs text-red-400 hover:text-red-600">Arquivar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800">
                                    {isEditing ? 'Editar Caso' : 'Novo Tratamento TB'}
                                </h3>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={currentCase.patientName || ''}
                                        onChange={e => setCurrentCase({ ...currentCase, patientName: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fase do Tratamento</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                                            value={currentCase.phase}
                                            onChange={e => setCurrentCase({ ...currentCase, phase: e.target.value as any })}
                                        >
                                            <option value="Intensiva">Intensiva</option>
                                            <option value="Manutenção">Manutenção</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                                            value={currentCase.status}
                                            onChange={e => setCurrentCase({ ...currentCase, status: e.target.value as any })}
                                        >
                                            <option value="em_tratamento">Em Tratamento</option>
                                            <option value="cura">Cura</option>
                                            <option value="abandono">Abandono</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mês Atual</label>
                                        <input
                                            type="number"
                                            min="1" max="12"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={currentCase.treatmentMonth}
                                            onChange={e => setCurrentCase({ ...currentCase, treatmentMonth: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Meses</label>
                                        <input
                                            type="number"
                                            min="6" max="12"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={currentCase.totalMonths}
                                            onChange={e => setCurrentCase({ ...currentCase, totalMonths: parseInt(e.target.value) })}
                                        />
                                    </div>
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

export default TuberculoseModule;
