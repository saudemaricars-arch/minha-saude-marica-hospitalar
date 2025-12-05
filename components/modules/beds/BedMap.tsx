
import React, { useState } from 'react';
import { Icons, MOCK_BEDS_DETAILED } from '../../../constants';
import { Bed } from '../../../types';

const BedMap: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('Todos');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const sectors = ['Todos', ...Array.from(new Set(MOCK_BEDS_DETAILED.map(b => b.sector)))];

  const filteredBeds = selectedSector === 'Todos' 
    ? MOCK_BEDS_DETAILED 
    : MOCK_BEDS_DETAILED.filter(b => b.sector === selectedSector);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ocupado': return 'bg-red-50 border-red-200 shadow-sm';
      case 'disponivel': return 'bg-green-50 border-green-200 shadow-sm';
      case 'higienizacao': return 'bg-yellow-50 border-yellow-200 shadow-sm';
      case 'manutencao': return 'bg-gray-100 border-gray-300 opacity-75';
      case 'reservado': return 'bg-blue-50 border-blue-200 shadow-sm';
      case 'bloqueado': return 'bg-gray-800 text-white border-gray-900';
      default: return 'bg-white border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
      switch (status) {
      case 'ocupado': return 'text-red-700 bg-red-100';
      case 'disponivel': return 'text-green-700 bg-green-100';
      case 'higienizacao': return 'text-yellow-700 bg-yellow-100';
      case 'manutencao': return 'text-gray-700 bg-gray-200';
      case 'reservado': return 'text-blue-700 bg-blue-100';
      case 'bloqueado': return 'text-white bg-gray-600';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
         <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
            {sectors.map(sector => (
               <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedSector === sector ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
               >
                  {sector}
               </button>
            ))}
         </div>
         <div className="flex gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Vago</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Ocupado</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Limpeza</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Reservado</div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map(bed => (
           <div 
             key={bed.id} 
             onClick={() => setSelectedBed(bed)}
             className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all relative ${getStatusStyle(bed.status)}`}
           >
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold">{bed.code}</h3>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(bed.status)}`}>
                    {bed.status}
                 </span>
              </div>
              
              <div className="text-sm mb-3">
                 <p className="font-medium opacity-80">{bed.type}</p>
                 <p className="text-xs opacity-60">{bed.sector}</p>
              </div>

              {bed.status === 'ocupado' && bed.patient && (
                 <div className="bg-white/50 p-2 rounded-lg border border-black/5">
                    <p className="font-bold text-sm truncate">{bed.patient.name}</p>
                    <p className="text-xs opacity-70 truncate">{bed.patient.diagnosis}</p>
                 </div>
              )}

              {bed.status === 'higienizacao' && (
                 <div className="flex items-center gap-2 text-yellow-700 text-xs mt-2">
                    <Icons.Sparkles className="w-4 h-4" />
                    <span>Em limpeza ({bed.cleaningStatus?.startTime})</span>
                 </div>
              )}

              {bed.isIsolation && (
                 <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-sm" title={`Isolamento: ${bed.isolationType}`}>
                    <Icons.ShieldAlert className="w-4 h-4" />
                 </div>
              )}
           </div>
        ))}
      </div>

      {/* Patient Detail Modal */}
      {selectedBed && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="bg-gray-800 text-white p-6 flex justify-between items-start">
                  <div>
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                        Leito {selectedBed.code}
                        {selectedBed.isIsolation && <span className="bg-red-500 text-xs px-2 py-1 rounded font-bold uppercase">Isolamento</span>}
                     </h2>
                     <p className="opacity-80 text-sm">{selectedBed.sector} • {selectedBed.type}</p>
                  </div>
                  <button onClick={() => setSelectedBed(null)} className="text-white/60 hover:text-white">
                     <Icons.XCircle className="w-8 h-8" />
                  </button>
               </div>
               
               <div className="p-6">
                  {selectedBed.status === 'ocupado' && selectedBed.patient ? (
                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                              {selectedBed.patient.name.charAt(0)}
                           </div>
                           <div>
                              <h3 className="text-xl font-bold text-gray-900">{selectedBed.patient.name}</h3>
                              <p className="text-gray-500">{selectedBed.patient.age} anos • {selectedBed.gender || 'N/A'}</p>
                              <p className="text-sm font-medium text-blue-600 mt-1">Prontuário #{selectedBed.patient.id}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 uppercase font-bold">Diagnóstico</p>
                              <p className="font-medium text-gray-900">{selectedBed.patient.diagnosis}</p>
                           </div>
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 uppercase font-bold">Médico Resp.</p>
                              <p className="font-medium text-gray-900">{selectedBed.patient.doctor}</p>
                           </div>
                           <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 uppercase font-bold">Admissão</p>
                              <p className="font-medium text-gray-900">{selectedBed.patient.admissionDate}</p>
                           </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 uppercase font-bold">Previsão Alta</p>
                              <p className="font-medium text-gray-900">{selectedBed.patient.predictionDischarge || '-'}</p>
                           </div>
                        </div>

                        {selectedBed.equipment.length > 0 && (
                           <div>
                              <p className="text-sm font-bold text-gray-700 mb-2">Equipamentos no Leito</p>
                              <div className="flex gap-2">
                                 {selectedBed.equipment.map(eq => (
                                    <span key={eq} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium border border-blue-100">
                                       {eq}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                           <button className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex justify-center items-center gap-2">
                              <Icons.ArrowRightLeft className="w-4 h-4" /> Transferir
                           </button>
                           <button className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex justify-center items-center gap-2">
                              <Icons.FileText className="w-4 h-4" /> Prontuário
                           </button>
                           <button className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold flex justify-center items-center gap-2">
                              <Icons.LogOut className="w-4 h-4" /> Alta
                           </button>
                        </div>
                     </div>
                  ) : selectedBed.status === 'disponivel' ? (
                     <div className="text-center py-8">
                        <Icons.CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Leito Disponível</h3>
                        <p className="text-gray-500 mb-6">Este leito está pronto para receber um paciente.</p>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold shadow-sm hover:bg-green-700">
                           Alocar Paciente da Fila
                        </button>
                     </div>
                  ) : (
                     <div className="text-center py-8">
                        <Icons.Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 capitalize">{selectedBed.status}</h3>
                        <p className="text-gray-500 mb-6">Aguardando liberação operacional.</p>
                         {selectedBed.status === 'higienizacao' && (
                            <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold shadow-sm hover:bg-yellow-600">
                               Concluir Limpeza
                            </button>
                         )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default BedMap;
