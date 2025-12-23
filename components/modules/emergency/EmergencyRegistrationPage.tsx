
import React from 'react';
import { Icons } from '../../../constants';
import EmergencyRegistration from './EmergencyRegistration';

interface EmergencyRegistrationPageProps {
  onBack: () => void;
}

const EmergencyRegistrationPage: React.FC<EmergencyRegistrationPageProps> = ({ onBack }) => {
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
                <div className="p-2 bg-red-600 rounded-lg text-white shadow-md">
                    <Icons.ClipboardList className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Registro de Urgência
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Triagem, classificação de risco (Manchester) e admissão rápida.
                    </p>
                </div>
            </div>
          </div>
        </div>

        <EmergencyRegistration />
      </div>
    </div>
  );
};

export default EmergencyRegistrationPage;
