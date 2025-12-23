
import React, { useState } from 'react';
import { Icons } from '../../../constants';
import { HealthUnit } from '../../../types';
import { supabase } from '../../../services/supabaseClient';

interface Department {
  id: string; // Changed to string for UUID
  name: string;
  unit_id: string; // Changed to unit_id for DB match
  head?: string;
}

const UNIT_TYPES = ['Hospital', 'UPA', 'UBS', 'Maternidade', 'Laboratório', 'Administrativo', 'Outros'];

const Hierarchy: React.FC = () => {
  // --- State ---
  // --- State ---
  // --- State ---
  const [units, setUnits] = useState<HealthUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  // Fetch Data
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load Units
      const { data: unitsData, error: unitsError } = await supabase.from('health_units').select('*').order('name');
      if (unitsError) throw unitsError;
      setUnits(unitsData || []);

      // Load Departments
      const { data: deptsData, error: deptsError } = await supabase.from('departments').select('*').order('name');
      if (deptsError) {
        // If table doesn't exist yet, just ignore (or log)
        console.warn('Departments fetch error (maybe table missing):', deptsError.message);
      } else {
        console.log('Loaded depts:', deptsData);
        setDepartments(deptsData || []);
      }

      checkSession();
    } catch (error) {
      console.error('Error loading hierarchy data:', error);
    }
  };

  const checkSession = () => {
    const sessionStr = localStorage.getItem('minha_saude_user_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.unit) {
          const isMaster = session.unit.id === '00000000-0000-0000-0000-000000000000' || session.unit.name.includes('Gestão') || session.unit.type === 'Administrativo';
          if (!isMaster) {
            setUnits(prev => prev.filter(u => u.id === session.unit.id));
            setUserRole('manager');
          } else {
            setUserRole('master');
          }
        }
      } catch (e) {
        console.error('Error parsing session', e);
      }
    }
  };

  // Modal States
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Editing State
  const [currentUnit, setCurrentUnit] = useState<Partial<HealthUnit>>({});
  const [currentDept, setCurrentDept] = useState<Partial<Department>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'unit' | 'dept', id: string | number, name: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Unit Handlers ---

  const handleOpenNewUnit = () => {
    setCurrentUnit({ type: 'Hospital' });
    setIsEditing(false);
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (unit: HealthUnit) => {
    setCurrentUnit({ ...unit });
    setIsEditing(true);
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit.name) return;

    try {
      if (currentUnit.id) {
        // Update
        const { error } = await supabase.from('health_units').update(currentUnit).eq('id', currentUnit.id);
        if (error) throw error;
        alert('Unidade atualizada!');
      } else {
        // Insert
        const { error } = await supabase.from('health_units').insert([{ ...currentUnit }]);
        if (error) throw error;
        alert('Unidade criada!');
      }
      setIsUnitModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving unit:', error);
      alert('Erro ao salvar unidade: ' + error.message);
    }
  };

  const handleConfirmDeleteUnit = (unit: HealthUnit) => {
    setDeleteTarget({ type: 'unit', id: unit.id, name: unit.name });
    setIsDeleteModalOpen(true);
  };

  // --- Department Handlers ---

  const handleOpenNewDept = (unitId: string) => {
    setCurrentDept({ unit_id: unitId, head: '' });
    setIsEditing(false);
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept: Department) => {
    setCurrentDept({ ...dept });
    setIsEditing(true);
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDept.name || !currentDept.unit_id) return;

    try {
      if (currentDept.id) {
        // Update
        const { error } = await supabase.from('departments').update({
          name: currentDept.name,
          head: currentDept.head,
          unit_id: currentDept.unit_id
        }).eq('id', currentDept.id);
        if (error) throw error;
        alert('Departamento atualizado!');
      } else {
        // Create
        const { error } = await supabase.from('departments').insert([{
          name: currentDept.name,
          head: currentDept.head,
          unit_id: currentDept.unit_id
        }]);
        if (error) throw error;
        alert('Departamento criado!');
      }
      setIsDeptModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving dept:', error);
      alert('Erro ao salvar departamento: ' + error.message);
    }
  };

  const handleConfirmDeleteDept = (dept: Department) => {
    setDeleteTarget({ type: 'dept', id: dept.id, name: dept.name });
    setIsDeleteModalOpen(true);
  };

  // --- Common Delete Logic ---

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'unit') {
        const { error } = await supabase.from('health_units').delete().eq('id', deleteTarget.id);
        if (error) throw error;
        alert('Unidade removida!');
      } else {
        const { error } = await supabase.from('departments').delete().eq('id', deleteTarget.id);
        if (error) throw error;
        alert('Departamento removido!');
      }
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      loadData();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Erro ao excluir: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hierarquia e Setores</h2>
          <p className="text-gray-500 text-sm">Organize unidades de saúde e seus departamentos funcionais.</p>
        </div>
        {userRole === 'master' && (
          <button
            onClick={handleOpenNewUnit}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium w-full sm:w-auto"
          >
            <Icons.Building className="w-4 h-4" />
            Nova Unidade
          </button>
        )}
      </div>

      {/* Grid of Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Unit Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-red-600 border border-red-100">
                  <Icons.Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 leading-tight">{unit.name}</h3>
                  <span className="text-xs text-red-700 font-medium">{unit.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEditUnit(unit)} className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors" title="Editar Unidade">
                  <Icons.Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleConfirmDeleteUnit(unit)} className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors" title="Excluir Unidade">
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Departments List */}
            <div className="flex-1 p-0">
              <div className="px-6 py-3 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 flex justify-between items-center">
                <span>Departamentos / Setores</span>
                <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                  {departments.filter(d => d.unit_id === unit.id).length}
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {departments.filter(d => d.unit_id === unit.id).length > 0 ? (
                  departments.filter(d => d.unit_id === unit.id).map(dept => (
                    <li key={dept.id} className="px-6 py-4 flex justify-between items-start hover:bg-gray-50 transition-colors group">
                      <div>
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          {dept.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Icons.UserCheck className="w-3 h-3" />
                          {dept.head || <span className="italic text-gray-400">Sem responsável</span>}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEditDept(dept)} className="text-gray-400 hover:text-blue-600 p-1">
                          <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleConfirmDeleteDept(dept)} className="text-gray-400 hover:text-red-600 p-1">
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-6 py-8 text-center">
                    <div className="inline-flex p-3 bg-gray-50 rounded-full text-gray-300 mb-2">
                      <Icons.Folder className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-sm">Nenhum departamento cadastrado.</p>
                  </li>
                )}
              </ul>
            </div>

            {/* Footer Action */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleOpenNewDept(unit.id)}
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 py-1 px-2 rounded hover:bg-red-50 transition-colors"
              >
                <Icons.UserPlus className="w-3 h-3" /> Adicionar Setor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- UNIT MODAL --- */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {isEditing ? 'Editar Unidade' : 'Nova Unidade'}
              </h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Unidade</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hospital Municipal Central"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={currentUnit.name || ''}
                  onChange={e => setCurrentUnit({ ...currentUnit, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Unidade</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                  value={currentUnit.type}
                  onChange={e => setCurrentUnit({ ...currentUnit, type: e.target.value })}
                >
                  {UNIT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
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

      {/* --- DEPARTMENT MODAL --- */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {isEditing ? 'Editar Setor' : 'Novo Setor'}
                </h3>
                <p className="text-xs text-gray-500">
                  Vinculado a: <span className="font-bold">{units.find(u => u.id === currentDept.unit_id)?.name}</span>
                </p>
              </div>
              <button onClick={() => setIsDeptModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Setor / Departamento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: UTI Neonatal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={currentDept.name || ''}
                  onChange={e => setCurrentDept({ ...currentDept, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Técnico (Chefe)</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Fulano de Tal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={currentDept.head || ''}
                  onChange={e => setCurrentDept({ ...currentDept, head: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
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
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Icons.Trash className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Excluir {deleteTarget.type === 'unit' ? 'Unidade' : 'Setor'}?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja remover <strong>{deleteTarget.name}</strong>?
              {deleteTarget.type === 'unit' && <br />}
              {deleteTarget.type === 'unit' && <span className="text-red-600 font-bold text-xs">Atenção: Todos os departamentos vinculados também serão excluídos.</span>}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
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

export default Hierarchy;
