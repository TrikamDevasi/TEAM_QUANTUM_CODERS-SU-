export interface SkillScore {
  skillName: string;
  score: number;
  confidence: number;
}

export interface CareerPrediction {
  likelyRoles: string[];
  matchScores: number[];
  predictedSalaryRange: string;
  timeToPlacement: string;
}

export interface FairnessFlag {
  dimension: string;
  gapPercent: number;
  severity: 'critical' | 'moderate' | 'minor';
}

export interface FairnessReport {
  isFair: boolean;
  flags: FairnessFlag[];
  recommendations: string[];
}

export interface Intervention {
  type: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedImpact: string;
}
