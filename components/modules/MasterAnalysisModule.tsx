import React from 'react';
import { Icons, HEALTH_UNITS } from '../../constants';
import { HealthUnit } from '../../types';
import MasterUnitMonitor from './MasterUnitMonitor';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

interface MasterAnalysisModuleProps {
    onBack: () => void;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const MOCK_COMPARATIVE_DATA = [
    { name: 'Hosp. Geral', ocupacao: 85, espera: 45, satisfacao: 90 },
    { name: 'UPA Zona Norte', ocupacao: 70, espera: 30, satisfacao: 92 },
    { name: 'Maternidade', ocupacao: 80, espera: 20, satisfacao: 95 },
    { name: 'UBS Jardim', ocupacao: 40, espera: 15, satisfacao: 88 },
];

const MOCK_ALERTS = [
    { id: 1, unit: 'Hosp. Geral', message: 'Superlotação na Emergência', type: 'critical' },
    { id: 2, unit: 'UPA Zona Norte', message: 'Estoque de Dipirona Baixo', type: 'warning' },
    { id: 3, unit: 'Maternidade', message: 'Manutenção Incubadora 02', type: 'warning' },
];

const MasterAnalysisModule: React.FC<MasterAnalysisModuleProps> = ({ onBack }) => {
    const [selectedUnit, setSelectedUnit] = React.useState<HealthUnit | null>(null);

    // If a unit is selected, show its specific monitor page
    if (selectedUnit) {
        return <MasterUnitMonitor unit={selectedUnit} onBack={() => setSelectedUnit(null)} />;
    }

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <Icons.ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Análise Global (Master)</h1>
                        <p className="text-gray-500">Visão consolidada de todas as unidades de saúde</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Icons.Download className="w-4 h-4" />
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total de Atendimentos (Hoje)</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">1,245</h3>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
                        <Icons.TrendingUp className="w-3 h-3" /> +12% vs ontem
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Média de Ocupação Global</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">76%</h3>
                    <span className="text-sm text-orange-600 font-medium flex items-center gap-1 mt-1">
                        <Icons.Activity className="w-3 h-3" /> Atenção
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Tempo Médio de Espera</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">28 min</h3>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
                        <Icons.CheckCircle className="w-3 h-3" /> Dentro da meta
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Alertas Críticos</p>
                    <h3 className="text-3xl font-bold text-red-600 mt-2">3</h3>
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 mt-1">
                        <Icons.AlertCircle className="w-3 h-3" /> Ação Necessária
                    </span>
                </div>
            </div>

            {/* Unit Selection Grid - New Feature */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monitoramento Detalhado por Unidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {HEALTH_UNITS.map(unit => {
                        if (unit.id === 'master' || unit.id === '00000000-0000-0000-0000-000000000000') return null; // Skip Master unit itself
                        return (
                            <button
                                key={unit.id}
                                onClick={() => setSelectedUnit(unit)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all text-left flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-red-50 transition-colors">
                                        <Icons.Building className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 group-hover:text-red-700">{unit.name}</h4>
                                        <p className="text-xs text-gray-500">{unit.type}</p>
                                    </div>
                                </div>
                                <Icons.ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-400" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Occupancy Comparison */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Taxa de Ocupação por Unidade (%)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_COMPARATIVE_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="ocupacao" name="Ocupação" fill="#ef4444" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Wait Time vs Satisfaction */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Espera (min) vs Satisfação</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_COMPARATIVE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="espera" name="Espera (min)" fill="#8884d8" />
                                <Bar yAxisId="right" dataKey="satisfacao" name="Satisfação" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Alert List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Alertas e Notificações Globais</h3>
                <div className="space-y-4">
                    {MOCK_ALERTS.map((alert) => (
                        <div key={alert.id} className={`p-4 rounded-lg flex items-start gap-3 border ${alert.type === 'critical' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
                            <div className={`mt-0.5 ${alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                                <Icons.AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-semibold ${alert.type === 'critical' ? 'text-red-900' : 'text-yellow-900'}`}>{alert.unit}</h4>
                                <p className={`${alert.type === 'critical' ? 'text-red-800' : 'text-yellow-800'}`}>{alert.message}</p>
                            </div>
                            <button className="ml-auto text-sm font-medium underline opacity-70 hover:opacity-100">
                                Ver Detalhes
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MasterAnalysisModule;
