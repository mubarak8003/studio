
"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRecoupStore, CURRENCY_SYMBOLS, CurrencyCode, Trade } from './lib/store';
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
  MessageSquare,
  Clock,
  Info,
  Landmark,
  ArrowDownRight,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
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
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { VaultView } from '@/components/recoup/vault-view';

type View = 'dashboard' | 'history' | 'sizer' | 'vault';

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
    <div className="space-y-4 p-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground uppercase font-bold">Number</label>
          <Input 
            type="text" 
            inputMode="decimal"
            placeholder="e.g. 100" 
            value={baseNum} 
            onChange={(e) => setBaseNum(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="h-8 text-xs bg-background border-border/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground uppercase font-bold">Percent (%)</label>
          <Input 
            type="text" 
            inputMode="decimal"
            placeholder="e.g. 40" 
            value={percent} 
            onChange={(e) => setPercent(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="h-8 text-xs bg-background border-border/50"
          />
        </div>
      </div>

      {result !== null ? (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center animate-in zoom-in duration-200">
          <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Result</span>
          <div className="text-2xl font-headline font-bold text-primary">
            {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-center font-medium">
            {percent}% of {baseNum}
          </p>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center border border-dashed rounded-xl border-border/50 text-muted-foreground text-[10px] font-medium">
          Enter values to calculate
        </div>
      )}
    </div>
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
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
          <Landmark className="h-3 w-3" /> Main Balance ({currencySymbol})
        </label>
        <SmartNumericInput 
          value={store.accountBalance} 
          onChange={store.setAccountBalance}
          className="bg-background border-border"
        />
        <p className="text-[9px] text-muted-foreground italic">Percentage calculations are based on this balance.</p>
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
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/50 px-1 rounded">Beta</span>
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
                This will permanently delete all your sessions, trade history, and wallet savings. Your Banking data 🏦 and strategy notes 📝 will NOT be deleted.
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
                    <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={fill} strokeWidth={1} />
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
                <p className="text-[10px] text-muted-foreground italic">Note: Balance set here is shared with Strategy Engine.</p>
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
  const [tradeDescription, setTradeDescription] = useState<string>('');
  const [sessionNameInput, setSessionNameInput] = useState<string>('');
  const [isStartSessionDialogOpen, setIsStartSessionDialogOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [mounted, setMounted] = useState(false);
  const [forecastCount, setForecastCount] = useState(1);
  const [isCustomForecast, setIsCustomForecast] = useState(false);
  const [customForecastValue, setCustomForecastValue] = useState("1");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      window.scrollTo(0, 0);
    }
  }, [view, mounted]);

  const formatPercent = (val: number) => {
    if (isNaN(val) || val === 0) return "0%";
    if (Math.abs(val) > 1000) {
      return val.toLocaleString(undefined, { maximumFractionDigits: 0 }) + "%";
    }
    return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "%";
  };

  const activeSessionStats = useMemo(() => {
    const s = store.activeSession;
    const trades = s?.trades || [];
    const chronTrades = [...trades].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
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

    // Multi-Trade Projection Simulation
    const simulateFuture = (initialD: number, count: number, isWinSequence: boolean) => {
      let d = initialD;
      let totalNetImpact = 0;
      let recoveryTarget = settings.recoveryTargetWins;

      for (let i = 0; i < count; i++) {
        // Recovery logic
        const simNetRec = d / (recoveryTarget || 1);
        const simTotalNetNeeded = (settings.baseStake * settings.riskRewardRatio) + simNetRec;
        const simTotalGrossNeeded = simTotalNetNeeded / safeWalletFactor;
        const simStake = simTotalGrossNeeded / (settings.riskRewardRatio || 1);
        const simWalletDed = simStake * (settings.walletDeductionPercent / 100);

        if (isWinSequence) {
          const simWinNet = (simStake * settings.riskRewardRatio) - simWalletDed;
          d = Math.max(0, d - simWinNet);
          totalNetImpact += simWinNet;
          if (recoveryTarget > 0) recoveryTarget--;
        } else {
          const simLossNet = simStake + simWalletDed;
          d += simLossNet;
          totalNetImpact += simLossNet;
          recoveryTarget++;
        }
      }
      return { d, totalNetImpact };
    };

    const winProjection = simulateFuture(currentDrawdown, forecastCount, true);
    const lossProjection = simulateFuture(currentDrawdown, forecastCount, false);

    const drawdownPercent = store.accountBalance > 0 ? (currentDrawdown / store.accountBalance) * 100 : 0;
    const netPnLPercent = store.accountBalance > 0 ? (netPnL / store.accountBalance) * 100 : 0;
    const walletPercent = store.accountBalance > 0 ? (store.walletBalance / store.accountBalance) * 100 : 0;
    const recoveryAdjustmentPercent = store.accountBalance > 0 ? (recoveryStakeAdjustment / store.accountBalance) * 100 : 0;
    const nextStakePercent = store.accountBalance > 0 ? (nextStake / store.accountBalance) * 100 : 0;
    const baseStakePercent = store.accountBalance > 0 ? (settings.baseStake / store.accountBalance) * 100 : 0;

    return {
      currentDrawdown,
      drawdownPercent,
      netPnLPercent,
      walletPercent,
      recoveryAdjustmentPercent,
      nextStakePercent,
      baseStakePercent,
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
      projectedWinDrawdown: winProjection.d,
      projectedLossDrawdown: lossProjection.d,
      winNetProfit: winProjection.totalNetImpact,
      lossNetImpact: lossProjection.totalNetImpact,
    };
  }, [store, forecastCount]);

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

  const lifetimeStats = useMemo(() => {
    const trades = globalHistoryStats.allTrades;
    const wins = trades.filter(t => t.type === 'win');
    const netPnL = trades.reduce((acc, t) => acc + (t.type === 'win' ? t.amount : -t.amount), 0);
    const totalWallet = trades.reduce((acc, t) => acc + t.deduction, 0);
    
    return {
      totalTrades: trades.length,
      winRate: trades.length > 0 ? (wins.length / trades.length) * 100 : 0,
      netPnL,
      totalWallet,
      turnover: globalHistoryStats.totalTurnover
    };
  }, [globalHistoryStats]);

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
    const groups: Record<string, { turnover: number, netChange: number, walletAmount: number, count: number }> = {};
    globalHistoryStats.allTrades.forEach(trade => {
      const day = trade.timestamp.toLocaleDateString('en-CA');
      if (!groups[day]) groups[day] = { turnover: 0, netChange: 0, walletAmount: 0, count: 0 };
      groups[day].turnover += trade.originalAmount;
      groups[day].netChange += (trade.type === 'win' ? trade.amount : -trade.amount);
      groups[day].walletAmount += trade.deduction;
      groups[day].count += 1;
    });
    return Object.entries(groups).map(([date, stats]) => ({ date, ...stats })).reverse();
  }, [globalHistoryStats.allTrades]);

  const handleAddTrade = (type: 'win' | 'loss') => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;
    store.addTrade(type, amount, tradeDescription.trim() || undefined);
    setTradeAmount('');
    setTradeDescription('');
    
    // Auto-decrement forecast count
    if (forecastCount > 0) {
      setForecastCount(prev => Math.max(0, prev - 1));
      if (isCustomForecast) {
        setCustomForecastValue(prev => Math.max(0, (parseInt(prev) || 0) - 1).toString());
      }
    }
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
  const latestDailySummary = dailySummaries[0];

  const TradeLogItem = ({ trade }: { trade: Trade }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn(
          "flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/20 shadow-sm transition-all hover:shadow-md cursor-pointer group active:scale-[0.98]",
          trade.type === 'win' ? "hover:bg-green-500/[0.02]" : "hover:bg-red-500/[0.02]"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
              trade.type === 'win' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              {trade.type === 'win' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-bold text-foreground">{currencySymbol}{trade.originalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <div className="flex items-center text-[11px] text-muted-foreground font-medium">
                <span>{trade.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</span>
                {trade.deduction > 0 && (
                  <span className="text-[#14b8a6] font-bold flex items-center">
                    <span className="mx-1.5 opacity-50">•</span>
                    Wallet: {currencySymbol}{trade.deduction.toFixed(2)}
                  </span>
                )}
                {trade.description && (
                  <span className="text-accent font-bold flex items-center">
                    <span className="mx-1.5 opacity-50">•</span>
                    <Info className="h-3 w-3" />
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
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              trade.type === 'win' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              {trade.type === 'win' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
            Trade Details
          </DialogTitle>
          <DialogDescription>
            Transaction summary for the entry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Type</span>
              <p className={cn("font-bold text-lg", trade.type === 'win' ? "text-green-500" : "text-red-500")}>
                {trade.type.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Entry Time</span>
              <div className="flex items-center justify-end gap-1.5 text-foreground font-medium">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {trade.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Original Stake:</span>
                <span className="font-bold">{currencySymbol}{trade.originalAmount.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center text-[#14b8a6]">
                <span className="text-xs">Wallet Savings (Deduction):</span>
                <span className="font-bold">-{currencySymbol}{trade.deduction.toFixed(2)}</span>
             </div>
             <Separator className="bg-border/30" />
             <div className="flex justify-between items-center text-lg">
                <span className="text-sm font-medium">Net P/L Result:</span>
                <span className={cn("font-headline font-bold", trade.type === 'win' ? "text-green-500" : "text-red-500")}>
                  {trade.type === 'win' ? '+' : '-'}{currencySymbol}{trade.amount.toFixed(2)}
                </span>
             </div>
          </div>

          {trade.description && (
            <div className="space-y-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Notebook className="h-3 w-3" /> Trade Description / Note
              </span>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm leading-relaxed text-foreground italic">
                "{trade.description}"
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full h-11">
              Close Details
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-col min-h-svh overflow-x-hidden">
      <header className="md:hidden sticky top-0 flex items-center justify-between p-2 border-b border-border bg-card/80 backdrop-blur-md z-40">
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
                    <Button variant={view === 'vault' ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView('vault')}>
                      <Landmark className="h-4 w-4" /> The Vault
                    </Button>
                    <Button variant={view === 'sizer' ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView('sizer')}>
                      <Briefcase className="h-4 w-4" /> Position Sizer
                    </Button>
                    <Button variant={view === 'history' ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView('history')}>
                      <History className="h-4 w-4" /> History
                    </Button>
                  </nav>
                  <Separator className="bg-border/30" />
                  {(view !== 'sizer' && view !== 'vault') && (
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
            <Button variant={view === 'vault' ? "secondary" : "ghost"} className="w-full justify-start gap-3 text-foreground" onClick={() => setView('vault')}>
              <Landmark className="h-4 w-4" /> The Vault
            </Button>
            <Button variant={view === 'sizer' ? "secondary" : "ghost"} className="w-full justify-start gap-3 text-foreground" onClick={() => setView('sizer')}>
              <Briefcase className="h-4 w-4" /> Position Sizer
            </Button>
            <Button variant={view === 'history' ? "secondary" : "ghost"} className="w-full justify-start gap-3 text-foreground" onClick={() => setView('history')}>
              <History className="h-4 w-4" /> History
            </Button>
          </nav>

          {(view !== 'sizer' && view !== 'vault') && (
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

        <main className="flex-1 min-h-svh p-2 md:p-10 bg-background/40 overflow-x-hidden">
          <div className="max-w-5xl mx-auto space-y-5 md:space-y-8">
            {view === 'dashboard' && (
              <div className="animate-in fade-in duration-500 space-y-5 md:space-y-8">
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
                                  className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-primary text-base"
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
                    <CardHeader className="pb-2">
                      <CardTitle className="text-primary text-lg md:text-xl flex items-center gap-2">
                        <Calculator className="h-5 w-5" /> Recommended Entry
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Based on target of <b>{currencySymbol}{activeSessionStats.currentDrawdown.toFixed(2)}</b> in <b>{activeSettings.recoveryTargetWins}</b> trades
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="flex flex-col items-center justify-center py-4 md:py-6 border-b border-border/30 mb-4">
                        <div className="text-6xl md:text-8xl font-headline font-bold text-foreground transition-all duration-300">
                          {currencySymbol}{activeSessionStats.nextStake.toFixed(2)}
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold">Total Trade Amount</p>
                          {activeSessionStats.nextStakePercent !== 0 && (
                            <div className="mt-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                              {formatPercent(activeSessionStats.nextStakePercent)} of Main
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex flex-col items-center gap-2">
                          {activeSessionStats.currentDrawdown > 0 && (
                            <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md animate-in fade-in zoom-in">
                              {activeSettings.useManualDrawdown ? 'Manual Target: ' : 'Recovery Target: '}{currencySymbol}{activeSessionStats.currentDrawdown.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm space-y-3">
                           <h4 className="font-bold text-sm flex items-center gap-2 text-muted-foreground uppercase tracking-tight">
                             <Target className="h-4 w-4" /> Profit Breakdown
                           </h4>
                           <div className="space-y-3">
                             <div className="flex justify-between items-center text-sm font-medium">
                               <span className="text-foreground">Base Profit Target:</span>
                               <span className="font-bold">{currencySymbol}{activeSessionStats.grossBaseProfit.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm font-medium text-destructive">
                               <span>Recovery Component:</span>
                               <span className="font-bold">+ {currencySymbol}{activeSessionStats.grossRecoveryProfit.toFixed(2)}</span>
                             </div>
                             <Separator className="bg-border/40" />
                             <div className="flex justify-between items-center text-base font-bold text-primary">
                               <span>Total Win Goal:</span>
                               <span>{currencySymbol}{(activeSessionStats.grossBaseProfit + activeSessionStats.grossRecoveryProfit).toFixed(2)}</span>
                             </div>
                           </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-primary/[0.03] border border-primary/10 shadow-sm space-y-3">
                           <h4 className="font-bold text-sm flex items-center gap-2 text-primary uppercase tracking-tight">
                             <ArrowUpRight className="h-4 w-4" /> Investment Logic
                           </h4>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center text-sm font-medium">
                               <span className="text-foreground">Base Investment:</span>
                               <div className="flex items-center gap-1.5">
                                 <span className="font-bold">{currencySymbol}{activeSettings.baseStake.toFixed(2)}</span>
                                 {activeSessionStats.baseStakePercent !== 0 && (
                                   <span className="text-[9px] font-bold bg-muted/50 px-1 rounded border border-border/50 text-muted-foreground">
                                     {formatPercent(activeSessionStats.baseStakePercent)}
                                   </span>
                                 )}
                               </div>
                             </div>
                             <div className="flex flex-col gap-0.5">
                               <div className="flex justify-between items-center text-sm font-bold text-primary">
                                 <span>Recovery Adjustment:</span>
                                 <div className="flex items-center gap-1.5">
                                    <span className="font-bold">+ {currencySymbol}{activeSessionStats.recoveryStakeAdjustment.toFixed(2)}</span>
                                    {activeSessionStats.recoveryAdjustmentPercent !== 0 && (
                                       <span className="text-[9px] font-bold bg-primary/10 px-1 rounded border border-primary/20">
                                         {formatPercent(activeSessionStats.recoveryAdjustmentPercent)}
                                       </span>
                                    )}
                                 </div>
                               </div>
                             </div>
                             <div className="text-[9px] text-muted-foreground/50 italic mt-1 font-medium text-right">
                               (Target / {activeSettings.riskRewardRatio.toFixed(2)} RR)
                             </div>
                           </div>
                        </div>
                      </div>

                      {store.activeSession && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                          <div className="flex flex-col gap-2">
                            <Input 
                              placeholder={`Trade P/L Amount (${currencySymbol})`}
                              type="text" 
                              inputMode="decimal"
                              value={tradeAmount} 
                              onChange={(e) => setTradeAmount(e.target.value)}
                              onFocus={(e) => e.target.select()}
                              className="text-lg py-5 bg-background focus:ring-primary border-border"
                            />
                            <Input 
                              placeholder="Optional description / note..."
                              type="text" 
                              value={tradeDescription} 
                              onChange={(e) => setTradeDescription(e.target.value)}
                              className="text-xs h-8 bg-muted/20 border-border/50 italic"
                            />
                            <div className="flex gap-3">
                              <Button 
                                variant="outline"
                                size="lg" 
                                className="flex-1 bg-green-500/5 border-green-500/20 hover:bg-green-500/10 h-auto px-6 py-3 transition-transform active:scale-95"
                                onClick={() => handleAddTrade('win')}
                              >
                                <TrendingUp className="h-6 w-6 text-green-500" />
                              </Button>
                              <Button 
                                variant="outline"
                                size="lg" 
                                className="flex-1 bg-red-500/5 border-red-500/20 hover:bg-red-500/10 h-auto px-6 py-3 transition-transform active:scale-95"
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
                        <div className="flex flex-col">
                          <div className="text-3xl font-headline font-bold text-primary">
                            {currencySymbol}{store.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          {store.walletBalance > 0 && (
                            <div className="mt-1">
                               <div className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 w-fit px-1.5 py-0.5 rounded">
                                 {formatPercent(activeSessionStats.walletPercent)} of Main
                               </div>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Total Savings Secured</p>
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
                            <div className="flex flex-col">
                              <div className={cn("text-lg md:text-xl font-headline font-bold", activeSessionStats.netPnL >= 0 ? "text-green-500" : "text-red-500")}>
                                {activeSessionStats.netPnL >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(activeSessionStats.netPnL).toFixed(2)}
                              </div>
                              <div className="mt-1">
                                <div className={cn(
                                  "text-[10px] font-bold w-fit px-1.5 py-0.5 rounded border",
                                  activeSessionStats.netPnL >= 0 
                                    ? "text-green-500 bg-green-500/5 border-green-500/10" 
                                    : "text-red-500 bg-red-500/5 border-red-500/10"
                                )}>
                                  {activeSessionStats.netPnL >= 0 ? '+' : ''}{formatPercent(activeSessionStats.netPnLPercent)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">Current Drawdown</span>
                            <div className="flex flex-col items-end">
                              <div className="text-lg md:text-xl font-headline font-bold text-red-500 flex items-center justify-end gap-2">
                                <TrendingDown className="h-4 w-4" /> {currencySymbol}{activeSessionStats.currentDrawdown.toFixed(2)}
                              </div>
                              <div className="mt-1">
                                {activeSessionStats.currentDrawdown > 0 ? (
                                  <div className="text-[10px] font-bold text-red-500 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                                    {formatPercent(activeSessionStats.drawdownPercent)}
                                  </div>
                                ) : (
                                  <div className="text-[10px] font-bold text-green-500 bg-green-500/5 px-1.5 py-0.5 rounded border border-green-500/10">
                                    0%
                                  </div>
                                )}
                              </div>
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

                        {latestDailySummary && (
                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-muted-foreground mb-1">
                              <CalendarDays className="h-3 w-3 text-primary" /> Today's Performance Snapshot
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground uppercase text-[8px] font-sans">Turnover</span>
                                <span className="font-bold">{currencySymbol}{latestDailySummary.turnover.toLocaleString()}</span>
                              </div>
                              <div className="flex flex-col text-center">
                                <span className="text-[#14b8a6] uppercase text-[8px] font-sans">Wallet</span>
                                <div className="flex items-center justify-center gap-1">
                                  <span className="font-bold text-[#14b8a6]">{currencySymbol}{latestDailySummary.walletAmount.toFixed(2)} ({formatPercent(store.accountBalance > 0 ? (latestDailySummary.walletAmount / store.accountBalance) * 100 : 0)})</span>
                                </div>
                              </div>
                              <div className="flex flex-col text-right">
                                <span className="text-muted-foreground uppercase text-[8px] font-sans">Net Chg</span>
                                <span className={cn("font-bold", latestDailySummary.netChange >= 0 ? "text-green-500" : "text-red-500")}>
                                  {latestDailySummary.netChange >= 0 ? '+' : ''}{latestDailySummary.netChange.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

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

                    <Collapsible className="w-full space-y-2">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between gap-2 border-border/50 h-11 rounded-xl transition-all duration-200 hover:bg-muted/30 active:bg-muted/50 focus:ring-1 focus:ring-primary/20 text-foreground"
                        >
                           <div className="flex items-center gap-2 text-foreground">
                             <Percent className="h-4 w-4 text-[#14b8a6]" />
                             <span className="text-xs font-semibold uppercase tracking-wider">Quick Percent Tool</span>
                           </div>
                           <ChevronDown className="h-4 w-4 text-muted-foreground/50 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="animate-in slide-in-from-top-1 duration-200">
                        <Card className="bg-muted/10 border-border/40 p-4 rounded-xl">
                          <div className="mb-2 pb-2 border-b border-border/30 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Calculator</span>
                            <Percent className="h-3 w-3 text-primary" />
                          </div>
                          <QuickPercentTool />
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 bg-card border-border overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap className="h-10 w-10 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" /> Strategy Forecast
                        </CardTitle>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">NEXT</span>
                           {isCustomForecast ? (
                             <div className="flex items-center gap-1.5 p-0.5 px-2 bg-background border border-primary/30 rounded-full animate-in zoom-in duration-200 shadow-sm min-w-[90px] justify-between">
                               <Input 
                                 type="text" 
                                 inputMode="numeric"
                                 value={customForecastValue} 
                                 onChange={(e) => {
                                   const val = e.target.value;
                                   if (val === '') {
                                     setCustomForecastValue('');
                                     setForecastCount(0);
                                     return;
                                   }
                                   const parsed = parseInt(val);
                                   if (!isNaN(parsed)) {
                                     const capped = Math.min(1000, Math.max(0, parsed));
                                     setCustomForecastValue(capped.toString());
                                     setForecastCount(capped);
                                   }
                                 }}
                                 onBlur={() => {
                                   if (customForecastValue === '' || parseInt(customForecastValue) === 0) {
                                     setCustomForecastValue('1');
                                     setForecastCount(1);
                                   }
                                 }}
                                 onFocus={(e) => e.target.select()}
                                 className="h-6 w-10 text-[11px] font-bold p-0 text-center bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                               />
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-5 w-5 rounded-full hover:bg-muted" 
                                 onClick={() => {
                                   setIsCustomForecast(false);
                                   setForecastCount(1);
                                 }}
                               >
                                 <ChevronDown className="h-3 w-3 text-muted-foreground" />
                               </Button>
                             </div>
                           ) : (
                             <Select 
                               value={forecastCount.toString()} 
                               onValueChange={(v) => {
                                 if (v === 'custom') {
                                   setIsCustomForecast(true);
                                 } else {
                                   setForecastCount(parseInt(v));
                                 }
                               }}
                             >
                               <SelectTrigger className="h-7 w-24 text-[10px] px-3 bg-background border-primary/20 rounded-full hover:border-primary/50 transition-colors">
                                 <SelectValue placeholder={`${forecastCount} Trades`} />
                               </SelectTrigger>
                               <SelectContent className="bg-card border-border">
                                 {[1, 2, 3, 5, 10, 20].map(n => (
                                   <SelectItem key={n} value={n.toString()} className="text-[10px]">{n} Trades</SelectItem>
                                 ))}
                                 <Separator className="my-1 bg-border/30" />
                                 <SelectItem value="custom" className="text-[10px] italic">Custom...</SelectItem>
                               </SelectContent>
                             </Select>
                           )}
                        </div>
                      </div>
                      <CardDescription className="text-[10px]">What happens if the next <b>{forecastCount}</b> trades are all...</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-2xl bg-green-500/[0.03] border border-green-500/10 space-y-3">
                           <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-tight">
                             <TrendingUp className="h-3 w-3" /> Potential Wins
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-muted-foreground">{activeSessionStats.currentDrawdown > 0 ? 'Recovery Profit:' : 'Growth Profit:'}</span>
                               <span className="font-bold text-green-500">+{currencySymbol}{activeSessionStats.winNetProfit.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-muted-foreground">Remaining Drawdown:</span>
                               <span className="font-bold text-foreground">{currencySymbol}{activeSessionStats.projectedWinDrawdown.toFixed(2)}</span>
                             </div>
                             <div className="mt-2 text-[9px] text-green-600/40 italic font-medium">
                               {activeSessionStats.currentDrawdown > 0 
                                 ? `Simulated cumulative impact over ${forecastCount} consecutive winning sessions.` 
                                 : `Projected growth from ${forecastCount} consecutive winning sessions.`}
                             </div>
                           </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-red-500/[0.03] border border-red-500/10 space-y-3">
                           <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-tight">
                             <TrendingDown className="h-3 w-3" /> Potential Losses
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-muted-foreground">Total Capital Impact:</span>
                               <span className="font-bold text-red-500">-{currencySymbol}{activeSessionStats.lossNetImpact.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-muted-foreground">Projected Drawdown:</span>
                               <span className="font-bold text-foreground">{currencySymbol}{activeSessionStats.projectedLossDrawdown.toFixed(2)}</span>
                             </div>
                             <div className="mt-2 text-[9px] text-red-600/40 italic font-medium">
                               Projected risk accumulation if next {forecastCount} trades result in losses.
                             </div>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-card/50 border-border">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle className="text-lg text-foreground">Trade Log</CardTitle>
                          <CardDescription className="text-xs">Click entry for details</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setView('history')} 
                          className="text-xs bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 rounded-xl px-4"
                        >
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
                  </div>

                  <div className="lg:col-span-1 space-y-6">
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
                </div>

                <div className="pb-20">
                  <Card className="bg-card border-border shadow-xl overflow-hidden border-t-4 border-t-[#14b8a6] rounded-3xl">
                    <CardHeader className="pb-3 bg-muted/20 border-b border-border/40">
                      <CardTitle className="text-base md:text-xl flex items-center gap-3 text-foreground font-headline font-bold">
                        <Notebook className="h-6 w-6 text-primary" /> Trading Journal & Strategy Notes 📝
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">Archive your psychology, mistakes, or strategy insights here for continuous learning.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 bg-background/50">
                      <Textarea 
                        placeholder="Today's mindset: Calm. Strategy followed? Yes. Remarks about discipline or market conditions..."
                        className="min-h-[280px] bg-card border-border/40 resize-none text-base leading-relaxed p-6 font-body shadow-inner focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-2xl border-2"
                        value={store.notes}
                        onChange={(e) => store.setNotes(e.target.value)}
                      />
                    </CardContent>
                    <CardFooter className="bg-muted/10 px-6 py-4 border-t border-border/20 flex justify-end">
                       <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                         <ShieldCheck className="h-3 w-3 text-primary" /> Auto-saved to Local Secure Vault
                       </span>
                    </CardFooter>
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
                      <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground leading-tight">Global History</h2>
                      <p className="text-muted-foreground text-xs md:text-sm">Consolidated analytics for all your trading activity.</p>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-card border-border/40 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Activity className="h-10 w-10 text-primary" />
                    </div>
                    <CardContent className="p-4 pt-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Net P/L</p>
                      <div className={cn("text-2xl font-headline font-bold", lifetimeStats.netPnL >= 0 ? "text-green-500" : "text-red-500")}>
                        {lifetimeStats.netPnL >= 0 ? '+' : ''}{currencySymbol}{lifetimeStats.netPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border/40 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                    <CardContent className="p-4 pt-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Win Rate</p>
                      <div className="text-2xl font-headline font-bold text-foreground">
                        {lifetimeStats.winRate.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border/40 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Wallet className="h-10 w-10 text-primary" />
                    </div>
                    <CardContent className="p-4 pt-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#14b8a6] mb-1">Wallet Savings</p>
                      <div className="text-2xl font-headline font-bold text-[#14b8a6]">
                        {currencySymbol}{lifetimeStats.totalWallet.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border/40 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Briefcase className="h-10 w-10 text-primary" />
                    </div>
                    <CardContent className="p-4 pt-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Turnover</p>
                      <div className="text-2xl font-headline font-bold text-foreground">
                        {currencySymbol}{lifetimeStats.turnover.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="trades" className="initial w-full">
                  <TabsList className="bg-muted/50 p-1 mb-6">
                    <TabsTrigger value="trades" className="text-xs flex items-center gap-2">
                      <History className="h-3 w-3" /> Full History
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="text-xs flex items-center gap-2">
                      <Tags className="h-3 w-3" /> Sessions Log
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="trades" className="space-y-8 m-0">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                         <CalendarDays className="h-4 w-4 text-primary" /> DAILY EQUITY SUMMARY
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dailySummaries.map((day) => (
                          <Card key={day.date} className="bg-card border-border">
                            <CardContent className="p-4 space-y-3">
                              <div className="grid grid-cols-4 gap-2">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">DATE</span>
                                  <p className="text-xs font-mono font-bold whitespace-nowrap">{day.date}</p>
                                </div>
                                <div className="space-y-1 text-center">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">TURNOVER</span>
                                  <p className="text-xs font-mono font-bold">{currencySymbol}{day.turnover.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1 text-center">
                                  <span className="text-[10px] text-[#14b8a6] uppercase font-bold">WALLET</span>
                                  <p className="text-xs font-mono font-bold text-[#14b8a6]">{currencySymbol}{day.walletAmount.toFixed(2)}</p>
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

            {view === 'vault' && (
              <VaultView store={store} setView={setView} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
