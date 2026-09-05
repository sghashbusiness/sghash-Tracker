import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLoanMetrics } from '../utils/finance';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Core Data States (Empty by default)
  const [incomePool, setIncomePool] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  // Confirm Modal State
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, message: '', onConfirm: null });

  const showConfirm = (message, onConfirm) => {
    setConfirmConfig({ isOpen: true, message, onConfirm });
  };
  
  const closeConfirm = () => {
    setConfirmConfig({ isOpen: false, message: '', onConfirm: null });
  };

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const storedBanks = JSON.parse(localStorage.getItem('sg_bankAccounts') || '[]');
      const storedTx = JSON.parse(localStorage.getItem('sg_transactions') || '[]');
      const storedBudgets = JSON.parse(localStorage.getItem('sg_budgets') || '[]');
      const storedCat = JSON.parse(localStorage.getItem('sg_categories') || '[]');
      const storedLoans = JSON.parse(localStorage.getItem('sg_loans') || '[]');
      const storedCards = JSON.parse(localStorage.getItem('sg_cards') || '[]');

      setBankAccounts(storedBanks);
      setTransactions(storedTx);
      setBudgets(storedBudgets);
      setCategories(storedCat);
      setLoans(storedLoans);
      setCards(storedCards);
    } catch (e) {
      console.error('Failed to parse local data', e);
    }
    setIsDataLoaded(true);
  }, []);

  // 2. Persist Data to LocalStorage (skip first render)
  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('sg_bankAccounts', JSON.stringify(bankAccounts));
  }, [bankAccounts, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('sg_transactions', JSON.stringify(transactions));
  }, [transactions, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('sg_budgets', JSON.stringify(budgets));
  }, [budgets, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('sg_categories', JSON.stringify(categories));
  }, [categories, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('sg_loans', JSON.stringify(loans));
  }, [loans, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('sg_cards', JSON.stringify(cards));
  }, [cards, isDataLoaded]);

  // Sync Loans Budget Limit
  useEffect(() => {
    if (!isDataLoaded) return;
    const totalEmi = loans.reduce((sum, l) => sum + Number(l.emi), 0);
    setBudgets(prev => {
      const hasLoansBudget = prev.some(b => b.name === 'Loans');
      if (!hasLoansBudget && loans.length > 0) {
        return [...prev, { id: 'budget-auto-loans', name: 'Loans', limit: totalEmi }];
      }
      return prev.map(b => b.name === 'Loans' ? { ...b, limit: totalEmi } : b);
    });
  }, [loans, isDataLoaded]);

  // Computed values
  const totalExpectedIncome = incomePool.reduce((sum, item) => sum + Number(item.expected || 0), 0);
  const totalActualIncome = incomePool.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  const totalPlannedBudget = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
  
  const totalActualSpent = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
  const leftToSpendBalance = totalPlannedBudget - totalActualSpent;

  // Loan aggregates
  const getLoanExpenses = (loanName) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category === loanName)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  };
  
  const loanMetricsList = loans.map(loan => calculateLoanMetrics(loan, getLoanExpenses(loan.name)));
  const totalPendingLoanAmount = loanMetricsList.reduce((sum, m) => sum + m.totalPendingAmount, 0);

  // Actions
  const addTransaction = (txData) => {
    const amount = Number(txData.amount);
    const newTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'Expense',
      date: txData.date || new Date().toISOString().split('T')[0],
      amount: amount,
      category: txData.category,
      note: txData.note || '',
      paymentMethod: txData.paymentMethod || 'Cash/UPI',
      bankAccountId: txData.bankAccountId || null,
      cardId: txData.cardId || null
    };

    setTransactions(prev => [newTx, ...prev]);

    // Deduct from bank account if specified (local)
    if (txData.bankAccountId) {
      setBankAccounts(prev => prev.map(b => 
        (b.id === txData.bankAccountId) 
          ? { ...b, balance: Number(b.balance) - amount } : b
      ));
    }

    // Add to Credit Card unbilled balance if card is selected
    if (txData.cardId) {
      setCards(prev => prev.map(c => 
        (c.id === txData.cardId)
          ? { ...c, unbilledBalance: Number(c.unbilledBalance) + amount } : c
      ));
    }
  };

  const addIncome = (incomeData) => {
    const amount = Number(incomeData.amount);
    const newTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'Income',
      date: incomeData.date || new Date().toISOString().split('T')[0],
      amount: amount,
      category: incomeData.category,
      note: incomeData.note || '',
      paymentMethod: incomeData.paymentMethod || 'Bank/Cash',
      bankAccountId: incomeData.bankAccountId || null
    };

    setTransactions(prev => [newTx, ...prev]);

    // Add to bank account if specified
    if (incomeData.bankAccountId) {
      setBankAccounts(prev => prev.map(b => 
        (b.id === incomeData.bankAccountId) 
          ? { ...b, balance: Number(b.balance) + amount } : b
      ));
    }
  };

  const transferFunds = (fromAccountName, toAccountName, amount, note, date) => {
    const transferTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'Transfer',
      date: date || new Date().toISOString().split('T')[0],
      amount: Number(amount),
      fromAccount: fromAccountName,
      toAccount: toAccountName,
      note: note || `Transfer to ${toAccountName}`
    };

    setTransactions(prev => [transferTx, ...prev]);

    setBankAccounts(prev => prev.map(b => {
      if (b.name === fromAccountName) return { ...b, balance: Number(b.balance) - Number(amount) };
      if (b.name === toAccountName) return { ...b, balance: Number(b.balance) + Number(amount) };
      return b;
    }));
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    showConfirm('Are you sure you want to delete this transaction?', () => {
      // Revert the transaction effects
      if (tx.type === 'Expense') {
        if (tx.bankAccountId) {
          setBankAccounts(prev => prev.map(b => 
            b.id === tx.bankAccountId ? { ...b, balance: Number(b.balance) + Number(tx.amount) } : b
          ));
        }
        if (tx.cardId) {
          setCards(prev => prev.map(c => 
            c.id === tx.cardId ? { ...c, unbilledBalance: Number(c.unbilledBalance) - Number(tx.amount) } : c
          ));
        }
      } else if (tx.type === 'Income') {
        if (tx.bankAccountId) {
          setBankAccounts(prev => prev.map(b => 
            b.id === tx.bankAccountId ? { ...b, balance: Number(b.balance) - Number(tx.amount) } : b
          ));
        }
      } else if (tx.type === 'Transfer') {
        setBankAccounts(prev => prev.map(b => {
          if (b.name === tx.fromAccount) return { ...b, balance: Number(b.balance) + Number(tx.amount) };
          if (b.name === tx.toAccount) return { ...b, balance: Number(b.balance) - Number(tx.amount) };
          return b;
        }));
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
    });
  };

  const updateTransaction = (id, newAmount) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    const diff = Number(newAmount) - Number(tx.amount);
    
    if (tx.type === 'Expense') {
      if (tx.bankAccountId) {
        setBankAccounts(prev => prev.map(b => 
          b.id === tx.bankAccountId ? { ...b, balance: Number(b.balance) - diff } : b
        ));
      }
    } else if (tx.type === 'Income') {
      if (tx.bankAccountId) {
        setBankAccounts(prev => prev.map(b => 
          b.id === tx.bankAccountId ? { ...b, balance: Number(b.balance) + diff } : b
        ));
      }
    }
    
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, amount: Number(newAmount) } : t));
  };

  const addBankAccount = (name, balance) => {
    const newBank = {
      id: `bank-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      balance: Number(balance)
    };
    setBankAccounts(prev => [...prev, newBank]);
  };

  const updateBankAccount = (originalName, newName, newBalance) => {
    setBankAccounts(prev => prev.map(b => 
      b.name === originalName ? { ...b, name: newName, balance: Number(newBalance) } : b
    ));
  };

  const deleteBankAccount = (id) => {
    setBankAccounts(prev => prev.filter(b => b.id !== id));
  };

  const addBudget = (name, limit) => {
    const newBudget = {
      id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      limit: Number(limit)
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    // Optionally: delete all categories associated with this budget?
    // Let's leave categories unassigned for now, or delete them:
    setCategories(prev => prev.filter(c => c.budgetId !== id));
  };

  const updateBudgetLimit = (id, newLimit) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: Number(newLimit) } : b));
  };

  const addCategory = (name, type, budgetId = null) => {
    const newCat = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      budgetId,
      icon: 'PieChart'
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addCard = (name, statementDay, dueRule, dueDay, dueOffsetDays) => {
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: 'Credit Card',
      statementBalance: 0,
      unbilledBalance: 0,
      statementDay: Number(statementDay),
      dueRule,
      dueDay: Number(dueDay) || null,
      dueOffsetDays: Number(dueOffsetDays) || null
    };
    setCards(prev => [...prev, newCard]);
  };

  const updateCardDetails = (id, updatedData) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const addLoan = (name, emi, totalMonths, initialMonthsPaid) => {
    const newLoan = {
      id: `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      emi: Number(emi),
      totalMonths: Number(totalMonths),
      initialMonthsPaid: Number(initialMonthsPaid) || 0
    };
    setLoans(prev => [...prev, newLoan]);

    // Ensure category exists
    setCategories(prev => {
      if (prev.find(c => c.name === name && c.type === 'Expense')) return prev;
      return [...prev, {
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        type: 'Expense',
        budgetId: 'budget-auto-loans',
        icon: 'PieChart'
      }];
    });
  };

  const deleteLoan = (id) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const updateLoan = (id, updatedData) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, ...updatedData } : l));
  };

  const deleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const updateCardBalances = (id, unbilled, statement) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, unbilledBalance: Number(unbilled), statementBalance: Number(statement) } : c));
  };

  return (
    <AppContext.Provider value={{
      isDataLoaded,
      incomePool, budgets, categories, loans, cards, transactions, bankAccounts,
      totalExpectedIncome, totalActualIncome, totalPlannedBudget, totalActualSpent,
      leftToSpendBalance, totalPendingLoanAmount, getLoanExpenses,
      confirmConfig, showConfirm, closeConfirm,
      addTransaction, deleteTransaction, updateTransaction, addIncome, transferFunds, addBankAccount, updateBankAccount, deleteBankAccount,
      addBudget, deleteBudget, updateBudgetLimit,
      addCategory, deleteCategory,
      addCard, deleteCard, updateCardBalances, updateCardDetails,
      addLoan, deleteLoan, updateLoan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
