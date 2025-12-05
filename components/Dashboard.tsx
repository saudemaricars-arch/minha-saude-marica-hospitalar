
import React, { useState, useEffect } from 'react';
import { Icons, MODULES_DATA, HEALTH_UNITS } from '../constants';
import { supabase } from '../services/supabaseClient';
import ModuleCard from './ModuleCard';
import { searchModulesWithAI } from '../services/geminiService';
import { HealthUnit } from '../types';
import AdminModule from './modules/AdminModule';
import DocumentsModule from './modules/DocumentsModule';
// Generic EmergencyModule removed
import EmergencyPanelPage from './modules/emergency/EmergencyPanelPage';
import EmergencyRegistrationPage from './modules/emergency/EmergencyRegistrationPage';
import FleetManagementPage from './modules/emergency/FleetManagementPage';
import DispatchPage from './modules/emergency/DispatchPage';
import PrioritizationModule from './modules/clinical/PrioritizationModule';
import BedManagementModule from './modules/BedManagementModule';
import AuthorizationModule from './modules/AuthorizationModule';
import ClinicalCensusModule from './modules/ClinicalCensusModule';
import ClinicalDischargeModule from './modules/ClinicalDischargeModule';
import SinanModule from './modules/monitoring/SinanModule';
import AgravosModule from './modules/monitoring/AgravosModule';
import TuberculoseModule from './modules/monitoring/TuberculoseModule';
import ViolenciaModule from './modules/monitoring/ViolenciaModule';
import AdminIndicatorsModule from './modules/AdminIndicatorsModule';
import NeonatalScreeningModule from './modules/clinical/NeonatalScreeningModule';
import MaternityVisitModule from './modules/clinical/MaternityVisitModule';
import VaccinationModule from './modules/clinical/VaccinationModule';
import MultidisciplinaryScheduleModule from './modules/clinical/MultidisciplinaryScheduleModule';
import MasterAnalysisModule from './modules/MasterAnalysisModule';
import MasterUnitMonitor from './modules/MasterUnitMonitor';
import UserSettings from './UserSettings';

interface DashboardProps {
  onLogout: () => void;
  currentUnit: HealthUnit;
  onSwitchUnit: (unit: HealthUnit) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, currentUnit, onSwitchUnit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'admin' | 'clinical' | 'emergency'>('all');
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Guard clause: If currentUnit is missing, don't render anything (or show loading)
  if (!currentUnit) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const filteredModules = MODULES_DATA.filter(m => {
    // 1. Accessibility Control
    const isMasterUser = currentUnit.id === 'master' || currentUnit.id === '00000000-0000-0000-0000-000000000000';

    // STRICT MASTER FILTERING: Master only sees 'master_analysis' modules
    if (isMasterUser) {
      return m.category === 'master_analysis';
    }

    // STRICT REGULAR FILTERING: Regular users NEVER see 'master_analysis' modules
    if (m.category === 'master_analysis') return false;

    // 2. Filter Logic
    const matchesFilter = activeFilter === 'all' || m.category === activeFilter;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGlobalSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    const response = await searchModulesWithAI(searchTerm);
    setAiResponse(response);
    setIsSearching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGlobalSearch();
    }
  };

  const handleModuleClick = (moduleId: string) => {
    // Whitelist active modules
    const whitelist = ['1', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
    // Allow master unit modules (dynamic IDs starting with master_unit_)
    const isMasterModule = moduleId.startsWith('master_unit_');

    if (whitelist.includes(moduleId) || isMasterModule) {
      setActiveModuleId(moduleId);
      setShowSettings(false); // Ensure settings is closed when module opens
    } else {
      alert("Módulo em desenvolvimento. Por favor, acesse os módulos principais já implementados.");
    }
  };

  // Helper to determine user display name
  const isMasterUser = currentUnit.id === 'master' || currentUnit.id === '00000000-0000-0000-0000-000000000000';
  const userDisplayName = isMasterUser ? 'Gestor Central' : 'Dr. Silva';
  const userDisplayRole = isMasterUser ? 'Secretaria de Saúde' : 'Diretor Clínico';
  const userInitials = isMasterUser ? 'GC' : 'DS';

  // State for real-time dashboard stats
  const [stats, setStats] = useState({
    activePatients: 0,
    occupiedBeds: 0,
    waitingTriage: 0,
    ambulancesAvailable: 0
  });

  useEffect(() => {
    if (!currentUnit || !currentUnit.id) return;

    const fetchDashboardStats = async () => {
      try {
        console.log('Fetching dashboard stats for unit:', currentUnit.id);

        // 1. Active Patients (Emergency Visits not discharged)
        // 1. Active Patients (Emergency Visits not discharged)
        let visitedQuery = supabase
          .from('emergency_visits')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'alta');

        // Only filter by unit if NOT master
        if (currentUnit.id !== 'master' && currentUnit.id !== '00000000-0000-0000-0000-000000000000') {
          visitedQuery = visitedQuery.eq('unit_id', currentUnit.id);
        }

        const { count: patientCount, error: patientError } = await visitedQuery;

        if (patientError) console.error('Error fetching patients:', patientError);

        // 2. Occupied Beds
        // 2. Occupied Beds
        let bedsQuery = supabase
          .from('beds')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ocupado');

        if (currentUnit.id !== 'master' && currentUnit.id !== '00000000-0000-0000-0000-000000000000') {
          bedsQuery = bedsQuery.eq('unit_id', currentUnit.id);
        }

        const { count: bedCount, error: bedError } = await bedsQuery;

        if (bedError) console.error('Error fetching beds:', bedError);

        // 3. Waiting Triage
        // 3. Waiting Triage
        let triageQuery = supabase
          .from('emergency_visits')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aguardando_triagem');

        if (currentUnit.id !== 'master' && currentUnit.id !== '00000000-0000-0000-0000-000000000000') {
          triageQuery = triageQuery.eq('unit_id', currentUnit.id);
        }

        const { count: triageCount, error: triageError } = await triageQuery;

        if (triageError) console.error('Error fetching triage:', triageError);

        // 4. Available Ambulances
        const { count: ambulanceCount, error: ambulanceError } = await supabase
          .from('ambulances')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'disponivel');

        if (ambulanceError) console.error('Error fetching ambulances:', ambulanceError);

        setStats({
          activePatients: patientCount || 0,
          occupiedBeds: bedCount || 0,
          waitingTriage: triageCount || 0,
          ambulancesAvailable: ambulanceCount || 0
        });
      } catch (error) {
        console.error('CRITICAL Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();

    // Optional: Set up realtime subscription here if desired

  }, [currentUnit.id]);

  // Helper to render active module container
  const renderActiveModule = () => {
    if (activeModuleId === '1') return <AdminModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '3') return <DocumentsModule onBack={() => setActiveModuleId(null)} />;
    // Specific Emergency Pages
    if (activeModuleId === '4') return <EmergencyPanelPage onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '5') return <EmergencyRegistrationPage onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '7') return <FleetManagementPage onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '8') return <DispatchPage onBack={() => setActiveModuleId(null)} />;

    if (activeModuleId === '6') return <PrioritizationModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '9') return <BedManagementModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '10') return <AuthorizationModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '11') return <ClinicalCensusModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '12') return <ClinicalDischargeModule onBack={() => setActiveModuleId(null)} />;
    // Independent Monitoring Modules
    if (activeModuleId === '13') return <SinanModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '14') return <AgravosModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '15') return <TuberculoseModule onBack={() => setActiveModuleId(null)} />;
    if (activeModuleId === '16') return <ViolenciaModule onBack={() => setActiveModuleId(null)} />;
    // Indicator Module
    if (activeModuleId === '17') return <AdminIndicatorsModule onBack={() => setActiveModuleId(null)} />;
    // Neonatal Screening
    if (activeModuleId === '18') return <NeonatalScreeningModule onBack={() => setActiveModuleId(null)} />;
    // Vaccination
    if (activeModuleId === '19') return <VaccinationModule onBack={() => setActiveModuleId(null)} />;
    // Maternity Visit
    if (activeModuleId === '20') return <MaternityVisitModule onBack={() => setActiveModuleId(null)} />;
    // Multidisciplinary Schedule
    if (activeModuleId === '21') return <MultidisciplinaryScheduleModule onBack={() => setActiveModuleId(null)} />;
    // Master Analysis (Global) - Removed
    // if (activeModuleId === '99') return <MasterAnalysisModule onBack={() => setActiveModuleId(null)} />;

    // Master Unit Analysis (Dynamic)
    if (activeModuleId.startsWith('master_unit_')) {
      // Extract unit ID from module ID (e.g. 'master_unit_1' -> '1')
      const targetUnitId = activeModuleId.replace('master_unit_', '');
      const targetUnit = HEALTH_UNITS.find(u => u.id === targetUnitId);

      if (targetUnit) {
        return <MasterUnitMonitor unit={targetUnit} onBack={() => setActiveModuleId(null)} />;
      }
    }

    return null;
  };

  // If settings is active, render UserSettings
  if (showSettings) {
    return <UserSettings onBack={() => setShowSettings(false)} />;
  }

  // If a module is active, render it instead of the dashboard grid
  if (activeModuleId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 rounded-md shadow-sm">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/excel-insights-n8l3f.firebasestorage.app/o/Logos%20Minha%20Sa%C3%BAde%20Maric%C3%A1_Logo%20Branca.png?alt=media&token=60f7743f-c437-40ef-8246-5012a66df59a"
                  alt="Minha Saúde Maricá"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <div className={`h-6 w-px hidden md:block ${currentUnit.id === 'master' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
              <div className={`text-sm font-medium hidden md:block ${currentUnit.id === 'master' ? 'text-red-700 font-bold' : 'text-gray-600'}`}>
                {currentUnit.name}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => { setActiveModuleId(null); setShowSettings(true); }} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-lg transition-colors group">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors">{userDisplayName}</p>
                  <p className="text-xs text-gray-500">{userDisplayRole}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold border-2 border-transparent group-hover:border-red-200">
                  {userInitials}
                </div>
              </button>
            </div>
          </div>
        </header>

        {renderActiveModule()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo & Unit Selector */}
          <div className="flex items-center gap-4">
            {/* Logo Wrapper */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-md shadow-md flex items-center justify-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/excel-insights-n8l3f.firebasestorage.app/o/Logos%20Minha%20Sa%C3%BAde%20Maric%C3%A1_Logo%20Branca.png?alt=media&token=60f7743f-c437-40ef-8246-5012a66df59a"
                alt="Minha Saúde Maricá"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="h-8 w-px bg-gray-300 hidden md:block"></div>

            {/* Unit Dropdown - Only for Master */}
            <div className="relative">
              {/* 
                  Check if user is master (either 'master' ID or the specific UUID).
                  Only Master can switch units.
                */}
              {(() => {
                const isMaster = currentUnit.id === 'master' || currentUnit.id === '00000000-0000-0000-0000-000000000000';
                return (
                  <>
                    <button
                      onClick={() => isMaster && setShowUnitMenu(!showUnitMenu)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-gray-700 text-sm font-medium border border-transparent 
                          ${isMaster ? 'hover:bg-gray-100 hover:border-gray-200 cursor-pointer' : 'cursor-default opacity-90'}`}
                    >
                      <Icons.Building className="w-4 h-4 text-red-600" />
                      <span className="max-w-[150px] truncate">{currentUnit.name}</span>
                      {isMaster && <Icons.ChevronDown className="w-3 h-3 text-gray-400" />}
                    </button>

                    {showUnitMenu && isMaster && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                          Trocar Unidade
                        </div>
                        {HEALTH_UNITS.map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() => {
                              onSwitchUnit(unit);
                              setShowUnitMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${currentUnit.id === unit.id ? 'text-red-600 bg-red-50 font-medium' : 'text-gray-700'
                              }`}
                          >
                            {unit.name}
                            {currentUnit.id === unit.id && <Icons.Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-xl mx-4 lg:mx-8 hidden sm:block">
              <div className="relative group">
                <span className="absolute left-4 top-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                  <Icons.Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Busque por módulos ou use IA..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleGlobalSearch}
                  className="absolute right-2 top-2 bg-white p-1 rounded-full shadow-sm hover:text-red-600 text-gray-400 transition-colors"
                  title="Pesquisar com IA"
                >
                  {isSearching ? <span className="animate-spin block h-3 w-3 border-2 border-red-600 rounded-full border-t-transparent"></span> : <Icons.Search className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-red-600 transition-colors">
                <Icons.Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-all cursor-pointer group"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors">{userDisplayName}</p>
                  <p className="text-xs text-gray-500">{userDisplayRole}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 border-2 border-white shadow-sm flex items-center justify-center text-red-700 font-bold overflow-hidden group-hover:border-red-200">
                  {/* Use text initials if no image, or a generic avatar */}
                  <span className="text-sm">{userInitials}</span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors ml-2"
                title="Sair"
              >
                <Icons.LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Visualizando dados de:
              <span className={`font-semibold px-2 py-0.5 rounded text-sm border ${currentUnit.id === 'master' ? 'text-white bg-red-600 border-red-700' : 'text-red-600 bg-red-50 border-red-100'}`}>
                {currentUnit.name}
              </span>
            </p>
          </div>
          <div className="text-sm text-gray-400">
            Última atualização: Hoje, 08:30
          </div>
        </div>

        {/* AI Response Area */}
        {
          aiResponse && (
            <div className="mb-8 bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-100 shadow-sm flex items-start gap-4 animate-fade-in">
              <div className="bg-red-100 p-2 rounded-full text-red-600 flex-shrink-0">
                <Icons.Activity className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Resposta do Assistente Inteligente</h4>
                <p className="text-gray-800">{aiResponse}</p>
                <button
                  onClick={() => setAiResponse(null)}
                  className="text-xs text-red-500 mt-2 hover:underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          )
        }

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pacientes Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.activePatients || 0}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <Icons.Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Leitos Ocupados</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.occupiedBeds || 0}</h3>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-red-600">
              <Icons.Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Aguardando Triagem</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.waitingTriage || 0}</h3>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600">
              <Icons.ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Ambulâncias Disp.</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.ambulancesAvailable || 0}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-green-600">
              <Icons.Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'Todos os Módulos' },
            { id: 'clinical', label: 'Clínico & Assistencial' },
            { id: 'emergency', label: 'Urgência & Emergência' },
            { id: 'monitoring', label: 'Vigilância & Monitoramento' },
            { id: 'admin', label: 'Administrativo' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => handleModuleClick(module.id)}
            />
          ))}
          {filteredModules.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              <Icons.Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum módulo encontrado para os filtros atuais.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
