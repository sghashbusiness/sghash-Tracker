import React from 'react';
import { PieChart, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/finance';

export const BudgetTab = () => {
  const { budgets, categories, transactions } = useApp();

  const expenseCategories = categories.filter(c => c.type === 'Expense');

  const calculateSpent = (catName) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category === catName)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const totalSpent = expenseCategories.reduce((acc, c) => acc + calculateSpent(c.name), 0);

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={18} color="#38bdf8" />
            <span>Categories Breakdown</span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Track where your money goes by Budget
          </p>
        </div>
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
          
          if (budgetCategories.length === 0) return null;

          return (
            <div key={budget.id}>
              <h3 style={{ fontSize: '0.9rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Folder size={16} />
                {budget.name} Budget (Limit: {formatCurrency(budget.limit)})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {budgetCategories.map(cat => {
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
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.85rem' }}>No budgets configured.</p>
          </div>
        )}
      </div>

    </div>
  );
};
