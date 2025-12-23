
import React, { useState, useEffect } from 'react';
import { neonatalService, NeonatalPatient } from '../../../services/neonatalService';
import { Icons, MOCK_NEONATAL_PATIENTS } from '../../../constants';
import { NeonatalPage, TestStatus } from '../../../types';

interface NeonatalScreeningModuleProps {
    onBack: () => void;
}

const NeonatalScreeningModule: React.FC<NeonatalScreeningModuleProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<NeonatalPage>('list');
    const [patients, setPatients] = useState<NeonatalPatient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<NeonatalPatient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBaby, setNewBaby] = useState<Partial<NeonatalPatient>>({});
    const [isEditResultsOpen, setIsEditResultsOpen] = useState(false);
    const [editResults, setEditResults] = useState<any>({});

    // Fetch Data
    useEffect(() => {
        loadPatients();
    }, [activeTab]); // Reload when tab changes just in case

    const loadPatients = async () => {
        try {
            const data = await neonatalService.fetchPatients();
            setPatients(data);
        } catch (error) {
            console.error('Error loading neonatal patients:', error);
        }
    };

    // Helper to safely get tests array
    const getPatientTests = (p: NeonatalPatient) => [
        p.tests.pezinho,
        p.tests.orelhinha,
        p.tests.olhinho,
        p.tests.coracaozinho,
        p.tests.linguinha
    ];

    const totalBabies = patients.length;

    const alteredTests = patients.reduce((acc, p) => {
        const tests = getPatientTests(p);
        return acc + tests.filter(t => t.status === 'Alterado').length;
    }, 0);

    const pendingTests = patients.reduce((acc, p) => {
        const tests = getPatientTests(p);
        return acc + tests.filter(t => t.status === 'Pendente' || t.status === 'Não Realizado').length;
    }, 0);

    const getStatusBadge = (status: TestStatus) => {
        switch (status) {
            case 'Normal': return <span className="w-3 h-3 rounded-full bg-green-500 block" title="Normal"></span>;
            case 'Alterado': return <span className="w-3 h-3 rounded-full bg-red-600 block animate-pulse" title="Alterado"></span>;
            case 'Inconclusivo': return <span className="w-3 h-3 rounded-full bg-yellow-500 block" title="Inconclusivo"></span>;
            case 'Pendente': return <span className="w-3 h-3 rounded-full bg-gray-300 block" title="Pendente"></span>;
            default: return <span className="w-3 h-3 rounded-full bg-gray-200 block border border-gray-300" title="Não Realizado"></span>;
        }
    };

    const getStatusText = (status: TestStatus) => {
        switch (status) {
            case 'Normal': return 'text-green-700 bg-green-100';
            case 'Alterado': return 'text-red-700 bg-red-100';
            case 'Inconclusivo': return 'text-yellow-700 bg-yellow-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBaby.name || !newBaby.mother_name) return;

        try {
            await neonatalService.createPatient({
                name: newBaby.name,
                mother_name: newBaby.mother_name,
                birth_date: newBaby.birth_date || new Date().toISOString().split('T')[0],
                birth_time: newBaby.birth_time || '12:00',
                weight: newBaby.weight || 3000,
                gestational_age: newBaby.gestational_age || '39s',
                tests: {
                    pezinho: { status: 'Pendente' },
                    orelhinha: { status: 'Pendente' },
                    olhinho: { status: 'Pendente' },
                    coracaozinho: { status: 'Pendente' },
                    linguinha: { status: 'Pendente' },
                }
            });

            setIsModalOpen(false);
            setNewBaby({});
            loadPatients();
        } catch (error: any) {
            console.error('Error creating patient:', error);
            alert('Erro ao salvar paciente: ' + (error.message || 'Erro desconhecido'));
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Nascimentos (Mês)</h3>
                                    <Icons.Baby className="w-6 h-6 text-pink-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{totalBabies}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Resultados Alterados</h3>
                                    <Icons.AlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-3xl font-bold text-red-600">{alteredTests}</p>
                                <p className="text-xs text-red-500 mt-1">Ação necessária</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Pendências</h3>
                                    <Icons.Clock className="w-6 h-6 text-yellow-500" />
                                </div>
                                <p className="text-3xl font-bold text-yellow-600">{pendingTests}</p>
                            </div>
                        </div>
                        {/* Simulated Chart */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Cobertura de Triagem (%)</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Teste do Pezinho', val: 95 },
                                    { name: 'Teste do Coraçãozinho', val: 98 },
                                    { name: 'Teste do Olhinho', val: 92 },
                                    { name: 'Teste da Orelhinha', val: 88 },
                                    { name: 'Teste da Linguinha', val: 96 }
                                ].map(t => (
                                    <div key={t.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{t.name}</span>
                                            <span className="font-bold">{t.val}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${t.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'list':
                return (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                            <div className="relative w-full md:w-96">
                                <Icons.Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <input type="text" placeholder="Buscar RN ou Mãe..." className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-bold shadow-sm"
                            >
                                <Icons.UserPlus className="w-4 h-4" /> Novo Nascido
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Recém-Nascido / Mãe</th>
                                    <th className="px-6 py-4">Nascimento</th>
                                    <th className="px-6 py-4 text-center">Pezinho</th>
                                    <th className="px-6 py-4 text-center">Orelhinha</th>
                                    <th className="px-6 py-4 text-center">Olhinho</th>
                                    <th className="px-6 py-4 text-center">Coração</th>
                                    <th className="px-6 py-4 text-center">Linguinha</th>
                                    <th className="px-6 py-4 text-right">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {patients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-pink-50/30 transition-colors cursor-pointer" onClick={() => { setSelectedPatient(patient); setEditResults(JSON.parse(JSON.stringify(patient.tests))); }}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{patient.name}</div>
                                            <div className="text-xs text-gray-500">Mãe: {patient.mother_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{patient.birth_date}</div>
                                            <div className="text-xs text-gray-500">{patient.birth_time} • {patient.weight}g</div>
                                        </td>
                                        <td className="px-6 py-4 text-center"><div className="flex justify-center">{getStatusBadge(patient.tests.pezinho.status)}</div></td>
                                        <td className="px-6 py-4 text-center"><div className="flex justify-center">{getStatusBadge(patient.tests.orelhinha.status)}</div></td>
                                        <td className="px-6 py-4 text-center"><div className="flex justify-center">{getStatusBadge(patient.tests.olhinho.status)}</div></td>
                                        <td className="px-6 py-4 text-center"><div className="flex justify-center">{getStatusBadge(patient.tests.coracaozinho.status)}</div></td>
                                        <td className="px-6 py-4 text-center"><div className="flex justify-center">{getStatusBadge(patient.tests.linguinha.status)}</div></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-pink-600">
                                                <Icons.Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'recall':
                const recallList = patients.filter(p =>
                    getPatientTests(p).some((t) => t.status === 'Alterado' || t.status === 'Inconclusivo')
                );
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                            <Icons.Phone className="w-6 h-6 text-yellow-600 mt-1" />
                            <div>
                                <h3 className="font-bold text-yellow-900">Lista de Reconvocação e Busca Ativa</h3>
                                <p className="text-sm text-yellow-800">Bebês com resultados alterados ou inconclusivos que necessitam de nova coleta ou encaminhamento imediato.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {recallList.map(patient => (
                                <div key={patient.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                            <Icons.AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{patient.name}</h4>
                                            <p className="text-sm text-gray-500">Mãe: {patient.mother_name} • Tel: (21) 99999-9999</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(patient.tests).map(([key, result]) => {
                                            const r = result as any;
                                            if (r.status === 'Alterado' || r.status === 'Inconclusivo') {
                                                return (
                                                    <div key={key} className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                                                        <p className="text-xs font-bold text-red-700 uppercase">{key}</p>
                                                        <p className="text-sm text-red-900">{r.notes || r.status}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-bold flex items-center gap-2">
                                            <Icons.Phone className="w-4 h-4" /> Contatar
                                        </button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-bold shadow-sm">
                                            Agendar Retorno
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {recallList.length === 0 && (
                                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
                                    <Icons.CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
                                    <p>Nenhuma reconvocação pendente.</p>
                                </div>
                            )}
                        </div>
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
                            className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium mb-2"
                        >
                            <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-red-200 shadow-sm transition-colors">
                                <Icons.ArrowLeft className="w-4 h-4" />
                            </div>
                            Voltar ao Menu Principal
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-600 rounded-lg text-white shadow-md">
                                <Icons.Baby className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Triagem Neonatal
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Testes do Pezinho, Orelhinha, Olhinho, Coraçãozinho e Linguinha.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.BarChart2 className="w-4 h-4" /> Visão Geral
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'list' ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.ListOrdered className="w-4 h-4" /> Recém-Nascidos
                        </button>
                        <button
                            onClick={() => setActiveTab('recall')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'recall' ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.Phone className="w-4 h-4" /> Busca Ativa
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in">
                    {renderContent()}
                </div>

                {/* Patient Details Modal */}
                {selectedPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                            <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-800 rounded-full">
                                        <Icons.Baby className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                                        <p className="opacity-80 text-sm">Mãe: {selectedPatient.mother_name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedPatient(null)} className="text-white/60 hover:text-white">
                                    <Icons.XCircle className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Nascimento</p>
                                        <p className="font-medium text-gray-900">{selectedPatient.birth_date} às {selectedPatient.birth_time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Peso</p>
                                        <p className="font-medium text-gray-900">{selectedPatient.weight}g</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">IG</p>
                                        <p className="font-medium text-gray-900">{selectedPatient.gestational_age}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <h3 className="font-bold text-gray-800 mb-2">Resultados da Triagem</h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Teste do Pezinho', data: selectedPatient.tests.pezinho, icon: 'Syringe' },
                                        { label: 'Teste da Orelhinha', data: selectedPatient.tests.orelhinha, icon: 'Ear' },
                                        { label: 'Teste do Olhinho', data: selectedPatient.tests.olhinho, icon: 'Eye' },
                                        { label: 'Teste do Coraçãozinho', data: selectedPatient.tests.coracaozinho, icon: 'HeartPulse' },
                                        { label: 'Teste da Linguinha', data: selectedPatient.tests.linguinha, icon: 'Smile' },
                                    ].map((test, i) => {
                                        const Icon = Icons[test.icon] || Icons.Activity;
                                        const r = test.data as any;
                                        return (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 rounded text-gray-600">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800">{test.label}</p>
                                                        {test.data.date && <p className="text-xs text-gray-500">{test.data.date}</p>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mb-1 ${getStatusText(r.status)}`}>
                                                        {r.status}
                                                    </span>
                                                    {(r.notes || r.value) && (
                                                        <p className="text-xs text-gray-600 max-w-[200px] truncate">{r.notes || r.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 flex items-center gap-2">
                                    <Icons.Printer className="w-4 h-4" /> Imprimir Laudo
                                </button>
                                <button className="px-4 py-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 shadow-sm flex items-center gap-2">
                                    <Icons.Edit className="w-4 h-4" /> Editar Resultados
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Results Modal */}
                {isEditResultsOpen && selectedPatient && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800">Editar Resultados</h3>
                                <button onClick={() => setIsEditResultsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <Icons.XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {['pezinho', 'orelhinha', 'olhinho', 'coracaozinho', 'linguinha'].map((testKey) => (
                                    <div key={testKey} className="border-b border-gray-100 pb-4">

                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold capitalize text-gray-700">{testKey}</h4>
                                            <select
                                                className="text-sm border border-gray-300 rounded px-2 py-1"
                                                value={editResults[testKey]?.status || 'Pendente'}
                                                onChange={(e) => setEditResults({
                                                    ...editResults,
                                                    [testKey]: { ...editResults[testKey], status: e.target.value }
                                                })}
                                            >
                                                <option value="Pendente">Pendente</option>
                                                <option value="Normal">Normal</option>
                                                <option value="Alterado">Alterado</option>
                                                <option value="Inconclusivo">Inconclusivo</option>
                                            </select>
                                        </div>
                                        <textarea
                                            placeholder="Observações..."
                                            className="w-full text-sm border border-gray-300 rounded p-2"
                                            value={editResults[testKey]?.notes || ''}
                                            onChange={(e) => setEditResults({
                                                ...editResults,
                                                [testKey]: { ...editResults[testKey], notes: e.target.value }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                                <button onClick={() => setIsEditResultsOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-white">Cancelar</button>
                                <button onClick={async () => {
                                    // Update logic here (mocked or service call)
                                    // Assuming we just update local state for now or call service
                                    try {
                                        // In real app: await service.updateTests(selectedPatient.id, editResults);
                                        // For now update local state to reflect changes
                                        const updatedPatient = { ...selectedPatient, tests: editResults };
                                        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
                                        setSelectedPatient(updatedPatient);
                                        setIsEditResultsOpen(false);
                                        alert('Resultados atualizados!');
                                    } catch (e) { console.error(e); }
                                }} className="px-4 py-2 bg-pink-600 text-white rounded font-bold hover:bg-pink-700">Salvar Alterações</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Baby Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800">Registrar Nascimento</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <Icons.XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do RN</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="RN de..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={newBaby.name || ''}
                                        onChange={e => setNewBaby({ ...newBaby, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Mãe</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={newBaby.mother_name || ''}
                                        onChange={e => setNewBaby({ ...newBaby, mother_name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Nasc.</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                            value={newBaby.birth_date || ''}
                                            onChange={e => setNewBaby({ ...newBaby, birth_date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                            value={newBaby.birth_time || ''}
                                            onChange={e => setNewBaby({ ...newBaby, birth_time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso (g)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                            value={newBaby.weight || ''}
                                            onChange={e => setNewBaby({ ...newBaby, weight: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Idade Gestacional</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 39s 2d"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                            value={newBaby.gestational_age || ''}
                                            onChange={e => setNewBaby({ ...newBaby, gestational_age: e.target.value })}
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
                                        className="flex-1 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-bold shadow-sm transition-colors"
                                    >
                                        Registrar
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

export default NeonatalScreeningModule;
