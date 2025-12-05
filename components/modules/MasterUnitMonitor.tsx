
import React, { useState, useEffect } from 'react';
import { Icons } from '../../constants';
import { HealthUnit } from '../../types';
import { supabase } from '../../services/supabaseClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

interface MasterUnitMonitorProps {
    unit: HealthUnit;
    onBack: () => void;
}

const MasterUnitMonitor: React.FC<MasterUnitMonitorProps> = ({ unit, onBack }) => {
    const [stats, setStats] = useState({
        activePatients: 0,
        occupiedBeds: 0,
        waitingTriage: 0,
        doctorsActive: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnitDetails = async () => {
            setLoading(true);
            try {
                // Fetch real data for this specific unit
                // 1. Patients
                const { count: patientCount } = await supabase
                    .from('emergency_visits')
                    .select('*', { count: 'exact', head: true })
                    .eq('unit_id', unit.id)
                    .neq('status', 'alta');

                // 2. Beds
                const { count: bedCount } = await supabase
                    .from('beds')
                    .select('*', { count: 'exact', head: true })
                    .eq('unit_id', unit.id)
                    .eq('status', 'ocupado');

                // 3. Triage
                const { count: triageCount } = await supabase
                    .from('emergency_visits')
                    .select('*', { count: 'exact', head: true })
                    .eq('unit_id', unit.id)
                    .eq('status', 'aguardando_triagem');

                // 4. Doctors (Mock for now as we don't have a shift table yet)
                const doctors = Math.floor(Math.random() * 10) + 2;

                setStats({
                    activePatients: patientCount || 0,
                    occupiedBeds: bedCount || 0,
                    waitingTriage: triageCount || 0,
                    doctorsActive: doctors
                });

            } catch (error) {
                console.error('Error fetching unit details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnitDetails();
    }, [unit.id]);

    // Mock hourly data for charts
    const HOURLY_DATA = [
        { time: '08:00', atendimentos: 12, espera: 15 },
        { time: '10:00', atendimentos: 18, espera: 25 },
        { time: '12:00', atendimentos: 25, espera: 40 },
        { time: '14:00', atendimentos: 20, espera: 30 },
        { time: '16:00', atendimentos: 30, espera: 45 },
        { time: '18:00', atendimentos: 22, espera: 20 },
    ];

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
                    >
                        <Icons.ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-red-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900">{unit.name}</h1>
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                                Monitoramento Master
                            </span>
                        </div>
                        <p className="text-gray-500">{unit.type} • ID: {unit.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm flex items-center gap-2">
                        <Icons.Activity className="w-4 h-4" />
                        Gerar Alerta Crítico
                    </button>
                </div>
            </div>

            {/* Real-time KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pacientes Ativos</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? '...' : stats.activePatients}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Icons.Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ocupação de Leitos</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? '...' : stats.occupiedBeds}
                            </h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Icons.Bed className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Fila de Triagem</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? '...' : stats.waitingTriage}
                            </h3>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Icons.Clipboard className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Equipe Médica</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? '...' : stats.doctorsActive}
                            </h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Icons.Stethoscope className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Fluxo de Atendimento (Hoje)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={HOURLY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="atendimentos" name="Atendimentos/h" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="espera" name="Tempo Espera (min)" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Specific Alerts for this Unit */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Problemas Identificados</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
                            <Icons.AlertTriangle className="w-5 h-5 text-red-600" />
                            <div>
                                <h4 className="font-semibold text-red-900 text-sm">Alta Ocupação na Enfermaria</h4>
                                <p className="text-red-700 text-xs">Atualmente em 95% de capacidade</p>
                            </div>
                            <button className="ml-auto text-xs font-bold text-red-700 bg-white border border-red-200 px-2 py-1 rounded hover:bg-red-50">
                                Intervir
                            </button>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-3">
                            <Icons.Package className="w-5 h-5 text-yellow-600" />
                            <div>
                                <h4 className="font-semibold text-yellow-900 text-sm">Estoque de Soro Baixo</h4>
                                <p className="text-yellow-700 text-xs">Previsão de término em 4h</p>
                            </div>
                            <button className="ml-auto text-xs font-bold text-yellow-700 bg-white border border-yellow-200 px-2 py-1 rounded hover:bg-yellow-50">
                                Solicitar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterUnitMonitor;
