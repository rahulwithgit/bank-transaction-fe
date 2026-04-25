import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { hashString } from '../utils/crypto';

export const Login: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [customerId, setCustomerId] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.requestOtp(customerId);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Hash the OTP from the frontend side as requested
      const hashedOtp = await hashString(otp);
      console.log('Frontend generated OTP Hash:', hashedOtp);

      const res = await api.login(customerId, hashedOtp);
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('customerId', customerId);
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
      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <div className="input-group">
            <label className="input-label">CustomerId</label>
            <input
              type="text"
              className="input-field"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter your Customer ID"
              required
            />
            {error && <div className="error-text">{error}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading || !customerId.trim()}>
            {loading ? 'Sending OTP...' : 'Next'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="input-group">
            <label className="input-label">Enter OTP</label>
            <div className="input-wrapper">
              <input
                type={showOtp ? "text" : "password"}
                className="input-field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your mobile"
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button"
                className="input-icon-btn"
                onClick={() => setShowOtp(!showOtp)}
                aria-label={showOtp ? "Hide OTP" : "Show OTP"}
              >
                {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <div className="error-text">{error}</div>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-outline w-full" onClick={() => setStep(1)} disabled={loading}>
              Back
            </button>
            <button type="submit" className="btn btn-primary w-full" disabled={loading || !otp.trim()}>
              {loading ? 'Verifying...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
