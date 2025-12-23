
import React, { useState } from 'react';
import { Icons, MOCK_AMBULANCES } from '../../../constants';
import { Ambulance } from '../../../types';

const AmbulanceFleet: React.FC = () => {
  const [fleet, setFleet] = useState<Ambulance[]>(MOCK_AMBULANCES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmbulance, setCurrentAmbulance] = useState<Partial<Ambulance>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredFleet = fleet.filter(a => filterStatus === 'all' || a.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'em_atendimento': return 'bg-blue-100 text-blue-800';
      case 'em_manutencao': return 'bg-red-100 text-red-800';
      case 'higienizacao': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  // CRUD Handlers
  const handleOpenAdd = () => {
    setCurrentAmbulance({ status: 'disponivel', fuelLevel: 100, equipmentStatus: 'ok' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ambulance: Ambulance) => {
    setCurrentAmbulance({ ...ambulance });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta ambulância da frota?')) {
      setFleet(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAmbulance.plate || !currentAmbulance.model) return;

    if (isEditing && currentAmbulance.id) {
      setFleet(prev => prev.map(a => a.id === currentAmbulance.id ? { ...a, ...currentAmbulance } as Ambulance : a));
    } else {
      const newAmbulance: Ambulance = {
        ...currentAmbulance,
        id: Math.random().toString(36).substr(2, 9),
        location: 'Base Central',
        lastMaintenance: new Date().toLocaleDateString('pt-BR')
      } as Ambulance;
      setFleet(prev => [...prev, newAmbulance]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Top Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-2xl font-bold text-gray-900">{fleet.length}</h3>
                  <p className="text-sm text-gray-500">Total da Frota</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg"><Icons.Ambulance className="w-6 h-6 text-gray-600" /></div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-2xl font-bold text-green-600">{fleet.filter(a => a.status === 'disponivel').length}</h3>
                  <p className="text-sm text-gray-500">Disponíveis Agora</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg"><Icons.CheckCircle className="w-6 h-6 text-green-600" /></div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-2xl font-bold text-red-600">{fleet.filter(a => a.status === 'em_manutencao').length}</h3>
                  <p className="text-sm text-gray-500">Em Manutenção</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg"><Icons.Wrench className="w-6 h-6 text-red-600" /></div>
           </div>
       </div>

       {/* List Header & Filters */}
       <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
           <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-t-xl gap-4">
               <div className="flex items-center gap-4 w-full md:w-auto">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                       <Icons.Truck className="w-5 h-5 text-gray-500" /> Veículos
                   </h3>
                   <div className="flex gap-2 overflow-x-auto">
                       {['all', 'disponivel', 'em_atendimento', 'em_manutencao'].map(st => (
                           <button 
                               key={st}
                               onClick={() => setFilterStatus(st)}
                               className={`px-3 py-1 text-xs rounded-full font-medium capitalize transition-colors whitespace-nowrap ${filterStatus === st ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                           >
                               {st.replace('_', ' ')}
                           </button>
                       ))}
                   </div>
               </div>
               <button 
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium w-full md:w-auto justify-center"
               >
                  <Icons.PlusCircle className="w-4 h-4" /> Nova Ambulância
               </button>
           </div>
           
           {/* Table */}
           <div className="overflow-x-auto">
               <table className="w-full text-left">
                   <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                       <tr>
                           <th className="px-6 py-4">Veículo / Placa</th>
                           <th className="px-6 py-4">Tipo</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Tripulação</th>
                           <th className="px-6 py-4">Combustível</th>
                           <th className="px-6 py-4 text-right">Ação</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-sm">
                       {filteredFleet.map(amb => (
                           <tr key={amb.id} className="hover:bg-gray-50 group">
                               <td className="px-6 py-4">
                                   <div className="font-bold text-gray-900">{amb.model}</div>
                                   <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">{amb.plate}</div>
                               </td>
                               <td className="px-6 py-4">
                                   <span className="font-medium text-gray-700">{amb.type}</span>
                               </td>
                               <td className="px-6 py-4">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(amb.status)}`}>
                                       {amb.status.replace('_', ' ')}
                                   </span>
                                   <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                       <Icons.Map className="w-3 h-3" /> {amb.location}
                                   </div>
                               </td>
                               <td className="px-6 py-4 text-gray-600 text-xs max-w-[150px] truncate" title={amb.crew}>
                                   {amb.crew || <span className="italic text-gray-400">Sem equipe</span>}
                               </td>
                               <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                       <Icons.Fuel className={`w-4 h-4 ${getFuelColor(amb.fuelLevel)}`} />
                                       <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                           <div className={`h-full rounded-full ${amb.fuelLevel > 50 ? 'bg-green-500' : amb.fuelLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${amb.fuelLevel}%` }}></div>
                                       </div>
                                       <span className="text-xs font-medium">{amb.fuelLevel}%</span>
                                   </div>
                               </td>
                               <td className="px-6 py-4 text-right">
                                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleOpenEdit(amb)} className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-transparent hover:border-gray-200 rounded-lg">
                                           <Icons.Edit className="w-4 h-4" />
                                       </button>
                                       <button onClick={() => handleDelete(amb.id)} className="p-2 text-gray-400 hover:text-red-600 bg-white border border-transparent hover:border-gray-200 rounded-lg">
                                           <Icons.Trash className="w-4 h-4" />
                                       </button>
                                   </div>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>

       {/* Add/Edit Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {isEditing ? 'Editar Veículo' : 'Nova Ambulância'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none uppercase"
                        value={currentAmbulance.plate || ''}
                        onChange={e => setCurrentAmbulance({ ...currentAmbulance, plate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={currentAmbulance.model || ''}
                        onChange={e => setCurrentAmbulance({ ...currentAmbulance, model: e.target.value })}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                        value={currentAmbulance.type}
                        onChange={e => setCurrentAmbulance({ ...currentAmbulance, type: e.target.value as any })}
                    >
                        <option value="USA">USA (Avançada)</option>
                        <option value="USB">USB (Básica)</option>
                        <option value="Resgate">Resgate</option>
                        <option value="Neonatal">Neonatal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Combustível %</label>
                    <input 
                        type="number" 
                        min="0" max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={currentAmbulance.fuelLevel}
                        onChange={e => setCurrentAmbulance({ ...currentAmbulance, fuelLevel: parseInt(e.target.value) })}
                    />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Operacional</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                    value={currentAmbulance.status}
                    onChange={e => setCurrentAmbulance({ ...currentAmbulance, status: e.target.value as any })}
                >
                    <option value="disponivel">Disponível</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="em_manutencao">Em Manutenção</option>
                    <option value="higienizacao">Higienização</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tripulação (Opcional)</label>
                <input 
                    type="text" 
                    placeholder="Motorista, Médico, Enfermeiro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentAmbulance.crew || ''}
                    onChange={e => setCurrentAmbulance({ ...currentAmbulance, crew: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-sm transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceFleet;
