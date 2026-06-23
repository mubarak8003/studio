'use server';
/**
 * @fileOverview An AI Strategy Coach that analyzes trading patterns and recovery settings.
 *
 * - aiStrategyCoachRecommendation - A function that provides recommendations on the sustainability of a recovery plan.
 * - AIStrategyCoachRecommendationInput - The input type for the aiStrategyCoachRecommendation function.
 * - AIStrategyCoachRecommendationOutput - The return type for the aiStrategyCoachRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIStrategyCoachRecommendationInputSchema = z.object({
  totalCurrentLoss: z
    .number()
    .describe('The total accumulated loss amount that needs to be recovered.'),
  recoveryTargetWins: z
    .number()
    .describe(
      'The number of future winning sessions over which the user aims to recover the total loss.'
    ),
  recentWinRatePercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('The recent success rate as a percentage (e.g., 60 for 60%).'),
  averageWinAmount: z
    .number()
    .describe('The average amount gained in a winning session.'),
  averageLossAmount: z
    .number()
    .describe('The average amount lost in a losing session.'),
});
export type AIStrategyCoachRecommendationInput = z.infer<
  typeof AIStrategyCoachRecommendationInputSchema
>;

const AIStrategyCoachRecommendationOutputSchema = z.object({
  sustainabilityRecommendation: z
    .string()
    .describe('A comprehensive recommendation on the sustainability of the current recovery plan.'),
  adjustmentSuggestions: z
    .array(z.string())
    .describe('A list of actionable suggestions for adjusting the trading strategy or recovery plan.'),
  isSustainable: z
    .boolean()
    .describe('A boolean indicating whether the current recovery plan is considered sustainable based on the analysis.'),
});
export type AIStrategyCoachRecommendationOutput = z.infer<
  typeof AIStrategyCoachRecommendationOutputSchema
>;

export async function aiStrategyCoachRecommendation(
  input: AIStrategyCoachRecommendationInput
): Promise<AIStrategyCoachRecommendationOutput> {
  return aiStrategyCoachRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStrategyCoachRecommendationPrompt',
  input: { schema: AIStrategyCoachRecommendationInputSchema },
  output: { schema: AIStrategyCoachRecommendationOutputSchema },
  prompt: `You are an AI Strategy Coach named RecoupPro, specializing in financial trading recovery plans. Your goal is to analyze a user's current loss situation and recovery settings, and provide a clear, actionable recommendation on the sustainability of their recovery plan based on their recent trading performance.

Analyze the following user data:
- Total Current Loss to Recover: {{{totalCurrentLoss}}}
- Target Number of Winning Sessions for Recovery: {{{recoveryTargetWins}}}
- Recent Win Rate: {{{recentWinRatePercentage}}}%
- Average Win Amount per Session: {{{averageWinAmount}}}
- Average Loss Amount per Session: {{{averageLossAmount}}}

Consider the following in your analysis:
1.  **Feasibility of Recovery:** Can the total current loss be covered within the 'recoveryTargetWins' given the 'averageWinAmount'? Calculate 'potentialRecovery = recoveryTargetWins * averageWinAmount'.
2.  **Impact of Win Rate:** Is the 'recentWinRatePercentage' sufficient to realistically achieve 'recoveryTargetWins' before accumulating further significant losses? How does the win rate compare to the average win and loss amounts?
3.  **Risk Assessment:** What is the implied risk given the average win and loss amounts? If 'averageLossAmount' is significantly higher than 'averageWinAmount', the plan might be riskier.
4.  **Overall Sustainability:** Based on all factors, is the current plan sustainable? Provide a clear 'isSustainable' boolean.

Your output should be a JSON object conforming to the AIStrategyCoachRecommendationOutputSchema, providing a 'sustainabilityRecommendation', a list of 'adjustmentSuggestions', and an 'isSustainable' boolean.
`,
});

const aiStrategyCoachRecommendationFlow = ai.defineFlow(
  {
    name: 'aiStrategyCoachRecommendationFlow',
    inputSchema: AIStrategyCoachRecommendationInputSchema,
    outputSchema: AIStrategyCoachRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
