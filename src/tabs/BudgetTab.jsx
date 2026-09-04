import React, { useState } from 'react';
import { 
  PieChart, 
  Home, 
  ShoppingBag, 
  Fuel, 
  Train, 
  Landmark, 
  Coffee, 
  Gift, 
  CreditCard, 
  PiggyBank, 
  TrendingUp,
  Edit2,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/finance';
import { AddCategoryModal } from '../components/AddCategoryModal';

const ICON_MAP = {
  Home,
  ShoppingBag,
  Fuel,
  Train,
  Landmark,
  Coffee,
  Gift,
  CreditCard,
  PiggyBank,
  TrendingUp
};

export const BudgetTab = ({ onOpenAdd }) => {
  const { categories, updateCategoryLimit, deleteCategory } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingCatId, setEditingCatId] = useState(null);
  const [newLimitVal, setNewLimitVal] = useState('');
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);

  const filteredCategories = categories.filter(c => {
    if (activeFilter === 'fixed_variable') return c.type === 'Fixed' || c.type === 'Variable';
    if (activeFilter === 'discretionary') return c.type === 'Discretionary' || c.type === 'Investment';
    return true;
  });

  const totalLimit = filteredCategories.reduce((acc, c) => acc + Number(c.limit), 0);
  const totalSpent = filteredCategories.reduce((acc, c) => acc + Number(c.spent), 0);

  const handleSaveLimit = (id) => {
    if (newLimitVal !== '') {
      updateCategoryLimit(id, Number(newLimitVal));
    }
    setEditingCatId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      setEditingCatId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={18} color="#38bdf8" />
            <span>Planned vs. Actual</span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Limits vs spending across outflows & investments
          </p>
        </div>
      </div>



      {/* Summary Mini Bar */}
      <div className="glass-card" style={{ marginBottom: '16px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Spent: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{formatCurrency(totalSpent)}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Limit: </span>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{formatCurrency(totalLimit)}</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${
              totalSpent > totalLimit ? 'progress-fill-rose' : (totalSpent / totalLimit) > 0.8 ? 'progress-fill-amber' : 'progress-fill-emerald'
            }`}
            style={{ width: `${Math.min(100, (totalSpent / (totalLimit || 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Manage/Add Categories Button */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setIsAddCatModalOpen(true)}
          className="btn-ghost" 
          style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
        >
          <Plus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.85rem' }}>No categories found in this filter.</p>
          </div>
        ) : filteredCategories.map(cat => {
          const Icon = ICON_MAP[cat.icon] || PieChart;
          const pct = Math.round((cat.spent / (cat.limit || 1)) * 100);
          const isOver = cat.spent > cat.limit;
          const remaining = cat.limit - cat.spent;
          const isEditing = editingCatId === cat.id;

          return (
            <div 
              key={cat.id} 
              className="glass-card interactive-card"
              style={{
                padding: '14px 16px',
                border: isOver ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: cat.type === 'Fixed' || cat.type === 'Variable' 
                      ? 'rgba(99, 102, 241, 0.15)' 
                      : cat.type === 'Investment' 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon 
                      size={18} 
                      color={
                        cat.type === 'Fixed' || cat.type === 'Variable' 
                          ? '#818cf8' 
                          : cat.type === 'Investment' 
                            ? '#34d399' 
                            : '#fcd34d'
                      } 
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {cat.type} Outflow
                    </span>
                  </div>
                </div>

                {/* Edit Limit Action */}
                <div style={{ textAlign: 'right' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                      <input 
                        type="number"
                        autoFocus
                        value={newLimitVal}
                        onChange={e => setNewLimitVal(e.target.value)}
                        style={{
                          width: '70px',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid #38bdf8',
                          borderRadius: '4px',
                          color: 'white',
                          padding: '2px 4px',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button 
                        onClick={() => handleSaveLimit(cat.id)}
                        className="btn-ghost" 
                        style={{ padding: '4px' }}
                      >
                        <Check size={14} color="#10b981" />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Limit: </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {formatCurrency(cat.limit)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button 
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setNewLimitVal(cat.limit);
                          }}
                          className="btn-ghost"
                          style={{ padding: '4px', color: '#94a3b8' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="btn-ghost" 
                          style={{ padding: '4px', color: '#f43f5e' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: isOver ? '#fb7185' : 'var(--accent-emerald)', 
                    display: 'block',
                    marginTop: '2px'
                  }}>
                    {isOver ? `Over by ${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} left`}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Actual */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Actual: <strong>{formatCurrency(cat.spent)}</strong></span>
                  <span style={{ color: isOver ? '#fb7185' : 'var(--text-muted)', fontWeight: 600 }}>{pct}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar-fill ${
                      isOver ? 'progress-fill-rose' : pct > 80 ? 'progress-fill-amber' : 'progress-fill-emerald'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddCategoryModal isOpen={isAddCatModalOpen} onClose={() => setIsAddCatModalOpen(false)} />
    </div>
  );
};
