import React from 'react';
import { Settings } from 'lucide-react';

export const Header = ({ onOpenSettings }) => {
  const currentMonthYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header style={{
      padding: 'calc(env(safe-area-inset-top, 40px) + 16px) 20px 12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-emerald)',
            boxShadow: '0 0 10px var(--accent-emerald)'
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {currentMonthYear}
          </span>
        </div>
        <img 
          src="/AppLogo_transparent.png" 
          alt="App Logo" 
          style={{ height: '36px', marginTop: '4px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={onOpenSettings}
          className="btn-ghost"
          style={{ padding: '8px', borderRadius: '50%' }}
        >
          <Settings size={20} color="var(--text-secondary)" />
        </button>
      </div>
    </header>
  );
};
