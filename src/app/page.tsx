
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useRecoupStore, CURRENCY_SYMBOLS, CurrencyCode } from './lib/store';
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
  Target,
  PenLine,
  Menu,
  ArrowLeft,
  Trash2,
  ArrowUpRight,
  Coins,
  Briefcase,
  AlertCircle,
  Percent,
  Wallet,
  Notebook,
  CalendarDays,
  AreaChart as ChartIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type View = 'dashboard' | 'history' | 'sizer';

const AppLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center bg-[#14b8a6] rounded-[22%] shadow-lg aspect-square glow-primary ring-1 ring-white/10", className)}>
      <span className="text-white font-headline font-bold text-xl leading-none select-none tracking-tighter">RP</span>
    </div>
  );
};

const QuickPercentTool = () => {
  const [baseNum, setBaseNum] = useState('');
  const [percent, setPercent] = useState('');

  const result = useMemo(() => {
    const b = parseFloat(baseNum);
    const p = parseFloat(percent);
    if (isNaN(b) || isNaN(p)) return null;
    return (b * p) / 100;
  }, [baseNum, percent]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Percent className="h-4 w-4 text-primary" /> Quick Percent Tool
        </CardTitle>
        <CardDescription className="text-[10px]">Calculate percentage of any number</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground uppercase">Number</label>
            <Input 
              type="text" 
              inputMode="decimal"
              placeholder="e.g. 100" 
              value={baseNum} 
              onChange={(e) => setBaseNum(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="h-8 text-xs bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground uppercase">Percent (%)</label>
            <Input 
              type="text" 
              inputMode="decimal"
              placeholder="e.g. 40" 
              value={percent} 
              onChange={(e) => setPercent(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="h-8 text-xs bg-background"
            />
          </div>
        </div>

        {result !== null ? (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Result</span>
            <div className="text-2xl font-headline font-bold text-primary">
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {percent}% of {baseNum}
            </p>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center border border-dashed rounded-lg border-border/50 text-muted-foreground text-[10px]">
            Enter values to calculate
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SmartNumericInput = ({ 
  value, 
  onChange, 
  className, 
  placeholder,
  ...props 
}: { 
  value: number, 
  onChange: (val: number) => void, 
  className?: string,
  placeholder?: string,
  [key: string]: any
}) => {
  const [inputValue, setInputValue] = useState(value === 0 ? "" : value.toString());

  useEffect(() => {
    setInputValue(value === 0 ? "" : value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || val === ".") {
      setInputValue(val);
      onChange(0);
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setInputValue(val);
      onChange(parsed);
    }
  };

  return (
    <Input 
      {...props}
      type="text" 
      inputMode="decimal"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
      className={className}
    />
  );
};

const StrategySettings = ({ store, stats }: { store: any, stats: any }) => {
  const currencySymbol = CURRENCY_SYMBOLS[store.currency as CurrencyCode];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
          <Coins className="h-3 w-3" /> Currency
        </label>
        <Select value={store.currency} onValueChange={(val) => store.setCurrency(val as CurrencyCode)}>
          <SelectTrigger className="bg-background border-border h-9">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="INR">INR (₹)</SelectItem>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="GBP">GBP (£)</SelectItem>
            <SelectItem value="AED">AED (د.إ)</SelectItem>
            <SelectItem value="SAR">SAR (﷼)</SelectItem>
            <SelectItem value="PKR">PKR (₨)</SelectItem>
            <SelectItem value="BDT">BDT (৳)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground">Base Stake ({currencySymbol})</label>
        <SmartNumericInput 
          value={store.baseStake} 
          onChange={store.setBaseStake}
          className="bg-background border-border"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            RR Ratio <Scale className="h-3 w-3" />
          </label>
          <div className="flex items-center gap-1">
            <SmartNumericInput 
              value={store.riskRewardRatio} 
              onChange={store.setRiskRewardRatio}
              className="w-20 h-7 text-xs bg-background text-right"
            />
            <span className="text-xs font-bold text-accent">x</span>
          </div>
        </div>
        <Slider 
          value={[store.riskRewardRatio]} 
          min={0.1} 
          max={5} 
          step={0.01}
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
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground uppercase">Loss to Recover ({currencySymbol})</label>
            <SmartNumericInput 
              value={store.manualDrawdown} 
              onChange={store.setManualDrawdown}
              placeholder="Enter amount..."
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
          <SmartNumericInput 
            value={store.recoveryTargetWins} 
            onChange={store.setRecoveryTargetWins}
            className="w-16 h-7 text-xs bg-background text-right"
          />
        </div>
        <Slider 
          value={[store.recoveryTargetWins]} 
          min={1} 
          max={30} 
          step={1}
          onValueChange={([val]) => store.setRecoveryTargetWins(val)}
        />
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
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your sessions and trade history. Your strategy notes 📝 will NOT be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary text-secondary-foreground border-border">Cancel</AlertDialogCancel>
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

const EquityCurveChart = ({ data, currencySymbol }: { data: any[], currencySymbol: string }) => {
  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            hide 
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickFormatter={(value) => `${currencySymbol}${value}`}
            width={50}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
            formatter={(value) => [`${currencySymbol}${parseFloat(value as string).toFixed(2)}`, 'Equity']}
            labelFormatter={(label) => `Entry: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const PositionSizer = ({ store }: { store: any }) => {
  const [entry, setEntry] = useState('');
  const [stop, setStop] = useState('');
  const [target, setTarget] = useState('');
  const currencySymbol = CURRENCY_SYMBOLS[store.currency as CurrencyCode];

  const results = useMemo(() => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const balance = store.accountBalance || 0;
    
    let riskAmount = 0;
    if (store.riskType === 'percentage') {
      riskAmount = balance * ((store.riskPerTradePercent || 0) / 100);
    } else {
      riskAmount = store.riskAmountFixed || 0;
    }

    if (isNaN(e) || isNaN(s) || e <= 0 || s <= 0 || e === s || riskAmount <= 0) return null;

    const riskPerShare = Math.abs(e - s);
    const shares = Math.floor(riskAmount / riskPerShare);
    const totalPositionValue = shares * e;
    
    let rewardToRisk = 0;
    let potentialProfit = 0;
    if (!isNaN(t) && t > 0) {
      const profitPerShare = Math.abs(t - e);
      potentialProfit = profitPerShare * shares;
      rewardToRisk = profitPerShare / riskPerShare;
    }

    return {
      riskAmount,
      shares,
      totalPositionValue,
      rewardToRisk,
      potentialProfit
    };
  }, [entry, stop, target, store.accountBalance, store.riskPerTradePercent, store.riskAmountFixed, store.riskType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 text-foreground">Position Sizer</h2>
        <p className="text-muted-foreground text-sm">Calculate shares and risk based on stop loss.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" /> Trade Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Account Balance ({currencySymbol})</label>
                <SmartNumericInput 
                  value={store.accountBalance} 
                  onChange={store.setAccountBalance}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-3">
                <Tabs value={store.riskType} onValueChange={(val) => store.setRiskType(val as 'percentage' | 'amount')}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-muted-foreground">Risk Type</label>
                    <TabsList className="h-7 bg-muted/50 p-0.5">
                      <TabsTrigger value="percentage" className="text-[10px] px-2 h-6 gap-1">
                        <Percent className="h-3 w-3" /> %
                      </TabsTrigger>
                      <TabsTrigger value="amount" className="text-[10px] px-2 h-6 gap-1">
                        <Wallet className="h-3 w-3" /> {currencySymbol}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="percentage" className="space-y-3 m-0">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-muted-foreground">Risk per Trade (%)</label>
                      <span className="text-xs font-bold text-primary">{store.riskPerTradePercent}%</span>
                    </div>
                    <Slider 
                      value={[store.riskPerTradePercent]} 
                      min={0.1} 
                      max={10} 
                      step={0.1} 
                      onValueChange={([v]) => store.setRiskPerTradePercent(v)} 
                    />
                  </TabsContent>

                  <TabsContent value="amount" className="m-0">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-muted-foreground">Fixed Risk Amount ({currencySymbol})</label>
                      <SmartNumericInput 
                        value={store.riskAmountFixed} 
                        onChange={store.setRiskAmountFixed}
                        className="w-24 h-8 text-xs bg-background text-right"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <Separator className="bg-border/30" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Entry Price</label>
                <Input placeholder="0.00" value={entry} onChange={(e) => setEntry(e.target.value)} onFocus={(e) => e.target.select()} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Stop Loss</label>
                <Input placeholder="0.00" value={stop} onChange={(e) => setStop(e.target.value)} onFocus={(e) => e.target.select()} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Target (Optional)</label>
                <Input placeholder="0.00" value={target} onChange={(e) => setTarget(e.target.value)} onFocus={(e) => e.target.select()} className="bg-background border-border" />
              </div>
            </div>

            {results ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/30">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center py-8">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Recommended Shares</span>
                  <div className="text-5xl font-headline font-bold text-primary">
                    {results.shares.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-2">Units of stock</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Total Capital Required</span>
                    <span className="font-bold text-foreground">{currencySymbol}{results.totalPositionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/5 text-red-500">
                    <span className="text-xs">Max Loss (Risk)</span>
                    <span className="font-bold">-{currencySymbol}{results.riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {results.rewardToRisk > 0 && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 text-green-500">
                      <span className="text-xs">Reward to Risk Ratio</span>
                      <span className="font-bold">{results.rewardToRisk.toFixed(2)}:1</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl border-border/50">
                <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">Enter Entry and Stop Loss prices to calculate size</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <QuickPercentTool />
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Strategy Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                Professional traders rarely risk more than <b>1-2%</b> of their total account on a single idea.
              </p>
              <p>
                This calculator ensures that even if your Stop Loss is hit, you only lose exactly the amount of money you intended to risk.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const store = useRecoupStore();
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [view, setView] = useState<View>('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const chronTrades = [
      ...store.sessions.flatMap(s => s.trades),
      ...(store.activeSession?.trades || [])
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    let runningPnL = 0;
    let peakPnL = 0;
    
    chronTrades.forEach(t => {
      runningPnL += (t.type === 'win' ? t.amount : -t.amount);
      if (runningPnL > peakPnL) peakPnL = runningPnL;
    });

    const netPnL = runningPnL;
    const hwmDrawdown = peakPnL - netPnL;
    
    const currentDrawdown = store.useManualDrawdown 
      ? store.manualDrawdown 
      : (hwmDrawdown > 0 ? hwmDrawdown : 0);
    
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

    const wins = chronTrades.filter(t => t.type === 'win');
    const losses = chronTrades.filter(t => t.type === 'loss');
    const allTradesDesc = [...chronTrades].reverse();

    return {
      allTrades: allTradesDesc,
      wins,
      losses,
      totalProfit: wins.reduce((sum, t) => sum + t.amount, 0),
      totalLoss: losses.reduce((sum, t) => sum + t.amount, 0),
      netPnL,
      currentDrawdown,
      requiredProfitPerTrade,
      nextStake,
      recoveryStakeAdjustment,
      riskLevel,
      winRate: chronTrades.length > 0 
        ? (wins.length / chronTrades.length) * 100 
        : 0,
      avgWin: wins.length > 0 ? wins.reduce((sum, t) => sum + t.amount, 0) / wins.length : 0,
      avgLoss: losses.length > 0 ? losses.reduce((sum, t) => sum + t.amount, 0) / losses.length : 0,
    };
  }, [store]);

  const dailyEquityData = useMemo(() => {
    const chronTrades = [
      ...store.sessions.flatMap(s => s.trades),
      ...(store.activeSession?.trades || [])
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const daysMap: Record<string, number> = {};
    
    chronTrades.forEach(trade => {
      const dayKey = trade.timestamp.toISOString().split('T')[0];
      const amount = (trade.type === 'win' ? trade.amount : -trade.amount);
      daysMap[dayKey] = (daysMap[dayKey] || 0) + amount;
    });

    let runningBalance = 0;
    return Object.keys(daysMap).sort().map(day => {
      runningBalance += daysMap[day];
      return {
        name: day,
        balance: runningBalance,
        pnl: daysMap[day],
      };
    });
  }, [store]);

  const tradeEquityData = useMemo(() => {
    let balance = 0;
    const chronTrades = [
      ...store.sessions.flatMap(s => s.trades),
      ...(store.activeSession?.trades || [])
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return chronTrades.map((trade, index) => {
      balance += (trade.type === 'win' ? trade.amount : -trade.amount);
      return {
        name: trade.timestamp.toLocaleDateString() + ' ' + trade.timestamp.toLocaleTimeString(),
        balance: balance,
      };
    });
  }, [store]);

  const handleAddTrade = (type: 'win' | 'loss') => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;
    store.addTrade(type, amount);
    setTradeAmount('');
  };

  if (!mounted) return null;

  const currencySymbol = CURRENCY_SYMBOLS[store.currency as CurrencyCode];

  return (
    <div className="flex flex-col min-h-svh overflow-x-hidden">
      <header className="md:hidden sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <AppLogo className="h-10 w-10" />
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
                  <SheetTitle className="text-left flex items-center gap-3 text-foreground">
                    <AppLogo className="h-8 w-8" />
                    <span>Trading Hub</span>
                  </SheetTitle>
                </SheetHeader>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="space-y-8">
                  <nav className="space-y-2">
                    <Button variant={view === 'dashboard' ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView('dashboard')}>
                      <Activity className="h-4 w-4" /> Dashboard
                    </Button>
                    <Button variant={view === 'sizer' ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView('sizer')}>
                      <Briefcase className="h-4 w-4" /> Position Sizer
                    </Button>
                    <Button variant={view === 'history' ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView('history')}>
                      <History className="h-4 w-4" /> History
                    </Button>
                  </nav>
                  <Separator className="bg-border/30" />
                  {view !== 'sizer' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Strategy Engine</h3>
                      </div>
                      <StrategySettings store={store} stats={stats} />
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1 relative">
        <aside className="w-80 border-r border-border bg-card/50 hidden md:flex flex-col p-6 sticky top-0 h-svh overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <AppLogo className="h-12 w-12" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-headline font-bold text-primary leading-none tracking-tight">RecoupPro</h1>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">Smart Trading</span>
              </div>
            </div>
            <ModeToggle />
          </div>

          <nav className="space-y-2 mb-8">
            <Button variant={view === 'dashboard' ? "secondary" : "ghost"} className="w-full justify-start gap-3 text-foreground" onClick={() => setView('dashboard')}>
              <Activity className="h-4 w-4" /> Dashboard
            </Button>
            <Button variant={view === 'sizer' ? "secondary" : "ghost"} className="w-full justify-start gap-3 text-foreground" onClick={() => setView('sizer')}>
              <Briefcase className="h-4 w-4" /> Position Sizer
            </Button>
            <Button variant={view === 'history' ? "secondary" : "ghost"} className="w-full justify-start gap-3 text-foreground" onClick={() => setView('history')}>
              <History className="h-4 w-4" /> History
            </Button>
          </nav>

          {view !== 'sizer' && (
            <>
              <Separator className="mb-8 bg-border/30" />
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Strategy Engine</h3>
                </div>
                <StrategySettings store={store} stats={stats} />
              </div>
            </>
          )}
        </aside>

        <main className="flex-1 min-h-svh p-4 md:p-10 bg-background/40 overflow-x-hidden">
          <div className="max-w-5xl mx-auto space-y-8">
            {view === 'dashboard' && (
              <div className="animate-in fade-in duration-500 space-y-8">
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
                  <Card className="lg:col-span-2 bg-card border-border backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 hidden md:block text-foreground">
                      <Calculator className="h-24 w-24" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary text-lg md:text-xl">
                        <Calculator className="h-5 w-5" /> Recommended Entry
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Based on target of <b>{currencySymbol}{stats.currentDrawdown.toFixed(2)}</b> in <b>{store.recoveryTargetWins}</b> trades
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6 md:py-8 border-b border-border/30 mb-6">
                        <div className="text-6xl md:text-8xl font-headline font-bold text-foreground transition-all duration-300">
                          {currencySymbol}{stats.nextStake.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-semibold">Total Trade Amount</p>
                        <div className="mt-4 flex flex-col items-center gap-2">
                          <Badge variant={stats.currentDrawdown > 0 ? "destructive" : "secondary"}>
                            {store.useManualDrawdown ? 'Manual Target: ' : 'Recovery Target: '}{currencySymbol}{stats.currentDrawdown.toFixed(2)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                           <h4 className="font-bold mb-3 flex items-center gap-2 text-muted-foreground">
                             <Target className="h-3 w-3" /> Profit Breakdown
                           </h4>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center text-foreground">
                               <span>Base Profit Target:</span>
                               <span className="font-mono font-bold">{currencySymbol}{(store.baseStake * store.riskRewardRatio).toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-red-500">
                               <span>Recovery Component:</span>
                               <span className="font-mono font-bold">+ {currencySymbol}{stats.requiredProfitPerTrade.toFixed(2)}</span>
                             </div>
                             <Separator className="bg-border/50" />
                             <div className="flex justify-between items-center text-primary font-bold">
                               <span>Total Win Goal:</span>
                               <span className="font-mono">{currencySymbol}{( (store.baseStake * store.riskRewardRatio) + stats.requiredProfitPerTrade ).toFixed(2)}</span>
                             </div>
                           </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                           <h4 className="font-bold mb-3 flex items-center gap-2 text-primary">
                             <ArrowUpRight className="h-3 w-3" /> Investment Logic
                           </h4>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center text-foreground">
                               <span>Base Investment:</span>
                               <span className="font-mono">{currencySymbol}{store.baseStake.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-accent font-bold">
                               <span>Recovery Adjustment:</span>
                               <span className="font-mono">+ {currencySymbol}{stats.recoveryStakeAdjustment.toFixed(2)}</span>
                             </div>
                             <div className="text-[10px] text-muted-foreground italic mt-2">
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
                                placeholder={`Trade P/L Amount (${currencySymbol})`}
                                type="text" 
                                inputMode="decimal"
                                value={tradeAmount} 
                                onChange={(e) => setTradeAmount(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                className="text-lg py-6 bg-background focus:ring-primary border-border"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                variant="outline"
                                size="lg" 
                                className="flex-1 bg-green-500/5 border-green-500/20 hover:bg-green-500/10 h-auto px-6 py-4 md:py-2"
                                onClick={() => handleAddTrade('win')}
                              >
                                <TrendingUp className="h-6 w-6 text-green-500" />
                              </Button>
                              <Button 
                                variant="outline"
                                size="lg" 
                                className="flex-1 bg-red-500/5 border-red-500/20 hover:bg-red-500/10 h-auto px-6 py-4 md:py-2"
                                onClick={() => handleAddTrade('loss')}
                              >
                                <TrendingDown className="h-6 w-6 text-red-500" />
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
                          <span className="font-bold text-foreground">{stats.winRate.toFixed(1)}%</span>
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
                            {stats.netPnL >= 0 ? '+' : ''}{currencySymbol}{stats.netPnL.toFixed(2)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Current Drawdown</span>
                          <div className="text-lg md:text-xl font-headline font-bold text-red-400">
                            {currencySymbol}{stats.currentDrawdown.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-border/50" />

                      <div className="flex items-center gap-3">
                        <div className="flex-1 flex justify-between items-center text-xs p-2 rounded bg-green-500/5 border border-green-500/10">
                          <span className="text-muted-foreground">Wins</span>
                          <span className="font-bold text-green-500">{stats.wins.length}</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center px-1 text-[10px] font-bold text-muted-foreground/50 bg-muted/20 rounded h-8 min-w-8">
                           <span className="leading-none">Diff</span>
                           <span className="leading-none">{Math.abs(stats.wins.length - stats.losses.length)}</span>
                        </div>

                        <div className="flex-1 flex justify-between items-center text-xs p-2 rounded bg-red-500/5 border border-red-500/10">
                          <span className="text-muted-foreground">Losses</span>
                          <span className="font-bold text-red-500">{stats.losses.length}</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                         <div className="flex justify-between items-center text-sm text-foreground">
                            <span className="text-muted-foreground flex items-center gap-2"><Plus className="h-3 w-3 text-green-500" /> Avg Win</span>
                            <span>{currencySymbol}{stats.avgWin.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm text-foreground">
                            <span className="text-muted-foreground flex items-center gap-2"><div className="h-[2px] w-3 bg-red-500" /> Avg Loss</span>
                            <span>{currencySymbol}{stats.avgLoss.toFixed(2)}</span>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">Trade Log</CardTitle>
                        <CardDescription className="text-xs">Recent entries</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setView('history')} className="text-xs bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
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
                                  <p className="text-sm font-semibold text-foreground">{currencySymbol}{trade.amount.toFixed(2)}</p>
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

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                        <Notebook className="h-5 w-5 text-primary" /> Trading Notes 📝
                      </CardTitle>
                      <CardDescription className="text-xs">Journal your thoughts or strategy reminders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea 
                        placeholder="Start typing your notes here..."
                        className="min-h-[256px] bg-background border-border resize-none"
                        value={store.notes}
                        onChange={(e) => store.setNotes(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {view === 'history' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setView('dashboard')}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground leading-tight">History & Analytics</h2>
                      <p className="text-muted-foreground text-xs md:text-sm">Daily aggregation and trade-level audit.</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="px-4 py-1.5 h-auto text-sm w-fit shrink-0">
                    {stats.allTrades.length} Total Trades
                  </Badge>
                </header>

                {stats.allTrades.length > 0 && (
                  <Card className="bg-card border-border overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ChartIcon className="h-4 w-4 text-primary" /> Daily Equity Curve
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <EquityCurveChart data={dailyEquityData} currencySymbol={currencySymbol} />
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {stats.allTrades.length === 0 ? (
                    <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 bg-background/50 border-border/50">
                      <History className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                      <h3 className="text-lg font-semibold text-foreground">No history yet</h3>
                      <p className="text-muted-foreground text-sm mb-6">Your recorded trades will appear here.</p>
                      <Button onClick={() => setView('dashboard')}>Return to Dashboard</Button>
                    </Card>
                  ) : (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" /> Daily Equity Summary
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {dailyEquityData.reverse().map((day) => (
                            <Card key={day.name} className="bg-card border-border">
                              <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Date</span>
                                  <span className="text-sm font-semibold">{day.name}</span>
                                </div>
                                <div className="flex items-center gap-8">
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Net Change</span>
                                    <span className={cn("text-sm font-bold", day.pnl >= 0 ? "text-green-500" : "text-red-500")}>
                                      {day.pnl >= 0 ? '+' : ''}{currencySymbol}{day.pnl.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Closing Balance</span>
                                    <span className="text-sm font-bold text-foreground">
                                      {currencySymbol}{day.balance.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Full Audit Log</h3>
                        <div className="space-y-3">
                          {stats.allTrades.map((trade) => (
                            <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/30">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "p-3 rounded-xl",
                                  trade.type === 'win' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}>
                                  {trade.type === 'win' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-foreground">{currencySymbol}{trade.amount.toFixed(2)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {trade.timestamp.toLocaleDateString()} at {trade.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className={cn(
                                trade.type === 'win' ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"
                              )}>
                                {trade.type.toUpperCase()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {view === 'sizer' && (
              <PositionSizer store={store} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
