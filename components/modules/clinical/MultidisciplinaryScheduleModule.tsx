import React, { useState, useEffect } from 'react';
import { Icons } from '../../../constants';
import { multidisciplinaryService, MultidisciplinaryAppointment } from '../../../services/multidisciplinaryService';

const SPECIALTIES = [
    { id: 'Fisioterapia', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'Psicologia', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'Fonoaudiologia', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'Social', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'Nutrição', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const MultidisciplinaryScheduleModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todos');
    const [appointments, setAppointments] = useState<MultidisciplinaryAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewModal, setShowNewModal] = useState(false);

    // New Appointment State
    const [newAppointment, setNewAppointment] = useState<Partial<MultidisciplinaryAppointment>>({
        specialty: 'Fisioterapia',
        status: 'scheduled',
        date: new Date().toISOString().split('T')[0],
        time: '09:00'
    });

    // Fetch Data
    const loadAppointments = async () => {
        setLoading(true);
        try {
            const data = await multidisciplinaryService.fetchAppointments(selectedDate, selectedSpecialty);
            setAppointments(data);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar agendamentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [selectedDate, selectedSpecialty]);

    const handleSaveAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAppointment.patient_name || !newAppointment.professional) return;

        try {
            await multidisciplinaryService.createAppointment({
                patient_name: newAppointment.patient_name,
                patient_id: newAppointment.patient_id || 'N/A',
                specialty: newAppointment.specialty as any,
                professional: newAppointment.professional,
                date: newAppointment.date || selectedDate,
                time: newAppointment.time || '09:00',
                status: 'scheduled',
                notes: newAppointment.notes,
                unit_id: 'master' // Or dynamic unit ID
            });

            setShowNewModal(false);
            // Reset form
            setNewAppointment({
                specialty: 'Fisioterapia',
                status: 'scheduled',
                date: new Date().toISOString().split('T')[0],
                time: '09:00'
            });
            // Reload list
            loadAppointments();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar agendamento');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-gray-100 text-gray-600';
            case 'checked-in': return 'bg-blue-100 text-blue-600';
            case 'completed': return 'bg-green-100 text-green-600';
            case 'canceled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'scheduled': return 'Agendado';
            case 'checked-in': return 'Na Sala';
            case 'completed': return 'Atendido';
            case 'canceled': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-600">
                        <Icons.ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Icons.Calendar className="w-6 h-6 text-red-600" />
                            Agenda Multidisciplinar
                        </h1>
                        <p className="text-sm text-gray-500">Gerenciamento de atendimentos da equipe multi</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadAppointments()}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
                    >
                        <Icons.Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition-all active:scale-95"
                    >
                        <Icons.PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Novo Agendamento</span>
                    </button>
                </div>
            </div>

            {/* Controls & Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Date Selector */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                </div>

                {/* Specialty Filter */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    <button
                        onClick={() => setSelectedSpecialty('Todos')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedSpecialty === 'Todos' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Todos
                    </button>
                    {SPECIALTIES.map(spec => (
                        <button
                            key={spec.id}
                            onClick={() => setSelectedSpecialty(spec.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedSpecialty === spec.id
                                ? spec.color
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {spec.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 divide-y divide-gray-100 overflow-y-auto">
                        {appointments.length > 0 ? (
                            appointments.map(apt => (
                                <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">

                                    {/* Time & Status */}
                                    <div className="flex items-center gap-6 min-w-[150px]">
                                        <div className="text-xl font-bold text-gray-800">{apt.time.substring(0, 5)}</div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(apt.status)} border border-transparent`}>
                                            {getStatusLabel(apt.status)}
                                        </span>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900">{apt.patient_name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>ID: {apt.patient_id}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>{apt.professional}</span>
                                        </p>
                                    </div>

                                    {/* Specialty Tag */}
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-md text-sm font-medium border ${SPECIALTIES.find(s => s.id === apt.specialty)?.color || 'bg-gray-100'
                                            }`}>
                                            {apt.specialty}
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                <Icons.Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Check-in">
                                                <Icons.CheckCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Icons.Calendar className="w-12 h-12 mb-4 opacity-20" />
                                <p>Nenhum agendamento para este filtro.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* New Appointment Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Icons.PlusCircle className="w-5 h-5 text-red-600" />
                            Novo Agendamento
                        </h2>

                        <form onSubmit={handleSaveAppointment} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Nome completo"
                                        value={newAppointment.patient_name || ''}
                                        onChange={e => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID / CPF</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="123456"
                                        value={newAppointment.patient_id || ''}
                                        onChange={e => setNewAppointment({ ...newAppointment, patient_id: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={newAppointment.specialty}
                                        onChange={e => setNewAppointment({ ...newAppointment, specialty: e.target.value as any })}
                                    >
                                        {SPECIALTIES.map(s => (
                                            <option key={s.id} value={s.id}>{s.id}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Dr. Nome"
                                        value={newAppointment.professional || ''}
                                        onChange={e => setNewAppointment({ ...newAppointment, professional: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={newAppointment.date}
                                        onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={newAppointment.time}
                                        onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        rows={3}
                                        placeholder="Detalhes clínicos..."
                                        value={newAppointment.notes || ''}
                                        onChange={e => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowNewModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                                >
                                    Agendar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MultidisciplinaryScheduleModule;
