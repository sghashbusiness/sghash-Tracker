import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddCardModal = ({ isOpen, onClose }) => {
  const { addCard } = useApp();
  
  const [name, setName] = useState('');
  const [type, setType] = useState('Axis');
  const [statementBalance, setStatementBalance] = useState('');
  const [unbilledBalance, setUnbilledBalance] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addCard(name, type, statementBalance || 0, unbilledBalance || 0);
    setName('');
    setType('Axis');
    setStatementBalance('');
    setUnbilledBalance('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="title-md">Add Credit Card</h2>
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
            <label className="form-label">Network / Type</label>
            <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
              <option value="Axis">Axis Bank</option>
              <option value="UNI">UNI Cards</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Statement Balance (₹)</label>
            <input 
              type="number"
              className="form-input"
              value={statementBalance}
              onChange={e => setStatementBalance(e.target.value)}
              placeholder="0 (Already Billed)"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Unbilled Balance (₹)</label>
            <input 
              type="number"
              className="form-input"
              value={unbilledBalance}
              onChange={e => setUnbilledBalance(e.target.value)}
              placeholder="0 (Current Cycle)"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            <Check size={18} />
            <span>Save Credit Card</span>
          </button>
        </form>
      </div>
    </div>
  );
};
