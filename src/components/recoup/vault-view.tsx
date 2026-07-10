
"use client"

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Wallet, 
  TrendingUp, 
  Landmark, 
  CalendarDays,
  Percent,
  PlusCircle,
  ArrowLeft,
  CircleDollarSign,
  PiggyBank,
  Edit2,
  Hash,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_SYMBOLS, CurrencyCode, BankAccount } from '@/app/lib/store';
import { cn } from '@/lib/utils';

export function VaultView({ store, setView }: { store: any, setView: (v: any) => void }) {
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [isUpdateBalanceDialogOpen, setIsUpdateBalanceDialogOpen] = useState(false);
  const [isInvDialogOpen, setIsInvDialogOpen] = useState(false);
  
  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [accountLabel, setAccountLabel] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');

  // Update Balance State
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');

  // Investment Form State
  const [invType, setInvType] = useState<'FD' | 'RD'>('FD');
  const [invBank, setInvBank] = useState('');
  const [invAccountNumber, setInvAccountNumber] = useState('');
  const [invPrincipal, setInvPrincipal] = useState('');
  const [invRate, setInvRate] = useState('');
  const [invMonths, setInvMonths] = useState('');
  const [invRDAmount, setInvRDAmount] = useState('');

  const currencySymbol = CURRENCY_SYMBOLS[store.currency as CurrencyCode];

  const totals = useMemo(() => {
    const bankTotal = store.bankAccounts.reduce((sum: number, b: any) => sum + b.balance, 0);
    const invTotal = store.investments.reduce((sum: number, i: any) => sum + i.principalAmount, 0);
    return {
      cash: bankTotal,
      invested: invTotal,
      netWorth: bankTotal + invTotal + store.walletBalance
    };
  }, [store.bankAccounts, store.investments, store.walletBalance]);

  const handleAddBank = () => {
    const bal = parseFloat(balance);
    if (!bankName || isNaN(bal)) return;
    store.addBankAccount({
      bankName,
      accountLabel: accountLabel || 'Savings',
      accountNumber: accountNumber.trim() || undefined,
      balance: bal
    });
    setBankName('');
    setAccountLabel('');
    setAccountNumber('');
    setBalance('');
    setIsBankDialogOpen(false);
  };

  const handleUpdateBalance = () => {
    const bal = parseFloat(newBalance);
    if (selectedBankId && !isNaN(bal)) {
      store.updateBankAccount(selectedBankId, { balance: bal });
      setNewBalance('');
      setSelectedBankId(null);
      setIsUpdateBalanceDialogOpen(false);
    }
  };

  const handleAddInv = () => {
    const p = parseFloat(invPrincipal);
    const r = parseFloat(invRate);
    const m = parseInt(invMonths);
    if (isNaN(p) || isNaN(r) || isNaN(m) || !invBank) return;

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + m);

    store.addInvestment({
      type: invType,
      bankName: invBank,
      accountNumber: invAccountNumber.trim() || undefined,
      principalAmount: p,
      interestRate: r,
      startDate: new Date(),
      maturityDate,
      monthlyInstallment: invType === 'RD' ? parseFloat(invRDAmount) : undefined,
      status: 'active'
    });
    
    setInvBank('');
    setInvAccountNumber('');
    setInvPrincipal('');
    setInvRate('');
    setInvMonths('');
    setInvRDAmount('');
    setIsInvDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => setView('dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 text-foreground">The Vault</h2>
          <p className="text-muted-foreground text-sm">Manage bank balances and long-term savings.</p>
        </div>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building2 className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Cash</p>
            <div className="text-2xl font-headline font-bold text-foreground">
              {currencySymbol}{totals.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Invested Capital</p>
            <div className="text-2xl font-headline font-bold text-primary">
              {currencySymbol}{totals.invested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Landmark className="h-16 w-16 text-primary" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Total Net Worth</p>
            <div className="text-3xl font-headline font-bold text-foreground">
              {currencySymbol}{totals.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="banks" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-6">
          <TabsTrigger value="banks" className="text-xs flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" /> Bank Accounts
          </TabsTrigger>
          <TabsTrigger value="investments" className="text-xs flex items-center gap-2">
            <PiggyBank className="h-3.5 w-3.5" /> FDs & RDs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Bank Balances</h3>
            <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" /> Add Bank
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border rounded-2xl max-h-[95dvh] overflow-y-auto">
                <DialogHeader className="sticky top-0 bg-card z-10 pb-4">
                  <DialogTitle>Add Bank Account</DialogTitle>
                  <DialogDescription>Track balance across your multiple accounts.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</label>
                    <Input placeholder="e.g. HDFC Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Label</label>
                    <Input placeholder="e.g. Savings, Salary" value={accountLabel} onChange={(e) => setAccountLabel(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number (Optional)</label>
                    <Input placeholder="e.g. 50100..." value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Initial Balance ({currencySymbol})</label>
                    <Input type="number" placeholder="0.00" value={balance} onChange={(e) => setBalance(e.target.value)} />
                  </div>
                </div>
                <DialogFooter className="sticky bottom-0 bg-card z-10 pt-4">
                  <Button className="w-full h-12" onClick={handleAddBank}>Save Account</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={isUpdateBalanceDialogOpen} onOpenChange={setIsUpdateBalanceDialogOpen}>
            <DialogContent className="bg-card border-border rounded-2xl">
              <DialogHeader>
                <DialogTitle>Update Balance</DialogTitle>
                <DialogDescription>Enter the latest balance for this account.</DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">New Balance ({currencySymbol})</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={newBalance} 
                    onChange={(e) => setNewBalance(e.target.value)} 
                    onFocus={(e) => e.target.select()}
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full h-11" onClick={handleUpdateBalance}>Update Balance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.bankAccounts.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-2xl border-border/50">
                <Building2 className="h-10 w-10 mb-2 opacity-20" />
                <p>No bank accounts added yet.</p>
              </div>
            )}
            {store.bankAccounts.map((bank: BankAccount) => (
              <Card 
                key={bank.id} 
                className="bg-card border-border shadow-sm group cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => {
                  setSelectedBankId(bank.id);
                  setNewBalance(bank.balance.toString());
                  setIsUpdateBalanceDialogOpen(true);
                }}
              >
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base text-foreground font-bold leading-none">{bank.bankName}</CardTitle>
                    {bank.accountNumber && (
                      <p className="text-[10px] text-muted-foreground font-mono">#{bank.accountNumber}</p>
                    )}
                    <Badge variant="outline" className="text-[9px] uppercase font-bold border-none p-0 text-primary hover:bg-transparent">
                      {bank.accountLabel}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={(e) => {
                      e.stopPropagation();
                      store.deleteBankAccount(bank.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-headline font-bold text-foreground">
                      {currencySymbol}{bank.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-40" />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-3 flex items-center gap-1.5 uppercase font-bold">
                    <CalendarDays className="h-3 w-3" /> Updated: {bank.lastUpdated.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Term Deposits (FD/RD)</h3>
            <Dialog open={isInvDialogOpen} onOpenChange={setIsInvDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" /> New Investment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border rounded-2xl max-h-[95dvh] overflow-y-auto">
                <DialogHeader className="sticky top-0 bg-card z-10 pb-4">
                  <DialogTitle>New Fixed/Recurring Deposit</DialogTitle>
                  <DialogDescription>Plan your long-term wealth growth.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Type</label>
                    <Select value={invType} onValueChange={(v: any) => setInvType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FD">Fixed Deposit (FD)</SelectItem>
                        <SelectItem value="RD">Recurring Deposit (RD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</label>
                    <Input placeholder="e.g. SBI, ICICI" value={invBank} onChange={(e) => setInvBank(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Ref / Account Number</label>
                    <Input placeholder="e.g. FD1234..." value={invAccountNumber} onChange={(e) => setInvAccountNumber(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Principal ({currencySymbol})</label>
                      <Input type="number" value={invPrincipal} onChange={(e) => setInvPrincipal(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Rate (%)</label>
                      <Input type="number" step="0.1" value={invRate} onChange={(e) => setInvRate(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Tenacity (Months)</label>
                    <Input type="number" value={invMonths} onChange={(e) => setInvMonths(e.target.value)} />
                  </div>
                  {invType === 'RD' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Installment</label>
                      <Input type="number" value={invRDAmount} onChange={(e) => setInvRDAmount(e.target.value)} />
                    </div>
                  )}
                </div>
                <DialogFooter className="sticky bottom-0 bg-card z-10 pt-4">
                  <Button className="w-full h-12" onClick={handleAddInv}>Create Investment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {store.investments.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-2xl border-border/50">
                <PiggyBank className="h-10 w-10 mb-2 opacity-20" />
                <p>No investments recorded.</p>
              </div>
            )}
            {store.investments.map((inv: any) => (
              <Card key={inv.id} className="bg-card border-border shadow-sm group overflow-hidden">
                <div className={cn("h-1 w-full", inv.type === 'FD' ? "bg-accent" : "bg-primary")} />
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      inv.type === 'FD' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                    )}>
                      <Landmark className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground">{inv.bankName}</h4>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold border-border/50 h-5 px-1.5">{inv.type}</Badge>
                      </div>
                      {inv.accountNumber && (
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">#{inv.accountNumber}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-tight flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" /> Mature: {inv.maturityDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:flex md:items-center gap-8 text-right">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">Principal</p>
                      <p className="font-bold text-foreground font-mono">{currencySymbol}{inv.principalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">Rate</p>
                      <p className="font-bold text-primary flex items-center justify-end gap-1">
                        {inv.interestRate}% <Percent className="h-3 w-3" />
                      </p>
                    </div>
                    {inv.monthlyInstallment && (
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">Installment</p>
                        <p className="font-bold text-accent">{currencySymbol}{inv.monthlyInstallment}/mo</p>
                      </div>
                    )}
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => store.deleteInvestment(inv.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
