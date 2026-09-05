import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConfirmModal = () => {
  const { confirmConfig, closeConfirm } = useApp();

  if (!confirmConfig || !confirmConfig.isOpen) return null;

  const handleConfirm = () => {
    if (confirmConfig.onConfirm) {
      confirmConfig.onConfirm();
    }
    closeConfirm();
  };

  return (
    <div className="modal-backdrop" onClick={closeConfirm} style={{ zIndex: 1000, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ padding: '24px', maxWidth: '350px', width: '100%', borderRadius: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'rgba(244, 63, 94, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <AlertTriangle size={24} color="#f43f5e" />
          </div>
          
          <h2 className="title-md" style={{ marginBottom: '24px', color: 'var(--text-primary)', textAlign: 'center' }}>
            {confirmConfig.message}
          </h2>

          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button 
              onClick={closeConfirm}
              className="btn-ghost"
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                background: '#f43f5e', 
                color: 'white', 
                fontWeight: 600, 
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              Confirm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
