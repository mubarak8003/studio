
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
  BrainCircuit,
  ChevronRight,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Info,
  Target,
  PenLine,
  Menu
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
import { AICoachPanel } from '@/components/recoup/ai-coach-panel';
import { cn } from '@/lib/utils';

// Move component outside of Dashboard to prevent focus loss during typing
const StrategySettings = ({ store, stats }: { store: any, stats: any }) => {
  const [localBaseStake, setLocalBaseStake] = useState(store.baseStake.toString());
  const [localManualDrawdown, setLocalManualDrawdown] = useState(store.manualDrawdown.toString());
  const [localRecoveryTarget, setLocalRecoveryTarget] = useState(store.recoveryTargetWins.toString());

  useEffect(() => {
    setLocalBaseStake(store.baseStake.toString());
  }, [store.baseStake]);

  useEffect(() => {
    setLocalManualDrawdown(store.manualDrawdown.toString());
  }, [store.manualDrawdown]);

  useEffect(() => {
    setLocalRecoveryTarget(store.recoveryTargetWins.toString());
  }, [store.recoveryTargetWins]);

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
          className="bg-obsidian border-border"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            RR Ratio <Scale className="h-3 w-3" />
          </label>
          <span className="text-xs font-bold text-sky-blue">{store.riskRewardRatio}x</span>
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
              className="bg-obsidian border-border h-8 text-xs"
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
            className="w-16 h-7 text-xs bg-obsidian text-right"
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
        "bg-green-500/5 border-green-500/20"
      )}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
          {stats.riskLevel === 'high' ? <ShieldAlert className="h-3 w-3 text-red-500" /> : 
           stats.riskLevel === 'medium' ? <Shield className="h-3 w-3 text-yellow-500" /> : 
           <ShieldCheck className="h-3 w-3 text-green-500" />}
          Risk Profile: {stats.riskLevel}
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">
          {stats.riskLevel === 'high' ? 'Warning: Recovery stake is very high. Consider increasing recovery trades.' : 
           stats.riskLevel === 'medium' ? 'Recovery is active. Follow the plan strictly.' : 
           'Strategy is within safe operational limits.'}
        </p>
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
    ];
    
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
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
            <BrainCircuit className="text-primary-foreground h-5 w-5" />
          </div>
          <h1 className="text-xl font-headline font-bold text-electric-blue">RecoupPro</h1>
        </div>
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
                  <BrainCircuit className="h-6 w-6 text-primary" />
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
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="w-80 border-r border-border bg-card/50 hidden md:flex flex-col p-6 sticky top-0 h-svh overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
              <BrainCircuit className="text-primary-foreground h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-electric-blue">RecoupPro</h1>
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

        {/* Main Content */}
        <main className="flex-1 min-h-svh p-4 md:p-10 bg-obsidian/40 overflow-x-hidden">
          <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1">Trading Control</h2>
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
              <Card className="lg:col-span-2 bg-card/80 border-primary/20 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 hidden md:block">
                  <Calculator className="h-24 w-24" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-blue text-lg md:text-xl">
                    <Calculator className="h-5 w-5" /> Recommended Entry
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Stake size to recover <b>${stats.currentDrawdown.toFixed(2)}</b> in <b>{store.recoveryTargetWins}</b> winning trades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6 md:py-8">
                    <div className="text-6xl md:text-8xl font-headline font-bold text-foreground">
                      ${stats.nextStake.toFixed(2)}
                    </div>
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <Badge variant={stats.currentDrawdown > 0 ? "destructive" : "secondary"}>
                        {store.useManualDrawdown ? 'Manual Target: ' : 'Session Loss: '}${stats.currentDrawdown.toFixed(2)}
                      </Badge>
                      {stats.currentDrawdown > 0 && (
                        <p className="text-[10px] md:text-xs text-muted-foreground text-center max-w-xs px-4 leading-relaxed">
                          Targeting <b>${stats.requiredProfitPerTrade.toFixed(2)}</b> profit per win. 
                          Plan: {store.recoveryTargetWins} trades at {store.riskRewardRatio}x RR.
                        </p>
                      )}
                    </div>
                  </div>

                  {store.activeSession && (
                    <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-border/50">
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <Input 
                            placeholder="Trade P/L Amount" 
                            type="number" 
                            inputMode="decimal"
                            value={tradeAmount} 
                            onChange={(e) => setTradeAmount(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="text-lg py-6 bg-obsidian"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            size="lg" 
                            className="flex-1 bg-green-600 hover:bg-green-700 h-auto px-6 py-4 md:py-2"
                            onClick={() => handleAddTrade('win')}
                          >
                            <TrendingUp className="h-6 w-6" />
                          </Button>
                          <Button 
                            size="lg" 
                            className="flex-1 bg-red-600 hover:bg-red-700 h-auto px-6 py-4 md:py-2"
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

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Session Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-bold">{stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-obsidian rounded-full h-2">
                      <div 
                        className="bg-sky-blue h-2 rounded-full glow-accent transition-all duration-1000" 
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
              <Card className="bg-card/30 border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Trade Log</CardTitle>
                    <CardDescription className="text-xs">Recent entries</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)} className="text-xs">
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
                        <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-obsidian/50 border border-border/30">
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
          </div>
        </main>
      </div>
    </div>
  );
}
