import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AddExpenseModal } from './components/AddExpenseModal';
import { TransferModal } from './components/TransferModal';
import { CloudConfigModal } from './components/CloudConfigModal';
import { ManageBanksModal } from './components/ManageBanksModal';
import { AddLoanModal } from './components/AddLoanModal';
import { LoginScreen } from './components/LoginScreen';
import { HomeTab } from './tabs/HomeTab';
import { BudgetTab } from './tabs/BudgetTab';
import { LoansTab } from './tabs/LoansTab';
import { CardsTab } from './tabs/CardsTab';

function AppContent() {
  const { user, isAuthLoading } = useApp();

  const [activeTab, setActiveTab] = useState('home');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isManageBanksOpen, setIsManageBanksOpen] = useState(false);
  const [isCloudConfigOpen, setIsCloudConfigOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);

  if (isAuthLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}><span style={{ color: 'var(--text-muted)' }}>Loading...</span></div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="mobile-container">
      {/* Top sticky header */}
      <Header 
        onOpenCloudConfig={() => setIsCloudConfigOpen(true)} 
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1, width: '100%', position: 'relative' }}>
        {activeTab === 'home' && (
          <HomeTab 
            onOpenTransfer={() => setIsTransferOpen(true)}
            onOpenManageBanks={() => setIsManageBanksOpen(true)}
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
        {activeTab === 'cards' && (
          <CardsTab />
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      {activeTab === 'home' && (
        <button
          onClick={() => setIsAddOpen(true)}
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
      <AddExpenseModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
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

      <CloudConfigModal 
        isOpen={isCloudConfigOpen} 
        onClose={() => setIsCloudConfigOpen(false)} 
      />
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
