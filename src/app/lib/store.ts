
"use client"

import { useState, useEffect } from 'react';

export type Trade = {
  id: string;
  type: 'win' | 'loss';
  amount: number; // The NET amount after deduction (used for P&L)
  originalAmount: number; // The amount the user actually entered
  deduction: number; // The amount moved to the wallet
  timestamp: Date;
  description?: string;
};

export type Session = {
  id: string;
  name?: string;
  startTime: Date;
  endTime?: Date;
  trades: Trade[];
  isActive: boolean;
  // Session-specific strategy settings
  recoveryTargetWins: number;
  baseStake: number;
  riskRewardRatio: number;
  manualDrawdown: number;
  useManualDrawdown: boolean;
  walletDeductionPercent: number;
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountLabel: string;
  balance: number;
  lastUpdated: Date;
};

export type InvestmentType = 'FD' | 'RD';

export type Investment = {
  id: string;
  type: InvestmentType;
  bankName: string;
  principalAmount: number;
  interestRate: number;
  startDate: Date;
  maturityDate: Date;
  monthlyInstallment?: number;
  status: 'active' | 'matured';
};

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'PKR' | 'BDT';

export type AppState = {
  sessions: Session[];
  activeSession: Session | null;
  // Global defaults for NEW sessions
  recoveryTargetWins: number;
  baseStake: number;
  riskRewardRatio: number;
  manualDrawdown: number;
  useManualDrawdown: boolean;
  currency: CurrencyCode;
  // Position Sizer Defaults
  accountBalance: number;
  riskPerTradePercent: number;
  riskAmountFixed: number;
  riskType: 'percentage' | 'amount';
  notes: string;
  // Wallet System
  walletBalance: number;
  walletDeductionPercent: number;
  // Banking & Vault
  bankAccounts: BankAccount[];
  investments: Investment[];
};

const DEFAULT_STATE: AppState = {
  sessions: [],
  activeSession: null,
  recoveryTargetWins: 3,
  baseStake: 10,
  riskRewardRatio: 1,
  manualDrawdown: 0,
  useManualDrawdown: false,
  currency: 'INR',
  accountBalance: 100000,
  riskPerTradePercent: 1,
  riskAmountFixed: 1000,
  riskType: 'percentage',
  notes: '',
  walletBalance: 0,
  walletDeductionPercent: 0,
  bankAccounts: [],
  investments: [],
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
  SAR: '﷼',
  PKR: '₨',
  BDT: '৳'
};

export function useRecoupStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recouppro_state_v13');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Cleanup empty sessions
          const cleanHistory = (parsed.sessions || []).filter((s: any) => s.trades && s.trades.length > 0);
          
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            sessions: cleanHistory.map((s: any) => ({
              ...s,
              startTime: new Date(s.startTime),
              endTime: s.endTime ? new Date(s.endTime) : undefined,
              trades: (s.trades || []).map((t: any) => ({ 
                ...t, 
                timestamp: new Date(t.timestamp),
                originalAmount: t.originalAmount ?? t.amount,
                deduction: t.deduction ?? 0
              }))
            })),
            activeSession: parsed.activeSession ? {
               ...parsed.activeSession,
               startTime: new Date(parsed.activeSession.startTime),
               trades: (parsed.activeSession.trades || []).map((t: any) => ({ 
                 ...t, 
                 timestamp: new Date(t.timestamp),
                 originalAmount: t.originalAmount ?? t.amount,
                 deduction: t.deduction ?? 0
               }))
            } : null,
            bankAccounts: (parsed.bankAccounts || []).map((b: any) => ({
              ...b,
              lastUpdated: new Date(b.lastUpdated)
            })),
            investments: (parsed.investments || []).map((i: any) => ({
              ...i,
              startDate: new Date(i.startDate),
              maturityDate: new Date(i.maturityDate)
            })),
          });
        } catch (e) {
          console.error("Failed to parse recouppro_state", e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('recouppro_state_v13', JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const startSession = (name?: string) => {
    setState(prev => {
      const newSession: Session = {
        id: crypto.randomUUID(),
        name: name || `Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        startTime: new Date(),
        trades: [],
        isActive: true,
        recoveryTargetWins: prev.recoveryTargetWins,
        baseStake: prev.baseStake,
        riskRewardRatio: prev.riskRewardRatio,
        manualDrawdown: prev.manualDrawdown,
        useManualDrawdown: prev.useManualDrawdown,
        walletDeductionPercent: prev.walletDeductionPercent,
      };

      let newSessions = prev.sessions;
      if (prev.activeSession && prev.activeSession.trades.length > 0) {
        newSessions = [{ ...prev.activeSession, isActive: false, endTime: new Date() }, ...prev.sessions];
      }

      return {
        ...prev,
        activeSession: newSession,
        sessions: newSessions
      };
    });
  };

  const stopSession = () => {
    setState(prev => {
      if (!prev.activeSession) return prev;
      if (prev.activeSession.trades.length === 0) {
        return { ...prev, activeSession: null };
      }
      const finishedSession = { ...prev.activeSession, endTime: new Date(), isActive: false };
      return {
        ...prev,
        sessions: [finishedSession, ...prev.sessions],
        activeSession: null
      };
    });
  };

  const resumeSession = (sessionId: string) => {
    setState(prev => {
      const sessionToResume = prev.sessions.find(s => s.id === sessionId);
      if (!sessionToResume) return prev;
      
      const updatedSessions = prev.sessions.filter(s => s.id !== sessionId);
      let newSessionsList = updatedSessions;
      if (prev.activeSession && prev.activeSession.trades.length > 0) {
        newSessionsList = [{ ...prev.activeSession, isActive: false, endTime: new Date() }, ...updatedSessions];
      }
        
      return {
        ...prev,
        activeSession: { ...sessionToResume, isActive: true, endTime: undefined },
        sessions: newSessionsList
      };
    });
  };

  const deleteSession = (sessionId: string) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== sessionId),
      activeSession: prev.activeSession?.id === sessionId ? null : prev.activeSession
    }));
  };

  const addTrade = (type: 'win' | 'loss', inputAmount: number, description?: string) => {
    if (!state.activeSession) return;
    
    setState(prev => {
      if (!prev.activeSession) return prev;
      
      const currentSession = prev.activeSession;
      const deduction = inputAmount * (currentSession.walletDeductionPercent / 100);
      const netAmount = type === 'win' ? inputAmount - deduction : inputAmount + deduction;

      const newTrade: Trade = {
        id: crypto.randomUUID(),
        type,
        amount: netAmount,
        originalAmount: inputAmount,
        deduction,
        timestamp: new Date(),
        description,
      };

      const tradesAfterAdd = [...currentSession.trades, newTrade];
      
      let nextRecoveryTarget = currentSession.recoveryTargetWins;
      let nextManualDrawdown = currentSession.manualDrawdown;

      if (type === 'win') {
        if (nextRecoveryTarget > 0) nextRecoveryTarget = nextRecoveryTarget - 1;
      } else {
        nextRecoveryTarget = nextRecoveryTarget + 1;
      }

      if (currentSession.useManualDrawdown) {
        if (type === 'win') {
          nextManualDrawdown = Math.max(0, currentSession.manualDrawdown - netAmount);
        } else {
          nextManualDrawdown = currentSession.manualDrawdown + netAmount;
        }
      }

      return {
        ...prev,
        walletBalance: prev.walletBalance + deduction,
        activeSession: {
          ...currentSession,
          trades: tradesAfterAdd,
          recoveryTargetWins: nextRecoveryTarget,
          manualDrawdown: nextManualDrawdown,
        }
      };
    });
  };

  // Banking Actions
  const addBankAccount = (bank: Omit<BankAccount, 'id' | 'lastUpdated'>) => {
    setState(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, { ...bank, id: crypto.randomUUID(), lastUpdated: new Date() }]
    }));
  };

  const updateBankAccount = (id: string, updates: Partial<BankAccount>) => {
    setState(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(b => b.id === id ? { ...b, ...updates, lastUpdated: new Date() } : b)
    }));
  };

  const deleteBankAccount = (id: string) => {
    setState(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(b => b.id !== id)
    }));
  };

  const addInvestment = (inv: Omit<Investment, 'id'>) => {
    setState(prev => ({
      ...prev,
      investments: [...prev.investments, { ...inv, id: crypto.randomUUID() }]
    }));
  };

  const deleteInvestment = (id: string) => {
    setState(prev => ({
      ...prev,
      investments: prev.investments.filter(i => i.id !== id)
    }));
  };

  // Setters
  const setRecoveryTargetWins = (n: number) => {
    setState(prev => {
      if (prev.activeSession) return { ...prev, activeSession: { ...prev.activeSession, recoveryTargetWins: n } };
      return { ...prev, recoveryTargetWins: n };
    });
  };

  const setBaseStake = (n: number) => {
    setState(prev => {
      if (prev.activeSession) return { ...prev, activeSession: { ...prev.activeSession, baseStake: n } };
      return { ...prev, baseStake: n };
    });
  };

  const setRiskRewardRatio = (n: number) => {
    setState(prev => {
      if (prev.activeSession) return { ...prev, activeSession: { ...prev.activeSession, riskRewardRatio: n } };
      return { ...prev, riskRewardRatio: n };
    });
  };

  const setManualDrawdown = (n: number) => {
    setState(prev => {
      if (prev.activeSession) return { ...prev, activeSession: { ...prev.activeSession, manualDrawdown: n } };
      return { ...prev, manualDrawdown: n };
    });
  };

  const setUseManualDrawdown = (b: boolean) => {
    setState(prev => {
      if (prev.activeSession) return { ...prev, activeSession: { ...prev.activeSession, useManualDrawdown: b } };
      return { ...prev, useManualDrawdown: b };
    });
  };

  const setWalletDeductionPercent = (n: number) => {
    setState(prev => {
      if (prev.activeSession) return { ...prev, activeSession: { ...prev.activeSession, walletDeductionPercent: n } };
      return { ...prev, walletDeductionPercent: n };
    });
  };

  const setCurrency = (c: CurrencyCode) => setState(prev => ({ ...prev, currency: c }));
  const setAccountBalance = (n: number) => setState(prev => ({ ...prev, accountBalance: n }));
  const setRiskPerTradePercent = (n: number) => setState(prev => ({ ...prev, riskPerTradePercent: n }));
  const setRiskAmountFixed = (n: number) => setState(prev => ({ ...prev, riskAmountFixed: n }));
  const setRiskType = (t: 'percentage' | 'amount') => setState(prev => ({ ...prev, riskType: t }));
  const setNotes = (n: string) => setState(prev => ({ ...prev, notes: n }));

  const resetAllData = () => {
    setState(prev => ({
      ...DEFAULT_STATE,
      bankAccounts: prev.bankAccounts,
      investments: prev.investments,
      sessions: [],
      activeSession: null,
      walletBalance: 0,
      notes: prev.notes
    }));
  };

  return {
    ...state,
    isHydrated,
    startSession,
    stopSession,
    resumeSession,
    deleteSession,
    addTrade,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addInvestment,
    deleteInvestment,
    setRecoveryTargetWins,
    setBaseStake,
    setRiskRewardRatio,
    setManualDrawdown,
    setUseManualDrawdown,
    setCurrency,
    setAccountBalance,
    setRiskPerTradePercent,
    setRiskAmountFixed,
    setRiskType,
    setNotes,
    setWalletDeductionPercent,
    resetAllData
  };
}
