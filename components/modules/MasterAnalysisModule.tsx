import React, { useState, useEffect } from 'react';
import { Icons, HEALTH_UNITS } from '../../constants';
// Import Recharts
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import MasterUnitMonitor from './MasterUnitMonitor';
import { AnalyticsService, GlobalKPIs, UnitStatus } from '../../services/analyticsService';
import { generateStrategicReport } from '../../services/geminiService';

// Mock Data for Global Flow (Still need to be dynamic later, keep for now)
const MOCK_GLOBAL_FLOW = [
    { name: '00h', hospital: 30, upa: 45, ubs: 10 },
    { name: '04h', hospital: 25, upa: 50, ubs: 5 },
    { name: '08h', hospital: 80, upa: 120, ubs: 60 },
    { name: '12h', hospital: 95, upa: 140, ubs: 90 },
    { name: '16h', hospital: 85, upa: 130, ubs: 80 },
    { name: '20h', hospital: 70, upa: 90, ubs: 40 },
];

interface MasterAnalysisModuleProps {
    onBack: () => void;
}

const MasterAnalysisModule: React.FC<MasterAnalysisModuleProps> = ({ onBack }) => {
    const [selectedUnit, setSelectedUnit] = useState<typeof HEALTH_UNITS[0] | null>(null);
    const [kpis, setKpis] = useState<GlobalKPIs | null>(null);
    const [unitStatuses, setUnitStatuses] = useState<UnitStatus[]>([]);
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Initial Data Load
    useEffect(() => {
        // Fetch Real Analytics
        const globalStats = AnalyticsService.getGlobalKPIs();
        const units = AnalyticsService.getAllUnitsStatus();

        setKpis(globalStats);
        setUnitStatuses(units);
    }, []);

    const handleGenerateReport = async () => {
        if (!kpis) return;
        setIsGeneratingReport(true);
        const report = await generateStrategicReport(kpis, unitStatuses);
        setAiReport(report);
        setIsGeneratingReport(false);
    };

    // If a unit is selected, show the detailed monitor
    if (selectedUnit) {
        return <MasterUnitMonitor unit={selectedUnit} onBack={() => setSelectedUnit(null)} />;
    }

    if (!kpis) return <div className="p-12 text-center text-gray-500">Caregando dados da rede...</div>;

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fade-in">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Painel de Comando Central</h1>
                    <p className="text-gray-500 mt-1">Visão Estratégica da Rede de Saúde Municipal</p>
                </div>
                <div className="flex gap-3">
                    {!aiReport && (
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGeneratingReport}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            {isGeneratingReport ? <Icons.Refresh className="animate-spin w-4 h-4" /> : <Icons.Sparkles className="w-4 h-4" />}
                            {isGeneratingReport ? 'Analisando Rede...' : 'Gerar Relatório IA'}
                        </button>
                    )}
                    <div className="text-right px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold">Última Atualização</p>
                        <p className="text-gray-900 font-medium">Agora (Tempo Real)</p>
                    </div>
                </div>
            </div>

            {/* AI Report Section */}
            {aiReport && (
                <div className="mb-8 bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-md animate-fade-in relative">
                    <button
                        onClick={() => setAiReport(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <Icons.XCircle className="w-5 h-5" />
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg text-purple-700">
                            <Icons.Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Análise Estratégica Inteligente</h3>
                            <div className="prose prose-sm text-gray-700 max-w-none">
                                {aiReport.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Ocupação Global</p>
                        <h3 className="text-3xl font-bold text-gray-900">{kpis.totalOccupancy}%</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${kpis.totalOccupancy > 85 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {kpis.totalOccupancy > 85 ? 'Crítico' : 'Estável'}
                        </span>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                        <Icons.Bed className="w-8 h-8" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Fila Global (Urg)</p>
                        <h3 className="text-3xl font-bold text-gray-900">{kpis.totalPatientsWaiting}</h3>
                        <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full">Aguardando</span>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-50 text-yellow-600">
                        <Icons.Users className="w-8 h-8" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Tempo Médio Espera</p>
                        <h3 className="text-3xl font-bold text-gray-900">{kpis.avgWaitTime}</h3>
                        <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full">Geral</span>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 text-green-600">
                        <Icons.Clock className="w-8 h-8" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Unidades Críticas</p>
                        <h3 className="text-3xl font-bold text-gray-900">{kpis.criticalUnits}</h3>
                        <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">Ação Necessária</span>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 text-red-600">
                        <Icons.AlertTriangle className="w-8 h-8" />
                    </div>
                </div>
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

                {/* Criticality Matrix (Replaces static Alerts) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Matriz de Risco</h3>
                        <p className="text-xs text-gray-500">Unidades ordenadas por ocupação</p>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[300px] p-2">
                        {unitStatuses.slice(0, 6).map(unit => (
                            <div key={unit.id} onClick={() => {
                                const fullUnit = HEALTH_UNITS.find(u => u.id === unit.id);
                                if (fullUnit) setSelectedUnit(fullUnit);
                            }} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-1" title={unit.name}>{unit.name}</p>
                                    <p className="text-xs text-gray-500">{unit.type}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${unit.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                                        unit.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                            unit.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {unit.occupancy}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Units Grid (Dynamic) */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Icons.MapPin className="w-5 h-5 text-gray-500" />
                Monitoramento por Unidade (Ordem de Prioridade)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unitStatuses.map(status => {
                    const unit = HEALTH_UNITS.find(u => u.id === status.id);
                    if (!unit) return null;

                    const isHighOccupancy = status.occupancy > 80;

                    return (
                        <button
                            key={unit.id}
                            onClick={() => setSelectedUnit(unit)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all text-left group relative overflow-hidden"
                        >
                            {status.riskLevel === 'critical' && <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>}
                            {status.riskLevel === 'high' && <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>}

                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${unit.type === 'Hospital' || unit.type === 'Emergência' ? 'bg-purple-100 text-purple-700' :
                                    unit.type === 'UPA' ? 'bg-red-50 text-red-700' :
                                        unit.type === 'Maternidade' ? 'bg-pink-50 text-pink-700' :
                                            'bg-blue-50 text-blue-700'
                                    }`}>
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

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1" title={unit.name}>{unit.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 font-medium">
                                {status.patientsWaiting > 10 ?
                                    <span className="text-red-500">{status.patientsWaiting} pacientes aguardando</span> :
                                    `${status.patientsWaiting} pacientes na fila`
                                }
                            </p>

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
                                    Ver detalhes <Icons.ChevronRight className="w-4 h-4" />
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
