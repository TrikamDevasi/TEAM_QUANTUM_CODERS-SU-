import OpenAI from 'openai';
import { SkillScore, CareerPrediction } from '../types/ai.types';
import logger from '../utils/logger';

// ── OpenAI Client ─────────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Perplexity Client (uses OpenAI-compatible API) ────────────────────────────
const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
});

// ── Skill Extraction ──────────────────────────────────────────────────────────
/**
 * Analyses assessment responses and extracts skill scores using GPT-4o.
 */
export const extractSkills = async (
  responses: { questionId: string; answer: string; timeTaken: number }[]
): Promise<SkillScore[]> => {
  if (!responses || responses.length === 0) return [];

  try {
    const prompt = `You are an expert vocational skills assessor for India's NSQF framework.
Analyse the following assessment responses and extract skill scores.

Responses:
${JSON.stringify(responses, null, 2)}

Return a JSON array of skill scores. Each item must have:
- skillName: string (specific skill identified)
- score: number (0-100, based on correctness and time taken)
- confidence: number (0-1, how confident you are in this score)

Return ONLY valid JSON, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content ?? '{"skills":[]}';
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.skills) ? parsed.skills : [];
  } catch (err) {
    logger.error('AI extractSkills error:', err);
    return [];
  }
};

// ── Career Outcome Prediction ─────────────────────────────────────────────────
/**
 * Predicts career outcomes for a student based on their skill profile.
 */
export const predictOutcome = async (
  studentId: string,
  skillData?: { skillName: string; score: number }[]
): Promise<CareerPrediction> => {
  const defaultPrediction: CareerPrediction = {
    likelyRoles: ['Entry-level Technician', 'Vocational Trainee'],
    matchScores: [65, 55],
    predictedSalaryRange: '₹1.8L - ₹3.5L per annum',
    timeToPlacement: '3-6 months',
  };

  try {
    const skillContext = skillData
      ? `Student skills: ${JSON.stringify(skillData)}`
      : `Student ID: ${studentId} (no skill data provided)`;

    const prompt = `You are a career counsellor specialising in India's vocational education sector (ITI, Polytechnic, NSQF).

${skillContext}

Based on this student's skill profile, predict career outcomes relevant to the Indian job market.

Return a JSON object with exactly these fields:
- likelyRoles: string[] (top 3 job roles they can apply for)
- matchScores: number[] (match percentage 0-100 for each role, same order)
- predictedSalaryRange: string (e.g., "₹2.4L - ₹4.2L per annum")
- timeToPlacement: string (e.g., "2-4 months")

Return ONLY valid JSON, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(content);

    return {
      likelyRoles: parsed.likelyRoles ?? defaultPrediction.likelyRoles,
      matchScores: parsed.matchScores ?? defaultPrediction.matchScores,
      predictedSalaryRange: parsed.predictedSalaryRange ?? defaultPrediction.predictedSalaryRange,
      timeToPlacement: parsed.timeToPlacement ?? defaultPrediction.timeToPlacement,
    };
  } catch (err) {
    logger.error('AI predictOutcome error:', err);
    return defaultPrediction;
  }
};

// ── Industry Demand Research (Perplexity) ─────────────────────────────────────
/**
 * Uses Perplexity to research real-time industry demand for a skill domain.
 */
export const researchIndustryDemand = async (domain: string): Promise<{
  demandSummary: string;
  trendDirection: 'rising' | 'stable' | 'declining';
  topEmployers: string[];
  avgSalaryRange: string;
}> => {
  const fallback = {
    demandSummary: `${domain} skills are in steady demand across Indian industries.`,
    trendDirection: 'stable' as const,
    topEmployers: ['TCS', 'Infosys', 'Wipro', 'HCL'],
    avgSalaryRange: '₹2L - ₹5L per annum',
  };

  try {
    const response = await perplexity.chat.completions.create({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'user',
          content: `Research the current job market demand for "${domain}" skills in India in 2025.
Provide a JSON response with:
- demandSummary: string (2-3 sentences about current demand)
- trendDirection: "rising" | "stable" | "declining"
- topEmployers: string[] (top 5 companies hiring for this skill in India)
- avgSalaryRange: string (e.g. "₹3L - ₹8L per annum")
Return ONLY valid JSON.`,
        },
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content ?? '{}';
    // Extract JSON from response (Perplexity may include text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      demandSummary: parsed.demandSummary ?? fallback.demandSummary,
      trendDirection: parsed.trendDirection ?? fallback.trendDirection,
      topEmployers: parsed.topEmployers ?? fallback.topEmployers,
      avgSalaryRange: parsed.avgSalaryRange ?? fallback.avgSalaryRange,
    };
  } catch (err) {
    logger.error('Perplexity researchIndustryDemand error:', err);
    return fallback;
  }
};

// ── AI-Powered Intervention Generation ───────────────────────────────────────
/**
 * Generates personalised learning interventions for a student using GPT-4o.
 */
export const generateAIInterventions = async (
  program: string,
  nsqfLevel: number,
  weakSkills: { skillName: string; score: number }[]
): Promise<{ type: string; message: string }[]> => {
  if (!weakSkills || weakSkills.length === 0) return [];

  try {
    const prompt = `You are an expert vocational education counsellor in India.

Student profile:
- Program: ${program}
- NSQF Level: ${nsqfLevel}
- Weak skills: ${JSON.stringify(weakSkills)}

Generate 3 specific, actionable learning interventions to improve these skills.
Each intervention should be relevant to the Indian vocational education ecosystem (NSQF, PMKVY, etc.).

Return a JSON array with objects containing:
- type: string ("training" | "workshop" | "mentorship" | "online_course" | "assessment")
- message: string (specific actionable advice, 1-2 sentences)

Return ONLY valid JSON array, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content ?? '{"interventions":[]}';
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.interventions) ? parsed.interventions :
           Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    logger.error('AI generateAIInterventions error:', err);
    return [];
  }
};
