import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomSelect } from './ui/CustomSelect';

export const AddCategoryModal = ({ isOpen, onClose }) => {
  const { addCategory, budgets } = useApp();
  
  const [name, setName] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [type, setType] = useState('Expense');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || (!budgetId && type === 'Expense')) return;
    addCategory(name, type, budgetId || null);
    setName('');
    setBudgetId('');
    setType('Expense');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
            Add Category
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input 
              type="text"
              required
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <CustomSelect 
              value={type} 
              onChange={setType}
              options={[
                { value: 'Expense', label: 'Expense' },
                { value: 'Income', label: 'Income' }
              ]}
            />
          </div>

          {type === 'Expense' && (
            <div className="form-group">
              <label className="form-label">Parent Budget</label>
              <CustomSelect 
                value={budgetId} 
                onChange={setBudgetId}
                required
                placeholder="Select Budget..."
                options={budgets.map(b => ({
                  value: b.id,
                  label: `${b.name} (Limit: ₹${b.limit})`
                }))}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            <Check size={18} />
            <span>Save Category</span>
          </button>
        </form>
      </div>
    </div>
  );
};
