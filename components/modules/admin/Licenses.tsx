
import React, { useState } from 'react';
import { Icons, MODULES_DATA } from '../../../constants';

const Licenses: React.FC = () => {
  // Create local state from constants to allow toggling
  const [modules, setModules] = useState(MODULES_DATA.map(m => ({ ...m, active: true })));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleModule = (id: string) => {
      setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const filteredModules = modules.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Licenças e Módulos</h2>
           <p className="text-gray-500 text-sm">Gerencie quais funcionalidades estão ativas na unidade atual.</p>
        </div>
        <div className="relative w-full sm:w-64">
            <Icons.Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
                type="text" 
                placeholder="Buscar módulo..." 
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
       </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Módulo</th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Categoria</th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Status</th>
                        <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold text-right">Habilitar/Desabilitar</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredModules.map(module => (
                    <tr key={module.id} className={`hover:bg-gray-50 transition-colors ${!module.active ? 'bg-gray-50/50 opacity-70' : ''}`}>
                        <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${module.active ? 'bg-red-50 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                                <Icons.Layout className="w-4 h-4" />
                            </div>
                            {module.title}
                        </td>
                        <td className="px-6 py-4 capitalize text-gray-500 text-sm">{module.category}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${module.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                {module.active ? 'Ativo' : 'Inativo'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => toggleModule(module.id)}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${module.active ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className={`${module.active ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm`}/>
                            </button>
                        </td>
                    </tr>
                    ))}
                    <tr className="bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-gray-400 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-200 text-gray-400"><Icons.Cpu className="w-4 h-4" /></div>
                            Inteligência Artificial Avançada (Add-on)
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">Premium</td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                Não Contratado
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <span className="text-xs text-blue-600 hover:underline cursor-pointer">Contratar</span>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
       </div>
    </div>
  );
};

export default Licenses;
