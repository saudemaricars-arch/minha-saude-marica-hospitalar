import React, { useState, useEffect } from 'react';
import { Icons } from '../../constants';
import { HealthUnit } from '../../types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface MasterUnitMonitorProps {
    unit: HealthUnit;
    onBack: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- DYNAMIC MOCK DATA GENERATORS ---

const getMockFlow = (id: string) => {
    // Generate slightly different flow curves based on ID
    const seed = parseInt(id) || 1;
    const base = seed % 2 === 0 ? 1 : 0.8;

    return [
        { time: '06:00', entrada: Math.floor(5 * base), saida: Math.floor(2 * base), espera: Math.floor(10 * base) },
        { time: '08:00', entrada: Math.floor(12 * base), saida: Math.floor(5 * base), espera: Math.floor(18 * base) },
        { time: '10:00', entrada: Math.floor(25 * base), saida: Math.floor(8 * base), espera: Math.floor(35 * base) },
        { time: '12:00', entrada: Math.floor(20 * base), saida: Math.floor(15 * base), espera: Math.floor(40 * base) },
        { time: '14:00', entrada: Math.floor(18 * base), saida: Math.floor(12 * base), espera: Math.floor(32 * base) },
        { time: '16:00', entrada: Math.floor(28 * base), saida: Math.floor(10 * base), espera: Math.floor(45 * base) },
        { time: '18:00', entrada: Math.floor(35 * base), saida: Math.floor(5 * base), espera: Math.floor(60 * base) },
        { time: '20:00', entrada: Math.floor(22 * base), saida: Math.floor(18 * base), espera: Math.floor(40 * base) },
    ];
};

const getStaffMock = (type: string) => {
    if (type === 'Hospital' || type === 'Emergência' || type === 'UPA') {
        return [
            { role: 'Médicos Clínicos', total: 5, active: 4, break: 1, missing: 0 },
            { role: 'Enfermeiros', total: 12, active: 10, break: 2, missing: 0 },
            { role: 'Técnicos Enf.', total: 20, active: 18, break: 1, missing: 1 },
            { role: 'Cirurgiões', total: 3, active: 1, break: 0, missing: 2 },
            { role: 'Pediatras', total: 4, active: 4, break: 0, missing: 0 },
        ];
    } else if (type === 'Maternidade') {
        return [
            { role: 'Obstetras', total: 6, active: 5, break: 1, missing: 0 },
            { role: 'Enfermeiros Obs.', total: 10, active: 9, break: 1, missing: 0 },
            { role: 'Neonatologistas', total: 3, active: 3, break: 0, missing: 0 },
            { role: 'Técnicos Enf.', total: 15, active: 14, break: 1, missing: 0 },
            { role: 'Anestesistas', total: 2, active: 2, break: 0, missing: 0 },
        ];
    } else {
        // USF, CAPS, Lab
        return [
            { role: 'Médico de Família', total: 2, active: 2, break: 0, missing: 0 },
            { role: 'Enfermeiros', total: 3, active: 3, break: 0, missing: 0 },
            { role: 'Técnicos Enf.', total: 4, active: 4, break: 0, missing: 0 },
            { role: 'ACS', total: 6, active: 5, break: 0, missing: 1 },
            { role: 'Admin/Recepção', total: 2, active: 2, break: 0, missing: 0 },
        ];
    }
};

const getInfraMock = (type: string) => {
    if (type === 'Hospital' || type === 'Emergência') {
        return [
            { name: 'Tomógrafo', status: 'Operacional', lastMaintenance: '10/05' },
            { name: 'Raio-X 01', status: 'Manutenção', lastMaintenance: 'Hoje' },
            { name: 'Raio-X 02', status: 'Operacional', lastMaintenance: '20/04' },
            { name: 'Respiradores', total: 15, available: 12, inUse: 3 },
        ];
    } else if (type === 'Laboratório') {
        return [
            { name: 'Analisador Bioquímico', status: 'Operacional', lastMaintenance: '10/05' },
            { name: 'Centrífuga A', status: 'Operacional', lastMaintenance: '15/05' },
            { name: 'Microscópios', total: 8, available: 8, inUse: 6 },
            { name: 'Refrigeradores', total: 4, available: 4, inUse: 4 },
        ];
    } else {
        // USF, CAPS
        return [
            { name: 'Consultório Odonto', status: 'Operacional', lastMaintenance: '02/05' },
            { name: 'Sala de Vacina', status: 'Operacional', lastMaintenance: '10/05' },
            { name: 'Eletrocardiograma', status: 'Manutenção', lastMaintenance: 'Ontem' },
            { name: 'Veículo da Unidade', total: 1, available: 1, inUse: 0 },
        ];
    }
};

const MasterUnitMonitor: React.FC<MasterUnitMonitorProps> = ({ unit, onBack }) => {
    const [activeTab, setActiveTab] = useState<'geral' | 'recursos_humanos' | 'insumos' | 'infra'>('geral');
    const [isLoading, setIsLoading] = useState(true);

    // Derived State based on Unit Type
    const staffData = getStaffMock(unit.type);
    const infraData = getInfraMock(unit.type);
    const flowData = getMockFlow(unit.id);

    // Static supplies for now, could be dynamic too
    const suppliesData = [
        { name: 'Soro Fisiológico 0.9%', stock: 85, status: 'Normal', lastRestock: '2 dias' },
        { name: 'Dipirona Injetável', stock: 12, status: 'Crítico', lastRestock: '15 dias' },
        { name: 'Luvas P', stock: 90, status: 'Normal', lastRestock: '1 dia' },
        { name: 'Máscaras N95', stock: 30, status: 'Atenção', lastRestock: '7 dias' },
    ];

    // Simulate loading for premium feel
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [unit.id]); // Re-run if unit changes

    const renderLoadScreen = () => (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full min-h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Conectando aos sistemas da unidade...</p>
        </div>
    );

    if (isLoading) return renderLoadScreen();

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fade-in">
            {/* Header Area */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        >
                            <Icons.ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-primary-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{unit.name}</h1>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${unit.type === 'Hospital' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {unit.type}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Monitoramento em Tempo Real • Conexão Segura
                                <span className="mx-2 text-green-500">● Online</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                            <Icons.Printer className="w-4 h-4" />
                            Relatório
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm flex items-center gap-2 animate-pulse">
                            <Icons.PhoneIncoming className="w-4 h-4" />
                            Contatar Diretor
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-6 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('geral')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'geral' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Visão Geral
                        {activeTab === 'geral' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('recursos_humanos')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'recursos_humanos' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Recursos Humanos
                        {activeTab === 'recursos_humanos' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('insumos')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'insumos' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Farmácia & Insumos
                        {activeTab === 'insumos' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('infra')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'infra' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Infraestrutura
                        {activeTab === 'infra' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />}
                    </button>
                </div>
            </div>

            {/* TAB: VISÃO GERAL */}
            {activeTab === 'geral' && (
                <div className="space-y-6">
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-500 text-sm font-medium">Ocupação Global</span>
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Alta</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">92%</h3>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-500 text-sm font-medium">Fila de Espera</span>
                                <Icons.Clock className="w-4 h-4 text-orange-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">45 <span className="text-lg text-gray-400 font-normal">pacientes</span></h3>
                            <p className="text-xs text-orange-600 mt-1 font-medium">Tempo médio: 3h 15min</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-500 text-sm font-medium">Equipe Médica</span>
                                <Icons.Users className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">18/22</h3>
                            <p className="text-xs text-red-600 mt-1 font-medium">4 faltas/atestados hoje</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-500 text-sm font-medium">Desfechos (24h)</span>
                                <Icons.Activity className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">14</h3>
                            <p className="text-xs text-green-600 mt-1 font-medium">Altas médicas realizadas</p>
                        </div>
                    </div>

                    {/* Main Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Fluxo de Atendimento (Entradas vs Saídas)</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={flowData}>
                                        <defs>
                                            <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="entrada" name="Entradas (Triagem)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEntrada)" />
                                        <Area type="monotone" dataKey="saida" name="Saídas (Altas/Transf)" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorSaida)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Alertas Prioritários</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-1.5 bg-red-100 rounded text-red-600">
                                            <Icons.AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-red-800 text-sm">Superlotação</span>
                                    </div>
                                    <p className="text-xs text-red-700 leading-relaxed">
                                        Capacidade esgotada. Pacientes aguardando.
                                    </p>
                                    <button className="mt-3 text-xs w-full py-1.5 bg-white border border-red-200 text-red-700 font-semibold rounded hover:bg-red-50 transition-colors">
                                        Ver Detalhes
                                    </button>
                                </div>

                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-1.5 bg-yellow-100 rounded text-yellow-600">
                                            <Icons.Package className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-yellow-800 text-sm">Estoque Dipirona</span>
                                    </div>
                                    <p className="text-xs text-yellow-700 leading-relaxed">
                                        Estoque crítico. Estimativa de duração: 4 horas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: RECURSOS HUMANOS */}
            {activeTab === 'recursos_humanos' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Escala de Plantão (Agora)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3 text-left">Função</th>
                                    <th className="px-6 py-3 text-center">Escalados</th>
                                    <th className="px-6 py-3 text-center">Presentes</th>
                                    <th className="px-6 py-3 text-center">Pausa/Descanso</th>
                                    <th className="px-6 py-3 text-center">Faltas</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {staffData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.role}</td>
                                        <td className="px-6 py-4 text-center">{row.total}</td>
                                        <td className="px-6 py-4 text-center text-green-600 font-bold">{row.active}</td>
                                        <td className="px-6 py-4 text-center text-gray-500">{row.break}</td>
                                        <td className="px-6 py-4 text-center text-red-500 font-bold">{row.missing}</td>
                                        <td className="px-6 py-4 text-center">
                                            {row.missing > 1 ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">Crítico</span>
                                            ) : row.active === row.total ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Completo</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold">Parcial</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: INSUMOS */}
            {activeTab === 'insumos' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Monitoramento de Farmácia e Almoxarifado</h3>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Buscar insumo..." className="px-3 py-2 border rounded-lg text-sm w-64" />
                            <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">Filtrar Críticos</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {suppliesData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${item.status === 'Crítico' ? 'bg-red-100 text-red-600' : item.status === 'Atenção' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                        <Icons.Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                                        <p className="text-xs text-gray-500">Última reposição: {item.lastRestock}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">Estoque Atual</p>
                                        <p className="font-bold text-lg">{item.stock} un</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Crítico' ? 'bg-red-100 text-red-700' : item.status === 'Atenção' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.status}
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: INFRAESTRUTURA */}
            {activeTab === 'infra' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {infraData.map((eq, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{eq.name}</h4>
                                    <p className="text-sm text-gray-500">Manutenção: {eq.lastMaintenance || 'N/A'}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${eq.status === 'Operacional' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {eq.status || 'Status N/A'}
                                </span>
                            </div>
                            {eq.total && (
                                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <span className="block text-xl font-bold">{eq.total}</span>
                                        <span className="text-xs text-gray-500">Total</span>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded">
                                        <span className="block text-xl font-bold text-blue-700">{eq.available}</span>
                                        <span className="text-xs text-blue-600">Disp.</span>
                                    </div>
                                    <div className="bg-orange-50 p-2 rounded">
                                        <span className="block text-xl font-bold text-orange-700">{eq.inUse}</span>
                                        <span className="text-xs text-orange-600">Em Uso</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MasterUnitMonitor;
