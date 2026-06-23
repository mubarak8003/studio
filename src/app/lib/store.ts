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

export type AppState = {
  sessions: Session[];
  activeSession: Session | null;
  recoveryTargetWins: number;
  baseStake: number;
  riskRewardRatio: number;
  manualDrawdown: number;
  useManualDrawdown: boolean;
};

export function useRecoupStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [state, setState] = useState<AppState>({
    sessions: [],
    activeSession: null,
    recoveryTargetWins: 3,
    baseStake: 10,
    riskRewardRatio: 1,
    manualDrawdown: 0,
    useManualDrawdown: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recouppro_state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState({
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
            riskRewardRatio: parsed.riskRewardRatio || 1,
            manualDrawdown: parsed.manualDrawdown || 0,
            useManualDrawdown: !!parsed.useManualDrawdown
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
      localStorage.setItem('recouppro_state', JSON.stringify(state));
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
      // Calculate net PnL to determine if we are in recovery
      const allTrades = [
        ...(prev.activeSession?.trades || []),
        ...prev.sessions.flatMap(s => s.trades)
      ];
      const netPnL = allTrades.reduce((sum, t) => sum + (t.type === 'win' ? t.amount : -t.amount), 0);
      const inDrawdown = prev.useManualDrawdown ? prev.manualDrawdown > 0 : netPnL < 0;

      let nextRecoveryTarget = prev.recoveryTargetWins;
      let nextManualDrawdown = prev.manualDrawdown;

      // Logic: If it's a win and we are recovering, decrease the win count needed
      if (type === 'win' && inDrawdown && prev.recoveryTargetWins > 1) {
        nextRecoveryTarget = prev.recoveryTargetWins - 1;
      }

      // Logic: If using manual recovery, update the remaining target amount dynamically
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
  };
}
