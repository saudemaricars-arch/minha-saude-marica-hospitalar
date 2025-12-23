
import React, { useState, useEffect } from 'react';
import { Icons, MOCK_EMERGENCY_PATIENTS, MOCK_ROOMS } from '../../../constants';
import { RiskLevel, EmergencyPatient } from '../../../types';

const RISK_CONFIG: Record<RiskLevel, { color: string; label: string; maxWait: number; text: string }> = {
  red: { color: 'bg-red-600', label: 'Emergência', maxWait: 0, text: 'text-red-700' },
  orange: { color: 'bg-orange-500', label: 'Muito Urgente', maxWait: 10, text: 'text-orange-600' },
  yellow: { color: 'bg-yellow-400', label: 'Urgente', maxWait: 60, text: 'text-yellow-700' },
  green: { color: 'bg-green-500', label: 'Pouco Urgente', maxWait: 120, text: 'text-green-700' },
  blue: { color: 'bg-blue-500', label: 'Não Urgente', maxWait: 240, text: 'text-blue-600' },
  white: { color: 'bg-gray-200', label: 'Eletivo', maxWait: 300, text: 'text-gray-600' },
};

const EmergencyDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<RiskLevel | 'all'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // Clock effect for "Real-time" feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredPatients = MOCK_EMERGENCY_PATIENTS.filter(p => {
    const matchesRisk = activeFilter === 'all' || p.riskLevel === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.protocolNumber.includes(searchTerm);
    return matchesRisk && matchesSearch;
  });

  const getWaitTimeStatus = (minutes: number, maxWait: number) => {
    if (maxWait === 0) return 'text-white font-bold animate-pulse'; // Immediate
    if (minutes >= maxWait) return 'text-red-600 font-bold';
    if (minutes >= maxWait * 0.8) return 'text-yellow-600 font-bold';
    return 'text-gray-600';
  };

  const getRoomColor = (status: string) => {
    switch (status) {
        case 'ocupado': return 'bg-red-50 border-red-200 text-red-800';
        case 'livre': return 'bg-green-50 border-green-200 text-green-800';
        case 'higienizacao': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8">
      
      {/* 1. TOP COMMAND BAR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Stats - Left */}
          <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ocupação</p>
                    <h3 className="text-3xl font-bold">85%</h3>
                </div>
                <Icons.Activity className="w-8 h-8 text-gray-500" />
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Espera Média</p>
                    <h3 className="text-3xl font-bold text-gray-800">42<span className="text-sm text-gray-400 ml-1">min</span></h3>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Aguard. Internação</p>
                    <h3 className="text-3xl font-bold text-gray-800">5</h3>
                </div>
                <Icons.Bed className="w-8 h-8 text-blue-200" />
            </div>
             <div className="bg-red-600 text-white p-4 rounded-lg shadow-sm flex items-center justify-between animate-pulse">
                <div>
                    <p className="text-red-100 text-xs font-bold uppercase tracking-wider">Críticos (Vermelho)</p>
                    <h3 className="text-3xl font-bold">1</h3>
                </div>
                <Icons.Siren className="w-8 h-8" />
            </div>
          </div>

          {/* Emergency Codes - Right */}
          <div className="xl:col-span-4 flex gap-2 h-full">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transition-transform active:scale-95">
                  <span className="font-black text-xl">CÓDIGO AZUL</span>
                  <span className="text-xs opacity-80 uppercase">Parada Cardiorrespiratória</span>
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transition-transform active:scale-95">
                  <span className="font-black text-xl">CÓDIGO VERMELHO</span>
                  <span className="text-xs opacity-80 uppercase">Incêndio / Evacuação</span>
              </button>
              <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transition-transform active:scale-95">
                  <span className="font-black text-xl">CÓDIGO AMARELO</span>
                  <span className="text-xs opacity-80 uppercase">Desastre / Trauma</span>
              </button>
          </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full">
          
          {/* 2. MAIN PATIENT LIST (Left Column) */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-300px)] min-h-[600px]">
              {/* Header Filters */}
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
                      <button 
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}
                      >
                        Todos
                      </button>
                      {(Object.keys(RISK_CONFIG) as RiskLevel[]).map((level) => (
                          <button 
                            key={level}
                            onClick={() => setActiveFilter(level)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase border transition-all ${activeFilter === level ? 'bg-white border-gray-400 shadow-sm ring-1 ring-gray-200' : 'bg-white border-transparent hover:bg-gray-100'}`}
                          >
                              <div className={`w-3 h-3 rounded-full ${RISK_CONFIG[level].color}`}></div>
                              {RISK_CONFIG[level].label}
                          </button>
                      ))}
                  </div>
                  
                  <div className="relative w-full md:w-64">
                      <Icons.Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar paciente ou protocolo..." 
                        className="w-full pl-10 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                      />
                  </div>
              </div>

              {/* Table List */}
              <div className="overflow-auto flex-1">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-white sticky top-0 z-10 shadow-sm text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <tr>
                              <th className="px-4 py-3 border-b border-gray-100 w-2">Risco</th>
                              <th className="px-4 py-3 border-b border-gray-100">Paciente / Queixa</th>
                              <th className="px-4 py-3 border-b border-gray-100">Chegada / Espera</th>
                              <th className="px-4 py-3 border-b border-gray-100">Status / Local</th>
                              <th className="px-4 py-3 border-b border-gray-100">Equipe</th>
                              <th className="px-4 py-3 border-b border-gray-100 text-center">Exames</th>
                              <th className="px-4 py-3 border-b border-gray-100 text-right">Ação</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                          {filteredPatients.map(patient => (
                              <tr key={patient.id} className="hover:bg-red-50/30 transition-colors group cursor-pointer">
                                  <td className="p-0 relative w-2">
                                      <div className={`absolute inset-0 w-2 h-full ${RISK_CONFIG[patient.riskLevel].color}`}></div>
                                  </td>
                                  <td className="px-4 py-3">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs border border-gray-200">
                                              {patient.gender}{patient.age}
                                          </div>
                                          <div>
                                              <div className="font-bold text-gray-900 leading-tight">{patient.name}</div>
                                              <div className="text-xs text-gray-500 font-mono mt-0.5">#{patient.protocolNumber}</div>
                                              <div className="text-xs text-gray-600 mt-1 line-clamp-1 max-w-[200px] font-medium" title={patient.chiefComplaint}>
                                                 {patient.chiefComplaint}
                                              </div>
                                              {patient.alerts && (
                                                <div className="flex gap-1 mt-1">
                                                    {patient.alerts.map(a => (
                                                        <span key={a} className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase">{a}</span>
                                                    ))}
                                                </div>
                                              )}
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-4 py-3">
                                      <div className="text-gray-900 font-medium">{patient.arrivalTime}</div>
                                      <div className={`text-xs ${getWaitTimeStatus(patient.waitTimeMinutes, RISK_CONFIG[patient.riskLevel].maxWait)}`}>
                                          {patient.waitTimeMinutes} min
                                      </div>
                                      {/* Visual Wait Bar */}
                                      <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                         <div 
                                            className={`h-full ${patient.waitTimeMinutes > RISK_CONFIG[patient.riskLevel].maxWait ? 'bg-red-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${Math.min((patient.waitTimeMinutes / (RISK_CONFIG[patient.riskLevel].maxWait || 60)) * 100, 100)}%` }}
                                         ></div>
                                      </div>
                                  </td>
                                  <td className="px-4 py-3">
                                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase bg-gray-100 text-gray-700 mb-1">
                                          {patient.status.replace('_', ' ')}
                                      </div>
                                      <div className="text-xs text-gray-500 flex items-center gap-1">
                                          <Icons.Map className="w-3 h-3" /> {patient.location}
                                      </div>
                                  </td>
                                  <td className="px-4 py-3 text-xs">
                                      {patient.assignedTeam?.doctor ? (
                                          <div className="text-gray-900 font-medium">{patient.assignedTeam.doctor}</div>
                                      ) : (
                                          <span className="text-gray-400 italic">Não atribuído</span>
                                      )}
                                      {patient.assignedTeam?.nurse && (
                                          <div className="text-gray-500">{patient.assignedTeam.nurse}</div>
                                      )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                      {patient.exams ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex gap-0.5">
                                                {Array.from({length: patient.exams.total}).map((_, i) => (
                                                    <div key={i} className={`w-2 h-2 rounded-full ${i < patient.exams!.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {patient.exams.completed}/{patient.exams.total}
                                            </span>
                                        </div>
                                      ) : (
                                          <span className="text-gray-300">-</span>
                                      )}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                      <button className="text-gray-400 hover:text-red-600 transition-colors p-2 bg-gray-50 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm">
                                          <Icons.Menu className="w-4 h-4" />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* 3. RIGHT SIDEBAR (Resources & Rooms) */}
          <div className="w-full xl:w-80 flex flex-col gap-4">
              
              {/* Rooms Status */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Icons.Monitor className="w-4 h-4 text-gray-500" /> Salas & Leitos
                  </h3>
                  <div className="space-y-3">
                      {MOCK_ROOMS.map(room => (
                          <div key={room.id} className={`p-3 rounded-lg border flex justify-between items-start ${getRoomColor(room.status)}`}>
                              <div>
                                  <div className="font-bold text-sm">{room.name}</div>
                                  <div className="text-xs opacity-80 uppercase mt-0.5">{room.status}</div>
                                  {room.occupancyTime && (
                                      <div className="text-[10px] mt-1 font-mono flex items-center gap-1">
                                          <Icons.Clock className="w-3 h-3" /> {room.occupancyTime}
                                      </div>
                                  )}
                              </div>
                              <div className={`w-3 h-3 rounded-full ${room.status === 'ocupado' ? 'bg-red-500 animate-pulse' : room.status === 'livre' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Icons.Bell className="w-4 h-4 text-gray-500" /> Notificações
                  </h3>
                  <div className="space-y-4">
                      <div className="flex gap-3 items-start pb-3 border-b border-gray-100">
                          <div className="p-1.5 bg-red-100 text-red-600 rounded">
                              <Icons.HeartPulse className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-800">Troca de Plantão</p>
                              <p className="text-xs text-gray-500">Dr. Roberto (Cardio) assumiu Sala Trauma 1.</p>
                              <p className="text-[10px] text-gray-400 mt-1">Há 5 min</p>
                          </div>
                      </div>
                      <div className="flex gap-3 items-start pb-3 border-b border-gray-100">
                          <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded">
                              <Icons.TestTube className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-800">Resultados Críticos</p>
                              <p className="text-xs text-gray-500">Troponina elevada - Pct. Carlos Andrade.</p>
                              <p className="text-[10px] text-gray-400 mt-1">Há 12 min</p>
                          </div>
                      </div>
                       <div className="flex gap-3 items-start">
                          <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                              <Icons.Ambulance className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-800">Chegada SAMU</p>
                              <p className="text-xs text-gray-500">Previsão: 10 min. Politrauma.</p>
                              <p className="text-[10px] text-gray-400 mt-1">Há 2 min</p>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;