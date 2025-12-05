
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { DocumentPage, DocumentFile } from '../../types';
import DocumentRepository from './documents/DocumentRepository';
import DocumentUpload from './documents/DocumentUpload';
import PendingSignatures from './documents/PendingSignatures';
import DocumentConfig from './documents/DocumentConfig';
import AuditLogs from './admin/AuditLogs'; // Reuse Audit Logs

interface DocumentsModuleProps {
  onBack: () => void;
}

const INITIAL_FILES: DocumentFile[] = [
  { id: '1', name: 'Prontuário 12345.pdf', type: 'PDF', category: 'Prontuários', size: '2.4 MB', uploadDate: '10/05/2024', author: 'Dr. Silva', status: 'signed', version: '1.2', tags: ['Cardiologia'] },
  { id: '2', name: 'Raio-X Torax.dcm', type: 'DICOM', category: 'Exames', size: '15 MB', uploadDate: '09/05/2024', author: 'Tec. Santos', status: 'signed', version: '1.0', tags: ['Radiologia', 'Urgência'] },
  { id: '3', name: 'Laudo de Alta.docx', type: 'DOCX', category: 'Laudos', size: '450 KB', uploadDate: '08/05/2024', author: 'Dr. Roberto', status: 'pending', version: '0.9', tags: [] },
  { id: '4', name: 'Protocolo de Sepse.pdf', type: 'PDF', category: 'Protocolos', size: '1.1 MB', uploadDate: '01/01/2024', author: 'Comissão CCIH', status: 'signed', version: '2.0', tags: ['Institucional'] },
  { id: '5', name: 'Hemograma Completo.pdf', type: 'PDF', category: 'Exames', size: '200 KB', uploadDate: '11/05/2024', author: 'Laboratório', status: 'signed', version: '1.0', tags: ['Laboratório'] },
];

const DocumentsCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: string; 
  onClick: () => void 
}> = ({ title, description, icon, onClick }) => {
  const IconComponent = Icons[icon] || Icons.FileText;

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-red-500 transition-colors duration-300" />
      
      <div className="mb-4">
        <div className="inline-flex p-3 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-200 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4 flex-grow">
        {description}
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400 font-medium group-hover:text-red-500 transition-colors">
        <span>Acessar</span>
        <Icons.ChevronLeft className="w-4 h-4 ml-2 transform rotate-180 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const DocumentsModule: React.FC<DocumentsModuleProps> = ({ onBack }) => {
  const [activePage, setActivePage] = useState<DocumentPage | null>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_FILES);

  const handleAddDocuments = (newDocs: DocumentFile[]) => {
    setDocuments(prev => [...newDocs, ...prev]);
    // Switch to repository view to see the new files
    setTimeout(() => setActivePage('repository'), 500);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const DOC_ITEMS: { id: DocumentPage; label: string; description: string; icon: string }[] = [
    { id: 'repository', label: 'Repositório Central', description: 'Busca avançada, filtros e visualização de todos os arquivos.', icon: 'Folder' },
    { id: 'upload', label: 'Upload & Digitalização', description: 'Envio de arquivos, digitalização OCR e importação de DICOM.', icon: 'UploadCloud' },
    { id: 'signatures', label: 'Assinaturas Digitais', description: 'Central de assinaturas pendentes (e-CPF/CRM) e validação.', icon: 'PenTool' },
    { id: 'config', label: 'Políticas & Retenção', description: 'Configuração de prazos, categorias e segurança.', icon: 'Sliders' },
    { id: 'audit', label: 'Auditoria de Acessos', description: 'Logs de downloads, visualizações e compartilhamentos.', icon: 'Shield' },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'repository': return <DocumentRepository documents={documents} onDelete={handleDeleteDocument} />;
      case 'upload': return <DocumentUpload onUploadSuccess={handleAddDocuments} />;
      case 'signatures': return <PendingSignatures />;
      case 'config': return <DocumentConfig />;
      case 'audit': return <AuditLogs />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button 
            onClick={() => activePage ? setActivePage(null) : onBack()}
            className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium mb-2"
          >
            <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-red-200 shadow-sm transition-colors">
               <Icons.ArrowLeft className="w-4 h-4" />
            </div>
            {activePage ? 'Voltar ao Menu de Documentos' : 'Voltar ao Dashboard Principal'}
          </button>
          
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-600 rounded-lg text-white shadow-md">
                <Icons.FileText className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activePage ? DOC_ITEMS.find(i => i.id === activePage)?.label : 'Gestão de Documentos (GED)'}
                </h1>
                <p className="text-gray-500 text-sm">
                  {activePage ? 'Gerencie os arquivos e processos documentais.' : 'Repositório centralizado, seguro e inteligente.'}
                </p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        {activePage ? (
          <div className="animate-fade-in">
             {renderContent()}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {DOC_ITEMS.map((item) => (
              <DocumentsCard 
                key={item.id}
                title={item.label}
                description={item.description}
                icon={item.icon}
                onClick={() => setActivePage(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsModule;
