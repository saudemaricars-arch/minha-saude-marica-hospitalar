
import React, { useState } from 'react';
import { Icons } from '../../../constants';

interface SystemSettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiry: boolean;
  twoFactorAuth: boolean;
  triageProtocol: 'Manchester' | 'HumanizaSUS' | 'Australiano';
  maxWaitTime: string;
  maintenanceMode: boolean;
  allowExternalAccess: boolean;
}

const SystemParams: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: true,
    twoFactorAuth: true,
    triageProtocol: 'Manchester',
    maxWaitTime: '04:00',
    maintenanceMode: false,
    allowExternalAccess: true
  });

  const handleToggle = (key: keyof SystemSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      alert('Parâmetros do sistema atualizados com sucesso!');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Parâmetros Globais</h2>
           <p className="text-gray-500 text-sm">Regras de negócio e configurações gerais do sistema.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium w-full sm:w-auto ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Icons.Save className="w-4 h-4" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
         
         {/* Security Section */}
         <h3 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Icons.Shield className="w-5 h-5 text-red-600" /> Segurança & Acesso
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Expiração de Sessão (minutos)</label>
                  <input 
                    type="number" 
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Tempo de inatividade até o logout automático.</p>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tentativas de Login antes do Bloqueio</label>
                  <input 
                    type="number" 
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                  />
               </div>
            </div>

            <div className="space-y-4 pt-2">
                <div 
                  onClick={() => handleToggle('passwordExpiry')}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.passwordExpiry ? 'bg-red-600' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${settings.passwordExpiry ? 'right-1' : 'left-1'}`}></div>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Exigir Troca de Senha (90 dias)</span>
                   </div>
                </div>

                <div 
                  onClick={() => handleToggle('twoFactorAuth')}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.twoFactorAuth ? 'bg-red-600' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${settings.twoFactorAuth ? 'right-1' : 'left-1'}`}></div>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Autenticação de Dois Fatores (2FA)</span>
                   </div>
                </div>

                <div 
                  onClick={() => handleToggle('allowExternalAccess')}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.allowExternalAccess ? 'bg-blue-600' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${settings.allowExternalAccess ? 'right-1' : 'left-1'}`}></div>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Permitir Acesso Externo (VPN)</span>
                   </div>
                </div>
            </div>
         </div>

         {/* Operational Section */}
         <h3 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Icons.Activity className="w-5 h-5 text-red-600" /> Operacional & Clínico
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo de Triagem Padrão</label>
               <div className="relative">
                 <select 
                    value={settings.triageProtocol}
                    onChange={(e) => handleChange('triageProtocol', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white appearance-none"
                 >
                    <option value="Manchester">Protocolo de Manchester (Padrão)</option>
                    <option value="HumanizaSUS">HumanizaSUS</option>
                    <option value="Australiano">Australiano</option>
                 </select>
                 <Icons.ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
               </div>
               <p className="text-xs text-gray-400 mt-1">Define as cores e tempos da classificação de risco.</p>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Meta: Tempo Máximo de Espera (hh:mm)</label>
               <input 
                  type="time" 
                  value={settings.maxWaitTime}
                  onChange={(e) => handleChange('maxWaitTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                />
            </div>
            <div className="md:col-span-2">
                <div 
                  onClick={() => handleToggle('maintenanceMode')}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${settings.maintenanceMode ? 'border-orange-300 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                   <div>
                      <h4 className="font-bold text-gray-800">Modo de Manutenção</h4>
                      <p className="text-xs text-gray-500">Impede novos logins de usuários não-administradores.</p>
                   </div>
                   <div className={`w-12 h-7 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                   </div>
                </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default SystemParams;
