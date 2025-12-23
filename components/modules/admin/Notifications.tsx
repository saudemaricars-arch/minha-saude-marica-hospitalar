
import React, { useState } from 'react';
import { Icons } from '../../../constants';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Email' | 'SMS' | 'Push'>('Email');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [templateContent, setTemplateContent] = useState('');

  const handleEdit = (template: string) => {
      setEditingTemplate(template);
      setTemplateContent(`Olá {usuario},\n\nEste é o corpo do template de ${template}.\n\nAtenciosamente,\nEquipe Minha Saúde Maricá.`);
  };

  const handleSave = () => {
      alert(`Template "${editingTemplate}" salvo com sucesso!`);
      setEditingTemplate(null);
  };

  const handleTestSend = (template: string) => {
      alert(`Enviando teste de "${template}" para o seu usuário...`);
  };

  const templates = {
      'Email': ['Boas-vindas ao Usuário', 'Redefinição de Senha', 'Relatório Gerencial Mensal'],
      'SMS': ['Código de Verificação (2FA)', 'Alerta de Leito Vago', 'Confirmação de Plantão'],
      'Push': ['Resultado de Exame Disponível', 'Alerta Crítico: Ocupação Alta', 'Nova Mensagem Interna']
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
       <div>
           <h2 className="text-2xl font-bold text-gray-800">Notificações e Alertas</h2>
           <p className="text-gray-500 text-sm">Configuração de templates de e-mail, SMS e Push Notifications.</p>
       </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 flex">
             {(['Email', 'SMS', 'Push'] as const).map(tab => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === tab ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                 >
                    {tab === 'Email' && <Icons.Mail className="w-4 h-4" />}
                    {tab === 'SMS' && <Icons.MessageSquare className="w-4 h-4" />}
                    {tab === 'Push' && <Icons.Bell className="w-4 h-4" />}
                    Templates de {tab}
                 </button>
             ))}
          </div>
          
          <div className="p-6 space-y-4">
             {templates[activeTab].map((template, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:border-gray-300 transition-all shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 bg-white rounded-full border border-gray-200 ${activeTab === 'Email' ? 'text-blue-500' : activeTab === 'SMS' ? 'text-green-500' : 'text-purple-500'}`}>
                         {activeTab === 'Email' ? <Icons.Mail className="w-5 h-5" /> : activeTab === 'SMS' ? <Icons.Smartphone className="w-5 h-5" /> : <Icons.Bell className="w-5 h-5" />}
                      </div>
                      <span className="font-medium text-gray-800">{template}</span>
                   </div>
                   <div className="flex gap-2 items-center">
                      <button 
                        onClick={() => handleEdit(template)}
                        className="text-sm text-blue-600 hover:underline px-2 py-1 rounded hover:bg-blue-50"
                      >
                          Editar
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={() => handleTestSend(template)}
                        className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                      >
                          Testar Envio
                      </button>
                   </div>
                </div>
             ))}
             {templates[activeTab].length === 0 && <p className="text-gray-400 text-center py-4">Nenhum template encontrado.</p>}
          </div>
       </div>

       {/* Edit Modal */}
       {editingTemplate && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                   <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                       <h3 className="font-bold text-gray-800">Editando: {editingTemplate}</h3>
                       <button onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-gray-600">
                           <Icons.XCircle className="w-6 h-6" />
                       </button>
                   </div>
                   <div className="p-6 flex-1 overflow-y-auto">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Template ({activeTab})</label>
                       <textarea 
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                            value={templateContent}
                            onChange={(e) => setTemplateContent(e.target.value)}
                       ></textarea>
                       <p className="text-xs text-gray-500 mt-2">Variáveis disponíveis: {'{usuario}, {unidade}, {link}, {data}'}</p>
                   </div>
                   <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                       <button onClick={() => setEditingTemplate(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancelar</button>
                       <button onClick={handleSave} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-sm">Salvar Alterações</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default Notifications;
