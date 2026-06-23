"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useRecoupStore } from './lib/store';
import { 
  TrendingUp, 
  TrendingDown, 
  Settings2, 
  Plus, 
  StopCircle, 
  PlayCircle,
  History,
  Activity,
  Calculator,
  ChevronRight,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Info,
  Target,
  PenLine,
  Menu,
  ArrowLeft,
  Trash2,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { AICoachPanel } from '@/components/recoup/ai-coach-panel';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

const AppLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <rect x="25" y="45" width="12" height="35" rx="2" fill="currentColor" opacity="0.3" />
    <rect x="45" y="30" width="12" height="50" rx="2" fill="currentColor" opacity="0.6" />
    <rect x="65" y="15" width="12" height="65" rx="2" fill="currentColor" />
    <path 
      d="M10 70L30 50L50 65L85 20" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M70 20H85V35" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="12" cy="78" r="3" fill="currentColor" opacity="0.5" />
    <circle cx="5" cy="85" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

const StrategySettings = ({ store, stats }: { store: any, stats: any }) => {
  const [localBaseStake, setLocalBaseStake] = useState(store.baseStake.toString());
  const [localManualDrawdown, setLocalManualDrawdown] = useState(store.manualDrawdown.toString());
  const [localRecoveryTarget, setLocalRecoveryTarget] = useState(store.recoveryTargetWins.toString());
  const [localRRRatio, setLocalRRRatio] = useState(store.riskRewardRatio.toString());

  useEffect(() => {
    setLocalBaseStake(store.baseStake.toString());
  }, [store.baseStake]);

  useEffect(() => {
    setLocalManualDrawdown(store.manualDrawdown.toString());
  }, [store.manualDrawdown]);

  useEffect(() => {
    setLocalRecoveryTarget(store.recoveryTargetWins.toString());
  }, [store.recoveryTargetWins]);

  useEffect(() => {
    setLocalRRRatio(store.riskRewardRatio.toString());
  }, [store.riskRewardRatio]);

  const handleBaseStakeChange = (val: string) => {
    setLocalBaseStake(val);
    if (val !== '') store.setBaseStake(Number(val));
  };

  const handleManualDrawdownChange = (val: string) => {
    setLocalManualDrawdown(val);
    if (val !== '') store.setManualDrawdown(Number(val));
  };

  const handleRecoveryTargetChange = (val: string) => {
    setLocalRecoveryTarget(val);
    if (val !== '') store.setRecoveryTargetWins(Math.max(1, Number(val)));
  };

  const handleRRRatioChange = (val: string) => {
    setLocalRRRatio(val);
    if (val !== '' && !isNaN(Number(val))) {
      store.setRiskRewardRatio(Number(val));
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground">Base Stake ($)</label>
        <Input 
          type="number" 
          inputMode="decimal"
          value={localBaseStake} 
          onChange={(e) => handleBaseStakeChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="bg-background border-border"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            RR Ratio <Scale className="h-3 w-3" />
          </label>
          <div className="flex items-center gap-1">
            <Input 
              type="number" 
              inputMode="decimal"
              value={localRRRatio} 
              onChange={(e) => handleRRRatioChange(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-16 h-7 text-xs bg-background text-right"
              step="0.1"
            />
            <span className="text-xs font-bold text-accent">x</span>
          </div>
        </div>
        <Slider 
          value={[store.riskRewardRatio]} 
          min={0.1} 
          max={5} 
          step={0.1}
          onValueChange={([val]) => store.setRiskRewardRatio(val)}
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <PenLine className="h-3 w-3" /> Manual Recovery
          </label>
          <Switch 
            checked={store.useManualDrawdown} 
            onCheckedChange={store.setUseManualDrawdown} 
          />
        </div>
        
        {store.useManualDrawdown && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
            <label className="text-[10px] text-muted-foreground uppercase">Loss to Recover ($)</label>
            <Input 
              type="number" 
              inputMode="decimal"
              placeholder="Enter amount..."
              value={localManualDrawdown} 
              onChange={(e) => handleManualDrawdownChange(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="bg-background border-border h-8 text-xs"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-3 w-3" /> Recovery Trades
          </label>
          <Input 
            type="number"
            inputMode="numeric"
            value={localRecoveryTarget}
            onChange={(e) => handleRecoveryTargetChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-16 h-7 text-xs bg-background text-right"
            min={1}
          />
        </div>
        <Slider 
          value={[store.recoveryTargetWins]} 
          min={1} 
          max={30} 
          step={1}
          onValueChange={([val]) => store.setRecoveryTargetWins(val)}
        />
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic">
          <Info className="h-3 w-3" />
          {store.recoveryTargetWins <= 5 ? 'Aggressive recovery' : store.recoveryTargetWins <= 15 ? 'Balanced recovery' : 'Conservative recovery'}.
        </div>
      </div>

      <div className={cn(
        "p-3 rounded-lg border flex flex-col gap-2",
        stats.riskLevel === 'high' ? "bg-red-500/5 border-red-500/20" : 
        stats.riskLevel === 'medium' ? "bg-yellow-500/5 border-yellow-500/20" : 
        "bg-primary/5 border-primary/20"
      )}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
          {stats.riskLevel === 'high' ? <ShieldAlert className="h-3 w-3 text-red-500" /> : 
           stats.riskLevel === 'medium' ? <Shield className="h-3 w-3 text-yellow-500" /> : 
           <ShieldCheck className="h-3 w-3 text-primary" />}
          Risk Profile: {stats.riskLevel}
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">
          {stats.riskLevel === 'high' ? 'Warning: Recovery stake is very high. Consider increasing recovery trades.' : 
           stats.riskLevel === 'medium' ? 'Recovery is active. Follow the plan strictly.' : 
           'Strategy is within safe operational limits.'}
        </p>
      </div>

      <div className="pt-6 border-t border-border/30">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2 text-destructive hover:text-destructive border-destructive/20">
              <Trash2 className="h-3 w-3" /> Reset All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your sessions, trade history, and reset your strategy settings. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={store.resetAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Reset All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const store = useRecoupStore();
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const allTrades = [
      ...(store.activeSession?.trades || []),
      ...store.sessions.flatMap(s => s.trades)
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const wins = allTrades.filter(t => t.type === 'win');
    const losses = allTrades.filter(t => t.type === 'loss');
    
    const totalProfit = wins.reduce((sum, t) => sum + t.amount, 0);
    const totalLoss = losses.reduce((sum, t) => sum + t.amount, 0);
    
    const netPnL = totalProfit - totalLoss;
    
    const currentDrawdown = store.useManualDrawdown 
      ? store.manualDrawdown 
      : (netPnL < 0 ? Math.abs(netPnL) : 0);
    
    const requiredProfitPerTrade = currentDrawdown > 0 
      ? currentDrawdown / (store.recoveryTargetWins || 1) 
      : 0;
      
    const recoveryStakeAdjustment = requiredProfitPerTrade / (store.riskRewardRatio || 1);
    const nextStake = store.baseStake + recoveryStakeAdjustment;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (currentDrawdown > 0) {
      const recoveryRatio = recoveryStakeAdjustment / store.baseStake;
      if (recoveryRatio > 2) riskLevel = 'high';
      else if (recoveryRatio > 0.5) riskLevel = 'medium';
    }

    return {
      allTrades,
      wins,
      losses,
      totalProfit,
      totalLoss,
      netPnL,
      currentDrawdown,
      requiredProfitPerTrade,
      nextStake,
      recoveryStakeAdjustment,
      riskLevel,
      winRate: allTrades.length > 0 
        ? (wins.length / allTrades.length) * 100 
        : 0,
      avgWin: wins.length > 0 ? totalProfit / wins.length : 0,
      avgLoss: losses.length > 0 ? totalLoss / losses.length : 0,
    };
  }, [store]);

  const handleAddTrade = (type: 'win' | 'loss') => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;
    store.addTrade(type, amount);
    setTradeAmount('');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-svh overflow-x-hidden">
      {/* Mobile Top Navigation */}
      <header className="md:hidden sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shadow-lg ring-1 ring-white/20">
            <AppLogo className="text-white h-7 w-7" />
          </div>
          <h1 className="text-xl font-headline font-bold text-primary tracking-tight">RecoupPro</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm bg-card border-r border-border p-0 flex flex-col">
              <div className="p-6 border-b border-border">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                      <AppLogo className="h-6 w-6 text-white" />
                    </div>
                    <span>Strategy Coach</span>
                  </SheetTitle>
                </SheetHeader>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="space-y-8">
                  <nav className="space-y-2">
                    <Button variant={!showHistory ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setShowHistory(false)}>
                      <Activity className="h-4 w-4" /> Dashboard
                    </Button>
                    <Button variant={showHistory ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setShowHistory(true)}>
                      <History className="h-4 w-4" /> History
                    </Button>
                  </nav>
                  <Separator />
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Strategy Engine</h3>
                    </div>
                    <StrategySettings store={store} stats={stats} />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="w-80 border-r border-border bg-card/50 hidden md:flex flex-col p-6 sticky top-0 h-svh overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shadow-xl ring-2 ring-white/10">
                <AppLogo className="text-white h-9 w-9" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-headline font-bold text-primary leading-none tracking-tight">RecoupPro</h1>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">Smart Recovery</span>
              </div>
            </div>
            <ModeToggle />
          </div>

          <nav className="space-y-2 mb-8">
            <Button variant={!showHistory ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setShowHistory(false)}>
              <Activity className="h-4 w-4" /> Dashboard
            </Button>
            <Button variant={showHistory ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setShowHistory(true)}>
              <History className="h-4 w-4" /> History
            </Button>
          </nav>

          <Separator className="mb-8" />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Strategy Engine</h3>
            </div>
            <StrategySettings store={store} stats={stats} />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-svh p-4 md:p-10 bg-background/40 overflow-x-hidden">
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {!showHistory ? (
              <>
                {/* Dashboard View */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 text-foreground">Trading Control</h2>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {store.activeSession ? 'Session in progress...' : 'Start a session to begin tracking.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {store.activeSession ? (
                      <Button variant="destructive" className="flex-1 md:flex-none gap-2" onClick={store.stopSession}>
                        <StopCircle className="h-4 w-4" /> Stop Session
                      </Button>
                    ) : (
                      <Button variant="default" className="flex-1 md:flex-none gap-2 bg-primary hover:bg-primary/90 glow-primary" onClick={store.startSession}>
                        <PlayCircle className="h-4 w-4" /> Start Session
                      </Button>
                    )}
                  </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 bg-card border-primary/20 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 hidden md:block">
                      <Calculator className="h-24 w-24" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary text-lg md:text-xl">
                        <Calculator className="h-5 w-5" /> Recommended Entry
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Based on target of <b>${stats.currentDrawdown.toFixed(2)}</b> in <b>{store.recoveryTargetWins}</b> trades
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6 md:py-8 border-b border-border/30 mb-6">
                        <div className="text-6xl md:text-8xl font-headline font-bold text-foreground transition-all duration-300">
                          ${stats.nextStake.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-semibold">Total Trade Amount</p>
                        <div className="mt-4 flex flex-col items-center gap-2">
                          <Badge variant={stats.currentDrawdown > 0 ? "destructive" : "secondary"}>
                            {store.useManualDrawdown ? 'Manual Target: ' : 'Session Loss: '}${stats.currentDrawdown.toFixed(2)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                           <h4 className="font-bold mb-3 flex items-center gap-2 text-muted-foreground">
                             <Target className="h-3 w-3" /> Profit Breakdown
                           </h4>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center">
                               <span>Base Profit Target:</span>
                               <span className="font-mono font-bold">${(store.baseStake * store.riskRewardRatio).toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-red-500">
                               <span>Recovery Component:</span>
                               <span className="font-mono font-bold">+ ${stats.requiredProfitPerTrade.toFixed(2)}</span>
                             </div>
                             <Separator className="bg-border/50" />
                             <div className="flex justify-between items-center text-primary font-bold">
                               <span>Total Win Goal:</span>
                               <span className="font-mono">${( (store.baseStake * store.riskRewardRatio) + stats.requiredProfitPerTrade ).toFixed(2)}</span>
                             </div>
                           </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                           <h4 className="font-bold mb-3 flex items-center gap-2 text-primary">
                             <ArrowUpRight className="h-3 w-3" /> Investment Logic
                           </h4>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center">
                               <span>Base Investment:</span>
                               <span className="font-mono">${store.baseStake.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-accent font-bold">
                               <span>Recovery Adjustment:</span>
                               <span className="font-mono">+ ${stats.recoveryStakeAdjustment.toFixed(2)}</span>
                             </div>
                             <div className="text-[10px] text-muted-foreground italic mt-2 leading-tight">
                               Calculation: (Target / {store.riskRewardRatio} RR)
                             </div>
                           </div>
                        </div>
                      </div>

                      {store.activeSession && (
                        <div className="mt-8 pt-6 border-t border-border/50">
                          <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                              <Input 
                                placeholder="Trade P/L Amount" 
                                type="number" 
                                inputMode="decimal"
                                value={tradeAmount} 
                                onChange={(e) => setTradeAmount(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                className="text-lg py-6 bg-background focus:ring-primary"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                size="lg" 
                                className="flex-1 bg-green-600 hover:bg-green-700 h-auto px-6 py-4 md:py-2 text-white"
                                onClick={() => handleAddTrade('win')}
                              >
                                <TrendingUp className="h-6 w-6" />
                              </Button>
                              <Button 
                                size="lg" 
                                className="flex-1 bg-red-600 hover:bg-red-700 h-auto px-6 py-4 md:py-2 text-white"
                                onClick={() => handleAddTrade('loss')}
                              >
                                <TrendingDown className="h-6 w-6" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Session Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Win Rate</span>
                          <span className="font-bold">{stats.winRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full glow-primary transition-all duration-1000" 
                            style={{ width: `${stats.winRate}%` }} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Net Balance</span>
                          <div className={cn("text-lg md:text-xl font-headline font-bold", stats.netPnL >= 0 ? "text-green-500" : "text-red-500")}>
                            {stats.netPnL >= 0 ? '+' : ''}{stats.netPnL.toFixed(2)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Current Drawdown</span>
                          <div className="text-lg md:text-xl font-headline font-bold text-red-400">
                            ${Math.max(0, -stats.netPnL).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border/50">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2"><Plus className="h-3 w-3 text-green-500" /> Avg Win</span>
                            <span>${stats.avgWin.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2"><div className="h-[2px] w-3 bg-red-500" /> Avg Loss</span>
                            <span>${stats.avgLoss.toFixed(2)}</span>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Trade Log</CardTitle>
                        <CardDescription className="text-xs">Recent entries</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} className="text-xs bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {stats.allTrades.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                              <Activity className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-sm">Waiting for first trade...</p>
                            </div>
                          )}
                          {stats.allTrades.slice(0, 10).map((trade) => (
                            <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/30">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "p-2 rounded-md",
                                  trade.type === 'win' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}>
                                  {trade.type === 'win' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">${trade.amount.toFixed(2)}</p>
                                  <p className="text-[10px] text-muted-foreground">{trade.timestamp.toLocaleTimeString()}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className={cn(
                                "text-[10px]",
                                trade.type === 'win' ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"
                              )}>
                                {trade.type.toUpperCase()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <AICoachPanel 
                    totalCurrentLoss={stats.currentDrawdown}
                    recoveryTargetWins={store.recoveryTargetWins}
                    recentWinRatePercentage={stats.winRate}
                    averageWinAmount={stats.avgWin}
                    averageLossAmount={stats.avgLoss}
                  />
                </div>
              </>
            ) : (
              /* History View */
              <div className="space-y-6">
                <header className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h2 className="text-3xl font-headline font-bold">Trade History</h2>
                      <p className="text-muted-foreground text-sm">Review all session activity and recorded trades.</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="px-4 py-1 text-primary border-primary/30">
                    Total Trades: {stats.allTrades.length}
                  </Badge>
                </header>

                <div className="grid grid-cols-1 gap-6">
                  {stats.allTrades.length === 0 ? (
                    <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 bg-background/50">
                      <History className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                      <h3 className="text-lg font-semibold">No history yet</h3>
                      <p className="text-muted-foreground text-sm mb-6">Your recorded trades will appear here.</p>
                      <Button onClick={() => setShowHistory(false)}>Return to Dashboard</Button>
                    </Card>
                  ) : (
                    <Card className="bg-card">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Full Audit Log</CardTitle>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-4 text-sm mr-4 hidden md:flex">
                              <span className="flex items-center gap-1 text-green-500"><TrendingUp className="h-3 w-3" /> {stats.wins.length} Wins</span>
                              <span className="flex items-center gap-1 text-red-500"><TrendingDown className="h-3 w-3" /> {stats.losses.length} Losses</span>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats.allTrades.map((trade, idx) => (
                            <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/30 hover:border-primary/20 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="text-xs text-muted-foreground font-mono w-6">#{stats.allTrades.length - idx}</div>
                                <div className={cn(
                                  "p-3 rounded-xl",
                                  trade.type === 'win' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}>
                                  {trade.type === 'win' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-lg font-bold">${trade.amount.toFixed(2)}</p>
                                    <Badge variant="outline" className={cn(
                                      "text-[10px] h-5",
                                      trade.type === 'win' ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"
                                    )}>
                                      {trade.type.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {trade.timestamp.toLocaleDateString()} at {trade.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Status</p>
                                <p className={cn("text-xs font-bold", trade.type === 'win' ? "text-green-500" : "text-red-500")}>
                                  {trade.type === 'win' ? 'PROFIT' : 'LOSS'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}