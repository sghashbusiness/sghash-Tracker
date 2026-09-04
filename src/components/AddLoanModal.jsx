import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddLoanModal = ({ isOpen, onClose }) => {
  const { addLoan } = useApp();
  
  const [name, setName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [emi, setEmi] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [totalMonths, setTotalMonths] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !principal || !emi || !interestRate || !totalMonths) return;
    addLoan(name, principal, emi, interestRate, totalMonths);
    setName('');
    setPrincipal('');
    setEmi('');
    setInterestRate('');
    setTotalMonths('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="title-md">Add New Loan</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Loan Name</label>
            <input type="text" required className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Home Loan" />
          </div>

          <div className="form-group">
            <label className="form-label">Total Principal Amount (₹)</label>
            <input type="number" required className="form-input" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly EMI (₹)</label>
            <input type="number" required className="form-input" value={emi} onChange={e => setEmi(e.target.value)} placeholder="0" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Annual Interest Rate (%)</label>
            <input type="number" step="any" required className="form-input" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="e.g. 8.5" />
          </div>

          <div className="form-group">
            <label className="form-label">Total Tenure (Months)</label>
            <input type="number" required className="form-input" value={totalMonths} onChange={e => setTotalMonths(e.target.value)} placeholder="e.g. 240" />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            <Check size={18} />
            <span>Save Loan</span>
          </button>
        </form>
      </div>
    </div>
  );
};
