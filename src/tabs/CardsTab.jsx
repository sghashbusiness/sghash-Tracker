import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Edit3, 
  DollarSign,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, calculateCardBillingInfo } from '../utils/finance';

export const CardsTab = () => {
  const { cards, updateCardBalances } = useApp();
  const [editingCardId, setEditingCardId] = useState(null);
  const [unbilledInput, setUnbilledInput] = useState('');
  const [statementInput, setStatementInput] = useState('');

  const handleStartEdit = (card) => {
    setEditingCardId(card.id);
    setUnbilledInput(card.unbilledBalance);
    setStatementInput(card.statementBalance);
  };

  const handleSaveBalances = (cardId) => {
    updateCardBalances(cardId, Number(unbilledInput), Number(statementInput));
    setEditingCardId(null);
  };

  const handleMarkBillPaid = (cardId) => {
    updateCardBalances(cardId, cards.find(c => c.id === cardId)?.unbilledBalance || 0, 0);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CreditCard size={18} color="#f59e0b" />
          <span>Credit Card Billing Cycles</span>
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Statement cutoff on the 14th, with exact payment due dates
        </p>
      </div>

      {/* Cards Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cards.map(card => {
          const billing = calculateCardBillingInfo(card);
          const isAxis = card.type === 'Axis';
          const isEditing = editingCardId === card.id;

          const isDueUrgent = billing.daysUntilDue <= 3;

          return (
            <div 
              key={card.id}
              className="glass-card"
              style={{
                background: isAxis 
                  ? 'linear-gradient(135deg, rgba(28, 18, 38, 0.85) 0%, rgba(20, 16, 32, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 28, 38, 0.85) 0%, rgba(14, 22, 32, 0.95) 100%)',
                border: isAxis ? '1px solid rgba(244, 63, 94, 0.25)' : '1px solid rgba(6, 182, 212, 0.25)',
                padding: '18px'
              }}
            >
              {/* Card Brand Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '28px',
                      height: '18px',
                      borderRadius: '4px',
                      background: isAxis ? 'linear-gradient(135deg, #e11d48, #9f1239)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      color: 'white'
                    }}>
                      {isAxis ? 'AX' : 'UNI'}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {card.name}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    {isAxis ? 'Fixed Due: 2nd of month' : 'Offset Due: 17 days from statement'}
                  </span>
                </div>

                {/* Due Date Alert Badge */}
                <span className={`badge ${isDueUrgent ? 'badge-rose' : 'badge-amber'}`}>
                  <Clock size={11} />
                  {billing.daysUntilDue > 0 ? `${billing.daysUntilDue} days left` : 'Due Today'}
                </span>
              </div>

              {/* Balances Split Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px'
              }}>
                {/* Statement Balance (Locked on 14th) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Statement Balance
                    </span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px', color: '#cbd5e1' }}>
                      Locked 14th
                    </span>
                  </div>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={statementInput}
                      onChange={e => setStatementInput(e.target.value)}
                      style={{ width: '90%', background: '#0f172a', color: 'white', border: '1px solid #38bdf8', borderRadius: '4px', padding: '3px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: card.statementBalance > 0 ? '#fb7185' : '#34d399' }}>
                      {formatCurrency(card.statementBalance)}
                    </div>
                  )}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Payment Due: <strong>{billing.dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</strong>
                  </span>
                </div>

                {/* Unbilled Balance (Current Cycle) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Unbilled Balance
                    </span>
                    <Zap size={10} color="#38bdf8" />
                  </div>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={unbilledInput}
                      onChange={e => setUnbilledInput(e.target.value)}
                      style={{ width: '90%', background: '#0f172a', color: 'white', border: '1px solid #38bdf8', borderRadius: '4px', padding: '3px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                      {formatCurrency(card.unbilledBalance)}
                    </div>
                  )}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Locks in: <strong>{billing.daysUntilNextStatement} days</strong> (14th)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                {isEditing ? (
                  <button 
                    onClick={() => handleSaveBalances(card.id)}
                    className="btn-primary btn-emerald"
                    style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                  >
                    Save Balances
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStartEdit(card)}
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                  >
                    <Edit3 size={12} />
                    <span>Update Balances</span>
                  </button>
                )}

                {card.statementBalance > 0 && !isEditing && (
                  <button 
                    onClick={() => {
                      if (window.confirm(`Mark statement bill of ${formatCurrency(card.statementBalance)} as paid?`)) {
                        handleMarkBillPaid(card.id);
                      }
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '5px 10px', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <CheckCircle size={13} color="#10b981" />
                    <span>Mark Bill Paid</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cycle Explainer Note */}
      <div className="glass-card" style={{ marginTop: '20px', padding: '14px', background: 'rgba(15, 23, 42, 0.4)' }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          Rule Logic
        </h4>
        <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '16px', lineHeight: 1.6 }}>
          <li><strong>14th Cutoff</strong>: Unbilled cycle transactions automatically freeze into the Statement Balance on the 14th.</li>
          <li><strong>Axis Flipkart</strong>: Always due on the <strong>2nd of the upcoming month</strong>.</li>
          <li><strong>UNI Cards</strong>: Due exactly <strong>17 days</strong> after statement generation.</li>
        </ul>
      </div>

    </div>
  );
};
