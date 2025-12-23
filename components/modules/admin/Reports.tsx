
import React, { useState } from 'react';
import { Icons } from '../../../constants';

interface ReportConfig {
    title: string;
    desc: string;
    icon: string;
    previewType: 'chart' | 'table';
}

const Reports: React.FC = () => {
  const [viewingReport, setViewingReport] = useState<ReportConfig | null>(null);

  const reports: ReportConfig[] = [
    { title: 'Ocupação de Leitos', desc: 'Histórico de ocupação por setor e unidade nos últimos 30 dias.', icon: 'Bed', previewType: 'chart' },
    { title: 'Produtividade Médica', desc: 'Atendimentos realizados por profissional e especialidade.', icon: 'UserPlus', previewType: 'table' },
    { title: 'Tempo de Espera', desc: 'Média de tempo entre triagem e atendimento médico.', icon: 'Clock', previewType: 'chart' },
    { title: 'Consumo de Materiais', desc: 'Relatório sintético de saída de insumos da farmácia.', icon: 'ClipboardList', previewType: 'table' },
    { title: 'Auditoria de Acessos', desc: 'Logs completos de login e logout por usuário.', icon: 'Shield', previewType: 'table' },
    { title: 'Faturamento SUS', desc: 'Prévia do faturamento ambulatorial e hospitalar (AIH/BPA).', icon: 'FileText', previewType: 'table' },
  ];

  const handleDownload = (title: string) => {
      alert(`Iniciando download do relatório: ${title}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
       <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Relatórios Gerenciais</h2>
           <p className="text-gray-500 text-sm">Extração de dados para análise e tomada de decisão.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {reports.map((rep, i) => {
             const Icon = Icons[rep.icon] || Icons.FileText;
             return (
               <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg w-fit group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                     <Icon className="w-6 h-6 text-gray-600 group-hover:text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{rep.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 h-10">{rep.desc}</p>
                  <div className="flex gap-2 mt-auto">
                     <button 
                        onClick={() => setViewingReport(rep)}
                        className="flex-1 py-2 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                     >
                        <Icons.Eye className="w-4 h-4" /> Visualizar
                     </button>
                     <button 
                        onClick={() => handleDownload(rep.title)}
                        className="flex-1 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
                     >
                        <Icons.Download className="w-4 h-4" /> PDF
                     </button>
                  </div>
               </div>
             )
         })}
      </div>

      {/* Preview Modal */}
      {viewingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <div>
                          <h3 className="font-bold text-gray-800 text-lg">{viewingReport.title}</h3>
                          <p className="text-xs text-gray-500">Visualização de dados (Últimos 30 dias)</p>
                      </div>
                      <button onClick={() => setViewingReport(null)} className="text-gray-400 hover:text-gray-600">
                          <Icons.XCircle className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-8 flex items-center justify-center bg-gray-50 flex-1">
                      {viewingReport.previewType === 'chart' ? (
                          <div className="w-full h-64 flex items-end justify-center gap-4">
                              {[40, 65, 45, 80, 55, 70, 90].map((h, idx) => (
                                  <div key={idx} className="w-8 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height: `${h}%` }} title={`Data ${idx}: ${h}`}></div>
                              ))}
                          </div>
                      ) : (
                          <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-100 font-bold text-gray-600">
                                      <tr><th className="p-3">Data</th><th className="p-3">Métrica A</th><th className="p-3">Métrica B</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                      <tr><td className="p-3">01/05</td><td className="p-3">120</td><td className="p-3">45%</td></tr>
                                      <tr><td className="p-3">02/05</td><td className="p-3">135</td><td className="p-3">48%</td></tr>
                                      <tr><td className="p-3">03/05</td><td className="p-3">110</td><td className="p-3">42%</td></tr>
                                  </tbody>
                              </table>
                          </div>
                      )}
                  </div>

                  <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                      <button onClick={() => setViewingReport(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Fechar</button>
                      <button onClick={() => handleDownload(viewingReport.title)} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold shadow hover:bg-red-700 flex items-center gap-2">
                          <Icons.Download className="w-4 h-4" /> Baixar Completo
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Reports;
