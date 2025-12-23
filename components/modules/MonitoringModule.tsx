

import React, { useState, useEffect } from 'react';
import { Icons, MOCK_SINAN, MOCK_NOTIFICATIONS, MOCK_TB_CASES, MOCK_VIOLENCE_CASES } from '../../constants';
import { MonitoringPage } from '../../types';

interface MonitoringModuleProps {
  onBack: () => void;
  initialModuleId: string;
}

const MonitoringModule: React.FC<MonitoringModuleProps> = ({ onBack, initialModuleId }) => {
  const [activeTab, setActiveTab] = useState<MonitoringPage>('sinan');

  useEffect(() => {
      if (initialModuleId === '13') setActiveTab('sinan');
      else if (initialModuleId === '14') setActiveTab('agravos');
      else if (initialModuleId === '15') setActiveTab('tuberculose');
      else if (initialModuleId === '16') setActiveTab('violencia');
  }, [initialModuleId]);

  const getPageDetails = () => {
      switch(activeTab) {
          case 'sinan': return { title: 'Controle SINAN', desc: 'Gestão de numeração e lotes de notificação compulsória.', color: 'bg-orange-600', icon: 'ListOrdered' };
          case 'agravos': return { title: 'Notificação de Agravos', desc: 'Vigilância epidemiológica e controle de surtos.', color: 'bg-red-600', icon: 'ShieldAlert' };
          case 'tuberculose': return { title: 'Acomp. Tuberculose', desc: 'Tratamento supervisionado e evolução de casos.', color: 'bg-teal-600', icon: 'Activity' };
          case 'violencia': return { title: 'Monitoramento de Violências', desc: 'Registro sigiloso e articulação com rede de proteção.', color: 'bg-purple-700', icon: 'EyeOff' };
          default: return { title: 'Monitoramento', desc: 'Vigilância em Saúde.', color: 'bg-gray-600', icon: 'Activity' };
      }
  };

  const details = getPageDetails();
  const IconComponent = Icons[details.icon] || Icons.Activity;

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
                <div className={`p-2 rounded-lg text-white shadow-md ${details.color}`}>
                    <IconComponent className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    {details.title}
                    </h1>
                    <p className="text-gray-500 text-sm">
                    {details.desc}
                    </p>
                </div>
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
             <button 
                onClick={() => setActiveTab('sinan')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sinan' ? 'bg-orange-50 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.ListOrdered className="w-4 h-4" /> SINAN
             </button>
             <button 
                onClick={() => setActiveTab('agravos')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'agravos' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.ShieldAlert className="w-4 h-4" /> Agravos
             </button>
             <button 
                onClick={() => setActiveTab('tuberculose')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'tuberculose' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Activity className="w-4 h-4" /> Tuberculose
             </button>
             <button 
                onClick={() => setActiveTab('violencia')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'violencia' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.EyeOff className="w-4 h-4" /> Violência
             </button>
          </div>
        </div>

        {activeTab === 'sinan' && (
            <div className="animate-fade-in space-y-6">
                <div className="flex justify-end">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 font-bold text-sm flex items-center gap-2">
                        <Icons.ListOrdered className="w-4 h-4" /> Gerar Novo Lote
                    </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Numeração</th>
                                <th className="px-6 py-4">Ano</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Utilização</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {MOCK_SINAN.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-800">{item.number}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.year}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            item.status === 'utilizado' ? 'bg-green-100 text-green-700' :
                                            item.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {item.status === 'utilizado' ? (
                                            <div>
                                                <p className="font-bold text-gray-700">{item.patientName}</p>
                                                <p>{item.disease} • {item.generatedAt}</p>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {item.status === 'disponivel' && (
                                            <button className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Cancelar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'agravos' && (
            <div className="animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-xs font-bold uppercase">Casos na Semana</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                         <p className="text-gray-500 text-xs font-bold uppercase">Em Investigação</p>
                        <p className="text-3xl font-bold text-orange-600 mt-2">2</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Notificações Recentes</h3>
                        <button className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-bold">Nova Notificação</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Agravo</th>
                                <th className="px-6 py-4">Paciente</th>
                                <th className="px-6 py-4">Data Notif.</th>
                                <th className="px-6 py-4">Classificação</th>
                                <th className="px-6 py-4">Situação</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 text-sm">
                            {MOCK_NOTIFICATIONS.map(notif => (
                                <tr key={notif.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{notif.disease}</td>
                                    <td className="px-6 py-4 text-gray-700">{notif.patientName}</td>
                                    <td className="px-6 py-4 text-gray-600">{notif.notificationDate} <span className="text-xs text-gray-400">(SE {notif.week})</span></td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            notif.status === 'confirmado' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {notif.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium uppercase text-gray-500">
                                        {notif.investigationStatus.replace('_', ' ')}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'tuberculose' && (
             <div className="animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TB_CASES.map(tc => (
                        <div key={tc.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-gray-900">{tc.patientName}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                    tc.status === 'em_tratamento' ? 'bg-green-100 text-green-700' :
                                    tc.status === 'abandono' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>{tc.status.replace('_', ' ')}</span>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Fase {tc.phase}</span>
                                        <span>Mês {tc.treatmentMonth}/{tc.totalMonths}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(tc.treatmentMonth / tc.totalMonths) * 100}%` }}></div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Adesão TDO</span>
                                    <span className={`font-bold ${tc.tdoCompliance >= 80 ? 'text-green-600' : 'text-red-600'}`}>{tc.tdoCompliance}%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Último Exame</span>
                                    <span className="text-gray-800">{tc.lastExam}</span>
                                </div>
                            </div>

                            <button className="w-full py-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium">
                                Ver Prontuário
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'violencia' && (
            <div className="animate-fade-in space-y-6">
                 {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                           <p className="text-gray-500 text-xs font-bold uppercase">Casos (30 dias)</p>
                           <Icons.EyeOff className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">4</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
                        <div className="flex justify-between items-start mb-2">
                           <p className="text-gray-500 text-xs font-bold uppercase">Alto Risco</p>
                           <Icons.Siren className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-600">{MOCK_VIOLENCE_CASES.filter(c => c.riskLevel === 'Alto').length}</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                           <p className="text-gray-500 text-xs font-bold uppercase">Encaminhados</p>
                           <Icons.Share2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{MOCK_VIOLENCE_CASES.filter(c => c.status === 'Encaminhado').length}</p>
                    </div>
                </div>

                {/* Main List */}
                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-purple-900">Registro de Casos</h3>
                            <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded font-bold">Sigilo Absoluto</span>
                        </div>
                        <button className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm font-bold flex items-center gap-2 hover:bg-purple-700">
                            <Icons.ShieldAlert className="w-4 h-4" /> Nova Notificação
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Vítima (Sigilo)</th>
                                <th className="px-6 py-4">Tipo de Violência</th>
                                <th className="px-6 py-4">Risco</th>
                                <th className="px-6 py-4">Rede de Proteção</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 text-sm">
                            {MOCK_VIOLENCE_CASES.map(caseItem => (
                                <tr key={caseItem.id} className="hover:bg-purple-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {caseItem.isConfidential ? (
                                                <Icons.Lock className="w-4 h-4 text-purple-500" />
                                            ) : (
                                                <Icons.Eye className="w-4 h-4 text-gray-400" />
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">{caseItem.patientName}</div>
                                                <div className="text-xs text-gray-500">{caseItem.age} anos • {caseItem.gender} • {caseItem.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                            caseItem.type === 'Física' ? 'bg-red-50 text-red-700 border-red-100' :
                                            caseItem.type === 'Sexual' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            caseItem.type === 'Autoprovocada' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-gray-50 text-gray-700 border-gray-100'
                                        }`}>
                                            {caseItem.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`font-bold text-xs ${
                                             caseItem.riskLevel === 'Alto' ? 'text-red-600 animate-pulse' : 
                                             caseItem.riskLevel === 'Médio' ? 'text-orange-600' : 'text-green-600'
                                         }`}>
                                             {caseItem.riskLevel}
                                         </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {caseItem.referrals.map(ref => (
                                                <span key={ref} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                                                    {ref}
                                                </span>
                                            ))}
                                            {caseItem.referrals.length === 0 && <span className="text-gray-400 text-xs">-</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium text-xs">
                                        {caseItem.status}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="text-gray-400 hover:text-purple-600" title="Gerar Termo Administrativo">
                                                <Icons.FileText className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-blue-600" title="Encaminhar para Rede">
                                                <Icons.Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default MonitoringModule;
