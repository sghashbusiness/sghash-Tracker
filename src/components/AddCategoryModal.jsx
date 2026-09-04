import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddCategoryModal = ({ isOpen, onClose }) => {
  const { addCategory } = useApp();
  
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [type, setType] = useState('Variable');
  const [icon, setIcon] = useState('Home');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !limit) return;
    addCategory(name, limit, type, icon);
    setName('');
    setLimit('');
    setType('Variable');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="title-md">Add Budget Category</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input 
              type="text"
              required
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Limit (₹)</label>
            <input 
              type="number"
              required
              className="form-input"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
              <option value="Fixed">Fixed Outflow</option>
              <option value="Variable">Variable Outflow</option>
              <option value="Discretionary">Discretionary</option>
              <option value="Investment">Investment</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Icon Name</label>
            <select className="form-select" value={icon} onChange={e => setIcon(e.target.value)}>
              <option value="Home">Home</option>
              <option value="ShoppingBag">Shopping Bag</option>
              <option value="Fuel">Fuel / Transit</option>
              <option value="Coffee">Coffee / Dining</option>
              <option value="Gift">Gifts / Entertainment</option>
              <option value="PiggyBank">Savings</option>
              <option value="TrendingUp">Investments</option>
              <option value="Train">Travel</option>
              <option value="Landmark">Bills / Utilities</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            <Check size={18} />
            <span>Save Category</span>
          </button>
        </form>
      </div>
    </div>
  );
};
