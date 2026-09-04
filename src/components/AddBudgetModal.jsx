import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddBudgetModal = ({ isOpen, onClose }) => {
  const { addBudget } = useApp();
  
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !limit) return;
    addBudget(name, limit);
    setName('');
    setLimit('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
        <div className="modal-header">
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={20} color="#f59e0b" />
            Add New Budget
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '8px', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            A budget is an overarching limit (e.g., "Monthly Expenses" or "Travel Budget"). You will add Categories inside it later.
          </p>

          <div className="form-group">
            <label className="form-label">Budget Name</label>
            <input 
              type="text" 
              required
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Monthly Spends"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Limit (₹)</label>
            <input 
              type="number"
              required
              className="form-input"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Create Budget
          </button>
        </form>
      </div>
    </div>
  );
};
