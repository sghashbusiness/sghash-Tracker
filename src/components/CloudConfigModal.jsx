import React, { useState } from 'react';
import { X, Cloud, Key, Globe, CheckCircle, RefreshCw } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';
import { useApp } from '../context/AppContext';

export const CloudConfigModal = ({ isOpen, onClose }) => {
  const { isCloudConnected, resetToSampleData } = useApp();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.key || '');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!url || !key) {
      setStatusMsg('Please provide both Project URL and Publishable / Anon Key.');
      return;
    }

    let cleanUrl = url.trim();
    // Auto format if user enters project ref or full dashboard URL
    if (cleanUrl.includes('supabase.com/dashboard/project/')) {
      const match = cleanUrl.match(/project\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        cleanUrl = `https://${match[1]}.supabase.co`;
      }
    } else if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}.supabase.co`;
    }

    saveSupabaseConfig(cleanUrl, key);
    setStatusMsg('Saved! Connecting...');
  };

  const handleDisconnect = () => {
    localStorage.removeItem('sg_supabase_url');
    localStorage.removeItem('sg_supabase_key');
    window.location.reload();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cloud size={22} color="#38bdf8" />
            <h2 className="title-md">Supabase Cloud Sync</h2>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
          Connect your free Supabase PostgreSQL database to sync expenses, loans, and card data in real-time across your devices.
        </p>

        {isCloudConnected ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <CheckCircle size={20} color="#10b981" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>Connected to Supabase</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="text-mono">
                {currentConfig.url.replace('https://', '')}
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleDisconnect}
              className="btn-ghost" 
              style={{ fontSize: '0.72rem', color: '#fb7185' }}
            >
              Disconnect
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} color="#94a3b8" />
              <span>Supabase Project URL or Project Reference</span>
            </label>
            <input
              type="text"
              placeholder="e.g. https://xyzcompany.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="form-input text-mono"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} color="#94a3b8" />
              <span>Publishable Key / Anon Key</span>
            </label>
            <textarea
              rows={3}
              placeholder="Paste sb_publishable_... or legacy anon key here"
              value={key}
              onChange={e => setKey(e.target.value)}
              className="form-input text-mono"
              style={{ fontSize: '0.8rem', resize: 'none' }}
            />
          </div>

          {statusMsg && (
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '12px' }}>{statusMsg}</p>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              <Cloud size={16} />
              <span>Save & Connect</span>
            </button>
          </div>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Offline Mode Active</span>
          <button 
            type="button"
            onClick={() => {
              if (window.confirm('Reset all categories and loans back to initial plan?')) {
                resetToSampleData();
                onClose();
              }
            }}
            className="btn-ghost"
            style={{ fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
