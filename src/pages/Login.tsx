import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Login: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(customerId);
      if (res.success) {
        localStorage.setItem('token', res.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel login-view">
      <h2 className="view-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">CustomerId</label>
          <input
            type="text"
            className="input-field"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
          {error && <div className="error-text">{error}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading || !customerId.trim()}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
