import React, { useState } from 'react';
import { X, ArrowRightLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TransferModal = ({ isOpen, onClose }) => {
  const { bankAccounts, transferFunds } = useApp();

  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(bankAccounts[0]?.name || '');
  const [toAccount, setToAccount] = useState(bankAccounts[1]?.name || '');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || fromAccount === toAccount) return;

    transferFunds(fromAccount, toAccount, amount, note, date);

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowRightLeft size={18} color="#f59e0b" />
              <span>Transfer Funds</span>
            </h2>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount (₹)</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>₹</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                autoFocus
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  width: '180px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">From</label>
              <select 
                value={fromAccount} 
                onChange={e => setFromAccount(e.target.value)}
                className="form-select"
                style={{ padding: '10px 8px', fontSize: '0.85rem' }}
              >
                {bankAccounts.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ paddingTop: '20px' }}>
              <ArrowRightLeft size={16} color="var(--text-muted)" />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">To</label>
              <select 
                value={toAccount} 
                onChange={e => setToAccount(e.target.value)}
                className="form-select"
                style={{ padding: '10px 8px', fontSize: '0.85rem' }}
              >
                {bankAccounts.filter(b => b.name !== fromAccount).map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Note</label>
            <input
              type="text"
              placeholder="e.g. Rent share, savings"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)' }}
          >
            <Check size={18} />
            <span>Transfer Funds</span>
          </button>
        </form>
      </div>
    </div>
  );
};
