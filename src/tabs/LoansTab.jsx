import React, { useState } from 'react';
import { 
  Landmark, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  TrendingDown, 
  Percent, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  formatCurrency, 
  calculateLoanMetrics, 
  generateAmortizationSchedule 
} from '../utils/finance';

export const LoansTab = () => {
  const { 
    loans, 
    totalPendingLoanAmount, 
    totalPendingPrincipal, 
    totalFutureInterest,
    recordLoanPayment
  } = useApp();

  const [expandedLoanId, setExpandedLoanId] = useState(loans[0]?.id || null);

  const toggleExpand = (id) => {
    setExpandedLoanId(prev => prev === id ? null : id);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Landmark size={18} color="#818cf8" />
          <span>Loan Metrics & Amortization</span>
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          True payoff costs, future interest burden, and tenure schedules
        </p>
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
          Total True Payoff Cost
        </span>
        <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 14px 0', letterSpacing: '-0.02em' }}>
          {formatCurrency(totalPendingLoanAmount)}
        </div>

        {/* Debt Split: Principal vs Future Interest */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '10px', 
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base Principal (Book Value)</span>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>
              {formatCurrency(totalPendingPrincipal)}
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fb7185' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Future Interest Burden</span>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fb7185' }}>
              {formatCurrency(totalFutureInterest)}
            </span>
          </div>
        </div>
      </div>

      {/* List of Loans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loans.map(loan => {
          const metrics = calculateLoanMetrics(loan);
          const isExpanded = expandedLoanId === loan.id;
          const schedule = generateAmortizationSchedule(loan, 6); // next 6 cycles preview

          return (
            <div 
              key={loan.id}
              className="glass-card"
              style={{
                border: isExpanded ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid var(--border-subtle)',
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
                    <span style={{ fontSize: '0.7rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                      {loan.annualInterestRate}% p.a.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(loan.id)}
                  className="btn-ghost"
                  style={{ padding: '6px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{isExpanded ? 'Hide Schedule' : 'Amortization'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Tenure Progress Bar */}
              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Tenure Progress: <strong>{loan.monthsPaid}</strong> of <strong>{loan.totalMonths}</strong> months
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
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '8px', 
                background: 'rgba(15, 23, 42, 0.5)', 
                padding: '10px', 
                borderRadius: 'var(--radius-md)',
                marginBottom: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Pending Payoff</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    {formatCurrency(metrics.totalPendingAmount)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Base Principal</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>
                    {formatCurrency(metrics.pendingPrincipal)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Future Interest</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fb7185' }}>
                    {formatCurrency(metrics.futureInterest)}
                  </span>
                </div>
              </div>

              {/* Action to record monthly EMI */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => {
                    if (window.confirm(`Mark 1 month EMI (₹${loan.emi}) paid for ${loan.name}?`)) {
                      recordLoanPayment(loan.id);
                    }
                  }}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <CheckCircle2 size={13} color="#10b981" />
                  <span>Mark EMI Paid</span>
                </button>
              </div>

              {/* EXPANDABLE AMORTIZATION TABLE */}
              {isExpanded && (
                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '14px', 
                  borderTop: '1px dashed var(--border-subtle)',
                  animation: 'fadeIn 0.25s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                      Upcoming Billing Cycles Amortization
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {metrics.remainingMonths} cycles left
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'right' }}>
                      <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                          <th style={{ textAlign: 'left', padding: '6px 4px' }}>Mo</th>
                          <th style={{ padding: '6px 4px' }}>Opening</th>
                          <th style={{ padding: '6px 4px' }}>Interest</th>
                          <th style={{ padding: '6px 4px' }}>Principal</th>
                          <th style={{ padding: '6px 4px' }}>Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr key={row.cycle} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ textAlign: 'left', padding: '6px 4px', fontWeight: 700, color: '#818cf8' }}>
                              #{row.cycle}
                            </td>
                            <td style={{ padding: '6px 4px', color: 'var(--text-secondary)' }}>
                              ₹{row.openingPrincipal.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '6px 4px', color: '#fb7185' }}>
                              ₹{row.interestPortion.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '6px 4px', color: '#34d399', fontWeight: 600 }}>
                              ₹{row.principalDeduction.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '6px 4px', color: 'var(--text-primary)', fontWeight: 600 }}>
                              ₹{row.closingPrincipal.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
