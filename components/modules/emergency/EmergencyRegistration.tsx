
import React, { useState } from 'react';
import { Icons } from '../../../constants';
import { RiskLevel } from '../../../types';

const EmergencyRegistration: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
       <div className="text-center mb-6">
           <h2 className="text-2xl font-bold text-gray-800">Registro de Urgência (Triagem)</h2>
           <p className="text-gray-500 text-sm">Preencha os dados iniciais para classificação de risco e admissão.</p>
       </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
           <form className="space-y-6">
               {/* Patient ID */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">CPF ou Cartão SUS</label>
                       <div className="relative">
                           <input type="text" className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500" placeholder="000.000.000-00" />
                           <Icons.Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                       </div>
                   </div>
                   <div className="flex items-end">
                       <button type="button" className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 border border-gray-200">
                           Paciente Não Identificado (Desconhecido)
                       </button>
                   </div>
               </div>

               <div className="border-t border-gray-100 pt-6">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                       <Icons.Activity className="w-5 h-5 text-red-600" /> Sinais Vitais & Queixa
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                       <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">PA (mmHg)</label>
                           <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="120/80" />
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Temp (°C)</label>
                           <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="36.5" />
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">FC (bpm)</label>
                           <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="80" />
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">SatO2 (%)</label>
                           <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="98" />
                       </div>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Queixa Principal</label>
                       <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none outline-none focus:ring-2 focus:ring-red-500" placeholder="Descreva os sintomas relatados pelo paciente..."></textarea>
                   </div>
               </div>

               <div className="border-t border-gray-100 pt-6">
                   <h3 className="text-lg font-bold text-gray-800 mb-4">Classificação de Risco (Manchester)</h3>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                       {[
                           { id: 'red', label: 'Emergência', color: 'bg-red-600', time: '0 min' },
                           { id: 'orange', label: 'Muito Urgente', color: 'bg-orange-500', time: '10 min' },
                           { id: 'yellow', label: 'Urgente', color: 'bg-yellow-400', time: '60 min' },
                           { id: 'green', label: 'Pouco Urgente', color: 'bg-green-500', time: '120 min' },
                           { id: 'blue', label: 'Não Urgente', color: 'bg-blue-500', time: '240 min' },
                       ].map((risk) => (
                           <button
                               key={risk.id}
                               type="button"
                               onClick={() => setSelectedRisk(risk.id as RiskLevel)}
                               className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                                   selectedRisk === risk.id 
                                   ? 'border-gray-800 shadow-md transform scale-105' 
                                   : 'border-transparent hover:bg-gray-50'
                               }`}
                           >
                               <div className={`w-8 h-8 rounded-full ${risk.color} mb-2 border-2 border-white shadow-sm`}></div>
                               <span className="text-sm font-bold text-gray-800">{risk.label}</span>
                               <span className="text-xs text-gray-500">{risk.time}</span>
                           </button>
                       ))}
                   </div>
               </div>

               <div className="pt-6 flex gap-4">
                   <button type="button" className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">
                       Cancelar
                   </button>
                   <button type="button" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700">
                       Confirmar Triagem & Imprimir Pulseira
                   </button>
               </div>
           </form>
       </div>
    </div>
  );
};

export default EmergencyRegistration;