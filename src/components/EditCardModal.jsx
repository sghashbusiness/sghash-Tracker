import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditCardModal = ({ isOpen, onClose, card }) => {
  const { updateCardDetails } = useApp();
  
  const [name, setName] = useState('');
  const [statementDay, setStatementDay] = useState('');
  const [dueRule, setDueRule] = useState('fixed_day');
  const [dueDay, setDueDay] = useState('');
  const [dueOffsetDays, setDueOffsetDays] = useState('');

  useEffect(() => {
    if (card && isOpen) {
      setName(card.name);
      setStatementDay(card.statementDay);
      setDueRule(card.dueRule);
      setDueDay(card.dueDay || '');
      setDueOffsetDays(card.dueOffsetDays || '');
    }
  }, [card, isOpen]);

  if (!isOpen || !card) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !statementDay) return;
    if (dueRule === 'fixed_day' && !dueDay) return;
    if (dueRule === 'offset_days' && !dueOffsetDays) return;

    updateCardDetails(card.id, {
      name,
      statementDay: Number(statementDay),
      dueRule,
      dueDay: dueRule === 'fixed_day' ? Number(dueDay) : null,
      dueOffsetDays: dueRule === 'offset_days' ? Number(dueOffsetDays) : null
    });
    
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="#818cf8" />
            Edit Credit Card
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Card Name</label>
            <input 
              type="text"
              required
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Axis Flipkart"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bill Generation Date (1-31)</label>
            <input 
              type="number"
              min="1" max="31"
              required
              className="form-input"
              value={statementDay}
              onChange={e => setStatementDay(e.target.value)}
              placeholder="e.g. 14"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Due Date Calculation</label>
            <select className="form-select" value={dueRule} onChange={e => setDueRule(e.target.value)}>
              <option value="fixed_day">Fixed Date Every Month</option>
              <option value="offset_days">After N Days from Bill Generation</option>
            </select>
          </div>

          {dueRule === 'fixed_day' ? (
            <div className="form-group">
              <label className="form-label">Due Date (1-31)</label>
              <input 
                type="number"
                min="1" max="31"
                required
                className="form-input"
                value={dueDay}
                onChange={e => setDueDay(e.target.value)}
                placeholder="e.g. 2"
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Number of Days After Bill</label>
              <input 
                type="number"
                min="1"
                required
                className="form-input"
                value={dueOffsetDays}
                onChange={e => setDueOffsetDays(e.target.value)}
                placeholder="e.g. 17"
              />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            <Check size={18} />
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
