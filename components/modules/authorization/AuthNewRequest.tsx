
import React from 'react';
import { Icons } from '../../../constants';

const AuthNewRequest: React.FC = () => {
   return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               <Icons.FilePlus className="w-5 h-5 text-blue-600" /> Nova Solicitação de Internação
            </h2>

            <div className="space-y-6">
               {/* Patient Info */}
               <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Dados do Paciente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Buscar paciente..." />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                           <option>Unimed</option>
                           <option>Bradesco Saúde</option>
                           <option>Amil</option>
                           <option>Particular</option>
                           <option>SUS</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Carteirinha</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="000.000.000" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Validade Carteirinha</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                     </div>
                  </div>
               </div>

               {/* Clinical Info */}
               <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Dados Clínicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caráter da Solicitação</label>
                        <div className="flex gap-4 pt-1">
                           <label className="flex items-center gap-2">
                              <input type="radio" name="type" className="text-blue-600" /> Eletiva
                           </label>
                           <label className="flex items-center gap-2">
                              <input type="radio" name="type" className="text-blue-600" /> Urgência
                           </label>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Provável Internação</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CID Principal</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: I21.9" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Procedimento Principal (TUSS)</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: 40813071" />
                     </div>
                  </div>

                  <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Justificativa Clínica</label>
                     <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none" placeholder="Descreva o quadro clínico, exames realizados e motivo da internação..."></textarea>
                  </div>
               </div>

               {/* Documents */}
               <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Documentos Anexos</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                     <Icons.UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                     <p className="text-sm text-gray-600">Arraste laudos, exames ou guia do convênio aqui.</p>
                  </div>
               </div>

               <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Salvar Rascunho</button>
                  <button onClick={() => alert('Solicitação enviada com sucesso! Protocolo: ' + Math.random().toString(36).substr(2, 6).toUpperCase())} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700">Enviar Solicitação</button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthNewRequest;
