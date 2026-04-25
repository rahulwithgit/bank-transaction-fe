import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">HCL Bank</div>
        {localStorage.getItem('token') && (
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        )}
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
