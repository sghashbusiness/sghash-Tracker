import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLoanMetrics } from '../utils/finance';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Core Data States (Empty by default)
  const [incomePool, setIncomePool] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured());

  // 1. Auth Listener
  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Data Fetcher (Only runs if user is authenticated)
  useEffect(() => {
    if (!user || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const [banksRes, txRes, catRes, loanRes, cardRes] = await Promise.all([
          supabase.from('bank_accounts').select('*'),
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('expense_limits').select('*'),
          supabase.from('loans').select('*'),
          supabase.from('credit_cards').select('*')
        ]);

        if (banksRes.data) setBankAccounts(banksRes.data);
        if (txRes.data) {
          setTransactions(txRes.data.map(t => ({
            id: t.id, type: t.type, category: t.category, amount: t.amount,
            date: t.date, note: t.note, fromAccount: t.from_account, toAccount: t.to_account
          })));
        }
        if (catRes.data) setCategories(catRes.data);
        if (loanRes.data) {
          setLoans(loanRes.data.map(l => ({
            ...l,
            emi: l.emi_amount,
            annualInterestRate: l.annual_interest_rate,
            totalMonths: l.total_months,
            monthsPaid: l.months_paid,
            totalPrincipal: l.total_principal
          })));
        }
        if (cardRes.data) {
          setCards(cardRes.data.map(c => ({
            ...c, 
            unbilledBalance: c.unbilled_balance, 
            statementBalance: c.statement_balance
          })));
        }
      } catch (err) {
        console.warn('Supabase fetch error:', err);
      }
    };
    fetchSupabaseData();
  }, [user]);

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
  const addTransaction = async (txData) => {
    const amount = Number(txData.amount);
    const newTx = {
      id: `tx-${Date.now()}`,
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

    // Supabase push
    if (supabase && user) {
      try {
        await supabase.from('transactions').insert([{
          type: 'Expense',
          category: newTx.category,
          amount: newTx.amount,
          note: newTx.note,
          date: newTx.date,
          user_id: user.id
        }]);

        // Sync category spend to DB
        const cat = categories.find(c => c.name === txData.category);
        if (cat) {
          await supabase.from('expense_limits')
            .update({ spent: Number(cat.spent) + amount })
            .eq('id', cat.id);
        }

        // Sync bank balance to DB
        const bank = bankAccounts.find(b => b.id === txData.bankAccountId);
        if (bank) {
          await supabase.from('bank_accounts')
            .update({ balance: Number(bank.balance) - amount })
            .eq('id', bank.id);
        }
      } catch (e) {
        console.warn('Could not sync expense to Supabase:', e);
      }
    }
  };

  const transferFunds = async (fromAccountName, toAccountName, amount, note, date) => {
    const transferTx = {
      id: `tx-${Date.now()}`,
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

    if (supabase && user) {
      try {
        await supabase.from('transactions').insert([{
          type: 'Transfer',
          from_account: fromAccountName,
          to_account: toAccountName,
          amount: Number(amount),
          note: transferTx.note,
          date: transferTx.date,
          user_id: user.id
        }]);
        
        const fromAcc = bankAccounts.find(b => b.name === fromAccountName);
        const toAcc = bankAccounts.find(b => b.name === toAccountName);
        
        if (fromAcc) {
          await supabase.from('bank_accounts')
            .update({ balance: fromAcc.balance - Number(amount) })
            .eq('name', fromAccountName);
        }
        if (toAcc) {
          await supabase.from('bank_accounts')
            .update({ balance: toAcc.balance + Number(amount) })
            .eq('name', toAccountName);
        }
      } catch (e) {
        console.warn('Could not sync transfer to Supabase:', e);
      }
    }
  };

  const addBankAccount = async (name, balance) => {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('bank_accounts')
      .insert([{ name, balance: Number(balance), user_id: user.id }])
      .select()
      .single();
    
    if (!error && data) {
      setBankAccounts(prev => [...prev, data]);
    }
  };

  const updateBankAccount = async (originalName, newName, newBalance) => {
    setBankAccounts(prev => prev.map(b => 
      b.name === originalName ? { ...b, name: newName, balance: Number(newBalance) } : b
    ));

    if (supabase && user) {
      await supabase.from('bank_accounts')
        .update({ name: newName, balance: Number(newBalance) })
        .eq('name', originalName);
    }
  };

  const deleteBankAccount = async (id) => {
    setBankAccounts(prev => prev.filter(b => b.id !== id));
    if (supabase && user) {
      await supabase.from('bank_accounts').delete().eq('id', id);
    }
  };

  const addCategory = async (name, limit, type, icon) => {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('expense_limits')
      .insert([{ name, limit: Number(limit), type, icon, spent: 0, user_id: user.id }])
      .select()
      .single();
    
    if (error) {
      console.error('Failed to add category:', error);
    }
    
    if (!error && data) {
      setCategories(prev => [...prev, data]);
    }
  };

  const deleteCategory = async (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (supabase && user) {
      await supabase.from('expense_limits').delete().eq('id', id);
    }
  };

  const updateCategoryLimit = async (id, newLimit) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, limit: Number(newLimit) } : c));
    if (supabase && user) {
      await supabase.from('expense_limits').update({ limit: Number(newLimit) }).eq('id', id);
    }
  };

  const addCard = async (name, type, statementBalance, unbilledBalance) => {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('credit_cards')
      .insert([{ 
        name, 
        type, 
        statement_balance: Number(statementBalance), 
        unbilled_balance: Number(unbilledBalance),
        user_id: user.id 
      }])
      .select()
      .single();
    
    if (!error && data) {
      setCards(prev => [...prev, { ...data, unbilledBalance: data.unbilled_balance, statementBalance: data.statement_balance }]);
    }
  };

  const addLoan = async (name, principal, emi, interestRate, totalMonths) => {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('loans')
      .insert([{ 
        name, 
        total_principal: Number(principal), 
        emi_amount: Number(emi),
        annual_interest_rate: Number(interestRate),
        total_months: Number(totalMonths),
        months_paid: 0,
        user_id: user.id 
      }])
      .select()
      .single();
    
    if (!error && data) {
      setLoans(prev => [...prev, {
        ...data,
        emi: data.emi_amount,
        annualInterestRate: data.annual_interest_rate,
        totalMonths: data.total_months,
        monthsPaid: data.months_paid,
        totalPrincipal: data.total_principal
      }]);
    }
  };

  const deleteCard = async (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (supabase && user) {
      await supabase.from('credit_cards').delete().eq('id', id);
    }
  };

  const updateCardBalances = async (id, unbilled, statement) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, unbilledBalance: Number(unbilled), statementBalance: Number(statement) } : c));
    if (supabase && user) {
      await supabase.from('credit_cards').update({ 
        unbilled_balance: Number(unbilled), 
        statement_balance: Number(statement) 
      }).eq('id', id);
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setTransactions([]);
      setBankAccounts([]);
      setCategories([]);
      setLoans([]);
      setCards([]);
    }
  };

  return (
    <AppContext.Provider value={{
      user, session, isAuthLoading, signOut,
      incomePool, categories, loans, cards, transactions, bankAccounts,
      totalExpectedIncome, totalActualIncome, totalPlannedBudget, totalActualSpent,
      leftToSpendBalance, totalPendingLoanAmount, totalPendingPrincipal, totalFutureInterest,
      isCloudConnected,
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
