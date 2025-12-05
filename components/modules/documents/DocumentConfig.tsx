
import React, { useState } from 'react';
import { Icons } from '../../../constants';

const DocumentConfig: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
      prontuarioRetention: '20',
      examsRetention: '5',
      watermark: true,
      authDouble: true,
      blockPrintScreen: false
  });

  const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          alert("Configurações atualizadas com sucesso!");
      }, 1000);
  };

  const handleChange = (key: string, value: any) => {
      setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
               <h2 className="text-2xl font-bold text-gray-800">Configurações de Documentos</h2>
               <p className="text-gray-500 text-sm">Políticas de retenção, categorias e segurança.</p>
           </div>
           <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium w-full sm:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Save className="w-4 h-4" />}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Icons.Clock className="w-5 h-5 text-gray-500" /> Tabela de Temporalidade
               </h3>
               <div className="space-y-4">
                   <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-sm text-gray-600">Prontuários Médicos</span>
                       <select 
                            className="text-sm border border-gray-200 rounded p-1.5 bg-white outline-none focus:border-red-500"
                            value={config.prontuarioRetention}
                            onChange={(e) => handleChange('prontuarioRetention', e.target.value)}
                        >
                           <option value="20">20 anos (Lei 13.787)</option>
                           <option value="permanent">Permanente</option>
                       </select>
                   </div>
                   <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-sm text-gray-600">Exames de Imagem</span>
                       <select 
                            className="text-sm border border-gray-200 rounded p-1.5 bg-white outline-none focus:border-red-500"
                            value={config.examsRetention}
                            onChange={(e) => handleChange('examsRetention', e.target.value)}
                        >
                           <option value="5">5 anos</option>
                           <option value="10">10 anos</option>
                           <option value="20">20 anos</option>
                       </select>
                   </div>
                   <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-sm text-gray-600">Documentos Administrativos</span>
                       <select className="text-sm border border-gray-200 rounded p-1.5 bg-white outline-none focus:border-red-500">
                           <option>5 anos</option>
                           <option>10 anos</option>
                       </select>
                   </div>
               </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Icons.Shield className="w-5 h-5 text-gray-500" /> Segurança & DLP
               </h3>
               <div className="space-y-4">
                   <label className="flex items-center gap-3 cursor-pointer">
                       <input 
                            type="checkbox" 
                            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                            checked={config.watermark}
                            onChange={(e) => handleChange('watermark', e.target.checked)}
                        />
                       <span className="text-sm text-gray-700">Adicionar marca d'água automática em impressões</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                       <input 
                            type="checkbox" 
                            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                            checked={config.authDouble}
                            onChange={(e) => handleChange('authDouble', e.target.checked)}
                        />
                       <span className="text-sm text-gray-700">Exigir autenticação dupla para download em lote</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                       <input 
                            type="checkbox" 
                            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                            checked={config.blockPrintScreen}
                            onChange={(e) => handleChange('blockPrintScreen', e.target.checked)}
                        />
                       <span className="text-sm text-gray-700">Bloquear Print Screen (App Mobile)</span>
                   </label>
               </div>
           </div>
       </div>
    </div>
  );
};

export default DocumentConfig;
