import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddIncomeModal } from './components/AddIncomeModal';
import { ActionMenuModal } from './components/ActionMenuModal';
import { TransferModal } from './components/TransferModal';
import { ManageBanksModal } from './components/ManageBanksModal';
import { AddLoanModal } from './components/AddLoanModal';
import { ConfirmModal } from './components/ConfirmModal';
import { HomeTab } from './tabs/HomeTab';
import { BudgetTab } from './tabs/BudgetTab';
import { LoansTab } from './tabs/LoansTab';
import { BanksTab } from './tabs/BanksTab';

function AppContent() {
  const { isDataLoaded } = useApp();

  const [activeTab, setActiveTab] = useState('home');
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isManageBanksOpen, setIsManageBanksOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);

  if (!isDataLoaded) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}><span style={{ color: 'var(--text-muted)' }}>Loading...</span></div>;
  }

  return (
    <div className="mobile-container">
      {/* Top sticky header */}
      <Header />

      {/* Main Tab Content */}
      <main style={{ flex: '1 1 0', width: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
        {activeTab === 'home' && (
          <HomeTab 
            setActiveTab={setActiveTab} 
          />
        )}
        {activeTab === 'budget' && (
          <BudgetTab 
            onOpenAdd={() => setIsAddOpen(true)} 
          />
        )}
        {activeTab === 'loans' && (
          <LoansTab onOpenAdd={() => setIsAddLoanOpen(true)} />
        )}
        {activeTab === 'banks' && (
          <BanksTab 
            onOpenTransfer={() => setIsTransferOpen(true)}
            onOpenManageBanks={() => setIsManageBanksOpen(true)}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      {activeTab === 'home' && (
        <button
          onClick={() => setIsActionMenuOpen(true)}
          className="btn-primary"
          style={{
            position: 'fixed',
            bottom: '80px', // Above bottom navigation
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            padding: 0,
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            zIndex: 90,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Plus size={28} strokeWidth={2.5} color="white" />
        </button>
      )}

      {/* Floating / Bottom Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Modals */}
      <ActionMenuModal 
        isOpen={isActionMenuOpen}
        onClose={() => setIsActionMenuOpen(false)}
        onOpenExpense={() => setIsAddExpenseOpen(true)}
        onOpenIncome={() => setIsAddIncomeOpen(true)}
        onOpenTransfer={() => setIsTransferOpen(true)}
      />

      <AddExpenseModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
      />

      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />
      
      <TransferModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
      />
      
      <ManageBanksModal
        isOpen={isManageBanksOpen}
        onClose={() => setIsManageBanksOpen(false)}
      />
      
      <AddLoanModal
        isOpen={isAddLoanOpen}
        onClose={() => setIsAddLoanOpen(false)}
      />

      <ConfirmModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
