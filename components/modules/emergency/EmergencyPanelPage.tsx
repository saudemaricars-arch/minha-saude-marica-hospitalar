
import React from 'react';
import { Icons } from '../../../constants';
import EmergencyDashboard from './EmergencyDashboard';

interface EmergencyPanelPageProps {
  onBack: () => void;
}

const EmergencyPanelPage: React.FC<EmergencyPanelPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
                <div className="p-2 bg-red-600 rounded-lg text-white shadow-md animate-pulse">
                    <Icons.Activity className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Painel de Urgência
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Monitoramento em tempo real de ocupação, risco e fluxo de pacientes.
                    </p>
                </div>
            </div>
          </div>
          
          <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                  <Icons.Printer className="w-4 h-4" /> Relatório de Plantão
              </button>
          </div>
        </div>

        <EmergencyDashboard />
      </div>
    </div>
  );
};

export default EmergencyPanelPage;
