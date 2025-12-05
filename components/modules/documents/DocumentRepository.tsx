
import React, { useState } from 'react';
import { Icons } from '../../../constants';
import { DocumentFile } from '../../../types';

interface DocumentRepositoryProps {
  documents: DocumentFile[];
  onDelete: (id: string) => void;
}

const DocumentRepository: React.FC<DocumentRepositoryProps> = ({ documents, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFile, setViewingFile] = useState<DocumentFile | null>(null);

  // Filter Logic
  const filteredFiles = documents.filter(file => {
    const matchesCategory = selectedCategory === 'Todos' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          file.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Actions
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja mover este arquivo para a lixeira?')) {
      onDelete(id);
    }
  };

  const handleShare = (fileName: string) => {
    alert(`Link de compartilhamento para "${fileName}" copiado para a área de transferência.`);
  };

  const handleDownload = (fileName: string) => {
    alert(`Iniciando download de: ${fileName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       {/* Actions Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Repositório Central</h2>
           <p className="text-gray-500 text-sm">Gerencie, visualize e pesquise documentos de toda a unidade.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
                <Icons.Share2 className="w-4 h-4" />
                Compartilhar Pasta
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorias</h3>
                <ul className="space-y-1">
                    {['Todos', 'Prontuários', 'Exames', 'Laudos', 'Receitas', 'Protocolos', 'Administrativo'].map(cat => (
                        <li key={cat}>
                            <button 
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${selectedCategory === cat ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Icons.Folder className={`w-4 h-4 ${selectedCategory === cat ? 'fill-red-200' : ''}`} />
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
             
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filtros Rápidos</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                        Meus Documentos
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                        Pendentes de Assinatura
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                        Recentes (7 dias)
                    </label>
                </div>
             </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Icons.Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome, paciente, ID ou conteúdo (OCR)..." 
                        className="w-full pl-10 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                    />
                </div>
                <div className="flex items-center gap-2">
                     <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                         <Icons.Filter className="w-5 h-5" />
                     </button>
                </div>
            </div>

            {/* Files List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold w-8">
                                    <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                                </th>
                                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Nome</th>
                                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Categoria</th>
                                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Status</th>
                                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold">Data</th>
                                <th className="px-6 py-4 text-xs uppercase text-gray-500 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFiles.length > 0 ? (
                                filteredFiles.map(file => (
                                    <tr key={file.id} className="hover:bg-gray-50 group transition-colors">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold uppercase border ${
                                                    file.type === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    file.type === 'DOCX' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    file.type === 'DICOM' ? 'bg-gray-800 text-white border-gray-700' :
                                                    'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                    {file.type}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 line-clamp-1 max-w-[180px] sm:max-w-xs">{file.name}</div>
                                                    <div className="text-xs text-gray-500">{file.size} • v{file.version}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {file.category}
                                            {file.tags.length > 0 && (
                                                <div className="flex gap-1 mt-1 flex-wrap">
                                                    {file.tags.map(tag => (
                                                        <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                                file.status === 'signed' ? 'bg-green-100 text-green-800' :
                                                file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {file.status === 'signed' ? 'Assinado' : file.status === 'pending' ? 'Pendente' : file.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {file.uploadDate}
                                            <div className="text-xs text-gray-400">{file.author}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setViewingFile(file)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Visualizar">
                                                    <Icons.Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleShare(file.name)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Compartilhar">
                                                    <Icons.Share2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(file.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <Icons.Folder className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>Nenhum documento encontrado.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      {/* View File Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded">
                            <Icons.FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{viewingFile.name}</h3>
                            <p className="text-xs opacity-70">Visualização Modo Leitura</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleDownload(viewingFile.name)} className="p-2 hover:bg-gray-800 rounded transition-colors text-white/80 hover:text-white" title="Download">
                            <Icons.Download className="w-5 h-5" />
                        </button>
                        <button onClick={() => setViewingFile(null)} className="p-2 hover:bg-gray-800 rounded transition-colors text-white/80 hover:text-white">
                            <Icons.XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-y-auto">
                    {/* Placeholder for PDF/DICOM Viewer */}
                    <div className="bg-white w-full max-w-3xl aspect-[1/1.4] shadow-lg flex flex-col items-center justify-center text-gray-300 border border-gray-200 p-8">
                        <Icons.FileText className="w-24 h-24 mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-400">Pré-visualização do Documento</p>
                        <p className="text-sm mt-2">{viewingFile.name}</p>
                        <p className="text-xs mt-1">Página 1 de 1</p>
                    </div>
                </div>

                <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center text-sm text-gray-500 flex-shrink-0">
                    <span>Enviado por: <strong>{viewingFile.author}</strong> em {viewingFile.uploadDate}</span>
                    <div className="flex gap-2">
                        {viewingFile.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{t}</span>)}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;
