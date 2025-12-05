
import React, { useState } from 'react';
import { Icons } from '../constants';

interface UserSettingsProps {
  onBack: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Alterações salvas com sucesso!');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: 'UserCheck' },
    { id: 'security', label: 'Segurança & Senha', icon: 'Lock' },
    { id: 'preferences', label: 'Preferências', icon: 'Sliders' },
    { id: 'activity', label: 'Histórico de Acesso', icon: 'History' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Informações Pessoais</h3>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden relative group cursor-pointer">
                    <img src="https://picsum.photos/200/200" alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icons.UploadCloud className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 font-medium hover:underline">Alterar Foto</button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input type="text" defaultValue="Roberto Silva" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Social</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Como prefere ser chamado" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
                    <input type="email" defaultValue="roberto.silva@saude.marica.gov.br" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / Celular</label>
                    <input type="tel" defaultValue="(21) 99888-7766" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Dados Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Cargo</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">Médico Cardiologista</div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Registro Profissional (CRM/Coren)</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">52.12345-6</div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Unidade de Lotação</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">Hospital Municipal Dr. Ernesto Che Guevara</div>
                 </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Alterar Senha</h3>
                <div className="max-w-md space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                      <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                      <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                      <p className="text-xs text-gray-500 mt-1">Mínimo de 8 caracteres, incluindo letras, números e símbolos.</p>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                      <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Autenticação de Dois Fatores (2FA)</h3>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta.</p>
                   </div>
                   <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-6 border-green-500"/>
                      <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-green-500 cursor-pointer"></label>
                   </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-lg border border-green-100 flex items-center gap-3">
                   <Icons.CheckCircle className="w-5 h-5" />
                   <span className="text-sm font-medium">2FA Ativado via App Autenticador.</span>
                </div>
             </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Notificações</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="font-medium text-gray-800">Alertas por E-mail</p>
                         <p className="text-xs text-gray-500">Receba resumos diários e alertas de segurança.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="font-medium text-gray-800">Notificações SMS</p>
                         <p className="text-xs text-gray-500">Para alertas críticos e códigos de verificação.</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="font-medium text-gray-800">Push no Navegador</p>
                         <p className="text-xs text-gray-500">Notificações em tempo real sobre pacientes.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Aparência</h3>
                <div className="flex gap-4">
                   <div className="cursor-pointer">
                      <div className="w-32 h-20 bg-gray-100 border-2 border-red-500 rounded-lg mb-2 relative">
                         <div className="absolute top-2 left-2 w-20 h-2 bg-white rounded"></div>
                         <div className="absolute top-6 left-2 w-10 h-2 bg-white rounded"></div>
                         <div className="absolute bottom-2 right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                      </div>
                      <p className="text-center text-sm font-bold text-red-600">Claro (Padrão)</p>
                   </div>
                   <div className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                      <div className="w-32 h-20 bg-gray-800 border-2 border-gray-600 rounded-lg mb-2 relative">
                         <div className="absolute top-2 left-2 w-20 h-2 bg-gray-600 rounded"></div>
                         <div className="absolute top-6 left-2 w-10 h-2 bg-gray-600 rounded"></div>
                         <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-500 rounded-full"></div>
                      </div>
                      <p className="text-center text-sm font-medium text-gray-600">Escuro</p>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'activity':
        return (
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                       <th className="px-6 py-4">Dispositivo</th>
                       <th className="px-6 py-4">Localização (IP)</th>
                       <th className="px-6 py-4">Data/Hora</th>
                       <th className="px-6 py-4">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                    <tr>
                       <td className="px-6 py-4 flex items-center gap-2">
                          <Icons.Monitor className="w-4 h-4 text-gray-500" /> Chrome (Windows) <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">Atual</span>
                       </td>
                       <td className="px-6 py-4">192.168.1.45 (Rede Interna)</td>
                       <td className="px-6 py-4 text-green-600 font-medium">Online Agora</td>
                       <td className="px-6 py-4 text-green-600">Ativo</td>
                    </tr>
                    <tr>
                       <td className="px-6 py-4 flex items-center gap-2">
                          <Icons.Smartphone className="w-4 h-4 text-gray-500" /> App Mobile (iOS)
                       </td>
                       <td className="px-6 py-4">189.23.12.44 (4G Vivo)</td>
                       <td className="px-6 py-4 text-gray-500">Ontem, 20:30</td>
                       <td className="px-6 py-4 text-gray-500">Desconectado</td>
                    </tr>
                    <tr>
                       <td className="px-6 py-4 flex items-center gap-2">
                          <Icons.Monitor className="w-4 h-4 text-gray-500" /> Firefox (Linux)
                       </td>
                       <td className="px-6 py-4">192.168.1.10 (Consultório 3)</td>
                       <td className="px-6 py-4 text-gray-500">10/05/2024 08:00</td>
                       <td className="px-6 py-4 text-gray-500">Desconectado</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
           <button 
                onClick={onBack}
                className="p-2 rounded-full bg-white border border-gray-200 hover:border-red-200 shadow-sm transition-colors text-gray-500 hover:text-red-600"
            >
                <Icons.ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Configurações da Conta</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Sidebar Nav */}
           <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                 <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">DS</div>
                    <div>
                       <p className="text-sm font-bold text-gray-900">Dr. Silva</p>
                       <p className="text-xs text-gray-500">Diretor Clínico</p>
                    </div>
                 </div>
                 <nav className="p-2 space-y-1">
                    {tabs.map(tab => {
                       const Icon = Icons[tab.icon] || Icons.Settings;
                       return (
                          <button
                             key={tab.id}
                             onClick={() => setActiveTab(tab.id as any)}
                             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id 
                                ? 'bg-red-50 text-red-700' 
                                : 'text-gray-600 hover:bg-gray-50'
                             }`}
                          >
                             <Icon className="w-5 h-5" />
                             {tab.label}
                          </button>
                       );
                    })}
                 </nav>
              </div>
           </div>

           {/* Main Content */}
           <div className="flex-1">
              {renderContent()}

              <div className="mt-6 flex justify-end gap-4 border-t border-gray-200 pt-6">
                 <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Cancelar
                 </button>
                 <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold shadow hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {isLoading ? <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Save className="w-4 h-4" />}
                    Salvar Alterações
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
