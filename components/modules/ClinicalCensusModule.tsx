
import React, { useState } from 'react';
import { Icons, MOCK_CENSUS_SECTORS, MOCK_CENSUS_MOVEMENTS, MOCK_CENSUS_HISTORY } from '../../constants';
import { CensusPage } from '../../types';

interface ClinicalCensusModuleProps {
  onBack: () => void;
}

const ClinicalCensusModule: React.FC<ClinicalCensusModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<CensusPage>('dashboard');

  // Calculations for Dashboard
  const totalBeds = MOCK_CENSUS_SECTORS.reduce((acc, curr) => acc + curr.totalBeds, 0);
  const totalOccupied = MOCK_CENSUS_SECTORS.reduce((acc, curr) => acc + curr.occupiedBeds, 0);
  const totalBlocked = MOCK_CENSUS_SECTORS.reduce((acc, curr) => acc + curr.blockedBeds, 0);
  const globalOccupancyRate = Math.round((totalOccupied / (totalBeds - totalBlocked)) * 100);
  const avgStayGlobal = (MOCK_CENSUS_SECTORS.reduce((acc, curr) => acc + curr.avgStayDays, 0) / MOCK_CENSUS_SECTORS.length).toFixed(1);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-100';
    if (rate >= 80) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getOccupancyBarColor = (rate: number) => {
      if (rate >= 90) return 'bg-red-500';
      if (rate >= 80) return 'bg-orange-500';
      return 'bg-green-500';
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
                <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                    <Icons.BarChart2 className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Censo Hospitalar
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Indicadores de ocupação, movimentação e produtividade em tempo real.
                    </p>
                </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
             <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Activity className="w-4 h-4" /> Visão Geral
             </button>
             <button 
                onClick={() => setActiveTab('sectors')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sectors' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Building className="w-4 h-4" /> Por Setor
             </button>
             <button 
                onClick={() => setActiveTab('movements')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'movements' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.ArrowRightLeft className="w-4 h-4" /> Movimentação
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.TrendingUp className="w-4 h-4" /> Histórico
             </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Ocupação Global</p>
                      <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{globalOccupancyRate}%</h3>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-1 py-0.5 rounded flex items-center">
                            <Icons.TrendingUp className="w-3 h-3" /> +2%
                        </span>
                      </div>
                  </div>
                  <div className={`p-3 rounded-lg ${getOccupancyColor(globalOccupancyRate)}`}><Icons.PieChart className="w-6 h-6" /></div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pacientes Internados</p>
                      <h3 className="text-2xl font-bold text-gray-900">{totalOccupied}</h3>
                      <p className="text-xs text-gray-400 mt-1">Capacidade: {totalBeds}</p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Icons.Users className="w-6 h-6" /></div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Média Permanência</p>
                      <div className="flex items-end gap-2">
                         <h3 className="text-2xl font-bold text-gray-900">{avgStayDays => avgStayGlobal} dias</h3>
                      </div>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Icons.Clock className="w-6 h-6" /></div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Altas no Dia</p>
                      <h3 className="text-2xl font-bold text-gray-900">{MOCK_CENSUS_MOVEMENTS.filter(m => m.type === 'Alta').length}</h3>
                      <p className="text-xs text-indigo-600 mt-1 cursor-pointer hover:underline">Ver detalhes</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Icons.LogOut className="w-6 h-6" /></div>
               </div>
            </div>

            {/* Dashboard Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart Section (Custom CSS Chart) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          <Icons.TrendingUp className="w-5 h-5 text-indigo-600" /> Tendência de Ocupação (7 Dias)
                      </h3>
                      <select className="text-sm border-gray-300 rounded-lg px-2 py-1 bg-white">
                         <option>Última Semana</option>
                         <option>Último Mês</option>
                      </select>
                   </div>
                   
                   <div className="h-64 w-full flex items-end justify-between gap-2">
                      {MOCK_CENSUS_HISTORY.map((day, idx) => (
                         <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="relative w-full max-w-[40px] bg-indigo-50 rounded-t-lg hover:bg-indigo-100 transition-all flex flex-col justify-end overflow-hidden h-full">
                               <div 
                                  className={`w-full rounded-t-lg transition-all duration-500 ${getOccupancyBarColor(day.occupancyRate)}`} 
                                  style={{ height: `${day.occupancyRate}%` }}
                               ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2 font-medium">{day.date}</span>
                            
                            {/* Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-24 bg-gray-900 text-white text-xs p-2 rounded shadow-lg pointer-events-none transition-opacity z-10">
                               <p className="font-bold">{day.occupancyRate}% Ocupação</p>
                               <p>{day.admissions} Entradas</p>
                               <p>{day.discharges} Saídas</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Alerts / Bottlenecks */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                        <Icons.AlertTriangle className="w-5 h-5 text-orange-500" /> Pontos de Atenção
                    </h3>
                    <div className="space-y-4">
                        {MOCK_CENSUS_SECTORS.filter(s => s.occupancyRate >= 90).map(sector => (
                            <div key={sector.id} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-red-900">{sector.name}</h4>
                                    <span className="bg-red-200 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-bold">CRÍTICO</span>
                                </div>
                                <p className="text-sm text-red-800 mb-2">Ocupação: <span className="font-bold">{sector.occupancyRate}%</span> ({sector.occupiedBeds}/{sector.totalBeds})</p>
                                <div className="w-full bg-red-200 h-1.5 rounded-full">
                                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${sector.occupancyRate}%` }}></div>
                                </div>
                            </div>
                        ))}
                         {MOCK_CENSUS_SECTORS.filter(s => s.occupancyRate >= 80 && s.occupancyRate < 90).map(sector => (
                            <div key={sector.id} className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-orange-900">{sector.name}</h4>
                                    <span className="bg-orange-200 text-orange-800 text-[10px] px-1.5 py-0.5 rounded font-bold">ALERTA</span>
                                </div>
                                <p className="text-sm text-orange-800 mb-2">Ocupação: <span className="font-bold">{sector.occupancyRate}%</span> ({sector.occupiedBeds}/{sector.totalBeds})</p>
                                <div className="w-full bg-orange-200 h-1.5 rounded-full">
                                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${sector.occupancyRate}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {MOCK_CENSUS_SECTORS.every(s => s.occupancyRate < 80) && (
                            <div className="p-8 text-center text-gray-400">
                                <Icons.CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
                                <p>Nenhum setor com ocupação crítica no momento.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
          </div>
        )}

        {activeTab === 'sectors' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Detalhamento por Setor</h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                        <Icons.Download className="w-4 h-4" /> Exportar Excel
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Setor</th>
                            <th className="px-6 py-4 text-center">Leitos Totais</th>
                            <th className="px-6 py-4 text-center">Ocupados</th>
                             <th className="px-6 py-4 text-center">Bloqueados</th>
                            <th className="px-6 py-4">Taxa Ocupação</th>
                            <th className="px-6 py-4 text-center">Média Permanência</th>
                            <th className="px-6 py-4 text-center">Giro (Turnover)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {MOCK_CENSUS_SECTORS.map(sector => (
                            <tr key={sector.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-900">{sector.name}</td>
                                <td className="px-6 py-4 text-center text-gray-600">{sector.totalBeds}</td>
                                <td className="px-6 py-4 text-center font-medium text-gray-800">{sector.occupiedBeds}</td>
                                <td className="px-6 py-4 text-center text-red-500">{sector.blockedBeds}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold w-10 ${getOccupancyColor(sector.occupancyRate).split(' ')[0]}`}>{sector.occupancyRate}%</span>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full w-24">
                                            <div className={`h-full rounded-full ${getOccupancyBarColor(sector.occupancyRate)}`} style={{ width: `${sector.occupancyRate}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-600">{sector.avgStayDays} dias</td>
                                <td className="px-6 py-4 text-center text-gray-600">{sector.turnoverRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === 'movements' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
                 <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Movimentação Diária</h3>
                        <p className="text-gray-500 text-sm">Entradas, saídas e transferências registradas hoje.</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                            <option>Todos os Tipos</option>
                            <option>Internação</option>
                            <option>Alta</option>
                            <option>Transferência</option>
                            <option>Óbito</option>
                        </select>
                        <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {MOCK_CENSUS_MOVEMENTS.map(mov => (
                        <div key={mov.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${
                                    mov.type === 'Internação' ? 'bg-green-100 text-green-600' :
                                    mov.type === 'Alta' ? 'bg-blue-100 text-blue-600' :
                                    mov.type === 'Transferência' ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-800 text-white'
                                }`}>
                                    {mov.type === 'Internação' && <Icons.UserPlus className="w-5 h-5" />}
                                    {mov.type === 'Alta' && <Icons.LogOut className="w-5 h-5" />}
                                    {mov.type === 'Transferência' && <Icons.ArrowRightLeft className="w-5 h-5" />}
                                    {mov.type === 'Óbito' && <Icons.Activity className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{mov.patientName}</p>
                                    <p className="text-sm text-gray-500">{mov.details}</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 md:hidden">
                                        <Icons.Clock className="w-3 h-3" /> {mov.time}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="inline-block px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600 mb-1">
                                    {mov.sector}
                                </div>
                                <p className="text-sm font-mono text-gray-500">{mov.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'history' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center animate-fade-in">
                <Icons.Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Histórico Completo</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">Selecione um período para visualizar relatórios detalhados de sazonalidade e tendências anuais.</p>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700">
                    Gerar Relatório Personalizado
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ClinicalCensusModule;