
"use client"

import { useState, useEffect } from 'react';

export type Trade = {
  id: string;
  type: 'win' | 'loss';
  amount: number;
  timestamp: Date;
};

export type Session = {
  id: string;
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
  notes: ''
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
      const saved = localStorage.getItem('recouppro_state_v5');
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
              trades: (s.trades || []).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }))
            })),
            activeSession: parsed.activeSession ? {
               ...parsed.activeSession,
               startTime: new Date(parsed.activeSession.startTime),
               trades: (parsed.activeSession.trades || []).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }))
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
      localStorage.setItem('recouppro_state_v5', JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const startSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      startTime: new Date(),
      trades: [],
      isActive: true,
    };
    setState(prev => ({ ...prev, activeSession: newSession }));
  };

  const stopSession = () => {
    if (!state.activeSession) return;
    const finishedSession = { ...state.activeSession, endTime: new Date(), isActive: false };
    setState(prev => ({
      ...prev,
      sessions: [finishedSession, ...prev.sessions],
      activeSession: null
    }));
  };

  const addTrade = (type: 'win' | 'loss', amount: number) => {
    if (!state.activeSession) return;
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      type,
      amount,
      timestamp: new Date(),
    };

    setState(prev => {
      const allTrades = [
        ...(prev.activeSession?.trades || []),
        ...prev.sessions.flatMap(s => s.trades)
      ];
      const netPnL = allTrades.reduce((sum, t) => sum + (t.type === 'win' ? t.amount : -t.amount), 0);
      const inDrawdown = prev.useManualDrawdown ? prev.manualDrawdown > 0 : netPnL < 0;

      let nextRecoveryTarget = prev.recoveryTargetWins;
      let nextManualDrawdown = prev.manualDrawdown;

      if (type === 'win' && inDrawdown && prev.recoveryTargetWins > 1) {
        nextRecoveryTarget = prev.recoveryTargetWins - 1;
      }

      if (prev.useManualDrawdown) {
        if (type === 'win') {
          nextManualDrawdown = Math.max(0, prev.manualDrawdown - amount);
        } else {
          nextManualDrawdown = prev.manualDrawdown + amount;
        }
      }

      return {
        ...prev,
        recoveryTargetWins: nextRecoveryTarget,
        manualDrawdown: nextManualDrawdown,
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
      notes: prev.notes, // Preserve trading notes during reset
      sessions: [],
      activeSession: null,
      manualDrawdown: 0,
    }));
  };

  return {
    ...state,
    isHydrated,
    startSession,
    stopSession,
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
    resetAllData
  };
}
