
"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRecoupStore, CURRENCY_SYMBOLS, CurrencyCode } from './lib/store';
import { 
  TrendingUp, 
  TrendingDown, 
  Settings2, 
  Plus, 
  Minus,
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
  Hash,
  BarChart3,
  Tags,
  ArrowLeftRight,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModeToggle } from '@/components/mode-toggle';
import { AICoachPanel } from '@/components/recoup/ai-coach-panel';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
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
      <CardHeader className="pb-3">
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
            <p className="text-[10px] text-muted-foreground mt-1 text-center">
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
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue !== value) {
      setInputValue(value === 0 ? "" : value.toString());
    } else if (value === 0 && inputValue !== "" && inputValue !== "0") {
       setInputValue("");
    }
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
  
  // Use active session settings if available, otherwise global defaults
  const settings = store.activeSession || store;

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
          value={settings.baseStake} 
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
              value={settings.riskRewardRatio} 
              onChange={store.setRiskRewardRatio}
              className="w-20 h-7 text-xs bg-background text-right"
            />
            <span className="text-xs font-bold text-accent">x</span>
          </div>
        </div>
        <Slider 
          value={[settings.riskRewardRatio]} 
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
            checked={settings.useManualDrawdown} 
            onCheckedChange={store.setUseManualDrawdown} 
          />
        </div>
        
        {settings.useManualDrawdown && (
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground uppercase">Loss to Recover ({currencySymbol})</label>
            <SmartNumericInput 
              value={settings.manualDrawdown} 
              onChange={store.setManualDrawdown}
              placeholder="Enter amount..."
              className="bg-background border-border h-8 text-xs"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-border/30">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="h-3 w-3" /> Wallet Savings (%)
          </label>
          <SmartNumericInput 
            value={settings.walletDeductionPercent} 
            onChange={store.setWalletDeductionPercent}
            className="w-16 h-7 text-xs bg-background text-right"
          />
        </div>
        <Slider 
          value={[settings.walletDeductionPercent]} 
          min={0} 
          max={20} 
          step={0.1}
          onValueChange={([val]) => store.setWalletDeductionPercent(val)}
        />
        <p className="text-[10px] text-muted-foreground leading-tight italic">
          Portion of every trade saved into the strategy wallet. This amount is automatically recovered in the next trades.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-3 w-3" /> Recovery Trades
          </label>
          <SmartNumericInput 
            value={settings.recoveryTargetWins} 
            onChange={store.setRecoveryTargetWins}
            className="w-16 h-7 text-xs bg-background text-right"
          />
        </div>
        <Slider 
          value={[settings.recoveryTargetWins]} 
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
                This will permanently delete all your sessions, trade history, and wallet savings. Your strategy notes 📝 will NOT be deleted.
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  if (data.length === 0) return null;

  const chartWidth = Math.max(100, (data.length / 40) * 100);

  return (
    <div ref={scrollRef} className="w-full overflow-x-auto pb-4 scroll-smooth">
      <div style={{ width: `${chartWidth}%`, minWidth: '100%' }}>
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
              <XAxis dataKey="name" hide />
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
      </div>
    </div>
  );
};

const CandlestickChart = ({ data, currencySymbol }: { data: any[], currencySymbol: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  if (data.length === 0) return null;

  const chartWidth = Math.max(100, (data.length / 40) * 100);

  return (
    <div ref={scrollRef} className="w-full overflow-x-auto pb-4 scroll-smooth">
      <div style={{ width: `${chartWidth}%`, minWidth: '100%' }}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="index" hide />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => `${currencySymbol}${value}`}
                width={50}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-card border border-border p-3 rounded-lg shadow-xl text-[10px]">
                        <p className="font-bold mb-1 uppercase text-muted-foreground">Trade #{d.index}</p>
                        <p className={cn("font-bold text-sm mb-2", d.close >= d.open ? "text-green-500" : "text-red-500")}>
                          {d.close >= d.open ? 'WIN' : 'LOSS'}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                          <span className="text-muted-foreground">O:</span>
                          <span>{currencySymbol}{d.open.toFixed(2)}</span>
                          <span className="text-muted-foreground">H:</span>
                          <span>{currencySymbol}{d.high.toFixed(2)}</span>
                          <span className="text-muted-foreground">L:</span>
                          <span>{currencySymbol}{d.low.toFixed(2)}</span>
                          <span className="text-muted-foreground">C:</span>
                          <span>{currencySymbol}{d.close.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="candleHeight" shape={(props: any) => {
                const { x, y, width, height, open, close } = props;
                const fill = close >= open ? "hsl(var(--primary))" : "hsl(var(--destructive))";
                return (
                  <g>
                    {/* Wick */}
                    <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={fill} strokeWidth={1} />
                    {/* Body */}
                    <rect x={x} y={y} width={width} height={Math.max(2, height)} fill={fill} rx={1} />
                  </g>
                );
              }}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const PositionSizer = ({ store, setView }: { store: any, setView: (v: View) => void }) => {
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
      <header className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => setView('dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 text-foreground">Position Sizer</h2>
          <p className="text-muted-foreground text-sm">Calculate shares and risk based on stop loss.</p>
        </div>
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
  const [sessionNameInput, setSessionNameInput] = useState<string>('');
  const [isStartSessionDialogOpen, setIsStartSessionDialogOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Performance stats based on the ACTIVE SESSION or templates if no session is active
  const activeSessionStats = useMemo(() => {
    const s = store.activeSession;
    const trades = s?.trades || [];
    const chronTrades = [...trades].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Recovery stats for THIS session only
    let runningPnL = 0;
    let peakPnL = 0;
    let sessionTurnover = 0;
    chronTrades.forEach(t => {
      runningPnL += (t.type === 'win' ? t.amount : -t.amount);
      if (runningPnL > peakPnL) peakPnL = runningPnL;
      sessionTurnover += t.originalAmount;
    });

    const netPnL = runningPnL;
    const sessionDrawdown = peakPnL - netPnL;
    
    // Use session-specific settings or global defaults
    const currentDrawdown = s 
      ? (s.useManualDrawdown ? s.manualDrawdown : (sessionDrawdown > 0 ? sessionDrawdown : 0))
      : (store.useManualDrawdown ? store.manualDrawdown : 0);
    
    const settings = s || store;
    
    const walletFactor = 1 - (settings.walletDeductionPercent / 100);
    const safeWalletFactor = walletFactor > 0 ? walletFactor : 1;
    
    const netRecoveryNeededPerTrade = currentDrawdown / (settings.recoveryTargetWins || 1);
    const totalNetProfitNeeded = (settings.baseStake * settings.riskRewardRatio) + netRecoveryNeededPerTrade;
    const totalGrossProfitNeeded = totalNetProfitNeeded / safeWalletFactor;
    
    const nextStake = totalGrossProfitNeeded / (settings.riskRewardRatio || 1);
    const grossBaseProfit = (settings.baseStake * settings.riskRewardRatio) / safeWalletFactor;
    const grossRecoveryProfit = netRecoveryNeededPerTrade / safeWalletFactor;

    const recoveryStakeAdjustment = nextStake - settings.baseStake;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (currentDrawdown > 0) {
      const recoveryRatio = recoveryStakeAdjustment / settings.baseStake;
      if (recoveryRatio > 2) riskLevel = 'high';
      else if (recoveryRatio > 0.5) riskLevel = 'medium';
    }

    const wins = chronTrades.filter(t => t.type === 'win');
    const losses = chronTrades.filter(t => t.type === 'loss');

    return {
      currentDrawdown,
      grossRecoveryProfit,
      grossBaseProfit,
      nextStake,
      recoveryStakeAdjustment,
      riskLevel,
      netPnL,
      sessionTurnover,
      totalTrades: chronTrades.length,
      winRate: chronTrades.length > 0 ? (wins.length / chronTrades.length) * 100 : 0,
      avgWin: wins.length > 0 ? wins.reduce((sum, t) => sum + t.amount, 0) / wins.length : 0,
      avgLoss: losses.length > 0 ? losses.reduce((sum, t) => sum + t.amount, 0) / losses.length : 0,
      allTrades: [...chronTrades].reverse(),
      wins,
      losses,
    };
  }, [store]);

  // Global history stats for History Tab only
  const globalHistoryStats = useMemo(() => {
    const chronTrades = [...store.sessions.flatMap(s => s.trades), ...(store.activeSession?.trades || [])]
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    let totalTurnover = chronTrades.reduce((acc, t) => acc + t.originalAmount, 0);
    
    let balance = 0;
    const equityData = chronTrades.map((trade, index) => {
      const open = balance;
      balance += (trade.type === 'win' ? trade.amount : -trade.amount);
      const close = balance;
      return {
        index: index + 1,
        name: trade.timestamp.toLocaleDateString(),
        balance: balance,
        open,
        close,
        high: Math.max(open, close),
        low: Math.min(open, close),
        candleHeight: Math.abs(close - open),
      };
    });

    return {
      allTrades: chronTrades,
      totalTurnover,
      equityData,
    };
  }, [store]);

  const activeSessionEquityData = useMemo(() => {
    let balance = 0;
    const trades = store.activeSession?.trades || [];
    const chronTrades = [...trades].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return chronTrades.map((trade, index) => {
      const open = balance;
      balance += (trade.type === 'win' ? trade.amount : -trade.amount);
      const close = balance;
      return {
        index: index + 1,
        name: trade.timestamp.toLocaleTimeString(),
        balance: balance,
        open,
        close,
        high: Math.max(open, close),
        low: Math.min(open, close),
        candleHeight: Math.abs(close - open),
      };
    });
  }, [store.activeSession]);

  const dailySummaries = useMemo(() => {
    const groups: Record<string, { turnover: number, netChange: number, count: number }> = {};
    globalHistoryStats.allTrades.forEach(trade => {
      const day = trade.timestamp.toLocaleDateString('en-CA');
      if (!groups[day]) groups[day] = { turnover: 0, netChange: 0, count: 0 };
      groups[day].turnover += trade.originalAmount;
      groups[day].netChange += (trade.type === 'win' ? trade.amount : -trade.amount);
      groups[day].count += 1;
    });
    return Object.entries(groups).map(([date, stats]) => ({ date, ...stats })).reverse();
  }, [globalHistoryStats.allTrades]);

  const handleAddTrade = (type: 'win' | 'loss') => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;
    store.addTrade(type, amount);
    setTradeAmount('');
  };

  const handleStartSession = () => {
    if (!sessionNameInput.trim()) return;
    store.startSession(sessionNameInput);
    setSessionNameInput('');
    setIsStartSessionDialogOpen(false);
  };

  if (!mounted) return null;

  const currencySymbol = CURRENCY_SYMBOLS[store.currency as CurrencyCode];
  const activeSettings = store.activeSession || store;

  const TradeLogItem = ({ trade }: { trade: any }) => (
    <div className={cn(
      "flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/20 shadow-sm transition-colors",
      trade.type === 'win' ? "hover:bg-green-500/[0.02]" : "hover:bg-red-500/[0.02]"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center",
          trade.type === 'win' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trade.type === 'win' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        </div>
        <div className="space-y-0.5">
          <p className="text-base font-bold text-foreground">{currencySymbol}{trade.originalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className="flex items-center text-[11px] text-muted-foreground font-medium">
            <span>{trade.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</span>
            {trade.deduction > 0 && (
              <span className="text-primary font-bold flex items-center">
                <span className="mx-1.5 opacity-50">•</span>
                Wallet: {currencySymbol}{trade.deduction.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
      <Badge variant="outline" className={cn(
        "text-[10px] font-bold h-6 px-3 rounded-full border-none uppercase tracking-wider",
        trade.type === 'win' ? "text-green-600 bg-green-500/10" : "text-red-600 bg-red-500/10"
      )}>
        {trade.type}
      </Badge>
    </div>
  );

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
                      <StrategySettings store={store} stats={activeSessionStats} />
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
                <StrategySettings store={store} stats={activeSessionStats} />
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
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Badge variant="outline" className="h-10 px-4 border-primary/20 bg-primary/5 text-primary hidden md:flex items-center gap-2">
                           <Activity className="h-4 w-4" /> {store.activeSession.name}
                        </Badge>
                        
                        {store.sessions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="gap-2 h-10 border-primary/20 hover:bg-primary/5">
                                <ArrowLeftRight className="h-4 w-4" /> Switch
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-card border-border">
                              <DropdownMenuLabel>Switch Session</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <ScrollArea className="h-48">
                                {store.sessions.map((s) => (
                                  <DropdownMenuItem 
                                    key={s.id} 
                                    className="flex items-center justify-between group cursor-pointer"
                                  >
                                    <div className="flex flex-col flex-1" onClick={() => store.resumeSession(s.id)}>
                                      <span className="font-medium">{s.name}</span>
                                      <span className="text-[10px] text-muted-foreground">{s.startTime.toLocaleDateString()}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        store.deleteSession(s.id);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuItem>
                                ))}
                              </ScrollArea>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        <Button variant="destructive" className="flex-1 md:flex-none gap-2 h-10" onClick={store.stopSession}>
                          <StopCircle className="h-4 w-4" /> Stop Session
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        {store.sessions.length > 0 && (
                          <Button 
                            variant="outline" 
                            className="flex-1 md:flex-none h-10 gap-2"
                            onClick={() => setView('history')}
                          >
                            <History className="h-4 w-4" /> History
                          </Button>
                        )}
                        <Dialog open={isStartSessionDialogOpen} onOpenChange={setIsStartSessionDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="default" className="flex-1 md:flex-none gap-2 bg-primary hover:bg-primary/90 glow-primary h-10">
                              <PlayCircle className="h-4 w-4" /> Start Session
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border sm:max-w-[425px] rounded-2xl p-0 overflow-hidden">
                            <div className="p-8 space-y-8">
                              <div className="text-center space-y-2">
                                <DialogTitle className="text-2xl font-bold uppercase tracking-tight">Start New Session</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Give your session a name to track it easily in your history.
                                </DialogDescription>
                              </div>
                              
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                                  SESSION NAME
                                </label>
                                <Input 
                                  placeholder="e.g., Morning Scalping" 
                                  value={sessionNameInput} 
                                  onChange={(e) => setSessionNameInput(e.target.value)}
                                  className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary text-base"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleStartSession();
                                  }}
                                  autoFocus
                                />
                              </div>

                              <Button 
                                onClick={handleStartSession}
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg glow-primary"
                                disabled={!sessionNameInput.trim()}
                              >
                                Go Live
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
                        Based on target of <b>{currencySymbol}{activeSessionStats.currentDrawdown.toFixed(2)}</b> in <b>{activeSettings.recoveryTargetWins}</b> trades
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6 md:py-8 border-b border-border/30 mb-6">
                        <div className="text-6xl md:text-8xl font-headline font-bold text-foreground transition-all duration-300">
                          {currencySymbol}{activeSessionStats.nextStake.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-semibold">Total Trade Amount</p>
                        <div className="mt-4 flex flex-col items-center gap-2">
                          {activeSessionStats.currentDrawdown > 0 && (
                            <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md animate-in fade-in zoom-in">
                              {activeSettings.useManualDrawdown ? 'Manual Target: ' : 'Recovery Target: '}{currencySymbol}{activeSessionStats.currentDrawdown.toFixed(2)}
                            </div>
                          )}
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
                               <span className="font-mono font-bold">{currencySymbol}{activeSessionStats.grossBaseProfit.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-red-500">
                               <span>Recovery Component:</span>
                               <span className="font-mono font-bold">+ {currencySymbol}{activeSessionStats.grossRecoveryProfit.toFixed(2)}</span>
                             </div>
                             <Separator className="bg-border/50" />
                             <div className="flex justify-between items-center text-primary font-bold">
                               <span>Total Win Goal:</span>
                               <span className="font-mono">{currencySymbol}{(activeSessionStats.grossBaseProfit + activeSessionStats.grossRecoveryProfit).toFixed(2)}</span>
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
                               <span className="font-mono">{currencySymbol}{activeSettings.baseStake.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-accent font-bold">
                               <span>Recovery Adjustment:</span>
                               <span className="font-mono">+ {currencySymbol}{activeSessionStats.recoveryStakeAdjustment.toFixed(2)}</span>
                             </div>
                             <div className="text-[10px] text-muted-foreground italic mt-2">
                               Calculation: (Target / {activeSettings.riskRewardRatio} RR)
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

                  <div className="space-y-6">
                    <Card className="bg-card border-border overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="h-12 w-12 text-primary" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Wallet className="h-4 w-4" /> Strategy Wallet
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-headline font-bold text-primary mb-1">
                          {currencySymbol}{store.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Savings Secured</p>
                        <div className="mt-4 pt-4 border-t border-border/30">
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-muted-foreground">Automatic Deduction:</span>
                             <span className="font-bold text-foreground">{activeSettings.walletDeductionPercent}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Session Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Win Rate</span>
                            <span className="font-bold text-foreground">{activeSessionStats.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary h-2 rounded-full glow-primary transition-all duration-1000" 
                              style={{ width: `${activeSessionStats.winRate}%` }} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">Net Balance</span>
                            <div className={cn("text-lg md:text-xl font-headline font-bold", activeSessionStats.netPnL >= 0 ? "text-green-500" : "text-red-500")}>
                              {activeSessionStats.netPnL >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(activeSessionStats.netPnL).toFixed(2)}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">Current Drawdown</span>
                            <div className="text-lg md:text-xl font-headline font-bold text-red-500">
                              {currencySymbol}{activeSessionStats.currentDrawdown.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-border/50" />

                        <div className="flex items-center gap-3">
                          <div className="flex-1 flex justify-between items-center text-xs p-2 rounded bg-green-500/5 border border-green-500/10 text-green-600 font-bold">
                            <span>Wins</span>
                            <span>{activeSessionStats.wins.length}</span>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center px-1 text-[10px] font-bold text-muted-foreground/50">
                             <span className="leading-none">Diff</span>
                             <span className="leading-none">{Math.abs(activeSessionStats.wins.length - activeSessionStats.losses.length)}</span>
                          </div>

                          <div className="flex-1 flex justify-between items-center text-xs p-2 rounded bg-red-500/5 border border-red-500/10 text-red-600 font-bold">
                            <span>Losses</span>
                            <span>{activeSessionStats.losses.length}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 text-green-600 font-medium">
                              <Plus className="h-3 w-3" /> Avg Win
                            </div>
                            <span className="font-mono">{currencySymbol}{activeSessionStats.avgWin.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 text-red-600 font-medium">
                              <Minus className="h-3 w-3" /> Avg Loss
                            </div>
                            <span className="font-mono">{currencySymbol}{activeSessionStats.avgLoss.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Trades</span>
                            <div className="text-sm font-bold text-primary">{activeSessionStats.totalTrades}</div>
                          </div>
                          <div className="space-y-1 text-right">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Turnover</span>
                            <div className="text-sm font-bold text-foreground">{currencySymbol}{activeSessionStats.sessionTurnover.toLocaleString()}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <QuickPercentTool />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                  <div className="space-y-6">
                    <Card className="bg-card/50 border-border">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-foreground">Trade Log</CardTitle>
                          <CardDescription className="text-xs">Session entries</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setView('history')} className="text-xs bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 rounded-xl px-4">
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-2">
                          <div className="space-y-3">
                            {activeSessionStats.allTrades.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Activity className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">Waiting for first trade in session...</p>
                              </div>
                            )}
                            {activeSessionStats.allTrades.map((trade) => (
                              <TradeLogItem key={trade.id} trade={trade} />
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border overflow-hidden">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ChartIcon className="h-4 w-4 text-primary" /> Session Charts
                          </CardTitle>
                        </div>
                        <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)} className="w-auto">
                          <TabsList className="h-8 bg-muted/50 p-1">
                            <TabsTrigger value="line" className="h-6 text-[10px] gap-1 px-2">
                              <Activity className="h-3 w-3" /> Equity
                            </TabsTrigger>
                            <TabsTrigger value="candle" className="h-6 text-[10px] gap-1 px-2">
                              <BarChart3 className="h-3 w-3" /> Candles
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6">
                        {chartType === 'line' ? (
                          <EquityCurveChart data={activeSessionEquityData} currencySymbol={currencySymbol} />
                        ) : (
                          <CandlestickChart data={activeSessionEquityData} currencySymbol={currencySymbol} />
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <AICoachPanel 
                      totalCurrentLoss={activeSessionStats.currentDrawdown}
                      recoveryTargetWins={activeSettings.recoveryTargetWins}
                      recentWinRatePercentage={activeSessionStats.winRate}
                      averageWinAmount={activeSessionStats.avgWin}
                      averageLossAmount={activeSessionStats.avgLoss}
                    />

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
                      <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground leading-tight">Global History</h2>
                      <p className="text-muted-foreground text-xs md:text-sm">Consolidated analytics for all your trading activity.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-9 px-4 border-border bg-card">
                      {globalHistoryStats.allTrades.length} Trades
                    </Badge>
                    <Badge variant="outline" className="h-9 px-4 border-border bg-card">
                      Turnover: {currencySymbol}{globalHistoryStats.totalTurnover.toLocaleString()}
                    </Badge>
                  </div>
                </header>

                <Tabs defaultValue="trades" className="w-full">
                  <TabsList className="bg-muted/50 p-1 mb-6">
                    <TabsTrigger value="trades" className="text-xs flex items-center gap-2">
                      <History className="h-3 w-3" /> Full History
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="text-xs flex items-center gap-2">
                      <Tags className="h-3 w-3" /> Sessions Log
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="trades" className="space-y-8 m-0">
                    <Card className="bg-card border-border overflow-hidden">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ChartIcon className="h-4 w-4 text-primary" /> STRATEGY ANALYTICS
                          </CardTitle>
                        </div>
                        <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)} className="w-auto">
                          <TabsList className="h-8 bg-muted/50 p-1">
                            <TabsTrigger value="line" className="h-6 text-[10px] gap-1 px-2">
                              <Activity className="h-3 w-3" /> Equity
                            </TabsTrigger>
                            <TabsTrigger value="candle" className="h-6 text-[10px] gap-1 px-2">
                              <BarChart3 className="h-3 w-3" /> Candles
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6">
                        {chartType === 'line' ? (
                          <EquityCurveChart data={globalHistoryStats.equityData} currencySymbol={currencySymbol} />
                        ) : (
                          <CandlestickChart data={globalHistoryStats.equityData} currencySymbol={currencySymbol} />
                        )}
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                         <CalendarDays className="h-4 w-4" /> DAILY EQUITY SUMMARY
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dailySummaries.map((day) => (
                          <Card key={day.date} className="bg-card border-border">
                            <CardContent className="p-4 space-y-3">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">DATE</span>
                                  <p className="text-xs font-mono font-bold whitespace-nowrap">{day.date}</p>
                                </div>
                                <div className="space-y-1 text-center">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">TURNOVER</span>
                                  <p className="text-xs font-mono font-bold">{currencySymbol}{day.turnover.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">NET CHANGE</span>
                                  <p className={cn("text-xs font-mono font-bold", day.netChange >= 0 ? "text-green-500" : "text-red-500")}>
                                    {day.netChange >= 0 ? '+' : ''}{currencySymbol}{day.netChange.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        FULL AUDIT LOG
                      </h3>
                      <div className="space-y-3">
                        {[...globalHistoryStats.allTrades].reverse().map((trade) => (
                          <TradeLogItem key={trade.id} trade={trade} />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sessions" className="space-y-4 m-0">
                    {store.sessions.length === 0 && !store.activeSession ? (
                      <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 bg-background/50 border-border/50">
                        <Tags className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-foreground">No sessions recorded</h3>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {store.activeSession && (
                          <Card className="bg-primary/5 border-primary/20 ring-1 ring-primary/20">
                            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                  <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-foreground flex items-center gap-2">
                                    {store.activeSession.name || 'Unnamed Session'}
                                    <Badge variant="default" className="text-[8px] h-4 bg-primary px-1">ACTIVE</Badge>
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground">
                                    Started: {store.activeSession.startTime.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 justify-between sm:justify-end">
                                 <div className="text-left sm:text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Performance</p>
                                    <div className={cn("text-lg font-headline font-bold", store.activeSession.trades.reduce((acc, t) => acc + (t.type === 'win' ? t.amount : -t.amount), 0) >= 0 ? "text-green-500" : "text-red-500")}>
                                      {currencySymbol}{store.activeSession.trades.reduce((acc, t) => acc + (t.type === 'win' ? t.amount : -t.amount), 0).toFixed(2)}
                                    </div>
                                 </div>
                                 <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  className="h-8"
                                  onClick={() => setView('dashboard')}
                                >
                                  Go to Live
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {store.sessions.map((session) => {
                          const sessionPnL = session.trades.reduce((acc, t) => acc + (t.type === 'win' ? t.amount : -t.amount), 0);
                          return (
                            <Card key={session.id} className="bg-card border-border">
                              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                                    <Activity className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-foreground">{session.name || 'Unnamed Session'}</h4>
                                    <p className="text-[10px] text-muted-foreground">
                                      {session.startTime.toLocaleDateString()} at {session.startTime.toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 justify-between sm:justify-end">
                                   <div className="text-left sm:text-right">
                                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Performance</p>
                                      <div className={cn("text-lg font-headline font-bold", sessionPnL >= 0 ? "text-green-500" : "text-red-500")}>
                                        {sessionPnL >= 0 ? '+' : ''}{currencySymbol}{sessionPnL.toFixed(2)}
                                      </div>
                                   </div>
                                   <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="gap-2 h-8 text-xs flex-1"
                                          onClick={() => {
                                            store.resumeSession(session.id);
                                            setView('dashboard');
                                          }}
                                        >
                                          <RotateCcw className="h-3 w-3" /> Resume
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                          onClick={() => store.deleteSession(session.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground text-right">{session.trades.length} Trades</p>
                                   </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {view === 'sizer' && (
              <PositionSizer store={store} setView={setView} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
