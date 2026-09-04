import React from 'react';
import { LayoutDashboard, PieChart, Landmark, CreditCard } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'loans', label: 'Loans', icon: Landmark },
    { id: 'cards', label: 'Cards', icon: CreditCard },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {isActive && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                width: '16px',
                height: '3px',
                borderRadius: '4px',
                background: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8'
              }} />
            )}
            <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} color={isActive ? '#38bdf8' : '#64748b'} />
            <span style={{ color: isActive ? '#f8fafc' : '#64748b', fontSize: '0.7rem' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
