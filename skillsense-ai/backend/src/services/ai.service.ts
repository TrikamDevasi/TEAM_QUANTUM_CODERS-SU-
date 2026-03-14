import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface SkillGapAnalysisInput {
    studentId: string;
    studentName: string;
    program: string;
    skills: { skill: string; score: number }[];
    targetRole?: string;
    nsqfLevel: number;
}

export interface SkillGapAnalysisResult {
    studentId: string;
    overallGapScore: number;
    criticalGaps: { skill: string; currentScore: number; requiredScore: number; gap: number }[];
    recommendations: string[];
    estimatedTimeToClose: string;
    nextSteps: string[];
    aiSummary: string;
}

export interface CareerMatchInput {
    skills: { skill: string; score: number }[];
    program: string;
    nsqfLevel: number;
    overallScore: number;
    state: string;
    gender: 'male' | 'female';
}

export interface CareerMatchResult {
    topCareerPaths: {
        title: string;
        matchPercent: number;
        requiredUpskilling: string[];
        estimatedSalary: { min: number; max: number };
        timeToAchieve: string;
    }[];
    aiExplanation: string;
}

export interface InterventionRecommendation {
    type: 'skill-gap' | 'dropout-risk' | 'placement-alert' | 'remediation';
    urgency: 'high' | 'medium' | 'low';
    action: string;
    expectedOutcome: string;
}

export class AIService {
    /**
     * Analyse skill gaps for a student and produce structured recommendations.
     */
    async analyzeSkillGaps(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisResult> {
        const prompt = `
You are an AI skill gap analyst for India's vocational education system (NSQF framework).

Student Profile:
- Name: ${input.studentName}
- Program: ${input.program}
- NSQF Level: ${input.nsqfLevel}
- Target Role: ${input.targetRole ?? 'Not specified'}
- Current Skills: ${JSON.stringify(input.skills)}

Task: Analyse skill gaps, identify critical deficiencies, and recommend targeted upskilling actions relevant to the Indian vocational market.

Respond ONLY with a JSON object matching this schema:
{
  "overallGapScore": <number 0-100, higher = bigger gap>,
  "criticalGaps": [
    { "skill": "<name>", "currentScore": <num>, "requiredScore": <num>, "gap": <num> }
  ],
  "recommendations": ["<actionable recommendation>"],
  "estimatedTimeToClose": "<e.g. 3 months>",
  "nextSteps": ["<immediate next step>"],
  "aiSummary": "<2-3 sentence plain English summary>"
}
`.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3,
            max_tokens: 600,
        });

        const parsed = JSON.parse(completion.choices[0].message.content ?? '{}');
        return { studentId: input.studentId, ...parsed };
    }

    /**
     * Match a student profile to viable career pathways using AI.
     */
    async matchCareerPaths(input: CareerMatchInput): Promise<CareerMatchResult> {
        const prompt = `
You are an AI career counselor for India's vocational education ecosystem.

Student Profile:
- Program: ${input.program}
- NSQF Level: ${input.nsqfLevel}
- Overall Score: ${input.overallScore}/100
- State: ${input.state}
- Skills: ${JSON.stringify(input.skills)}

Task: Identify the top 3 realistic career pathways for this student within the Indian job market (consider sectors like manufacturing, IT, healthcare, renewable energy, automobile). For each pathway specify match %, required upskilling, salary range in INR, and estimated time to achieve.

Respond ONLY with JSON matching this schema:
{
  "topCareerPaths": [
    {
      "title": "<career path title>",
      "matchPercent": <number>,
      "requiredUpskilling": ["<skill>"],
      "estimatedSalary": { "min": <monthly INR>, "max": <monthly INR> },
      "timeToAchieve": "<e.g. 6 months>"
    }
  ],
  "aiExplanation": "<3 sentence explanation of the logic>"
}
`.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 700,
        });

        return JSON.parse(completion.choices[0].message.content ?? '{}') as CareerMatchResult;
    }

    /**
     * Generate intervention recommendations for a cohort of at-risk students.
     */
    async generateInterventions(
        atRiskStudents: {
            name: string;
            overallScore: number;
            attendance?: number;
            missingSkills: string[];
        }[]
    ): Promise<InterventionRecommendation[]> {
        const prompt = `
You are an AI education intervention planner for vocational students in India.

At-risk students data: ${JSON.stringify(atRiskStudents)}

For each student, generate targeted intervention recommendations. Consider attendance, skill scores, and program context.

Respond ONLY with a JSON array:
[
  {
    "studentName": "<name>",
    "type": "skill-gap" | "dropout-risk" | "placement-alert" | "remediation",
    "urgency": "high" | "medium" | "low",
    "action": "<specific action to take>",
    "expectedOutcome": "<measurable outcome>"
  }
]
`.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3,
            max_tokens: 800,
        });

        const data = JSON.parse(completion.choices[0].message.content ?? '{"interventions":[]}');
        return Array.isArray(data) ? data : data.interventions ?? [];
    }

    /**
     * Generate a plain-language insight summary for a dashboard section.
     */
    async generateInsightSummary(context: string, dataSnippet: object): Promise<string> {
        const prompt = `
You are an AI analyst for the SkillSense AI vocational intelligence platform.

Context: ${context}
Data: ${JSON.stringify(dataSnippet)}

Write a concise 2-3 sentence insight in plain English suitable for a government/industry dashboard. Focus on actionable takeaways specific to India's skill development sector.
`.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 200,
        });

        return completion.choices[0].message.content?.trim() ?? '';
    }
}

export const aiService = new AIService();
