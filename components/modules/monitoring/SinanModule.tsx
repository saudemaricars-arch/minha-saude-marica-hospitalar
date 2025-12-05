
import React, { useState } from 'react';
import { Icons, MOCK_SINAN } from '../../../constants';
import { SinanNumber } from '../../../types';

interface SinanModuleProps {
  onBack: () => void;
}

const SinanModule: React.FC<SinanModuleProps> = ({ onBack }) => {
  const [numbers, setNumbers] = useState<SinanNumber[]>(MOCK_SINAN);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBatch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const lastNumber = parseInt(numbers[numbers.length - 1]?.number || '2024000000');
      const newBatch: SinanNumber[] = Array.from({ length: 10 }).map((_, i) => ({
        id: `gen-${Date.now()}-${i}`,
        number: (lastNumber + i + 1).toString(),
        year: 2024,
        status: 'disponivel',
      }));
      
      setNumbers(prev => [...prev, ...newBatch]);
      setIsGenerating(false);
      alert('Lote de 10 números gerado com sucesso!');
    }, 1500);
  };

  const handleCancelNumber = (id: string) => {
    if(confirm('Tem certeza que deseja cancelar este número? Esta ação é irreversível e deve ser justificada.')) {
        setNumbers(prev => prev.map(n => n.id === id ? { ...n, status: 'cancelado' } : n));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors text-sm font-medium mb-2"
            >
                <div className="p-1 rounded-full bg-white border border-gray-200 group-hover:border-orange-200 shadow-sm transition-colors">
                <Icons.ArrowLeft className="w-4 h-4" />
                </div>
                Voltar ao Menu Principal
            </button>
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg text-white shadow-md">
                    <Icons.ListOrdered className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    Controle de Numeração SINAN
                    </h1>
                    <p className="text-gray-500 text-sm">
                    Gestão centralizada de faixas numéricas para notificação compulsória.
                    </p>
                </div>
            </div>
          </div>

          <button 
            onClick={handleGenerateBatch}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 font-bold text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
             {isGenerating ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : <Icons.PlusCircle className="w-4 h-4" />}
             Gerar Novo Lote (10)
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-xs font-bold uppercase">Disponíveis</p>
                <p className="text-3xl font-bold text-green-600">{numbers.filter(n => n.status === 'disponivel').length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-xs font-bold uppercase">Utilizados</p>
                <p className="text-3xl font-bold text-blue-600">{numbers.filter(n => n.status === 'utilizado').length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-xs font-bold uppercase">Cancelados</p>
                <p className="text-3xl font-bold text-red-600">{numbers.filter(n => n.status === 'cancelado').length}</p>
            </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <Icons.Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar número ou paciente..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Numeração</th>
                        <th className="px-6 py-4">Ano</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Utilização</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {numbers.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono font-medium text-gray-800">{item.number}</td>
                            <td className="px-6 py-4 text-gray-600">{item.year}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                    item.status === 'utilizado' ? 'bg-blue-100 text-blue-700' :
                                    item.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                                {item.status === 'utilizado' ? (
                                    <div>
                                        <p className="font-bold text-gray-700">{item.patientName}</p>
                                        <p>{item.disease} • {item.generatedAt}</p>
                                    </div>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {item.status === 'disponivel' && (
                                    <button 
                                        onClick={() => handleCancelNumber(item.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-bold uppercase hover:underline"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SinanModule;
