
import React from 'react';
import { Icons } from '../../../constants';

const AuthDetails: React.FC = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
       {/* Left: Request Info */}
       <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-xl font-bold text-gray-900">Ricardo Mendes</h2>
                   <p className="text-sm text-gray-500">Unimed • Carteirinha: 0032.1122.3344</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase border border-yellow-200">
                   Em Análise
                </span>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <p className="text-xs text-gray-500 uppercase font-bold">Procedimento</p>
                   <p className="font-medium text-gray-900">Angioplastia Coronariana (40813071)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <p className="text-xs text-gray-500 uppercase font-bold">CID</p>
                   <p className="font-medium text-gray-900">I20.0 - Angina Instável</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <p className="text-xs text-gray-500 uppercase font-bold">Solicitante</p>
                   <p className="font-medium text-gray-900">Dr. Roberto (Cardiologia)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <p className="text-xs text-gray-500 uppercase font-bold">Diárias Solicitadas</p>
                   <p className="font-medium text-gray-900">3 diárias (UTI)</p>
                </div>
             </div>

             <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Justificativa Clínica</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                   Paciente com quadro de angina instável há 48h, refratário a medicação. Cateterismo evidenciou lesão crítica em DA proximal. Indicada angioplastia com stent.
                </p>
             </div>

             <div>
                <h3 className="font-bold text-gray-800 mb-2">Documentos</h3>
                <div className="space-y-2">
                   <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                         <Icons.FileText className="w-5 h-5 text-red-500" />
                         <span className="text-sm text-gray-700">Laudo Cateterismo.pdf</span>
                      </div>
                      <Icons.Eye className="w-4 h-4 text-gray-400" />
                   </div>
                   <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                         <Icons.FileText className="w-5 h-5 text-blue-500" />
                         <span className="text-sm text-gray-700">Guia TISS.pdf</span>
                      </div>
                      <Icons.Eye className="w-4 h-4 text-gray-400" />
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Right: Actions & Audit */}
       <div className="w-full xl:w-96 flex flex-col gap-6">
          
          {/* Eligibility Check (Simulation) */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
             <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Icons.Briefcase className="w-4 h-4" /> Checagem Automática
             </h3>
             <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-green-700">
                   <Icons.CheckCircle className="w-4 h-4" /> Paciente Elegível (Ativo)
                </li>
                <li className="flex items-center gap-2 text-green-700">
                   <Icons.CheckCircle className="w-4 h-4" /> Procedimento Coberto
                </li>
                 <li className="flex items-center gap-2 text-green-700">
                   <Icons.CheckCircle className="w-4 h-4" /> Sem Carência
                </li>
             </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icons.ShieldCheck className="w-5 h-5 text-gray-600" /> Auditoria Médica
             </h3>
             
             <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parecer Técnico</label>
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 text-sm" placeholder="Insira observações da auditoria..."></textarea>
                </div>
                <div>
                   <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="text-blue-600 rounded" />
                      Solicitar OPME
                   </label>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-3">
                <button className="w-full py-2 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 flex items-center justify-center gap-2">
                   <Icons.CheckCircle className="w-4 h-4" /> Aprovar Internação
                </button>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 flex items-center justify-center gap-2">
                   <Icons.Link className="w-4 h-4" /> Solicitar à Operadora
                </button>
                <button className="w-full py-2 bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold hover:bg-red-200 flex items-center justify-center gap-2">
                   <Icons.XCircle className="w-4 h-4" /> Negar
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AuthDetails;
