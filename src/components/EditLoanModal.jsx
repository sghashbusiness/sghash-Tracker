import React, { useState, useEffect } from 'react';
import { X, Check, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditLoanModal = ({ isOpen, onClose, loan }) => {
  const { updateLoan } = useApp();
  
  const [name, setName] = useState('');
  const [totalMonths, setTotalMonths] = useState('');
  const [emi, setEmi] = useState('');
  const [initialMonthsPaid, setInitialMonthsPaid] = useState('');

  useEffect(() => {
    if (loan && isOpen) {
      setName(loan.name);
      setTotalMonths(loan.totalMonths);
      setEmi(loan.emi);
      setInitialMonthsPaid(loan.initialMonthsPaid);
    }
  }, [loan, isOpen]);

  if (!isOpen || !loan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !emi || !totalMonths) return;
    updateLoan(loan.id, {
      name,
      emi: Number(emi),
      totalMonths: Number(totalMonths),
      initialMonthsPaid: Number(initialMonthsPaid) || 0
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={20} color="#818cf8" />
            Edit Loan
          </h2>
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
            <label className="form-label">Loan Tenure (Months)</label>
            <input type="number" required className="form-input" value={totalMonths} onChange={e => setTotalMonths(e.target.value)} placeholder="e.g. 240" />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Due (₹)</label>
            <input type="number" required className="form-input" value={emi} onChange={e => setEmi(e.target.value)} placeholder="0" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Months Already Paid (Optional)</label>
            <input type="number" className="form-input" value={initialMonthsPaid} onChange={e => setInitialMonthsPaid(e.target.value)} placeholder="0" />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            <Check size={18} />
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
