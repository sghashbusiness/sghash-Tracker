import React, { useState } from 'react';
import { PieChart, TrendingUp, Building, ArrowRightLeft, Trash2, Edit2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/finance';

export const HomeTab = ({ setActiveTab }) => {
  const { bankAccounts, transactions, budgets, categories, deleteTransaction, updateTransaction } = useApp();

  const [editingTxId, setEditingTxId] = useState(null);
  const [editTxAmount, setEditTxAmount] = useState('');

  const totalBudget = budgets.reduce((sum, b) => sum + (Number(b.limit) || 0), 0);
  
  // Calculate expenses directly from transactions
  const totalActualSpent = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetRemaining = totalBudget - totalActualSpent;

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* 1. HERO CARD: BUDGET BALANCE */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.9) 0%, rgba(13, 20, 36, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '24px'
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
              Budget Remaining
            </span>
          </div>
        </div>

        <div style={{ margin: '14px 0 20px 0' }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            color: budgetRemaining < 0 ? '#f43f5e' : '#f8fafc'
          }}>
            {formatCurrency(budgetRemaining)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} color="#f43f5e" />
            <span style={{ color: 'var(--text-muted)' }}>Total Spent:</span>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{formatCurrency(totalActualSpent)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{formatCurrency(totalBudget)}</span>
          </div>
        </div>
      </div>

      {/* 2. BANK ACCOUNTS */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="title-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          <Building size={16} color="#10b981" />
          <span>Bank Balances</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bankAccounts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No bank accounts added yet.
            </div>
          ) : (
            bankAccounts.map(bank => (
              <div key={bank.id} className="glass-card" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{bank.name}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  {formatCurrency(bank.balance)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. BUDGET PREVIEW */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="title-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <PieChart size={16} color="#f59e0b" />
            <span>Budgets</span>
          </h2>
          <button onClick={() => setActiveTab('budget')} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#f59e0b' }}>
            View All →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {budgets.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No budgets set. Add one in Settings.
            </div>
          ) : (
            budgets.map(budget => {
              const limit = Number(budget.limit) || 0;
              // Get all categories that belong to this budget
              const childCategoryNames = categories
                .filter(c => c.budgetId === budget.id)
                .map(c => c.name);
                
              // Calculate total spent for this budget
              const spent = transactions
                .filter(t => t.type === 'Expense' && childCategoryNames.includes(t.category))
                .reduce((acc, t) => acc + Number(t.amount), 0);
              
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const isOver = spent > limit;

              return (
                <div key={budget.id} className="glass-card" style={{ padding: '14px 16px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{budget.name}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isOver ? '#fb7185' : 'var(--text-secondary)' }}>
                      {formatCurrency(spent)} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {formatCurrency(limit)}</span>
                    </div>
                  </div>
                  
                  {limit > 0 && (
                    <div className="progress-bar-container" style={{ height: '6px' }}>
                      <div 
                        className={`progress-bar-fill ${
                          isOver ? 'progress-fill-rose' : pct > 80 ? 'progress-fill-amber' : 'progress-fill-emerald'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  )}
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
          {transactions.map(tx => {
            const isEditing = editingTxId === tx.id;
            return (
              <div key={tx.id} className="glass-card interactive-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {tx.type === 'Transfer' ? 'Transfer' : tx.category}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {tx.note ? `${tx.note} • ` : ''}{tx.date}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input 
                          type="number"
                          value={editTxAmount}
                          onChange={e => setEditTxAmount(e.target.value)}
                          autoFocus
                          style={{
                            width: '80px',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #38bdf8',
                            borderRadius: '4px',
                            color: 'white',
                            padding: '4px',
                            fontSize: '0.9rem'
                          }}
                        />
                        <button 
                          onClick={() => {
                            if (editTxAmount) {
                              updateTransaction(tx.id, editTxAmount);
                            }
                            setEditingTxId(null);
                          }}
                          className="btn-ghost"
                          style={{ padding: '6px', color: '#10b981' }}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: tx.type === 'Income' ? '#34d399' : tx.type === 'Transfer' ? '#f59e0b' : '#fb7185' }}>
                          {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}{formatCurrency(tx.amount)}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                          {tx.type === 'Transfer' ? `${tx.fromAccount} → ${tx.toAccount}` : (tx.fromAccount || tx.paymentMethod || '')}
                        </span>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => {
                          setEditingTxId(tx.id);
                          setEditTxAmount(tx.amount);
                        }}
                        className="btn-ghost" 
                        style={{ padding: '6px', color: '#94a3b8', border: 'none' }}
                        title="Edit Transaction"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        className="btn-ghost" 
                        style={{ padding: '6px', color: '#f43f5e', border: 'none' }}
                        title="Delete Transaction"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
