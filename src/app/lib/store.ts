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
};

export function useRecoupStore() {
  const [state, setState] = useState<AppState>(() => {
    // Basic persistent storage for local demo
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recouppro_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          sessions: parsed.sessions.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: s.endTime ? new Date(s.endTime) : undefined,
            trades: s.trades.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }))
          })),
          activeSession: parsed.activeSession ? {
             ...parsed.activeSession,
             startTime: new Date(parsed.activeSession.startTime),
             trades: parsed.activeSession.trades.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }))
          } : null,
          riskRewardRatio: parsed.riskRewardRatio || 1
        };
      }
    }
    return {
      sessions: [],
      activeSession: null,
      recoveryTargetWins: 3,
      baseStake: 10,
      riskRewardRatio: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('recouppro_state', JSON.stringify(state));
  }, [state]);

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
    setState(prev => ({
      ...prev,
      activeSession: prev.activeSession ? {
        ...prev.activeSession,
        trades: [...prev.activeSession.trades, newTrade]
      } : null
    }));
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

  return {
    ...state,
    startSession,
    stopSession,
    addTrade,
    setRecoveryTargetWins,
    setBaseStake,
    setRiskRewardRatio,
  };
}
