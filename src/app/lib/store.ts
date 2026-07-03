
"use client"

import { useState, useEffect } from 'react';

export type Trade = {
  id: string;
  type: 'win' | 'loss';
  amount: number; // The NET amount after deduction (used for P&L)
  originalAmount: number; // The amount the user actually entered
  deduction: number; // The amount moved to the wallet
  timestamp: Date;
};

export type Session = {
  id: string;
  name?: string;
  startTime: Date;
  endTime?: Date;
  trades: Trade[];
  isActive: boolean;
};

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'PKR' | 'BDT';

export type AppState = {
  sessions: Session[];
  activeSession: Session | null;
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
      const saved = localStorage.getItem('recouppro_state_v11');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            sessions: (parsed.sessions || []).map((s: any) => ({
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
      localStorage.setItem('recouppro_state_v11', JSON.stringify(state));
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
      };

      // If current session is empty, just replace it. 
      // If it has trades, move it to history before starting new.
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
      
      // Only add to history if it has trades
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
      
      // If current active session is empty, discard it. 
      // If it has trades, save it to history.
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

  const addTrade = (type: 'win' | 'loss', inputAmount: number) => {
    if (!state.activeSession) return;
    
    setState(prev => {
      const deduction = inputAmount * (prev.walletDeductionPercent / 100);
      const netAmount = type === 'win' ? inputAmount - deduction : inputAmount + deduction;

      const newTrade: Trade = {
        id: crypto.randomUUID(),
        type,
        amount: netAmount,
        originalAmount: inputAmount,
        deduction,
        timestamp: new Date(),
      };

      const chronTrades = [
        ...prev.sessions.flatMap(s => s.trades),
        ...(prev.activeSession?.trades || [])
      ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      let runningPnL = 0;
      let peakPnL = 0;
      chronTrades.forEach(t => {
        runningPnL += (t.type === 'win' ? t.amount : -t.amount);
        if (runningPnL > peakPnL) peakPnL = runningPnL;
      });

      const isActuallyInDrawdown = prev.useManualDrawdown 
        ? prev.manualDrawdown > 0 
        : (peakPnL - (runningPnL + (type === 'win' ? netAmount : -netAmount)) > 0);

      let nextRecoveryTarget = prev.recoveryTargetWins;
      let nextManualDrawdown = prev.manualDrawdown;

      if (type === 'win' && isActuallyInDrawdown && prev.recoveryTargetWins > 0) {
        nextRecoveryTarget = prev.recoveryTargetWins - 1;
      }

      if (prev.useManualDrawdown) {
        if (type === 'win') {
          nextManualDrawdown = Math.max(0, prev.manualDrawdown - netAmount);
        } else {
          nextManualDrawdown = prev.manualDrawdown + netAmount;
        }
      }

      return {
        ...prev,
        recoveryTargetWins: nextRecoveryTarget,
        manualDrawdown: nextManualDrawdown,
        walletBalance: prev.walletBalance + deduction,
        activeSession: prev.activeSession ? {
          ...prev.activeSession,
          trades: [...prev.activeSession.trades, newTrade]
        } : null
      };
    });
  };

  const setRecoveryTargetWins = (n: number) => {
    setState(prev => ({ ...prev, recoveryTargetWins: n }));
  };

  const setBaseStake = (n: number) => {
    setState(prev => ({ ...prev, baseStake: n }));
  };

  const setRiskRewardRatio = (n: number) => {
    setState(prev => ({ ...prev, riskRewardRatio: n }));
  };

  const setManualDrawdown = (n: number) => {
    setState(prev => ({ ...prev, manualDrawdown: n }));
  };

  const setUseManualDrawdown = (b: boolean) => {
    setState(prev => ({ ...prev, useManualDrawdown: b }));
  };

  const setCurrency = (c: CurrencyCode) => {
    setState(prev => ({ ...prev, currency: c }));
  };

  const setAccountBalance = (n: number) => {
    setState(prev => ({ ...prev, accountBalance: n }));
  };

  const setRiskPerTradePercent = (n: number) => {
    setState(prev => ({ ...prev, riskPerTradePercent: n }));
  };

  const setRiskAmountFixed = (n: number) => {
    setState(prev => ({ ...prev, riskAmountFixed: n }));
  };

  const setRiskType = (t: 'percentage' | 'amount') => {
    setState(prev => ({ ...prev, riskType: t }));
  };

  const setNotes = (n: string) => {
    setState(prev => ({ ...prev, notes: n }));
  };

  const setWalletDeductionPercent = (n: number) => {
    setState(prev => ({ ...prev, walletDeductionPercent: n }));
  };

  const resetAllData = () => {
    setState(prev => ({
      ...DEFAULT_STATE,
      baseStake: prev.baseStake,
      currency: prev.currency,
      riskRewardRatio: prev.riskRewardRatio,
      recoveryTargetWins: prev.recoveryTargetWins,
      useManualDrawdown: prev.useManualDrawdown,
      accountBalance: prev.accountBalance,
      riskPerTradePercent: prev.riskPerTradePercent,
      riskAmountFixed: prev.riskAmountFixed,
      riskType: prev.riskType,
      notes: prev.notes, 
      walletDeductionPercent: prev.walletDeductionPercent,
      sessions: [],
      activeSession: null,
      manualDrawdown: 0,
      walletBalance: 0,
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
