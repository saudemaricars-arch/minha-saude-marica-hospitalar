
import React, { useState } from 'react';
import { Icons, MOCK_AMBULANCES, MOCK_MISSIONS } from '../../../constants';
import { AmbulanceMission, Ambulance } from '../../../types';

const AmbulanceDispatch: React.FC = () => {
  const [missions, setMissions] = useState<AmbulanceMission[]>(MOCK_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<AmbulanceMission | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Available ambulances for dispatch (mock logic)
  const availableAmbulances = MOCK_AMBULANCES.filter(a => a.status === 'disponivel');

  const handleOpenDispatch = (mission: AmbulanceMission) => {
      setSelectedMission(mission);
      setIsDispatchModalOpen(true);
  };

  const handleDispatch = (ambulanceId: string) => {
      if (!selectedMission) return;

      const updatedMissions = missions.map(m => 
          m.id === selectedMission.id 
          ? { ...m, status: 'despachada' as const, ambulanceId, etaMinutes: Math.floor(Math.random() * 15) + 5 } 
          : m
      );
      
      setMissions(updatedMissions);
      setIsDispatchModalOpen(false);
      setSelectedMission(null);
      alert(`Viatura despachada com sucesso para a ocorrência!`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in h-[calc(100vh-200px)] min-h-[600px]">
        
        {/* Left Column: Mission Control */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* Incoming Call Simulation */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 text-white rounded-full">
                        <Icons.PhoneIncoming className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-800">Chamado em Espera</h3>
                        <p className="text-sm text-red-600">192 - Linha 01</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow">
                    Atender
                </button>
            </div>

            {/* Missions List */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Ocorrências Ativas</h3>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">{missions.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {missions.map(mission => (
                        <div key={mission.id} className={`p-4 rounded-lg border ${mission.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} hover:shadow-md cursor-pointer transition-shadow`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${mission.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {mission.type}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">{mission.startTime}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{mission.address}</h4>
                            <p className="text-xs text-gray-600 mb-3">{mission.patientInfo}</p>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                                {mission.status === 'pendente' ? (
                                    <button 
                                        onClick={() => handleOpenDispatch(mission)}
                                        className="w-full py-1.5 bg-gray-800 text-white text-xs font-bold rounded hover:bg-gray-900 flex items-center justify-center gap-2"
                                    >
                                        <Icons.Navigation className="w-3 h-3" /> Despachar Ambulância
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Icons.Ambulance className="w-4 h-4 text-green-600" />
                                        <span className="text-xs font-bold text-green-700">
                                            Viatura {MOCK_AMBULANCES.find(a => a.id === mission.ambulanceId)?.plate}
                                        </span>
                                        {mission.etaMinutes && <span className="text-xs text-gray-500 ml-2">ETA: {mission.etaMinutes} min</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Map & Dispatch Area */}
        <div className="flex-1 flex flex-col gap-4">
            {/* Map Placeholder */}
            <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 relative overflow-hidden group">
                 {/* Mock Map Background */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_New_York_City_location_map.png')] bg-cover bg-center"></div>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <p className="text-gray-400 font-bold text-xl bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">Mapa de Operações em Tempo Real</p>
                 </div>
                 
                 {/* Mock Markers - Active Missions */}
                 {missions.map((m, i) => (
                     <div key={m.id} className="absolute animate-bounce" style={{ top: `${30 + (i * 15)}%`, left: `${20 + (i * 20)}%` }}>
                         <div className={`text-white text-xs font-bold px-2 py-1 rounded shadow-lg mb-1 whitespace-nowrap ${m.priority === 'high' ? 'bg-red-600' : 'bg-blue-600'}`}>
                             {m.type}
                         </div>
                         <Icons.Map className={`w-8 h-8 drop-shadow-md mx-auto ${m.priority === 'high' ? 'text-red-600' : 'text-blue-600'}`} />
                     </div>
                 ))}

                 {/* Mock Markers - Available Ambulances */}
                 <div className="absolute bottom-1/3 right-1/3">
                     <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg mb-1 whitespace-nowrap">USA-01 (Livre)</div>
                     <Icons.Ambulance className="w-8 h-8 text-green-600 drop-shadow-md mx-auto" />
                 </div>
            </div>

            {/* Quick Stats / Dispatch Bar */}
            <div className="h-32 bg-white border border-gray-200 rounded-xl shadow-sm p-4 grid grid-cols-4 gap-4">
                 <div className="flex flex-col justify-center items-center border-r border-gray-100">
                     <span className="text-sm text-gray-500">Tempo Médio Resposta</span>
                     <span className="text-2xl font-bold text-gray-900">8 min</span>
                 </div>
                 <div className="flex flex-col justify-center items-center border-r border-gray-100">
                     <span className="text-sm text-gray-500">Viaturas Livres</span>
                     <span className="text-2xl font-bold text-green-600">
                        {MOCK_AMBULANCES.filter(a => a.status === 'disponivel').length}/{MOCK_AMBULANCES.length}
                     </span>
                 </div>
                 <div className="flex flex-col justify-center items-center border-r border-gray-100">
                     <span className="text-sm text-gray-500">Em Atendimento</span>
                     <span className="text-2xl font-bold text-blue-600">
                        {MOCK_AMBULANCES.filter(a => a.status === 'em_atendimento').length}
                     </span>
                 </div>
                 <div className="flex flex-col justify-center items-center">
                     <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                         <Icons.BarChart2 className="w-4 h-4" /> Relatório Completo
                     </button>
                 </div>
            </div>
        </div>

        {/* Dispatch Modal */}
        {isDispatchModalOpen && selectedMission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Despachar Viatura</h3>
                        <button onClick={() => setIsDispatchModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <Icons.XCircle className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs font-bold text-blue-800 uppercase mb-1">Ocorrência Selecionada</p>
                            <p className="font-bold text-gray-900">{selectedMission.type} - {selectedMission.address}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedMission.patientInfo}</p>
                        </div>

                        <h4 className="font-bold text-gray-700 mb-3">Selecione uma Viatura Disponível:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {availableAmbulances.length > 0 ? availableAmbulances.map(amb => (
                                <button 
                                    key={amb.id}
                                    onClick={() => handleDispatch(amb.id)}
                                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white">
                                            <Icons.Ambulance className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{amb.plate} ({amb.type})</p>
                                            <p className="text-xs text-gray-500">{amb.location}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Disponível</span>
                                </button>
                            )) : (
                                <div className="text-center py-4 text-gray-500 italic">
                                    Nenhuma viatura disponível no momento.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AmbulanceDispatch;
