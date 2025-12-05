
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../constants';

const Monitoring: React.FC = () => {
  // Simulate live data
  const [activeUsers, setActiveUsers] = useState(142);
  const [latency, setLatency] = useState(24);
  const [trafficData, setTrafficData] = useState<number[]>([35, 45, 30, 60, 75, 50, 45, 60, 80, 70, 55, 40, 30, 45, 55, 65, 85, 95, 60, 40, 30, 25, 40, 50]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomize users slightly
      setActiveUsers(prev => Math.max(100, Math.min(200, prev + Math.floor(Math.random() * 5) - 2)));
      // Randomize latency
      setLatency(prev => Math.max(10, Math.min(100, prev + Math.floor(Math.random() * 10) - 5)));
      // Shift traffic data
      setTrafficData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 80) + 20];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
               <h2 className="text-2xl font-bold text-gray-800">Monitoramento de Uso</h2>
               <p className="text-gray-500 text-sm">Status em tempo real da infraestrutura e uso do sistema.</p>
           </div>
           <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Atualização em Tempo Real
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Icons.Users className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">+12%</span>
             </div>
             <h3 className="text-2xl font-bold text-gray-900">{activeUsers}</h3>
             <p className="text-sm text-gray-500">Usuários Online Agora</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${latency > 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Icons.Activity className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${latency > 50 ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 bg-gray-100'}`}>
                    {latency > 50 ? 'Lento' : 'Normal'}
                </span>
             </div>
             <h3 className={`text-2xl font-bold ${latency > 50 ? 'text-yellow-600' : 'text-gray-900'}`}>{latency}ms</h3>
             <p className="text-sm text-gray-500">Latência Média</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Icons.Database className="w-5 h-5" /></div>
             </div>
             <h3 className="text-2xl font-bold text-gray-900">45%</h3>
             <p className="text-sm text-gray-500">Uso do Banco de Dados</p>
             <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                 <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Icons.ShieldAlert className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-red-600">3 Alertas</span>
             </div>
             <h3 className="text-2xl font-bold text-gray-900">99.9%</h3>
             <p className="text-sm text-gray-500">Uptime (Últimos 30 dias)</p>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Icons.BarChart2 className="w-5 h-5 text-gray-500" /> Tráfego de Rede (Simulado)
          </h3>
          <div className="h-64 flex justify-between gap-1 px-4">
             {trafficData.map((h, i) => (
                <div key={i} className="w-full h-full bg-red-50 hover:bg-red-100 rounded-t transition-colors relative group flex flex-col justify-end">
                   <div 
                        style={{ height: `${h}%` }} 
                        className="bg-red-500 rounded-t w-full transition-all duration-500 ease-out"
                   ></div>
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                      {h} MB/s
                   </div>
                </div>
             ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2 font-mono">
             <span>00:00</span>
             <span>06:00</span>
             <span>12:00</span>
             <span>18:00</span>
             <span>23:59</span>
          </div>
       </div>
    </div>
  );
};

export default Monitoring;
