import React from 'react';
import { 
  ArrowDownRight, 
  ArrowRightLeft,
  Building,
  PieChart,
  CreditCard,
  Landmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, calculateCardBillingInfo } from '../utils/finance';

export const HomeTab = ({ onOpenTransfer, onOpenManageBanks, setActiveTab }) => {
  const { 
    leftToSpendBalance, 
    totalPlannedBudget, 
    totalActualSpent,
    bankAccounts,
    transactions,
    categories,
    loans,
    cards
  } = useApp();

  const spendPercentage = totalPlannedBudget > 0 
    ? Math.min(100, Math.round((totalActualSpent / totalPlannedBudget) * 100))
    : 0;

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* 1. HERO CARD: LEFT-TO-SPEND BALANCE */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.9) 0%, rgba(13, 20, 36, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Left-to-Spend Balance
            </span>
          </div>
          <span className={`badge ${leftToSpendBalance >= 0 ? 'badge-emerald' : 'badge-rose'}`}>
            {leftToSpendBalance >= 0 ? 'On Track' : 'Over Budget'}
          </span>
        </div>

        <div style={{ margin: '14px 0 20px 0' }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            color: leftToSpendBalance >= 0 ? '#f8fafc' : '#fb7185'
          }}>
            {formatCurrency(leftToSpendBalance)}
          </div>
        </div>

        {/* Planned vs Spent Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Budget Used ({spendPercentage}%)</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {formatCurrency(totalActualSpent)} / {formatCurrency(totalPlannedBudget)}
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${
                spendPercentage > 90 ? 'progress-fill-rose' : spendPercentage > 75 ? 'progress-fill-amber' : 'progress-fill-emerald'
              }`}
              style={{ width: `${spendPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. BANK ACCOUNTS */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="title-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Building size={16} color="#f59e0b" />
            <span>Bank Accounts</span>
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={onOpenManageBanks}
              className="btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#f8fafc', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Manage
            </button>
            <button 
              onClick={onOpenTransfer}
              className="btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}
            >
              <ArrowRightLeft size={12} />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bankAccounts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No bank accounts added yet. <br/><span style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={onOpenManageBanks}>Add one now</span>
            </div>
          ) : (
            bankAccounts.map(bank => (
              <div key={bank.id} className="glass-card" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.03)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{bank.name}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  {formatCurrency(bank.balance)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. BUDGET CATEGORIES PREVIEW */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="title-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <PieChart size={16} color="#10b981" />
            <span>Budget Categories</span>
          </h2>
          <button onClick={() => setActiveTab('budget')} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#38bdf8' }}>
            Manage →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {categories.length === 0 ? (
            <div style={{ gridColumn: 'span 2', padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No budget categories set. <br/><span style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => setActiveTab('budget')}>Configure budget</span>
            </div>
          ) : (
            categories.slice(0, 4).map(cat => {
              const isOver = cat.spent > cat.limit;
              const remaining = cat.limit - cat.spent;
              const pct = Math.round((cat.spent / (cat.limit || 1)) * 100);

              return (
                <div key={cat.id} className="glass-card" style={{ padding: '12px', border: isOver ? '1px solid rgba(244,63,94,0.3)' : '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isOver ? '#fb7185' : 'var(--text-muted)', marginBottom: '8px' }}>
                    {isOver ? 'Over budget' : `${formatCurrency(remaining)} left`}
                  </div>
                  <div className="progress-bar-container" style={{ height: '4px' }}>
                    <div 
                      className={`progress-bar-fill ${isOver ? 'progress-fill-rose' : pct > 80 ? 'progress-fill-amber' : 'progress-fill-emerald'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS */}
      <div>
        <h2 className="title-sm" style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Recent Transactions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.slice(0, 6).map(tx => (
            <div key={tx.id} className="glass-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {tx.type === 'Transfer' ? 'Transfer' : tx.category}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {tx.note ? `${tx.note} • ` : ''}{tx.date}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: tx.type === 'Transfer' ? '#f59e0b' : '#fb7185' }}>
                  {tx.type === 'Transfer' ? '' : '-'}{formatCurrency(tx.amount)}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  {tx.type === 'Transfer' ? `${tx.fromAccount} → ${tx.toAccount}` : (tx.fromAccount || tx.paymentMethod || '')}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No recent transactions
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
