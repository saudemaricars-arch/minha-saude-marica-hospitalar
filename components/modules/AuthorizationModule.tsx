
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { AuthorizationPage } from '../../types';
import AuthDashboard from './authorization/AuthDashboard';
import AuthNewRequest from './authorization/AuthNewRequest';
import AuthDetails from './authorization/AuthDetails';

interface AuthorizationModuleProps {
  onBack: () => void;
}

const AuthorizationModule: React.FC<AuthorizationModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<AuthorizationPage>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AuthDashboard />;
      case 'new_request': return <AuthNewRequest />;
      case 'audit': return <AuthDetails />; // In real app, this would take an ID
      case 'reports': return (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
           <Icons.BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
           <p>Relatórios de Glosas e SLAs em desenvolvimento.</p>
        </div>
      );
      default: return <AuthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium mb-2"
            >
                <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-red-200 shadow-sm transition-colors">
                <Icons.ArrowLeft className="w-4 h-4" />
                </div>
                Voltar ao Menu Principal
            </button>
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-700 rounded-lg text-white shadow-md">
                    <Icons.ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Autorização de Internação
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Workflow de aprovação, auditoria e integração com operadoras.
                    </p>
                </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
             <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Activity className="w-4 h-4" /> Painel
             </button>
             <button 
                onClick={() => setActiveTab('new_request')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'new_request' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.FilePlus className="w-4 h-4" /> Nova Solicitação
             </button>
             <button 
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'audit' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Search className="w-4 h-4" /> Auditoria (Exemplo)
             </button>
             <button 
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'reports' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.BarChart2 className="w-4 h-4" /> Relatórios
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthorizationModule;
