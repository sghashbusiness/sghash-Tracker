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

export const calculateLoanMetrics = (loan, totalExpenses = 0) => {
  // Compute dynamically paid months: Initial + (Expenses / EMI)
  const additionalMonthsPaid = Math.floor(totalExpenses / loan.emi);
  const totalMonthsPaid = (loan.initialMonthsPaid || 0) + additionalMonthsPaid;
  
  const remainingMonths = Math.max(0, loan.totalMonths - totalMonthsPaid);
  const totalPendingAmount = loan.emi * remainingMonths;
  const tenureProgress = loan.totalMonths > 0 ? (totalMonthsPaid / loan.totalMonths) * 100 : 0;

  return {
    totalMonthsPaid,
    remainingMonths,
    totalPendingAmount,
    tenureProgress: Math.min(100, Math.round(tenureProgress)),
  };
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
