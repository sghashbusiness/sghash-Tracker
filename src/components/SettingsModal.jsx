import React, { useState } from 'react';
import { Settings, X, Plus, Trash2, Wallet, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddCategoryModal } from './AddCategoryModal';
import { AddBudgetModal } from './AddBudgetModal';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { categories, deleteCategory, budgets, deleteBudget } = useApp();
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  if (!isOpen) return null;

  const expenses = categories.filter(c => c.type === 'Expense');
  const incomes = categories.filter(c => c.type === 'Income');

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ padding: 0, maxWidth: '450px', width: '100%', borderRadius: '24px', overflow: 'hidden' }}>
          
          <div className="modal-header" style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="title-lg" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '12px' }}>
                <Settings size={22} color="#38bdf8" />
              </div>
              Settings
            </h2>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '50%', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' 
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
            
            {/* Budgets Section */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '1.1rem' }}>
                  <Wallet size={18} />
                  Budgets
                </h3>
                <button 
                  onClick={() => setIsAddBudgetOpen(true)}
                  style={{ 
                    background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' 
                  }}
                >
                  <Plus size={14} strokeWidth={3} /> Add Budget
                </button>
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
                <button 
                  onClick={() => setIsAddCategoryOpen(true)}
                  style={{ 
                    background: 'rgba(251, 113, 133, 0.1)', color: '#fb7185', border: 'none', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' 
                  }}
                >
                  <Plus size={14} strokeWidth={3} /> Add Category
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expenses.length === 0 ? <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>No expense categories.</p> : expenses.map(cat => {
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
