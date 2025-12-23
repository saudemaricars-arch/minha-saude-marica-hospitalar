
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { BedPage } from '../../types';
import BedMap from './beds/BedMap';
import BedCleaning from './beds/BedCleaning';
import BedRequests from './beds/BedRequests';

interface BedManagementModuleProps {
  onBack: () => void;
}

const BedManagementModule: React.FC<BedManagementModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<BedPage>('map');

  const renderContent = () => {
    switch (activeTab) {
      case 'map': return <BedMap />;
      case 'cleaning': return <BedCleaning />;
      case 'requests': return <BedRequests />;
      case 'indicators': return (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
           <Icons.BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
           <p>Painel de Indicadores em desenvolvimento.</p>
        </div>
      );
      default: return <BedMap />;
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
                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md">
                    <Icons.Bed className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Sistema de Leitos
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Gestão centralizada de ocupação e hotelaria.
                    </p>
                </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
             <button 
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'map' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Map className="w-4 h-4" /> Mapa Geral
             </button>
             <button 
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.FileText className="w-4 h-4" /> Solicitações
             </button>
             <button 
                onClick={() => setActiveTab('cleaning')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'cleaning' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.Sparkles className="w-4 h-4" /> Hotelaria
             </button>
             <button 
                onClick={() => setActiveTab('indicators')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'indicators' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Icons.BarChart2 className="w-4 h-4" /> Indicadores
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

export default BedManagementModule;
