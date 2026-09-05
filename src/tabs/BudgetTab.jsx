import React, { useState } from 'react';
import { PieChart, Folder, Wallet, Tag, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/finance';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { AddBudgetModal } from '../components/AddBudgetModal';

export const BudgetTab = () => {
  const { budgets, categories, transactions, deleteCategory, deleteBudget } = useApp();

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  const expenseCategories = categories.filter(c => c.type === 'Expense');
  const incomes = categories.filter(c => c.type === 'Income');

  const calculateSpent = (catName) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category === catName)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const totalSpent = expenseCategories.reduce((acc, c) => acc + calculateSpent(c.name), 0);

  return (
    <>
      <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
        
        {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
        <button 
          onClick={() => setIsAddBudgetOpen(true)}
          style={{ 
            background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '8px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' 
          }}
        >
          <Plus size={15} strokeWidth={3} /> Budget
        </button>
        <button 
          onClick={() => setIsAddCategoryOpen(true)}
          style={{ 
            background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' 
          }}
        >
          <Plus size={15} strokeWidth={3} /> Category
        </button>
      </div>

      {/* Summary Mini Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Spending</span>
        <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.2rem' }}>{formatCurrency(totalSpent)}</span>
      </div>

      {/* Grouped by Budgets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {budgets.map(budget => {
          const budgetCategories = expenseCategories.filter(c => c.budgetId === budget.id);
          
          const displayCategories = budgetCategories.length > 0 ? budgetCategories : [{ id: 'dummy-' + budget.id, name: budget.name }];
          const budgetSpent = displayCategories.reduce((acc, cat) => acc + calculateSpent(cat.name), 0);
          const progressPercentage = Math.min(100, (budgetSpent / (budget.limit || 1)) * 100);
          const progressColorClass = budgetSpent > budget.limit ? 'progress-fill-rose' : (budgetSpent / budget.limit) > 0.8 ? 'progress-fill-amber' : 'progress-fill-emerald';

          return (
            <div 
              key={budget.id}
              className={budgetCategories.length === 0 ? "glass-card" : ""}
              style={budgetCategories.length === 0 ? { padding: '16px', border: '1px solid var(--border-subtle)' } : {}}
            >
              <div style={{ marginBottom: budgetCategories.length === 0 ? '0' : '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <Folder size={16} />
                    {budget.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: '#f8fafc' }}>{formatCurrency(budgetSpent)}</strong> / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <div className="progress-bar-container" style={{ height: '6px' }}>
                  <div 
                    className={`progress-bar-fill ${progressColorClass}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {budgetCategories.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {displayCategories.map(cat => {
                    const spent = calculateSpent(cat.name);
                    return (
                      <div 
                        key={cat.id} 
                        className="glass-card interactive-card"
                        style={{
                          padding: '12px 14px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PieChart size={16} color="#38bdf8" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {cat.name}
                            </h3>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {formatCurrency(spent)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.85rem' }}>No budgets configured.</p>
          </div>
        )}
      </div>

      {/* Settings Section (Moved here) */}
      <div style={{ marginTop: '48px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
        <h2 className="title-lg" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', marginBottom: '24px' }}>
          Configuration
        </h2>
        
        {/* Budgets Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '1.1rem' }}>
              <Wallet size={18} />
              Budgets
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgets.length === 0 ? <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>No budgets set.</p> : budgets.map(b => (
              <div key={b.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{b.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Limit: <strong style={{color:'var(--text-secondary)'}}>₹{b.limit}</strong></span>
                </div>
                <button 
                  onClick={() => deleteBudget(b.id)} 
                  style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontSize: '1.1rem' }}>
              <Tag size={18} />
              Expense Categories
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {expenseCategories.length === 0 ? <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>No expense categories.</p> : expenseCategories.map(cat => {
              const parentBudget = budgets.find(b => b.id === cat.budgetId);
              return (
                <div key={cat.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{cat.name}</span>
                    {parentBudget && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget: <strong style={{color:'#f59e0b'}}>{parentBudget.name}</strong></span>}
                  </div>
                  <button 
                    onClick={() => deleteCategory(cat.id)} 
                    style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Categories Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '1.1rem' }}>
              <Tag size={18} />
              Income Categories
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {incomes.length === 0 ? <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>No income categories.</p> : incomes.map(cat => (
              <div key={cat.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                <button 
                  onClick={() => deleteCategory(cat.id)} 
                  style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      <AddCategoryModal 
        isOpen={isAddCategoryOpen} 
        onClose={() => setIsAddCategoryOpen(false)} 
      />

      <AddBudgetModal
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
      />
    </>
  );
};
