import React from 'react';
import { X, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

export const ActionMenuModal = ({ isOpen, onClose, onOpenExpense, onOpenIncome, onOpenTransfer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 300 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="title-md">What would you like to log?</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => { onClose(); onOpenExpense(); }}
            className="glass-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              padding: '16px', 
              border: '1px solid rgba(244, 63, 94, 0.3)',
              background: 'rgba(244, 63, 94, 0.05)',
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            <div style={{ padding: '10px', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%' }}>
              <ArrowDownRight size={24} color="#f43f5e" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Expense</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Log money spent</div>
            </div>
          </button>

          <button 
            onClick={() => { onClose(); onOpenIncome(); }}
            className="glass-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              padding: '16px', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.05)',
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%' }}>
              <ArrowUpRight size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Income</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Log money received</div>
            </div>
          </button>

          <button 
            onClick={() => { onClose(); onOpenTransfer(); }}
            className="glass-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              padding: '16px', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'rgba(245, 158, 11, 0.05)',
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '50%' }}>
              <ArrowRightLeft size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Transfer</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Move money between accounts</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
