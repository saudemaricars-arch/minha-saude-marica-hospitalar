
import React, { useState, useRef } from 'react';
import { Icons } from '../../../constants';
import { DocumentFile } from '../../../types';

interface PendingUpload {
    file: File;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    progress: number;
}

interface DocumentUploadProps {
    onUploadSuccess: (files: DocumentFile[]) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingUpload[]>([]);
  const [metadata, setMetadata] = useState({ category: '', patient: '', tags: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
      const newFiles = files.map(file => ({ file, status: 'pending', progress: 0 } as PendingUpload));
      setPendingFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
      setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
      if (pendingFiles.length === 0) return;
      if (!metadata.category) {
          alert("Por favor, selecione uma categoria para os documentos.");
          return;
      }

      setPendingFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })));

      // Simulate Upload Process
      let progress = 0;
      const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 20) + 5;
          if (progress >= 100) {
              clearInterval(interval);
              setPendingFiles(prev => prev.map(f => ({ ...f, status: 'completed', progress: 100 })));
              
              // Create DocumentFile objects
              const newDocuments: DocumentFile[] = pendingFiles.map(pf => {
                  let fileType: DocumentFile['type'] = 'PDF';
                  const ext = pf.file.name.split('.').pop()?.toLowerCase();
                  if (ext === 'docx' || ext === 'doc') fileType = 'DOCX';
                  else if (ext === 'dcm') fileType = 'DICOM';
                  else if (ext === 'jpg' || ext === 'png') fileType = 'JPG';
                  else if (ext === 'xlsx') fileType = 'XLSX';

                  return {
                      id: Math.random().toString(36).substr(2, 9),
                      name: pf.file.name,
                      type: fileType,
                      category: metadata.category,
                      size: (pf.file.size / 1024 / 1024).toFixed(2) + ' MB',
                      uploadDate: new Date().toLocaleDateString('pt-BR'),
                      author: 'Dr. Silva', // Mock user
                      status: 'pending',
                      version: '1.0',
                      tags: metadata.tags ? metadata.tags.split(',').map(t => t.trim()) : [],
                      patientName: metadata.patient
                  };
              });

              setTimeout(() => {
                  alert("Upload concluído com sucesso!");
                  onUploadSuccess(newDocuments);
              }, 500);

          } else {
              setPendingFiles(prev => prev.map(f => ({ ...f, progress: Math.min(progress, 99) })));
          }
      }, 300);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pb-10">
       <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-gray-800">Upload de Documentos</h2>
           <p className="text-gray-500 text-sm">Arraste arquivos ou clique para selecionar. Formatos aceitos: PDF, DICOM, DOCX.</p>
       </div>

       <div 
         onDragEnter={handleDrag} 
         onDragLeave={handleDrag} 
         onDragOver={handleDrag} 
         onDrop={handleDrop}
         onClick={() => inputRef.current?.click()}
         className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${dragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 bg-white'}`}
       >
           <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} accept=".pdf,.docx,.doc,.jpg,.png,.dcm" />
           <div className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 ${dragActive ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-600'}`}>
               <Icons.UploadCloud className="w-8 h-8" />
           </div>
           <p className="text-lg font-medium text-gray-700 mb-2">Arraste e solte seus arquivos aqui</p>
           <p className="text-sm text-gray-400 mb-6">ou clique para navegar em suas pastas</p>
           <button className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition-all pointer-events-none">
               Selecionar Arquivos
           </button>
       </div>

       {pendingFiles.length > 0 && (
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 text-sm">
                   Arquivos Selecionados ({pendingFiles.length})
               </div>
               <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                   {pendingFiles.map((item, idx) => (
                       <div key={idx} className="p-4 flex items-center justify-between">
                           <div className="flex items-center gap-3 flex-1">
                               <Icons.FileText className="w-8 h-8 text-gray-400" />
                               <div className="flex-1 min-w-0">
                                   <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
                                   <p className="text-xs text-gray-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                   {item.status !== 'pending' && (
                                       <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                           <div 
                                                className={`h-full transition-all duration-300 ${item.status === 'completed' ? 'bg-green-500' : item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${item.progress}%` }}
                                           ></div>
                                       </div>
                                   )}
                               </div>
                           </div>
                           <div className="ml-4">
                               {item.status === 'completed' ? (
                                   <Icons.CheckCircle className="w-5 h-5 text-green-500" />
                               ) : (
                                   <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }} className="text-gray-400 hover:text-red-500">
                                       <Icons.Trash className="w-5 h-5" />
                                   </button>
                               )}
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       )}

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <Icons.Sliders className="w-4 h-4" /> Metadados Obrigatórios
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Categoria do Documento <span className="text-red-500">*</span></label>
                   <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        value={metadata.category}
                        onChange={e => setMetadata({...metadata, category: e.target.value})}
                   >
                       <option value="">Selecione...</option>
                       <option value="Prontuário">Prontuário</option>
                       <option value="Exame">Exame</option>
                       <option value="Laudo">Laudo</option>
                       <option value="Administrativo">Administrativo</option>
                   </select>
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Paciente (Opcional)</label>
                   <input 
                        type="text" 
                        placeholder="Nome ou CPF..." 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        value={metadata.patient}
                        onChange={e => setMetadata({...metadata, patient: e.target.value})}
                   />
               </div>
               <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Separadas por vírgula)</label>
                   <input 
                        type="text" 
                        placeholder="ex: Urgência, Pediatria" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        value={metadata.tags}
                        onChange={e => setMetadata({...metadata, tags: e.target.value})}
                   />
               </div>
               <div className="flex items-center pt-2 md:col-span-2">
                   <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
                       <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                       Solicitar Assinatura Digital após upload
                   </label>
               </div>
           </div>
       </div>

       <div className="flex justify-end pt-4">
           <button 
                onClick={handleUpload}
                disabled={pendingFiles.length === 0 || pendingFiles[0].status !== 'pending'}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
               {pendingFiles.some(f => f.status === 'uploading') ? (
                   <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Enviando...
                   </>
               ) : (
                   <>
                        <Icons.UploadCloud className="w-5 h-5" />
                        Iniciar Upload
                   </>
               )}
           </button>
       </div>
    </div>
  );
};

export default DocumentUpload;
