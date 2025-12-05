
import React, { useState } from 'react';
import { Icons } from '../../../constants';

const LayoutConfig: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#DC2626');
  const [bgColor, setBgColor] = useState('#F9FAFB');
  const [darkMode, setDarkMode] = useState(false);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          alert('Tema atualizado com sucesso! (As alterações são visuais e simuladas neste protótipo)');
      }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setLogoFile(e.target.files[0].name);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Personalização Visual</h2>
           <p className="text-gray-500 text-sm">Adapte a aparência do sistema à identidade da instituição.</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-70"
        >
            {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Save className="w-4 h-4" />}
            {isSaving ? 'Aplicando...' : 'Aplicar Tema'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Cores e Tema</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm text-gray-600 mb-1">Cor Primária (Institucional)</label>
                  <div className="flex items-center gap-2">
                     <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
                     />
                     <input 
                        type="text" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase" 
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm text-gray-600 mb-1">Cor de Fundo</label>
                  <div className="flex items-center gap-2">
                     <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
                     />
                     <input 
                        type="text" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase" 
                     />
                  </div>
               </div>
               <div className="pt-4 border-t border-gray-100 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div 
                        className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}
                        onClick={() => setDarkMode(!darkMode)}
                     >
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
                     </div>
                     <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">Modo Escuro (Beta)</span>
                  </label>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Logomarca</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
               <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               {logoFile ? (
                   <div className="flex flex-col items-center">
                       <Icons.CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                       <p className="text-sm font-bold text-gray-800">{logoFile}</p>
                       <p className="text-xs text-gray-500 mt-1">Pronto para envio</p>
                   </div>
               ) : (
                   <>
                        <img 
                            src="https://firebasestorage.googleapis.com/v0/b/excel-insights-n8l3f.firebasestorage.app/o/Logos%20Minha%20Sa%C3%BAde%20Maric%C3%A1_Logo%20Branca.png?alt=media&token=60f7743f-c437-40ef-8246-5012a66df59a" 
                            className="h-12 w-auto mb-4 bg-red-600 p-2 rounded shadow-sm" 
                            alt="Current Logo" 
                        />
                        <p className="text-sm text-gray-500 mb-2">Arraste uma nova imagem ou clique para fazer upload</p>
                        <span className="text-xs text-gray-400">PNG, JPG ou SVG (Max 2MB)</span>
                   </>
               )}
            </div>
            <div className="mt-4 flex gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Altura Max (px)</label>
                    <input type="number" defaultValue={40} className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm" />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Posição</label>
                    <select className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white">
                        <option>Esquerda</option>
                        <option>Centro</option>
                    </select>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LayoutConfig;
