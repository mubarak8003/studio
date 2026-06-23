"use client"

import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiStrategyCoachRecommendation, AIStrategyCoachRecommendationOutput } from '@/ai/flows/ai-strategy-coach-recommendation';
import { cn } from '@/lib/utils';

interface AICoachPanelProps {
  totalCurrentLoss: number;
  recoveryTargetWins: number;
  recentWinRatePercentage: number;
  averageWinAmount: number;
  averageLossAmount: number;
}

export function AICoachPanel({
  totalCurrentLoss,
  recoveryTargetWins,
  recentWinRatePercentage,
  averageWinAmount,
  averageLossAmount
}: AICoachPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AIStrategyCoachRecommendationOutput | null>(null);

  const getCoachAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiStrategyCoachRecommendation({
        totalCurrentLoss,
        recoveryTargetWins,
        recentWinRatePercentage,
        averageWinAmount,
        averageLossAmount
      });
      setRecommendation(res);
    } catch (err: any) {
      console.error("AI Coach Error:", err);
      setError("The AI model is currently busy or unavailable. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/30 border-primary/20 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-electric-blue">
            <BrainCircuit className="h-5 w-5" /> AI Strategy Coach
          </CardTitle>
          <Badge variant="outline" className="text-[10px] uppercase border-primary/30">Beta</Badge>
        </div>
        <CardDescription>Analyze plan sustainability based on live data</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {!recommendation && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[250px] mb-6">
              RecoupPro AI will evaluate if your current recovery path is realistic.
            </p>
            <Button onClick={getCoachAdvice} className="bg-primary hover:bg-primary/90">
              Run Analysis
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">Consulting RecoupPro AI...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-sm font-medium mb-2">Service Unavailable</p>
            <p className="text-xs text-muted-foreground max-w-[220px] mb-6">
              {error}
            </p>
            <Button onClick={getCoachAdvice} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </div>
        ) : recommendation ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-3">
              {recommendation.isSustainable ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
              )}
              <div>
                <h4 className="font-bold mb-1">
                  {recommendation.isSustainable ? 'Sustainable Strategy' : 'Strategy At Risk'}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {recommendation.sustainabilityRecommendation}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Adjustments</h5>
              <ul className="space-y-2">
                {recommendation.adjustmentSuggestions.map((suggestion, i) => (
                  <li key={i} className="text-xs flex items-start gap-2 bg-obsidian/40 p-2 rounded border border-border/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-blue mt-1 shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </CardContent>

      {(recommendation || error) && (
        <CardFooter className="pt-0 pb-6 flex justify-center">
          <Button variant="ghost" size="sm" onClick={getCoachAdvice} disabled={loading} className="text-xs gap-2">
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} /> {recommendation ? 'Re-analyze' : 'Retry'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
