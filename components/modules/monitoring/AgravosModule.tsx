
import React, { useState } from 'react';
import { agravosService, DiseaseNotification } from '../../../services/agravosService';
import { MOCK_NOTIFICATIONS } from '../../../constants';

interface AgravosModuleProps {
    onBack: () => void;
}

const AgravosModule: React.FC<AgravosModuleProps> = ({ onBack }) => {
    const [view, setView] = useState<'list' | 'new'>('list');
    const [notifications, setNotifications] = useState<DiseaseNotification[]>([]);

    useEffect(() => {
        loadNotifications();
    }, [view]);

    const loadNotifications = async () => {
        try {
            const data = await agravosService.fetchNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Form State
    const [newCase, setNewCase] = useState({ disease: '', patientName: '' });

    const handleSave = async () => {
        if (!newCase.disease || !newCase.patientName) return;

        try {
            await agravosService.createNotification({
                disease: newCase.disease,
                patient_name: newCase.patientName,
                notification_date: new Date().toISOString().split('T')[0]
            });

            setView('list');
            setNewCase({ disease: '', patientName: '' });
            alert("Notificação registrada com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar notificação");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
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
                            <div className="p-2 bg-red-600 rounded-lg text-white shadow-md">
                                <Icons.ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Notificação de Agravos
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Vigilância epidemiológica, controle de surtos e investigação.
                                </p>
                            </div>
                        </div>
                    </div>

                    {view === 'list' && (
                        <button
                            onClick={() => setView('new')}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 font-bold text-sm flex items-center gap-2"
                        >
                            <Icons.PlusCircle className="w-4 h-4" /> Nova Notificação
                        </button>
                    )}
                </div>

                {view === 'list' ? (
                    <div className="space-y-6 animate-fade-in">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-xs font-bold uppercase">Casos na Semana</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{notifications.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-xs font-bold uppercase">Em Investigação</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">
                                    {notifications.filter(n => n.investigationStatus === 'em_andamento').length}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-xs font-bold uppercase">Confirmados</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">
                                    {notifications.filter(n => n.status === 'confirmado').length}
                                </p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Agravo</th>
                                        <th className="px-6 py-4">Paciente</th>
                                        <th className="px-6 py-4">Data Notif.</th>
                                        <th className="px-6 py-4">Classificação</th>
                                        <th className="px-6 py-4">Situação</th>
                                        <th className="px-6 py-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {notifications.map(notif => (
                                        <tr key={notif.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900">{notif.disease}</td>
                                            <td className="px-6 py-4 text-gray-700">{notif.patient_name}</td>
                                            <td className="px-6 py-4 text-gray-600">{notif.notification_date} <span className="text-xs text-gray-400">(SE {notif.week})</span></td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${notif.status === 'confirmado' ? 'bg-red-100 text-red-700' :
                                                        notif.status === 'descartado' ? 'bg-gray-100 text-gray-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {notif.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium uppercase text-gray-500">
                                                {notif.investigation_status.replace('_', ' ')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-red-600">
                                                    <Icons.Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Nova Ficha de Notificação</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Agravo / Doença</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white"
                                    value={newCase.disease}
                                    onChange={e => setNewCase({ ...newCase, disease: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Dengue">Dengue</option>
                                    <option value="Chikungunya">Chikungunya</option>
                                    <option value="Tuberculose">Tuberculose</option>
                                    <option value="Sifilis">Sífilis</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    value={newCase.patientName}
                                    onChange={e => setNewCase({ ...newCase, patientName: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 flex gap-3 border-t border-gray-100">
                                <button
                                    onClick={() => setView('list')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!newCase.disease || !newCase.patientName}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm disabled:opacity-50"
                                >
                                    Salvar Notificação
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AgravosModule;
