
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { IndicatorsPage } from '../../types';
import { adminService, KpiMetric, KpiChart, KpiGoal } from '../../services/adminService';

interface AdminIndicatorsModuleProps {
    onBack: () => void;
}

// Simple Chart Component using CSS
const SimpleBarChart: React.FC<{ data: number[]; labels: string[]; color: string }> = ({ data, labels, color }) => {
    const max = Math.max(...data);
    return (
        <div className="flex items-end justify-between h-32 gap-2 pt-4">
            {data.map((val, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-default">
                    <div className="relative w-full rounded-t hover:opacity-80 transition-all flex flex-col justify-end" style={{ height: `${(val / max) * 100}%` }}>
                        <div className={`w-full h-full rounded-t ${color}`}></div>
                        {/* Tooltip */}
                        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                            {val}
                        </div>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">{labels[i]}</span>
                </div>
            ))}
        </div>
    );
};

const SimpleLineChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    // Simplified Line Chart visual representation using SVG polyline
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-32 w-full relative pt-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                />
                {data.map((val, i) => (
                    <circle
                        key={i}
                        cx={(i / (data.length - 1)) * 100}
                        cy={100 - ((val - min) / range) * 100}
                        r="3"
                        fill={color}
                        className="hover:r-5 transition-all cursor-pointer"
                        vectorEffect="non-scaling-stroke"
                    >
                        <title>{val}</title>
                    </circle>
                ))}
            </svg>
        </div>
    );
};


const AdminIndicatorsModule: React.FC<AdminIndicatorsModuleProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<IndicatorsPage>('overview');
    const [metrics, setMetrics] = useState<KpiMetric[]>([]);
    const [charts, setCharts] = useState<KpiChart[]>([]);
    const [goals, setGoals] = useState<KpiGoal[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch Data on Tab Change
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Parallel fetching suitable for dashboard
            const [fetchedMetrics, fetchedCharts, fetchedGoals] = await Promise.all([
                adminService.fetchMetrics(activeTab),
                adminService.fetchCharts(activeTab),
                adminService.fetchGoals()
            ]);
            setMetrics(fetchedMetrics);
            setCharts(fetchedCharts);
            setGoals(fetchedGoals);
        } catch (error) {
            console.error('Error loading KPI data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (name: string) => {
        const IconComponent = Icons[name as keyof typeof Icons];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : <Icons.Activity className="w-5 h-5" />;
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return <Icons.TrendingUp className="w-3 h-3" />;
        if (trend === 'down') return <Icons.TrendingDown className="w-3 h-3" />;
        return <Icons.Activity className="w-3 h-3" />;
    };

    const getTabClass = (tab: IndicatorsPage) =>
        `px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6 animate-fade-in">
                        {/* Summary Cards */}
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {metrics.map(metric => (
                                <div key={metric.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-gray-500 text-xs font-bold uppercase">{metric.title}</h3>
                                        <div className={metric.icon_color || 'text-indigo-600'}>
                                            {getIcon(metric.icon_name)}
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                                    <span className={`text-xs flex items-center gap-1 mt-1 ${metric.trend_color === 'red' ? 'text-red-500' :
                                            metric.trend_color === 'green' ? 'text-green-500' : 'text-gray-400'
                                        }`}>
                                        {getTrendIcon(metric.trend)} {metric.trend_label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {charts.map(chart => (
                                    <div key={chart.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4">{chart.title}</h3>
                                        {chart.chart_type === 'bar' ? (
                                            <SimpleBarChart
                                                data={chart.data_points}
                                                labels={chart.labels || []}
                                                color={chart.color}
                                            />
                                        ) : (
                                            <>
                                                <SimpleLineChart
                                                    data={chart.data_points}
                                                    color={chart.color}
                                                />
                                                {chart.labels && (
                                                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                                                        {chart.labels.map((l, i) => <span key={i}>{l}</span>)}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Goals Overview */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Icons.Target className="w-5 h-5 text-red-600" /> Metas Estratégicas
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    {goals.slice(0, 3).map(goal => (
                                        <div key={goal.id} className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${goal.status === 'success' ? 'bg-green-500' :
                                                goal.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                                                    <span className="text-xs text-gray-500">{goal.current_value}{goal.unit} / {goal.target_value}{goal.unit}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${goal.status === 'success' ? 'bg-green-500' :
                                                            goal.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'clinical':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6">Eficiência do Giro de Leitos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-4xl font-bold text-blue-600">4.8</p>
                                    <p className="text-sm text-gray-500 uppercase font-bold mt-2">Giro Médio (Mensal)</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-4xl font-bold text-green-600">2.1h</p>
                                    <p className="text-sm text-gray-500 uppercase font-bold mt-2">Tempo Médio Higienização</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-4xl font-bold text-orange-600">12%</p>
                                    <p className="text-sm text-gray-500 uppercase font-bold mt-2">Reinternações (30 dias)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Taxa de Ocupação por Especialidade</h3>
                            {/* Only render if chart data is available or fallback */}
                            {charts.length > 0 ? (
                                <SimpleBarChart
                                    data={charts[0].data_points}
                                    labels={charts[0].labels || []}
                                    color={charts[0].color}
                                />
                            ) : (
                                <p className="text-gray-500 italic">Carregando dados...</p>
                            )}
                        </div>
                    </div>
                );

            case 'epidemiological':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Icons.Map className="w-5 h-5 text-gray-600" /> Mapa de Calor (Geo)
                                </h3>
                                <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                    {/* Mock Map Visual */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_New_York_City_location_map.png')] bg-cover bg-center"></div>
                                    <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                                    <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-orange-500/30 rounded-full blur-xl"></div>
                                    <p className="relative z-10 text-gray-500 font-medium">Visualização Georreferenciada de Casos</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Curva Epidemiológica (Dengue)</h3>
                                <SimpleLineChart
                                    data={[12, 18, 45, 120, 85, 40]}
                                    color="#DC2626"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                                    <span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span><span>Sem 5</span><span>Sem 6</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Agravo</th>
                                        <th className="px-6 py-4 text-center">Casos Confirmados</th>
                                        <th className="px-6 py-4 text-center">Incidência / 100k</th>
                                        <th className="px-6 py-4 text-center">Tendência</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {[
                                        { name: 'Dengue', cases: 342, incidence: 145.2, trend: 'up' },
                                        { name: 'COVID-19', cases: 56, incidence: 23.5, trend: 'stable' },
                                        { name: 'Influenza A', cases: 89, incidence: 38.1, trend: 'down' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900">{row.name}</td>
                                            <td className="px-6 py-4 text-center">{row.cases}</td>
                                            <td className="px-6 py-4 text-center">{row.incidence}</td>
                                            <td className="px-6 py-4 text-center flex justify-center">
                                                {row.trend === 'up' && <Icons.TrendingUp className="w-4 h-4 text-red-500" />}
                                                {row.trend === 'down' && <Icons.TrendingDown className="w-4 h-4 text-green-500" />}
                                                {row.trend === 'stable' && <Icons.Activity className="w-4 h-4 text-gray-400" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'quality':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">NPS Global</h3>
                                    <Icons.Smile className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">78</p>
                                <span className="text-xs text-green-500 flex items-center gap-1 mt-1"><Icons.TrendingUp className="w-3 h-3" /> +5 pts vs mês anterior</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Taxa de Infecção (CCIH)</h3>
                                    <Icons.ShieldAlert className="w-5 h-5 text-red-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">1.8%</p>
                                <span className="text-xs text-green-500 flex items-center gap-1 mt-1"><Icons.TrendingDown className="w-3 h-3" /> -0.2% vs mês anterior</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Eventos Adversos</h3>
                                    <Icons.AlertTriangle className="w-5 h-5 text-orange-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">12</p>
                                <span className="text-xs text-gray-500 mt-1">Notificados este mês</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Satisfação do Paciente (Últimos 6 Meses)</h3>
                                <SimpleLineChart
                                    data={[70, 72, 75, 74, 76, 78]}
                                    color="#10B981"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                                    <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Adesão aos Protocolos de Segurança</h3>
                                <SimpleBarChart
                                    data={[95, 88, 92, 85, 98]}
                                    labels={['Higiene Mãos', 'Cirurgia Segura', 'Ident. Paciente', 'Prevenção Queda', 'Medicamentos']}
                                    color="bg-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'operational':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Tempo Médio Espera</h3>
                                    <Icons.Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">45min</p>
                                <span className="text-xs text-red-500 flex items-center gap-1 mt-1"><Icons.TrendingUp className="w-3 h-3" /> +5min vs meta</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Giro de Leitos</h3>
                                    <Icons.Refresh className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">4.2</p>
                                <span className="text-xs text-green-500 flex items-center gap-1 mt-1"><Icons.TrendingUp className="w-3 h-3" /> Eficiência Alta</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Cancel. Cirurgias</h3>
                                    <Icons.XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">5%</p>
                                <span className="text-xs text-gray-500 mt-1">Motivo principal: Clínico</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase">Absenteísmo</h3>
                                    <Icons.Users className="w-5 h-5 text-gray-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">15%</p>
                                <span className="text-xs text-red-500 mt-1">Consultas ambulatoriais</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Tempo de Resposta Ambulância (min)</h3>
                                <SimpleLineChart
                                    data={[15, 14, 18, 16, 12, 13]}
                                    color="#F59E0B"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                                    <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Produtividade por Setor (Atendimentos/Dia)</h3>
                                <SimpleBarChart
                                    data={[120, 85, 45, 60, 30]}
                                    labels={['Emergência', 'Ambulatório', 'Cirúrgico', 'Exames', 'Vacina']}
                                    color="bg-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'goals':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 text-lg">Painel de Metas Institucionais</h3>
                                <button className="text-sm text-indigo-600 hover:underline">Configurar Metas</button>
                            </div>

                            <div className="space-y-6">
                                {loading && <p className="text-center text-gray-400">Carregando metas...</p>}
                                {goals.map(goal => (
                                    <div key={goal.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${goal.status === 'success' ? 'bg-green-100 text-green-700' :
                                                    goal.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    <Icons.Target className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{goal.name}</h4>
                                                    <p className="text-xs text-gray-500">Meta: {goal.target_value}{goal.unit}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-bold ${goal.status === 'success' ? 'text-green-600' :
                                                    goal.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {goal.current_value}{goal.unit}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-white rounded-full h-3 border border-gray-200 overflow-hidden relative">
                                            {/* Target Line */}
                                            <div className="absolute top-0 bottom-0 w-0.5 bg-black z-10" style={{ left: '80%' }}></div>
                                            <div
                                                className={`h-full rounded-full ${goal.status === 'success' ? 'bg-green-500' :
                                                    goal.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${Math.min((goal.current_value / goal.target_value) * 80, 100)}%` }} // Scaled roughly for demo
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>0</span>
                                            <span>Target</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="p-12 text-center text-gray-400">
                        <Icons.Wrench className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Aba em construção.</p>
                    </div>
                );
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
                            <div className="p-2 bg-indigo-800 rounded-lg text-white shadow-md">
                                <Icons.BarChart2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Painel de Indicadores
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Inteligência de dados para gestão estratégica e tomada de decisão.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
                            <Icons.Share2 className="w-4 h-4" /> Exportar
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
                            <Icons.Filter className="w-4 h-4" /> Filtros
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto mb-6">
                    <button onClick={() => setActiveTab('overview')} className={getTabClass('overview')}>
                        <Icons.Layout className="w-4 h-4" /> Visão Geral
                    </button>
                    <button onClick={() => setActiveTab('clinical')} className={getTabClass('clinical')}>
                        <Icons.Stethoscope className="w-4 h-4" /> Assistencial
                    </button>
                    <button onClick={() => setActiveTab('epidemiological')} className={getTabClass('epidemiological')}>
                        <Icons.Globe className="w-4 h-4" /> Epidemiológico
                    </button>
                    <button onClick={() => setActiveTab('quality')} className={getTabClass('quality')}>
                        <Icons.ShieldCheck className="w-4 h-4" /> Qualidade
                    </button>
                    <button onClick={() => setActiveTab('operational')} className={getTabClass('operational')}>
                        <Icons.Settings className="w-4 h-4" /> Operacional
                    </button>
                    <button onClick={() => setActiveTab('goals')} className={getTabClass('goals')}>
                        <Icons.Target className="w-4 h-4" /> Metas
                    </button>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminIndicatorsModule;
