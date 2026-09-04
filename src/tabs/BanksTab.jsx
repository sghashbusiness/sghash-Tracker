import React, { useState } from 'react';
import { 
  CreditCard, 
  Building,
  Clock, 
  CheckCircle, 
  Edit3, 
  Zap,
  Plus,
  Trash2,
  ArrowRightLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, calculateCardBillingInfo } from '../utils/finance';
import { AddCardModal } from '../components/AddCardModal';

export const BanksTab = ({ onOpenTransfer, onOpenManageBanks }) => {
  const { bankAccounts, cards, updateCardBalances, deleteCard } = useApp();
  const [editingCardId, setEditingCardId] = useState(null);
  const [unbilledInput, setUnbilledInput] = useState('');
  const [statementInput, setStatementInput] = useState('');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this credit card?')) {
      deleteCard(id);
      setEditingCardId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* 1. BANK ACCOUNTS */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            <Building size={18} color="#10b981" />
            <span>Bank Accounts</span>
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={onOpenManageBanks}
              className="btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '6px 12px', color: '#f8fafc', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Manage
            </button>
            <button 
              onClick={onOpenTransfer}
              className="btn-primary" 
              style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: 'none' }}
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
              <div key={bank.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{bank.name}</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  {formatCurrency(bank.balance)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. CREDIT CARDS */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            <CreditCard size={18} color="#f59e0b" />
            <span>Credit Cards</span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Track billing cycles and statements
          </p>
        </div>
        <button 
          onClick={() => setIsAddCardModalOpen(true)}
          className="btn-ghost" 
          style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
        >
          <Plus size={14} />
          <span>Add Card</span>
        </button>
      </div>

      {/* Cards Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.85rem' }}>No credit cards added yet.</p>
          </div>
        ) : cards.map(card => {
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

                <span className={`badge ${isDueUrgent ? 'badge-rose' : 'badge-amber'}`}>
                  <Clock size={11} />
                  {billing.daysUntilDue > 0 ? `${billing.daysUntilDue} days left` : 'Due Today'}
                </span>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px'
              }}>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleSaveBalances(card.id)}
                      className="btn-primary btn-emerald"
                      style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => handleDelete(card.id)}
                      className="btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#f43f5e', border: 'none' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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

      <AddCardModal isOpen={isAddCardModalOpen} onClose={() => setIsAddCardModalOpen(false)} />
    </div>
  );
};
