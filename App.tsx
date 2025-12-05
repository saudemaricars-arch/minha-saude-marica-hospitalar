
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import { HealthUnit } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot_password' | 'dashboard'>('login');
  const [currentUnit, setCurrentUnit] = useState<HealthUnit | null>(null);

  const handleLogin = (selectedUnit: HealthUnit) => {
    setCurrentUnit(selectedUnit);
    setView('dashboard');
  };

  const handleLogout = () => {
    setView('login');
    setCurrentUnit(null);
  };

  const handleSwitchUnit = (newUnit: HealthUnit) => {
    setCurrentUnit(newUnit);
  };

  // Render Logic
  if (view === 'dashboard' && currentUnit) {
    return (
      <Dashboard 
        currentUnit={currentUnit} 
        onLogout={handleLogout} 
        onSwitchUnit={handleSwitchUnit}
      />
    );
  }

  if (view === 'forgot_password') {
    return (
      <ForgotPassword onBack={() => setView('login')} />
    );
  }

  // Default: Login View
  return (
    <Login 
      onLogin={handleLogin} 
      onForgotPassword={() => setView('forgot_password')} 
    />
  );
};

export default App;
