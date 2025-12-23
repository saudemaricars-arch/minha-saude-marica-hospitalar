
import React, { useState } from 'react';
import { Icons } from '../../../constants';

interface Permission {
  id: string;
  label: string;
  category: 'Clínico' | 'Administrativo' | 'Operacional' | 'Financeiro';
}

interface Profile {
  id: string;
  name: string;
  usersCount: number;
  level: 'Total' | 'Clínico' | 'Administrativo' | 'Operacional';
  permissions: string[]; // List of Permission IDs
}

// --- CONSTANTS ---

const AVAILABLE_PERMISSIONS: Permission[] = [
  // Clínico
  { id: 'cli_view_records', label: 'Visualizar Prontuário', category: 'Clínico' },
  { id: 'cli_edit_records', label: 'Evoluir Paciente', category: 'Clínico' },
  { id: 'cli_prescribe', label: 'Prescrição Eletrônica', category: 'Clínico' },
  { id: 'cli_discharge', label: 'Dar Alta Médica', category: 'Clínico' },
  { id: 'cli_exams', label: 'Solicitar Exames', category: 'Clínico' },
  // Administrativo
  { id: 'adm_users', label: 'Gerenciar Usuários', category: 'Administrativo' },
  { id: 'adm_profiles', label: 'Gerenciar Perfis de Acesso', category: 'Administrativo' },
  { id: 'adm_reports', label: 'Ver Relatórios Gerenciais', category: 'Administrativo' },
  { id: 'adm_audit', label: 'Acessar Logs de Auditoria', category: 'Administrativo' },
  // Operacional
  { id: 'ops_admission', label: 'Realizar Internação', category: 'Operacional' },
  { id: 'ops_triage', label: 'Realizar Triagem', category: 'Operacional' },
  { id: 'ops_scheduling', label: 'Agendar Consultas', category: 'Operacional' },
  { id: 'ops_bed_mgmt', label: 'Gerenciar Leitos', category: 'Operacional' },
];

const INITIAL_PROFILES: Profile[] = [
  { 
    id: '1', name: 'Médico', usersCount: 45, level: 'Clínico', 
    permissions: ['cli_view_records', 'cli_edit_records', 'cli_prescribe', 'cli_discharge', 'cli_exams', 'ops_triage'] 
  },
  { 
    id: '2', name: 'Enfermeiro', usersCount: 82, level: 'Clínico', 
    permissions: ['cli_view_records', 'cli_edit_records', 'ops_triage', 'ops_bed_mgmt'] 
  },
  { 
    id: '3', name: 'Recepção', usersCount: 15, level: 'Operacional', 
    permissions: ['ops_admission', 'ops_scheduling'] 
  },
  { 
    id: '4', name: 'Administrador', usersCount: 3, level: 'Total', 
    permissions: AVAILABLE_PERMISSIONS.map(p => p.id) 
  },
];

const AccessControl: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentProfile, setCurrentProfile] = useState<Partial<Profile>>({});
  const [isEditing, setIsEditing] = useState(false);

  // --- Handlers ---

  const handleOpenNew = () => {
    setCurrentProfile({ level: 'Clínico', permissions: [], usersCount: 0 });
    setIsEditing(false);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (profile: Profile) => {
    setCurrentProfile({ ...profile });
    setIsEditing(true);
    setIsEditModalOpen(true);
  };

  const handleOpenPermissions = (profile: Profile) => {
    setCurrentProfile({ ...profile });
    setIsPermModalOpen(true);
  };

  const handleOpenDelete = (profile: Profile) => {
    setCurrentProfile({ ...profile });
    setIsDeleteModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentProfile.id) {
      setProfiles(prev => prev.map(p => p.id === currentProfile.id ? { ...currentProfile, permissions: p.permissions } as Profile : p)); // Preserve permissions if simple edit
      alert('Perfil atualizado com sucesso!');
    } else {
      const newProfile: Profile = {
        ...currentProfile,
        id: Math.random().toString(36).substr(2, 9),
        permissions: currentProfile.permissions || [],
        usersCount: 0
      } as Profile;
      setProfiles(prev => [...prev, newProfile]);
      alert('Novo perfil criado com sucesso!');
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (currentProfile.id) {
      setProfiles(prev => prev.filter(p => p.id !== currentProfile.id));
      setIsDeleteModalOpen(false);
      alert('Perfil removido com sucesso.');
    }
  };

  const handleTogglePermission = (permId: string) => {
    const currentPerms = currentProfile.permissions || [];
    let newPerms;
    if (currentPerms.includes(permId)) {
      newPerms = currentPerms.filter(id => id !== permId);
    } else {
      newPerms = [...currentPerms, permId];
    }
    setCurrentProfile({ ...currentProfile, permissions: newPerms });
  };

  const handleSavePermissions = () => {
    if (currentProfile.id) {
      setProfiles(prev => prev.map(p => p.id === currentProfile.id ? { ...p, permissions: currentProfile.permissions || [] } : p));
      setIsPermModalOpen(false);
      alert('Permissões atualizadas com sucesso!');
    }
  };

  const handleSelectAll = (category?: string) => {
    const permsToAdd = category 
      ? AVAILABLE_PERMISSIONS.filter(p => p.category === category).map(p => p.id)
      : AVAILABLE_PERMISSIONS.map(p => p.id);
    
    // Union of current permissions and new ones
    const newPerms = Array.from(new Set([...(currentProfile.permissions || []), ...permsToAdd]));
    setCurrentProfile({ ...currentProfile, permissions: newPerms });
  };

  const handleDeselectAll = (category?: string) => {
    const permsToRemove = category
      ? AVAILABLE_PERMISSIONS.filter(p => p.category === category).map(p => p.id)
      : AVAILABLE_PERMISSIONS.map(p => p.id);

    const newPerms = (currentProfile.permissions || []).filter(id => !permsToRemove.includes(id));
    setCurrentProfile({ ...currentProfile, permissions: newPerms });
  };

  // --- Render Helpers ---

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Total': return 'bg-red-100 text-red-800 border-red-200';
      case 'Clínico': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Administrativo': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Perfis de Acesso</h2>
          <p className="text-gray-500 text-sm">Defina o que cada função pode visualizar e editar no sistema.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium w-full sm:w-auto justify-center"
        >
            <Icons.Shield className="w-4 h-4" />
            Novo Perfil
        </button>
      </div>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Icons.Key className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                 <button onClick={() => handleOpenEdit(profile)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Editar Nome">
                    <Icons.Edit className="w-4 h-4" />
                 </button>
                 <button onClick={() => handleOpenDelete(profile)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Excluir Perfil">
                    <Icons.Trash className="w-4 h-4" />
                 </button>
              </div>
            </div>
            
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{profile.name}</h3>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${getLevelBadge(profile.level || '')}`}>
                        {profile.level}
                    </span>
                    <span className="text-xs text-gray-500">• {profile.usersCount} usuários ativos</span>
                </div>
            </div>
            
            <div className="space-y-3 mb-6">
               <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                      <Icons.Lock className="w-3 h-3 text-gray-400" /> Permissões Ativas
                  </span>
                  <span className="font-bold">{profile.permissions?.length} de {AVAILABLE_PERMISSIONS.length}</span>
               </div>
               {/* Progress Bar for Permissions Coverage */}
               <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(profile.permissions.length / AVAILABLE_PERMISSIONS.length) * 100}%` }}
                  ></div>
               </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
               <button 
                 onClick={() => handleOpenPermissions(profile)}
                 className="w-full py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
               >
                 <Icons.Sliders className="w-4 h-4" /> Configurar Permissões
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {isEditing ? 'Editar Perfil' : 'Novo Perfil'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Perfil</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ex: Farmacêutico Pleno"
                  value={currentProfile.name || ''}
                  onChange={e => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso (Categoria)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                  value={currentProfile.level}
                  onChange={e => setCurrentProfile({ ...currentProfile, level: e.target.value as any })}
                >
                  <option value="Clínico">Clínico</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Total">Total (Super Admin)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Isso ajuda a categorizar o perfil nos relatórios.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
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

      {/* --- PERMISSIONS MODAL --- */}
      {isPermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <div>
                  <h3 className="font-bold text-gray-800 text-lg">Configurar Permissões</h3>
                  <p className="text-sm text-gray-500">Perfil: <span className="font-bold text-red-600">{currentProfile.name}</span></p>
              </div>
              <button onClick={() => setIsPermModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {['Clínico', 'Administrativo', 'Operacional'].map(category => (
                      <div key={category} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-fit">
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                              <h4 className="font-bold text-gray-700">{category}</h4>
                              <div className="flex gap-2">
                                  <button onClick={() => handleSelectAll(category)} className="text-[10px] text-blue-600 hover:underline">Todos</button>
                                  <button onClick={() => handleDeselectAll(category)} className="text-[10px] text-gray-500 hover:underline">Nenhum</button>
                              </div>
                          </div>
                          <div className="p-4 space-y-3">
                              {AVAILABLE_PERMISSIONS.filter(p => p.category === category).map(perm => {
                                  const isChecked = currentProfile.permissions?.includes(perm.id);
                                  return (
                                      <label key={perm.id} className="flex items-center justify-between cursor-pointer group">
                                          <span className={`text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{perm.label}</span>
                                          <div className="relative">
                                              <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={isChecked || false}
                                                onChange={() => handleTogglePermission(perm.id)}
                                              />
                                              <div className={`block w-10 h-6 rounded-full transition-colors ${isChecked ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                                              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isChecked ? 'transform translate-x-4' : ''}`}></div>
                                          </div>
                                      </label>
                                  )
                              })}
                          </div>
                      </div>
                  ))}
               </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
               <div className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">{currentProfile.permissions?.length}</span> permissões selecionadas
               </div>
               <div className="flex gap-3">
                  <button 
                    onClick={() => setIsPermModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSavePermissions}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-sm transition-colors"
                  >
                    Salvar Alterações
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Icons.Trash className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Perfil?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja remover o perfil <strong>{currentProfile.name}</strong>? Usuários associados perderão o acesso.
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

export default AccessControl;
