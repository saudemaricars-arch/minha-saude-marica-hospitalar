
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icons, HEALTH_UNITS, MASTER_UNIT } from '../constants';
import { HealthUnit } from '../types';

interface LoginProps {
  onLogin: (unit: HealthUnit) => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [selectedUnitId, setSelectedUnitId] = useState(''); // Removed manual selection
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState<HealthUnit[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const { data, error } = await supabase
          .from('health_units')
          .select('*');

        if (error) {
          console.error('Error fetching units:', error);
          // Fallback to mock data if DB fails
          setUnits(HEALTH_UNITS);
        } else if (data) {
          // Append Master Unit manually since it's not in DB
          setUnits([...data, MASTER_UNIT]);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setUnits([...HEALTH_UNITS, MASTER_UNIT]);
      }
    };

    fetchUnits();
  }, []);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Check for Master Super Admin (CPF: 00000000000)
      // 1. Check for Master Super Admin (CPF: 00000000000) OR General Manager (CPF: 99999999999)
      if ((username === '00000000000' && password === 'admin123') || (username === '99999999999' && password === 'gerente123')) {
        onLogin(MASTER_UNIT);
        return;
      }

      // 2. Query 'profiles' table to find the user's unit
      // We search globally by email/name (username)
      const { data: profiles, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.eq.${username},name.eq.${username}`);

      if (dbError) throw dbError;

      if (profiles && profiles.length > 0) {
        // SUCCESS - User found
        const userProfile = profiles[0];

        // 3. Find the unit they belong to
        const userUnitId = userProfile.unit_id;

        // Check if unit exists in our loaded list
        // Note: fetchUnits() already ran on mount so 'units' should be populated.
        // However, if we just fetched, we might not have the Master unit or others if DB failed.
        // Real-world: we should query health_units by ID if not found in list.

        // Find in local state
        let unit = units.find(u => u.id === userUnitId);

        // 4. If not found in local state (unexpected but possible), fetch it specifically
        if (!unit) {
          const { data: unitData } = await supabase
            .from('health_units')
            .select('*')
            .eq('id', userUnitId)
            .single();

          if (unitData) unit = unitData;
        }

        if (unit) {
          onLogin(unit);
        } else {
          // Edge case: Profile exists but unit_id is invalid or unit deleted
          setError('Unidade vinculada ao usuário não encontrada.');
        }

      } else {
        setError('Usuário não encontrado ou credenciais inválidas.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao processar login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white animate-fade-in">
      {/* Left Branding Side */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-red-600 to-red-800 flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 L0 100 Z" fill="white" />
          </svg>
        </div>

        <div className="z-10 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="mb-6">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/excel-insights-n8l3f.firebasestorage.app/o/Logos%20Minha%20Sa%C3%BAde%20Maric%C3%A1_Logo%20Branca.png?alt=media&token=60f7743f-c437-40ef-8246-5012a66df59a"
              alt="Minha Saúde Maricá"
              className="h-32 md:h-40 w-auto object-contain"
            />
          </div>
          <p className="text-red-100 text-lg max-w-md text-center md:text-left">
            Gestão hospitalar integrada e multifilial.
            Acesse sua unidade de saúde com segurança.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h2>
            <p className="text-gray-500">Entre com suas credenciais para acessar o sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Unit Selection REMOVED */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Icons.Users className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    // Simple mask for CPF (just numbers for now or you can add a real mask)
                    const val = e.target.value.replace(/\D/g, '');
                    setUsername(val);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="000.000.000-00"
                  maxLength={11}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Icons.Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input type="checkbox" className="mr-2 text-red-600 focus:ring-red-500 rounded" />
                Lembrar-me
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                'Acessar Unidade'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Minha Saúde Maricá. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
