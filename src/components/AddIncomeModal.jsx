import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomSelect } from './ui/CustomSelect';

export const AddIncomeModal = ({ isOpen, onClose }) => {
  const { categories, bankAccounts, addIncome } = useApp();

  const [amount, setAmount] = useState('');
  
  const incomeCategories = categories.filter(c => c.type === 'Income');
  const [category, setCategory] = useState(incomeCategories.length > 0 ? incomeCategories[0].name : 'General Income');
  
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts.length > 0 ? bankAccounts[0].id : '');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addIncome({
      amount: Number(amount),
      category,
      bankAccountId: selectedBankId || null,
      note,
      date
    });

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="title-md">Log Income</h2>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount (₹)</label>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>₹</span>
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
                  width: '140px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Income Source / Category</label>
            <CustomSelect 
              value={category} 
              onChange={setCategory}
              placeholder="Select Income Source..."
              options={
                incomeCategories.length > 0 
                  ? incomeCategories.map(c => ({ value: c.name, label: c.name }))
                  : [{ value: 'General Income', label: 'General Income' }]
              }
            />
          </div>

          {/* Bank Account */}
          <div className="form-group">
            <label className="form-label">Deposit Into</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {bankAccounts.map(b => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setSelectedBankId(b.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedBankId === b.id ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                    background: selectedBankId === b.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedBankId === b.id ? '#10b981' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {b.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedBankId('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedBankId === '' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: selectedBankId === '' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedBankId === '' ? '#38bdf8' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cash (Not tracked in bank)
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Note / Reference</label>
            <input
              type="text"
              placeholder="e.g. Salary, Freelance, Refund"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Date */}
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
            style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
          >
            <Check size={18} />
            <span>Save Income</span>
          </button>
        </form>
      </div>
    </div>
  );
};
