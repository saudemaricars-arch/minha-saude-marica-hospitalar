
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import { HealthUnit } from './types';

const APP_SESSION_KEY = 'minha_saude_user_session';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot_password' | 'dashboard'>('login');
  const [currentUnit, setCurrentUnit] = useState<HealthUnit | null>(null);

  // Restore session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(APP_SESSION_KEY);
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        if (parsedSession && parsedSession.unit) {
          setCurrentUnit(parsedSession.unit);
          setView('dashboard');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem(APP_SESSION_KEY);
      }
    }
  }, []);

  const handleLogin = (selectedUnit: HealthUnit) => {
    setCurrentUnit(selectedUnit);
    setView('dashboard');
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify({ unit: selectedUnit }));
  };

  const handleLogout = () => {
    setView('login');
    setCurrentUnit(null);
    localStorage.removeItem(APP_SESSION_KEY);
  };

  const handleSwitchUnit = (newUnit: HealthUnit) => {
    setCurrentUnit(newUnit);
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify({ unit: newUnit }));
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
