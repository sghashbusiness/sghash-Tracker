import React, { useState } from 'react';
import { X, Building, Check, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ManageBanksModal = ({ isOpen, onClose }) => {
  const { bankAccounts, addBankAccount, updateBankAccount, deleteBankAccount, showConfirm } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  
  const [bankName, setBankName] = useState('');
  const [bankBalance, setBankBalance] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (bank) => {
    setIsEditing(true);
    setEditingBankId(bank.name);
    setBankName(bank.name);
    setBankBalance(bank.balance);
  };

  const handleStartAdd = () => {
    setIsEditing(true);
    setEditingBankId(null);
    setBankName('');
    setBankBalance('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!bankName) return;

    if (editingBankId) {
      updateBankAccount(editingBankId, bankName, bankBalance);
    } else {
      addBankAccount(bankName, bankBalance);
    }

    setIsEditing(false);
    setEditingBankId(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#f59e0b" />
              <span>Manage Bank Accounts</span>
            </h2>
          </div>
          <button onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            } else {
              onClose();
            }
          }} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {!isEditing ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '400px', overflowY: 'auto' }}>
              {bankAccounts.map(b => (
                <div key={b.id} className="glass-card interactive-card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Building size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>₹{Number(b.balance).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleStartEdit(b)} className="btn-ghost" style={{ padding: '6px', color: 'var(--text-muted)' }}>
                      <Edit2 size={15} />
                    </button>
                    <button 
                      onClick={() => {
                        showConfirm('Delete this bank account?', () => {
                          deleteBankAccount(b.id);
                        });
                      }} 
                      className="btn-ghost" 
                      style={{ padding: '6px', color: '#f43f5e' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleStartAdd}
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', boxShadow: 'none' }}
            >
              <Plus size={18} />
              <span>Add New Bank Account</span>
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Account Name</label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. Canara Bank"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Balance (₹)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={bankBalance}
                onChange={e => setBankBalance(e.target.value)}
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)' }}
            >
              <Check size={18} />
              <span>Save Account</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
