import React from 'react';
import { ModuleItem } from '../types';
import { Icons } from '../constants';

interface ModuleCardProps {
  module: ModuleItem;
  onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  const IconComponent = Icons[module.iconName] || Icons.FileText;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-red-500 transition-colors duration-300" />

      <div className="mb-5">
        <div className="inline-flex p-3 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-200 mb-2 flex-grow">
        {module.title}
      </h3>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400 font-medium group-hover:text-red-500 transition-colors">
        <span>Ver detalhes</span>
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
};

export default ModuleCard;