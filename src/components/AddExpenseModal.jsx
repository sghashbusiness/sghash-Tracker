import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddExpenseModal = ({ isOpen, onClose }) => {
  const { categories, cards, bankAccounts, addTransaction } = useApp();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories.length > 0 ? categories[0].name : '');
  
  // By default select first bank account or Cash
  const [paymentMethod, setPaymentMethod] = useState(bankAccounts.length > 0 ? bankAccounts[0].name : 'Cash');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts.length > 0 ? bankAccounts[0].name : '');
  
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction({
      amount: Number(amount),
      category,
      paymentMethod,
      cardId: selectedCardId || null,
      bankAccountId: selectedBankId || null,
      note,
      date
    });

    setAmount('');
    setNote('');
    onClose();
  };

  const handleSelectMethod = (method, type, id) => {
    setPaymentMethod(method);
    if (type === 'card') {
      setSelectedCardId(id);
      setSelectedBankId('');
    } else if (type === 'bank') {
      setSelectedBankId(id);
      setSelectedCardId('');
    } else {
      setSelectedCardId('');
      setSelectedBankId('');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="title-md">Log Expense</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deducts dynamically from your budget</p>
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
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>₹</span>
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

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Expense Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="form-select"
            >
              <optgroup label="Fixed & Variable Outflows">
                {categories.filter(c => c.type === 'Fixed' || c.type === 'Variable').map(c => (
                  <option key={c.id} value={c.name}>{c.name} (Limit: ₹{c.limit})</option>
                ))}
              </optgroup>
              <optgroup label="Discretionary & Investments">
                {categories.filter(c => c.type === 'Discretionary' || c.type === 'Investment').map(c => (
                  <option key={c.id} value={c.name}>{c.name} (Limit: ₹{c.limit})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Payment Method / Bank Account */}
          <div className="form-group">
            <label className="form-label">Deduct From</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {/* Bank Accounts */}
              {bankAccounts.map(b => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => handleSelectMethod(b.name, 'bank', b.name)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === b.name ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                    background: paymentMethod === b.name ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: paymentMethod === b.name ? '#38bdf8' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {b.name}
                </button>
              ))}
              {/* Cards & Others */}
              {cards.map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleSelectMethod(c.name, 'card', c.id)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === c.name ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                    background: paymentMethod === c.name ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: paymentMethod === c.name ? '#f59e0b' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleSelectMethod('Cash', 'cash')}
                style={{
                  padding: '10px 4px',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'Cash' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'Cash' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: paymentMethod === 'Cash' ? '#10b981' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cash
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Note / Merchant</label>
            <input
              type="text"
              placeholder="e.g. Swiggy, Petrol pump, Grocery"
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
            style={{ width: '100%', marginTop: '16px', padding: '14px' }}
          >
            <Check size={18} />
            <span>Save Expense</span>
          </button>
        </form>
      </div>
    </div>
  );
};
