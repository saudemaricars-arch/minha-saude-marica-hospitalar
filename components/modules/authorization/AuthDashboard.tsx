
import React from 'react';
import { Icons, MOCK_AUTH_REQUESTS } from '../../../constants';
import { AuthStatus } from '../../../types';

const AuthDashboard: React.FC = () => {
  const getStatusColor = (status: AuthStatus) => {
    switch (status) {
      case 'autorizado': return 'bg-green-100 text-green-700 border-green-200';
      case 'negado': return 'bg-red-100 text-red-700 border-red-200';
      case 'pendente': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'analise_medica': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'aguardando_operadora': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusLabel = (status: AuthStatus) => {
     switch (status) {
      case 'autorizado': return 'Autorizado';
      case 'negado': return 'Negado';
      case 'pendente': return 'Pendente';
      case 'analise_medica': return 'Análise Médica';
      case 'aguardando_operadora': return 'Em Operadora';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Pendentes</p>
                <h3 className="text-2xl font-bold text-gray-900">{MOCK_AUTH_REQUESTS.filter(r => r.status === 'pendente' || r.status === 'analise_medica').length}</h3>
             </div>
             <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600"><Icons.Clock className="w-6 h-6" /></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Aprovadas Hoje</p>
                <h3 className="text-2xl font-bold text-green-600">12</h3>
             </div>
             <div className="p-3 bg-green-50 rounded-lg text-green-600"><Icons.CheckCircle className="w-6 h-6" /></div>
          </div>
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Negadas</p>
                <h3 className="text-2xl font-bold text-red-600">2</h3>
             </div>
             <div className="p-3 bg-red-50 rounded-lg text-red-600"><Icons.XCircle className="w-6 h-6" /></div>
          </div>
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Tempo Médio</p>
                <h3 className="text-2xl font-bold text-blue-600">45m</h3>
             </div>
             <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Icons.Activity className="w-6 h-6" /></div>
          </div>
       </div>

       {/* List */}
       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative w-full md:w-96">
                <Icons.Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Buscar por paciente, carteirinha ou protocolo..." className="w-full pl-10 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div className="flex gap-2">
                <select className="text-sm border-gray-300 rounded-lg p-2 bg-white">
                   <option>Todos os Status</option>
                   <option>Pendentes</option>
                   <option>Autorizados</option>
                </select>
             </div>
          </div>

          <table className="w-full text-left">
             <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                   <th className="px-6 py-4">Protocolo / Data</th>
                   <th className="px-6 py-4">Paciente / Convênio</th>
                   <th className="px-6 py-4">Procedimento</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Ação</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
                {MOCK_AUTH_REQUESTS.map(req => (
                   <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <div className="font-bold text-gray-900">{req.protocol}</div>
                         <div className="text-xs text-gray-500">{req.requestDate}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="font-medium text-gray-900">{req.patientName}</div>
                         <div className="text-xs text-gray-500">{req.insurance} • {req.insuranceId}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-gray-800 font-medium truncate max-w-[200px]" title={req.procedureName}>{req.procedureName}</div>
                         <div className="text-xs text-gray-500">CID: {req.cid} • {req.type}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(req.status)}`}>
                            {getStatusLabel(req.status)}
                         </span>
                         {req.denialReason && (
                            <div className="text-xs text-red-500 mt-1">{req.denialReason}</div>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-gray-400 hover:text-blue-600">
                            <Icons.Eye className="w-5 h-5" />
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default AuthDashboard;
