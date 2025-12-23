
import React, { useState } from 'react';
import { Icons, MOCK_DISCHARGES } from '../../constants';
import { DischargePage } from '../../types';

interface ClinicalDischargeModuleProps {
    onBack: () => void;
}

const ClinicalDischargeModule: React.FC<ClinicalDischargeModuleProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<DischargePage>('requests');
    const [discharges, setDischarges] = useState(MOCK_DISCHARGES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDischarge, setNewDischarge] = useState<any>({});

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = {
            id: Math.random().toString(),
            patientName: newDischarge.patientName || 'Novo Paciente',
            reason: newDischarge.reason || 'Alta Melhorada',
            unit: 'H. Municipal',
            destination: newDischarge.destination || 'Domicílio',
            status: 'em_preparo',
            documentsReady: false,
            transportRequired: false
        };
        setDischarges([...discharges, newItem]);
        setIsModalOpen(false);
        alert('Solicitação de alta criada com sucesso!');
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
                            <div className="p-2 bg-green-600 rounded-lg text-white shadow-md">
                                <Icons.LogOut className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Altas Referenciadas
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Gestão de saídas, documentos e continuidade do cuidado.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.ClipboardList className="w-4 h-4" /> Solicitações
                        </button>
                        <button
                            onClick={() => setActiveTab('followup')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'followup' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Icons.PhoneIncoming className="w-4 h-4" /> Follow-up
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-md text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-sm flex items-center gap-2 whitespace-nowrap ml-2"
                        >
                            <Icons.Plus className="w-4 h-4" /> Nova Alta
                        </button>
                    </div>
                </div>

                {activeTab === 'requests' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Em Preparo</h3>
                                    <Icons.Clock className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{discharges.filter(d => d.status === 'em_preparo').length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Transporte Pendente</h3>
                                    <Icons.Ambulance className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{discharges.filter(d => d.transportRequired && d.status !== 'liberado').length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Liberados Hoje</h3>
                                    <Icons.CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{discharges.filter(d => d.status === 'liberado').length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Paciente</th>
                                        <th className="px-6 py-4">Unidade</th>
                                        <th className="px-6 py-4">Destino</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Pendências</th>
                                        <th className="px-6 py-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {discharges.map(discharge => (
                                        <tr key={discharge.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{discharge.patientName}</div>
                                                <div className="text-xs text-gray-500">{discharge.reason}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{discharge.unit}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{discharge.destination}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${discharge.status === 'liberado' ? 'bg-green-100 text-green-700' :
                                                        discharge.status === 'em_preparo' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {discharge.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {!discharge.documentsReady && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">Documentos</span>}
                                                    {discharge.transportRequired && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Transporte</span>}
                                                    {discharge.documentsReady && !discharge.transportRequired && <span className="text-xs text-green-600 font-medium">Tudo pronto</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Gerenciar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(activeTab === 'followup' || activeTab === 'indicators') && (
                    <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 animate-fade-in">
                        <Icons.Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Módulo em construção.</p>
                    </div>
                )}

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Nova Solicitação de Alta</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Icons.XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                    onChange={e => setNewDischarge({ ...newDischarge, patientName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo da Alta</label>
                                <input
                                    type="text" required
                                    placeholder="Ex: Melhora Clínica"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                    onChange={e => setNewDischarge({ ...newDischarge, reason: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                    onChange={e => setNewDischarge({ ...newDischarge, destination: e.target.value })}
                                >
                                    <option value="Domicílio">Domicílio</option>
                                    <option value="Outra Unidade">Transferência para Outra Unidade</option>
                                    <option value="Óbito">Óbito</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 mt-4">
                                Criar Solicitação
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClinicalDischargeModule;
