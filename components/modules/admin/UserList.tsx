
import React, { useState, useMemo } from 'react';
import { Icons, HEALTH_UNITS } from '../../../constants';
import { User } from '../../../types';

// Initial Mock Data moved outside component to serve as initial state
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Dr. Roberto Silva', role: 'Médico', email: 'roberto.silva@hosp.marica.gov.br', status: 'active', lastAccess: '10 min atrás', department: 'Clínica Médica', unitId: '1' },
  { id: '2', name: 'Enf. Juliana Costa', role: 'Enfermeiro', email: 'juliana.costa@hosp.marica.gov.br', status: 'active', lastAccess: '2 horas atrás', department: 'Emergência', unitId: '1' },
  { id: '3', name: 'Carlos Admin', role: 'Administrador', email: 'carlos.ti@saude.marica.gov.br', status: 'active', lastAccess: 'Agora', department: 'TI', unitId: '0' },
  { id: '4', name: 'Dra. Ana Paula', role: 'Médico', email: 'ana.paula@upa.marica.gov.br', status: 'inactive', lastAccess: '2 dias atrás', department: 'Pediatria', unitId: '2' },
  { id: '5', name: 'Tec. Marcos Souza', role: 'Técnico', email: 'marcos.s@hosp.marica.gov.br', status: 'suspended', lastAccess: '1 semana atrás', department: 'Triagem', unitId: '1' },
  { id: '6', name: 'Fernanda Lima', role: 'Recepcionista', email: 'fernanda.l@upa.marica.gov.br', status: 'active', lastAccess: '15 min atrás', department: 'Recepção', unitId: '2' },
  { id: '7', name: 'Dr. João Pedro', role: 'Médico', email: 'joao.pedro@hosp.marica.gov.br', status: 'active', lastAccess: 'Ontem', department: 'Cirurgia', unitId: '1' },
];

const ROLES = ['Todos os Perfis', 'Médico', 'Enfermeiro', 'Técnico', 'Administrador', 'Recepcionista'];

const UserList: React.FC = () => {
  // --- State Management ---
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos os Perfis');
  const [unitFilter, setUnitFilter] = useState('Todas as Unidades');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);

  // --- Filtering Logic ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'Todos os Perfis' || user.role === roleFilter;
      
      const unitName = HEALTH_UNITS.find(u => u.id === user.unitId)?.name || '';
      const matchesUnit = unitFilter === 'Todas as Unidades' || unitName === unitFilter;

      return matchesSearch && matchesRole && matchesUnit;
    });
  }, [users, searchTerm, roleFilter, unitFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Handlers ---

  const handleOpenAdd = () => {
    setCurrentUser({ status: 'active', role: 'Médico', unitId: '1' }); // Defaults
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleOpenView = (user: User) => {
    setCurrentUser({ ...user });
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setCurrentUser({ ...user });
    setIsDeleteModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...currentUser, id: u.id } as User : u));
      alert(`Usuário ${currentUser.name} atualizado com sucesso!`);
    } else {
      const newUser: User = {
        ...currentUser,
        id: Math.random().toString(36).substr(2, 9),
        lastAccess: 'Nunca',
      } as User;
      setUsers(prev => [newUser, ...prev]);
      alert(`Usuário ${newUser.name} criado com sucesso!`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentUser.id) {
      setUsers(prev => prev.filter(u => u.id !== currentUser.id));
      alert('Usuário removido do sistema.');
      setIsDeleteModalOpen(false);
    }
  };

  const handleExport = () => {
    const header = ["ID", "Nome", "Email", "Cargo", "Departamento", "Status", "Ultimo Acesso"];
    const rows = filteredUsers.map(u => 
      [u.id, u.name, u.email, u.role, u.department, u.status, u.lastAccess].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios_sistema.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Render Helpers ---
  
  const getUnitName = (id?: string) => HEALTH_UNITS.find(u => u.id === id)?.name || 'N/A';

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h2>
          <p className="text-gray-500 text-sm">Gerencie o cadastro, acesso e permissões dos profissionais.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button 
             onClick={handleExport}
             className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
           >
            <Icons.Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Icons.UserPlus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-grow w-full md:w-auto">
            <span className="absolute left-3 top-2.5 text-gray-400">
               <Icons.Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nome ou email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all"
            />
         </div>
         <select 
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white text-gray-600 transition-all"
         >
            {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
         </select>
         <select 
            value={unitFilter}
            onChange={(e) => { setUnitFilter(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white text-gray-600 transition-all"
         >
            <option>Todas as Unidades</option>
            {HEALTH_UNITS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
         </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="px-6 py-4">Profissional</th>
                <th className="px-6 py-4">Cargo / Departamento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm shrink-0">
                          {user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.role}</div>
                      <div className="text-xs text-gray-500">{user.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getUnitName(user.unitId)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => handleOpenView(user)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-transparent hover:border-gray-200 rounded-lg" title="Visualizar Detalhes">
                           <Icons.Eye className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleOpenEdit(user)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-white border border-transparent hover:border-gray-200 rounded-lg" title="Editar">
                           <Icons.Edit className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleOpenDelete(user)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-transparent hover:border-gray-200 rounded-lg" title="Excluir">
                           <Icons.Trash className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <Icons.Search className="w-12 h-12 opacity-20 mb-2" />
                      <p>Nenhum usuário encontrado com os filtros atuais.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
           <span>Mostrando {Math.min(itemsPerPage * currentPage, filteredUsers.length)} de {filteredUsers.length} usuários</span>
           <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded border ${currentPage === i + 1 ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-gray-200 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
           </div>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentUser.name || ''}
                    onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                      value={currentUser.role}
                      onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}
                    >
                      {ROLES.filter(r => r !== 'Todos os Perfis').map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                      value={currentUser.status}
                      onChange={e => setCurrentUser({ ...currentUser, status: e.target.value as any })}
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentUser.email || ''}
                    onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      value={currentUser.department || ''}
                      onChange={e => setCurrentUser({ ...currentUser, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Lotação</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white outline-none"
                      value={currentUser.unitId}
                      onChange={e => setCurrentUser({ ...currentUser, unitId: e.target.value })}
                    >
                      {HEALTH_UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
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
                  {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW DETAILS MODAL --- */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                  {currentUser.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentUser.name}</h3>
                  <p className="opacity-80 text-sm">{currentUser.role}</p>
                </div>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <Icons.XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        currentUser.status === 'active' ? 'bg-green-100 text-green-700' :
                        currentUser.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {currentUser.status}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Último Acesso</p>
                  <p className="text-sm font-medium text-gray-800">{currentUser.lastAccess}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email</p>
                <div className="flex items-center gap-2 text-gray-800">
                  <Icons.Mail className="w-4 h-4 text-gray-400" />
                  {currentUser.email}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Lotação</p>
                <div className="flex items-center gap-2 text-gray-800">
                  <Icons.Building className="w-4 h-4 text-gray-400" />
                  {getUnitName(currentUser.unitId)}
                </div>
                <p className="text-xs text-gray-500 ml-6 mt-0.5">{currentUser.department}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Icons.Trash className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Usuário?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja remover <strong>{currentUser.name}</strong>? Essa ação não pode ser desfeita.
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
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserList;
