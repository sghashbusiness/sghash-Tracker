/**
 * Utility functions for Loan and Credit Card calculations
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const calculateLoanMetrics = (loan) => {
  const remainingMonths = Math.max(0, loan.totalMonths - loan.monthsPaid);
  // User spec: True payoff cost = exact EMI multiplied by remaining months
  const totalPendingAmount = loan.emi * remainingMonths;
  const pendingPrincipal = loan.currentPrincipal;
  // User spec: Future interest burden = Total Pending Amount minus Pending Principal
  const futureInterest = Math.max(0, totalPendingAmount - pendingPrincipal);
  const tenureProgress = loan.totalMonths > 0 ? (loan.monthsPaid / loan.totalMonths) * 100 : 0;

  return {
    remainingMonths,
    totalPendingAmount,
    pendingPrincipal,
    futureInterest,
    tenureProgress: Math.min(100, Math.round(tenureProgress)),
  };
};

/**
 * Calculates exact monthly split: Opening Principal, Interest Portion, Principal Deduction, Closing Principal
 */
export const generateAmortizationSchedule = (loan, maxMonths = 12) => {
  const monthlyRate = (loan.annualInterestRate / 12) / 100;
  let balance = loan.currentPrincipal;
  const schedule = [];

  for (let i = 1; i <= Math.min(loan.totalMonths - loan.monthsPaid, maxMonths); i++) {
    const opening = balance;
    const interest = Math.round(opening * monthlyRate);
    const principalDeduction = Math.min(opening, Math.max(0, loan.emi - interest));
    const closing = Math.max(0, Math.round(opening - principalDeduction));

    schedule.push({
      cycle: loan.monthsPaid + i,
      openingPrincipal: opening,
      interestPortion: interest,
      principalDeduction,
      closingPrincipal: closing
    });

    balance = closing;
    if (balance <= 0) break;
  }

  return schedule;
};

/**
 * Credit Card Billing Cycle Calculations
 */
export const calculateCardBillingInfo = (card, currentDate = new Date()) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed
  const currentDay = currentDate.getDate();

  // Statement date is 14th of each month
  let lastStatementDate;
  let nextStatementDate;

  if (currentDay >= card.statementDay) {
    lastStatementDate = new Date(currentYear, currentMonth, card.statementDay);
    nextStatementDate = new Date(currentYear, currentMonth + 1, card.statementDay);
  } else {
    lastStatementDate = new Date(currentYear, currentMonth - 1, card.statementDay);
    nextStatementDate = new Date(currentYear, currentMonth, card.statementDay);
  }

  // Calculate Due Date based on card rules
  let dueDate;
  if (card.dueRule === 'fixed_day') {
    // Axis: 2nd of the following month after statement
    dueDate = new Date(lastStatementDate.getFullYear(), lastStatementDate.getMonth() + 1, card.dueDay);
  } else {
    // UNI: Exact 17-day offset from last statement date
    dueDate = new Date(lastStatementDate.getTime() + (card.dueOffsetDays || 17) * 24 * 60 * 60 * 1000);
  }

  // Days left
  const diffTime = dueDate.getTime() - currentDate.getTime();
  const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const diffToNextStatement = nextStatementDate.getTime() - currentDate.getTime();
  const daysUntilNextStatement = Math.ceil(diffToNextStatement / (1000 * 60 * 60 * 24));

  return {
    lastStatementDate,
    nextStatementDate,
    dueDate,
    daysUntilDue,
    daysUntilNextStatement,
    isOverdue: daysUntilDue < 0
  };
};
