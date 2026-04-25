import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Account } from '../types';

export const AccountsList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAccounts = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await api.getAccounts(currentPage, 5);
      setAccounts(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(page);
  }, [page]);

  const totalPages = Math.ceil(total / 5);

  return (
    <div className="glass-panel dashboard-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="view-title" style={{ marginBottom: 0 }}>Favorite accounts</h2>
        <button className="btn btn-outline" onClick={() => navigate('/add')} disabled={total >= 20}>
          <Plus size={16} style={{ marginRight: '0.5rem', color: '#0b5cff' }} /> Add a new account
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="empty-state">No favorite accounts found.</div>
      ) : (
        <div className="account-list">
          {accounts.map((acc) => (
            <div key={acc.id} className="account-card">
              <div className="account-info">
                <h3>{acc.name}</h3>
                <p>{acc.iban}</p>
                <p>{acc.bank}</p>
              </div>
              <div className="account-actions">
                <button className="icon-btn" onClick={() => navigate(`/edit/${acc.id}`)}>
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-outline" 
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            className="btn btn-outline" 
            disabled={page === totalPages || loading} 
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
