import React from 'react';
import { Cloud, CloudOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ onOpenCloudConfig }) => {
  const { isCloudConnected } = useApp();

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
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: '2px' }}>
          SgHash Tracker <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, background: 'rgba(99, 102, 241, 0.15)', padding: '2px 6px', borderRadius: '6px' }}>PRO</span>
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={onOpenCloudConfig}
          className="btn-ghost"
          style={{ padding: '7px 10px', fontSize: '0.75rem' }}
          title={isCloudConnected ? "Supabase Connected" : "Connect Supabase"}
        >
          {isCloudConnected ? (
            <>
              <Cloud size={15} color="#10b981" />
              <span style={{ color: '#10b981' }}>Cloud</span>
            </>
          ) : (
            <>
              <CloudOff size={15} color="#94a3b8" />
              <span>Connect</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
