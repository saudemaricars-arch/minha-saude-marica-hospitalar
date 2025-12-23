import React, { useState } from 'react';
import { Icons } from '../../constants';
import { AdminPage } from '../../types';
import UserList from './admin/UserList';
// AccessControl import removed
import Hierarchy from './admin/Hierarchy';
import Shifts from './admin/Shifts';
import SystemParams from './admin/SystemParams';
import AuditLogs from './admin/AuditLogs';
import Monitoring from './admin/Monitoring';
import Integrations from './admin/Integrations';
import Licenses from './admin/Licenses';
import LayoutConfig from './admin/LayoutConfig';
import Notifications from './admin/Notifications';
import BackupRestore from './admin/BackupRestore';
import Reports from './admin/Reports';

interface AdminModuleProps {
  onBack: () => void;
}

// Local card component to match Main Dashboard style exactly
const AdminCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  onClick: () => void
}> = ({ title, description, icon, onClick }) => {
  const IconComponent = Icons[icon] || Icons.FileText;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-red-500 transition-colors duration-300" />

      <div className="mb-4">
        <div className="inline-flex p-3 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-200 mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mb-4 flex-grow">
        {description}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400 font-medium group-hover:text-red-500 transition-colors">
        <span>Ver detalhes</span>
        <Icons.ChevronLeft className="w-4 h-4 ml-2 transform rotate-180 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const AdminModule: React.FC<AdminModuleProps> = ({ onBack }) => {
  // If activePage is null, we show the grid. If it has a value, we show the sub-component.
  const [activePage, setActivePage] = useState<AdminPage | null>(null);

  const ADMIN_ITEMS: { id: AdminPage; label: string; description: string; icon: string }[] = [
    { id: 'users', label: 'Gestão de Usuários', description: 'Cadastro, edição e controle de profissionais e funcionários.', icon: 'Users' },
    // 'access' item removed
    { id: 'hierarchy', label: 'Hierarquia & Setores', description: 'Organograma, unidades, departamentos e centros de custo.', icon: 'Network' },
    { id: 'shifts', label: 'Turnos e Escalas', description: 'Gestão de plantões, horários e escalas de trabalho.', icon: 'Clock' },
    { id: 'params', label: 'Parâmetros Globais', description: 'Configurações gerais, regras de negócio e limites do sistema.', icon: 'Sliders' },
    { id: 'audit', label: 'Auditoria (Logs)', description: 'Rastreamento completo de ações e histórico de segurança.', icon: 'FileSearch' },
    { id: 'monitoring', label: 'Monitoramento de Uso', description: 'Métricas de performance e estatísticas de acesso.', icon: 'Activity' },
    { id: 'integrations', label: 'Integrações', description: 'Conexão com laboratórios, farmácias e sistemas externos.', icon: 'Link' },
    { id: 'licenses', label: 'Licenças e Módulos', description: 'Gestão de contratos e funcionalidades ativas por unidade.', icon: 'CreditCard' },
    { id: 'layout', label: 'Personalização Visual', description: 'Ajustes de temas, logos e disposição dos dashboards.', icon: 'Layout' },
    { id: 'notifications', label: 'Notificações', description: 'Configuração de alertas por e-mail, SMS e Push.', icon: 'Bell' },
    { id: 'backup', label: 'Backup e Dados', description: 'Rotinas de segurança, cópias de segurança e restauração.', icon: 'Database' },
    { id: 'reports', label: 'Relatórios Gerenciais', description: 'Central de relatórios, exportação e B.I.', icon: 'Printer' },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'users': return <UserList />;
      // case 'access' removed
      case 'hierarchy': return <Hierarchy />;
      case 'shifts': return <Shifts />;
      case 'params': return <SystemParams />;
      case 'audit': return <AuditLogs />;
      case 'monitoring': return <Monitoring />;
      case 'integrations': return <Integrations />;
      case 'licenses': return <Licenses />;
      case 'layout': return <LayoutConfig />;
      case 'notifications': return <Notifications />;
      case 'backup': return <BackupRestore />;
      case 'reports': return <Reports />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Navigation Breadcrumb Header */}
        <div className="mb-8">
          <button
            onClick={() => activePage ? setActivePage(null) : onBack()}
            className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium mb-2"
          >
            <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-red-200 shadow-sm transition-colors">
              <Icons.ArrowLeft className="w-4 h-4" />
            </div>
            {activePage ? 'Voltar ao Menu Administrativo' : 'Voltar ao Dashboard Principal'}
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg text-white shadow-md">
              <Icons.Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activePage ? ADMIN_ITEMS.find(i => i.id === activePage)?.label : 'Administração do Sistema'}
              </h1>
              <p className="text-gray-500 text-sm">
                {activePage ? 'Gerencie as informações detalhadas abaixo.' : 'Núcleo de controle, segurança e governança da plataforma.'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activePage ? (
          // Sub-Page View
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        ) : (
          // Grid Dashboard View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {ADMIN_ITEMS.map((item) => (
              <AdminCard
                key={item.id}
                title={item.label}
                description={item.description}
                icon={item.icon}
                onClick={() => setActivePage(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModule;