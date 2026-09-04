import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLoanMetrics } from '../utils/finance';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Core Data States (Empty by default)
  const [incomePool, setIncomePool] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const storedBanks = JSON.parse(localStorage.getItem('sg_bankAccounts') || '[]');
      const storedTx = JSON.parse(localStorage.getItem('sg_transactions') || '[]');
      const storedCat = JSON.parse(localStorage.getItem('sg_categories') || '[]');
      const storedLoans = JSON.parse(localStorage.getItem('sg_loans') || '[]');
      const storedCards = JSON.parse(localStorage.getItem('sg_cards') || '[]');

      setBankAccounts(storedBanks);
      setTransactions(storedTx);
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

  // Computed values
  const totalExpectedIncome = incomePool.reduce((sum, item) => sum + Number(item.expected || 0), 0);
  const totalActualIncome = incomePool.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  const totalPlannedBudget = categories.reduce((sum, cat) => sum + Number(cat.limit || 0), 0);
  const totalActualSpent = categories.reduce((sum, cat) => sum + Number(cat.spent || 0), 0);
  const leftToSpendBalance = totalPlannedBudget - totalActualSpent;

  // Loan aggregates
  const loanMetricsList = loans.map(calculateLoanMetrics);
  const totalPendingLoanAmount = loanMetricsList.reduce((sum, m) => sum + m.totalPendingAmount, 0);
  const totalPendingPrincipal = loanMetricsList.reduce((sum, m) => sum + m.pendingPrincipal, 0);
  const totalFutureInterest = loanMetricsList.reduce((sum, m) => sum + m.futureInterest, 0);

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
      paymentMethod: txData.paymentMethod || 'Cash/UPI'
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update category spent (local)
    setCategories(prev => prev.map(cat => 
      cat.name === txData.category ? { ...cat, spent: Number(cat.spent) + amount } : cat
    ));

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

  const addCategory = (name, limit, type, icon) => {
    const newCat = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      limit: Number(limit),
      type,
      icon,
      spent: 0
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateCategoryLimit = (id, newLimit) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, limit: Number(newLimit) } : c));
  };

  const addCard = (name, type, statementBalance, unbilledBalance) => {
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      statementBalance: Number(statementBalance),
      unbilledBalance: Number(unbilledBalance)
    };
    setCards(prev => [...prev, newCard]);
  };

  const addLoan = (name, principal, emi, interestRate, totalMonths) => {
    const newLoan = {
      id: `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      totalPrincipal: Number(principal),
      emi: Number(emi),
      annualInterestRate: Number(interestRate),
      totalMonths: Number(totalMonths),
      monthsPaid: 0
    };
    setLoans(prev => [...prev, newLoan]);
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
      incomePool, categories, loans, cards, transactions, bankAccounts,
      totalExpectedIncome, totalActualIncome, totalPlannedBudget, totalActualSpent,
      leftToSpendBalance, totalPendingLoanAmount, totalPendingPrincipal, totalFutureInterest,
      addTransaction, transferFunds, addBankAccount, updateBankAccount, deleteBankAccount,
      addCategory, deleteCategory, updateCategoryLimit,
      addCard, deleteCard, updateCardBalances,
      addLoan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
