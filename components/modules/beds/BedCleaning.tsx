
import React from 'react';
import { Icons, MOCK_BEDS_DETAILED } from '../../../constants';

const BedCleaning: React.FC = () => {
  const dirtyBeds = MOCK_BEDS_DETAILED.filter(b => b.status === 'higienizacao');

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-200 rounded-lg text-yellow-800"><Icons.Sparkles className="w-6 h-6" /></div>
                <h3 className="font-bold text-yellow-900 text-lg">{dirtyBeds.length}</h3>
             </div>
             <p className="text-yellow-800 text-sm">Leitos Aguardando Limpeza</p>
          </div>
       </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Icons.ClipboardList className="w-5 h-5 text-gray-500" /> Fila de Higienização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {dirtyBeds.map(bed => (
                <div key={bed.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-gray-50">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h4 className="font-bold text-lg text-gray-900">{bed.code}</h4>
                         <p className="text-sm text-gray-500">{bed.sector}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">Sujo</span>
                   </div>
                   
                   <div className="text-xs text-gray-600 space-y-1 mb-4">
                      <p>Solicitado às: {bed.cleaningStatus?.startTime}</p>
                      <p>Resp: {bed.cleaningStatus?.assignedTo || 'Pendente'}</p>
                   </div>

                   <button className="w-full py-2 bg-green-600 text-white rounded font-bold text-sm shadow hover:bg-green-700 flex items-center justify-center gap-2">
                      <Icons.CheckCircle className="w-4 h-4" /> Liberar Leito
                   </button>
                </div>
             ))}
             {dirtyBeds.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                   <Icons.Sparkles className="w-12 h-12 mx-auto mb-2 opacity-30" />
                   <p>Nenhum leito aguardando limpeza.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default BedCleaning;
