import React, { useState } from 'react';
import { Icons, HEALTH_UNITS } from '../../constants';
// Import Recharts
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
// Import detailed monitor
import MasterUnitMonitor from './MasterUnitMonitor';

// Mock Data for Global Analysis
const GLOBAL_STATS = [
    { name: 'Ocupação Total', value: '87%', status: 'warning', icon: Icons.Bed },
    { name: 'Fila Global', value: '142', status: 'critical', icon: Icons.Users },
    { name: 'Tempo Médio', value: '3h 12m', status: 'normal', icon: Icons.Clock },
    { name: 'Médicos Ativos', value: '64/80', status: 'alert', icon: Icons.Stethoscope },
];

const MOCK_GLOBAL_FLOW = [
    { name: '00h', hospital: 30, upa: 45, ubs: 10 },
    { name: '04h', hospital: 25, upa: 50, ubs: 5 },
    { name: '08h', hospital: 80, upa: 120, ubs: 60 },
    { name: '12h', hospital: 95, upa: 140, ubs: 90 },
    { name: '16h', hospital: 85, upa: 130, ubs: 80 },
    { name: '20h', hospital: 70, upa: 90, ubs: 40 },
];

const MOCK_UNIT_STATUS = {
    '1': { occupancy: 92, waitTime: '4h', trend: 'up' }, // Hospital Geral
    '2': { occupancy: 85, waitTime: '2h', trend: 'stable' }, // UPA
    '3': { occupancy: 45, waitTime: '40m', trend: 'down' }, // Maternidade
    '4': { occupancy: 30, waitTime: '15m', trend: 'stable' }, // UBS
    '5': { occupancy: 60, waitTime: '1h', trend: 'up' }, // Lab
};

interface MasterAnalysisModuleProps {
    onBack: () => void;
}

const MasterAnalysisModule: React.FC<MasterAnalysisModuleProps> = ({ onBack }) => {
    const [selectedUnit, setSelectedUnit] = useState<typeof HEALTH_UNITS[0] | null>(null);

    // If a unit is selected, show the detailed monitor
    if (selectedUnit) {
        return <MasterUnitMonitor unit={selectedUnit} onBack={() => setSelectedUnit(null)} />;
    }

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fade-in">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Painel de Comando Central</h1>
                    <p className="text-gray-500 mt-1">Visão Estratégica da Rede de Saúde Municipal</p>
                </div>
                <div className="flex gap-3">
                    <div className="text-right px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold">Última Atualização</p>
                        <p className="text-gray-900 font-medium">Agora (Tempo Real)</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {GLOBAL_STATS.map((stat, idx) => {
                    const ColorIcon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                {stat.status === 'critical' && <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">Crítico</span>}
                                {stat.status === 'warning' && <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full">Atenção</span>}
                            </div>
                            <div className={`p-4 rounded-xl ${stat.status === 'critical' ? 'bg-red-100 text-red-600' : stat.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                                <ColorIcon className="w-8 h-8" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Fluxo de Atendimento Rede</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Hospital</span>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>UPA</span>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-500"></span>UBS</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_GLOBAL_FLOW}>
                                <defs>
                                    <linearGradient id="colorHospital" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUpa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="hospital" stackId="1" stroke="#3b82f6" fill="url(#colorHospital)" />
                                <Area type="monotone" dataKey="upa" stackId="1" stroke="#10b981" fill="url(#colorUpa)" />
                                <Area type="monotone" dataKey="ubs" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts/Notifications Side */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <Icons.AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-bold">Alertas da Rede</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Emergência</span>
                                <span className="text-xs text-gray-400">12 min atrás</span>
                            </div>
                            <p className="font-semibold mt-1">Hospital Geral: Capacidade de Trauma excedida.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">Logística</span>
                                <span className="text-xs text-gray-400">45 min atrás</span>
                            </div>
                            <p className="font-semibold mt-1">UPA Zona Norte: Baixo estoque de oxigênio (cilindros).</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Pessoal</span>
                                <span className="text-xs text-gray-400">2h atrás</span>
                            </div>
                            <p className="font-semibold mt-1">UBS Jardim: Médico plantonista faltou.</p>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-3 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                        Ver Centro de Notificações
                    </button>
                </div>
            </div>

            {/* Units Grid */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Icons.MapPin className="w-5 h-5 text-gray-500" />
                Monitoramento por Unidade
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HEALTH_UNITS.map(unit => {
                    if (unit.id === 'master' || unit.id.startsWith('0000')) return null;

                    // Get mock status
                    // @ts-ignore
                    const status = MOCK_UNIT_STATUS[unit.id] || { occupancy: 50, waitTime: '30m', trend: 'stable' };
                    const isHighOccupancy = status.occupancy > 80;

                    return (
                        <button
                            key={unit.id}
                            onClick={() => setSelectedUnit(unit)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all text-left group relative overflow-hidden"
                        >
                            {isHighOccupancy && <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>}

                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${unit.type === 'Hospital' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {unit.type}
                                </span>
                                {isHighOccupancy ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        LOTAÇÃO MÁXIMA
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        Normal
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{unit.name}</h3>
                            <p className="text-sm text-gray-500 mb-6">Monitoramento ativo • {status.waitTime} espera</p>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-gray-600">Ocupação</span>
                                        <span className={`font-bold ${isHighOccupancy ? 'text-red-600' : 'text-blue-600'}`}>{status.occupancy}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isHighOccupancy ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${status.occupancy}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end">
                                <span className="text-sm font-medium text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex items-center gap-1">
                                    Acessar Painel <Icons.ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MasterAnalysisModule;
