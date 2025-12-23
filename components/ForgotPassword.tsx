
import React, { useState } from 'react';
import { Icons } from '../constants';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
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
          <h2 className="text-2xl font-bold mb-2">Recuperação de Acesso</h2>
          <p className="text-red-100 text-lg max-w-md text-center md:text-left">
            Esqueceu sua senha? Não se preocupe, vamos ajudá-lo a retomar o acesso ao sistema.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        <button 
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
        >
            <Icons.ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </button>

        <div className="w-full max-w-md">
          {!isSent ? (
            <>
                <div className="mb-8 text-center md:text-left">
                    <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
                        <Icons.Key className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Redefinir Senha</h2>
                    <p className="text-gray-500">Informe seu e-mail institucional ou CPF para receber o link de redefinição.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail ou CPF</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                        <Icons.Mail className="w-5 h-5" />
                        </span>
                        <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="ex: nome.sobrenome@saude.marica.gov.br"
                        />
                    </div>
                    </div>

                    <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                    {isLoading ? (
                        <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        'Enviar Link de Recuperação'
                    )}
                    </button>
                </form>
            </>
          ) : (
            <div className="text-center animate-fade-in">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Icons.CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu E-mail</h2>
                <p className="text-gray-500 mb-8">
                    Enviamos as instruções de recuperação para: <br/>
                    <span className="font-bold text-gray-800">{email}</span>
                </p>
                
                <div className="space-y-3">
                    <button 
                        onClick={onBack}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg shadow transition-colors"
                    >
                        Voltar para Login
                    </button>
                    <button 
                        onClick={() => setIsSent(false)}
                        className="w-full text-red-600 hover:text-red-700 font-medium py-2 text-sm hover:underline"
                    >
                        Tentar outro e-mail
                    </button>
                </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-gray-400">
            Precisa de ajuda? Contate o suporte de TI: (21) 3731-0000
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
