
import React, { useState } from 'react';
import { Icons } from '../../../constants';

interface Shift {
  id: string | number;
  name: string;
  startTime: string;
  endTime: string;
  type: 'Fixo' | 'Rotativo' | 'Comercial' | 'Parcial';
  staffCount: number; // Ideal capacity
  assignedStaff: string[]; // List of names/IDs
  status: 'Ativo' | 'Inativo';
}

const AVAILABLE_STAFF = [
  'Dr. Roberto Silva', 
  'Enf. Juliana Costa', 
  'Tec. Marcos Souza', 
  'Dra. Ana Paula', 
  'Dr. João Pedro', 
  'Enf. Carla Dias',
  'Tec. Felipe Santos',
  'Rec. Maria Oliveira'
];

const INITIAL_SHIFTS: Shift[] = [
  { 
    id: 1, 
    name: 'Plantão Diurno (12h)', 
    startTime: '07:00', 
    endTime: '19:00', 
    type: 'Fixo', 
    staffCount: 5, 
    assignedStaff: ['Dr. Roberto Silva', 'Enf. Juliana Costa', 'Tec. Marcos Souza'],
    status: 'Ativo' 
  },
  { 
    id: 2, 
    name: 'Plantão Noturno (12h)', 
    startTime: '19:00', 
    endTime: '07:00', 
    type: 'Fixo', 
    staffCount: 4, 
    assignedStaff: ['Dr. João Pedro'],
    status: 'Ativo' 
  },
  { 
    id: 3, 
    name: 'Administrativo', 
    startTime: '08:00', 
    endTime: '17:00', 
    type: 'Comercial', 
    staffCount: 12, 
    assignedStaff: ['Rec. Maria Oliveira'],
    status: 'Ativo' 
  },
];

const SHIFT_TYPES = ['Fixo', 'Rotativo', 'Comercial', 'Parcial'];

const Shifts: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentShift, setCurrentShift] = useState<Partial<Shift>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

  // --- Helpers ---
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fixo': return 'bg-blue-100 text-blue-700';
      case 'Comercial': return 'bg-green-100 text-green-700';
      case 'Rotativo': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return '';
    const startH = parseInt(start.split(':')[0]);
    const endH = parseInt(end.split(':')[0]);
    let diff = endH - startH;
    if (diff < 0) diff += 24;
    return `${diff}h`;
  };

  // --- Handlers ---

  const handleOpenAdd = () => {
    setCurrentShift({ type: 'Fixo', status: 'Ativo', staffCount: 0, assignedStaff: [] });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shift: Shift) => {
    setCurrentShift({ ...shift });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (shift: Shift) => {
    setShiftToDelete(shift);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShift.name || !currentShift.startTime || !currentShift.endTime) return;

    if (isEditing && currentShift.id) {
      setShifts(prev => prev.map(s => s.id === currentShift.id ? { ...s, ...currentShift } as Shift : s));
      alert('Turno e equipe atualizados com sucesso!');
    } else {
      const newShift: Shift = {
        ...currentShift,
        id: Math.random().toString(36).substr(2, 9),
        assignedStaff: currentShift.assignedStaff || []
      } as Shift;
      setShifts(prev => [...prev, newShift]);
      alert('Novo turno criado com sucesso!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (shiftToDelete) {
      setShifts(prev => prev.filter(s => s.id !== shiftToDelete.id));
      alert('Turno removido com sucesso.');
      setIsDeleteModalOpen(false);
      setShiftToDelete(null);
    }
  };

  const toggleStaff = (name: string) => {
    const currentList = currentShift.assignedStaff || [];
    if (currentList.includes(name)) {
      setCurrentShift({ ...currentShift, assignedStaff: currentList.filter(s => s !== name) });
    } else {
      setCurrentShift({ ...currentShift, assignedStaff: [...currentList, name] });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Turnos e Escalas</h2>
           <p className="text-gray-500 text-sm">Gerencie os horários e a alocação da equipe.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button 
                onClick={handlePrint}
                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
            >
                <Icons.Printer className="w-4 h-4" />
                Imprimir
            </button>
            <button 
                onClick={handleOpenAdd}
                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium"
            >
                <Icons.Clock className="w-4 h-4" />
                Novo Turno
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Nome do Turno</th>
                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Horário</th>
                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Tipo</th>
                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Equipe Escalada</th>
                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Status</th>
                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold text-right print:hidden">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {shifts.map(shift => (
                <tr key={shift.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-800">{shift.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">
                        {shift.startTime} - {shift.endTime} 
                        <span className="text-xs text-gray-400 ml-2">({calculateDuration(shift.startTime, shift.endTime)})</span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getTypeColor(shift.type)}`}>
                            {shift.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        {shift.assignedStaff && shift.assignedStaff.length > 0 ? (
                            <div className="flex -space-x-2 overflow-hidden py-1">
                                {shift.assignedStaff.slice(0, 4).map((staff, i) => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase" title={staff}>
                                        {staff.split(' ')[1]?.charAt(0) || staff.charAt(0)}
                                    </div>
                                ))}
                                {shift.assignedStaff.length > 4 && (
                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">
                                        +{shift.assignedStaff.length - 4}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-400 italic text-xs">Nenhum colaborador</span>
                        )}
                        <div className="text-[10px] text-gray-400 mt-1">
                            {shift.assignedStaff?.length || 0} de {shift.staffCount} vagas
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${shift.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${shift.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {shift.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right print:hidden">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(shift)} className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all" title="Editar">
                                <Icons.Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleOpenDelete(shift)} className="p-2 text-gray-400 hover:text-red-600 bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all" title="Excluir">
                                <Icons.Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {shifts.length === 0 && (
            <div className="p-12 text-center text-gray-400">
                <Icons.Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum turno cadastrado.</p>
            </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">
                {isEditing ? 'Editar Turno' : 'Novo Turno'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Turno</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: Plantão Diurno 12x36"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentShift.name || ''}
                    onChange={e => setCurrentShift({ ...currentShift, name: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                      <input 
                          type="time" 
                          required 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                          value={currentShift.startTime || ''}
                          onChange={e => setCurrentShift({ ...currentShift, startTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
                      <input 
                          type="time" 
                          required 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                          value={currentShift.endTime || ''}
                          onChange={e => setCurrentShift({ ...currentShift, endTime: e.target.value })}
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                          value={currentShift.type}
                          onChange={e => setCurrentShift({ ...currentShift, type: e.target.value as any })}
                      >
                          {SHIFT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                          value={currentShift.status}
                          onChange={e => setCurrentShift({ ...currentShift, status: e.target.value as any })}
                      >
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                      </select>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lotação Ideal (Vagas)</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentShift.staffCount || 0}
                    onChange={e => setCurrentShift({ ...currentShift, staffCount: parseInt(e.target.value) })}
                  />
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-800">Equipe Escalada</label>
                        <span className="text-xs text-gray-500">
                            {currentShift.assignedStaff?.length || 0} selecionados
                        </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto p-2 space-y-1">
                        {AVAILABLE_STAFF.map(staff => (
                            <label key={staff} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={currentShift.assignedStaff?.includes(staff)}
                                    onChange={() => toggleStaff(staff)}
                                    className="rounded text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-700">{staff}</span>
                            </label>
                        ))}
                    </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
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

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && shiftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Icons.Trash className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Turno?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja remover o turno <strong>{shiftToDelete.name}</strong>? Isso pode afetar escalas futuras.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-sm transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shifts;
