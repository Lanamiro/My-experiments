export interface UserProfile {
  name: string;
  currentRole: string;
  yearsExperience: number;
  targetRole: string;
  skills: string[]; // Comma separated strings initially, parsed to array
  bio: string; // "What are your goals?"
  // New preference fields
  careerPath: string; // e.g., "Technical Expert", "Management"
  learningStyles: string[]; // e.g., "Video", "Hands-on"
  timeCommitment: string; // e.g., "Low", "Medium", "High"
}

export interface SkillGap {
  skill: string;
  currentScore: number; // 1-10
  targetScore: number; // 1-10
  importance: string; // High, Medium, Low
  recommendation: string;
}

export interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  duration: string;
}

export interface CareerAnalysis {
  executiveSummary: string;
  skillGaps: SkillGap[];
  roadmap: RoadmapStep[];
  salaryInsights: string;
  recommendedResources: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
}