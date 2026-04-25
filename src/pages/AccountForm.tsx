import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { validateName, validateIBAN } from '../utils/validators';
import { calculateBankFromIBAN } from '../utils/bank';

export const AccountForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id;
  const stateAccount = location.state as { name: string; iban: string; bank: string } | null;

  const [name, setName] = useState(stateAccount?.name || '');
  const [iban, setIban] = useState(stateAccount?.iban || '');
  const [bank, setBank] = useState(stateAccount?.bank || '');
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isEdit && !stateAccount) {
      api.getAccount(id).then(acc => {
        setName(acc.name);
        setIban(acc.iban);
        setBank(acc.bank);
      }).catch(() => setApiError('Failed to load account'));
    }
  }, [id, isEdit, stateAccount]);

  useEffect(() => {
    try {
      const stripped = iban.replace(/\s/g, '');
      if (stripped.length >= 8) {
        const b = calculateBankFromIBAN(iban);
        setBank(b);
        setErrorString('');
      } else {
        setBank('');
        setErrorString('');
      }
    } catch (err: any) {
      setBank('');
      const stripped = iban.replace(/\s/g, '');
      if (stripped.length >= 8) {
        setErrorString(err.message);
      }
    }
  }, [iban]);

  const handleSave = async () => {
    setApiError('');
    const nameErr = validateName(name);
    const ibanErr = validateIBAN(iban);
    
    if (nameErr) return setErrorString(nameErr);
    if (ibanErr) return setErrorString(ibanErr);
    if (!bank) return setErrorString('Bank does not exist');

    setLoading(true);
    try {
      if (isEdit) {
        await api.updateAccount(id!, { name, iban, bank });
      } else {
        await api.addAccount({ name, iban, bank });
      }
      navigate('/');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (confirm('Are you certain?')) {
      await api.deleteAccount(id!);
      navigate('/');
    }
  }

  return (
    <div className="glass-panel form-view">
      <h2 className="view-title">{isEdit ? 'Edit favorite account' : 'Add favorite account'}</h2>
      {apiError && <div className="error-text mb-4" style={{ fontSize: '1rem', textAlign: 'center' }}>{apiError}</div>}
      
      <div className="input-group">
        <label className="input-label">Account name</label>
        <input 
          className="input-field" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="E.g. Bridge Foundation"
        />
      </div>

      <div className="input-group">
        <label className="input-label">IBAN/Account number</label>
        <input 
          className="input-field" 
          type="text" 
          value={iban} 
          onChange={(e) => setIban(e.target.value)} 
          placeholder="ES50..."
        />
      </div>

      <div className="input-group">
        <label className="input-label">Bank</label>
        <input 
          className="input-field" 
          type="text" 
          value={bank} 
          disabled
        />
      </div>

      {errorString && <div className="error-text mb-4" style={{ textAlign: 'center' }}>{errorString}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
        <button 
          className="btn btn-primary w-full" 
          onClick={handleSave} 
          disabled={loading || !!errorString || !name || !iban || !bank}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {isEdit && (
          <button className="btn btn-danger w-full" onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        )}
        <button className="btn btn-outline w-full" onClick={() => navigate('/')} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};
