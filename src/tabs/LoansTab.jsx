import React, { useState } from 'react';
import { 
  Landmark, 
  Trash2,
  Edit2,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EditLoanModal } from '../components/EditLoanModal';
import { 
  formatCurrency, 
  calculateLoanMetrics 
} from '../utils/finance';

export const LoansTab = ({ onOpenAdd }) => {
  const { 
    loans, 
    totalPendingLoanAmount,
    getLoanExpenses,
    deleteLoan,
    showConfirm
  } = useApp();

  const [editingLoan, setEditingLoan] = useState(null);

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Landmark size={18} color="#818cf8" />
            <span>Loans</span>
          </h2>
        </div>
        <button 
          onClick={onOpenAdd}
          className="btn-ghost" 
          style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)' }}
        >
          <Plus size={14} />
          <span>Add Loan</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(20, 24, 45, 0.9) 0%, rgba(15, 20, 38, 0.95) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.25)',
          marginBottom: '20px'
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Pending Loans
        </span>
        <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 0px 0', letterSpacing: '-0.02em' }}>
          {formatCurrency(totalPendingLoanAmount)}
        </div>
      </div>

      {/* List of Loans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loans.map(loan => {
          const metrics = calculateLoanMetrics(loan, getLoanExpenses(loan.name));

          return (
            <div 
              key={loan.id}
              className="glass-card"
              style={{
                border: '1px solid var(--border-subtle)',
                padding: '16px'
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                    {loan.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      EMI: <strong style={{ color: '#f8fafc' }}>{formatCurrency(loan.emi)}</strong>/mo
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingLoan(loan)}
                    className="btn-ghost"
                    style={{ padding: '6px', color: '#818cf8', borderColor: 'transparent', background: 'rgba(129, 140, 248, 0.1)' }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      showConfirm(`Are you sure you want to delete ${loan.name}?`, () => {
                        deleteLoan(loan.id);
                      });
                    }}
                    className="btn-ghost"
                    style={{ padding: '6px', color: '#f43f5e', borderColor: 'transparent', background: 'rgba(244, 63, 94, 0.1)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Tenure Progress Bar */}
              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Tenure Progress: <strong>{metrics.totalMonthsPaid}</strong> of <strong>{loan.totalMonths}</strong> months
                  </span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{metrics.tenureProgress}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar-fill progress-fill-indigo" 
                    style={{ width: `${metrics.tenureProgress}%` }} 
                  />
                </div>
              </div>

              {/* Dynamic Loan Calculation Metrics */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '8px', 
                background: 'rgba(15, 23, 42, 0.5)', 
                padding: '10px', 
                borderRadius: 'var(--radius-md)'
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Pending Amount</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    {formatCurrency(metrics.totalPendingAmount)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Remaining Tenure</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>
                    {metrics.remainingMonths} months
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {loans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.85rem' }}>No loans tracked yet.</p>
          </div>
        )}
      </div>

      <EditLoanModal 
        isOpen={!!editingLoan}
        onClose={() => setEditingLoan(null)}
        loan={editingLoan}
      />
    </div>
  );
};
