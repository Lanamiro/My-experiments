import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = 'gemini-3-pro-preview';
const CHAT_MODEL = 'gemini-3-pro-preview';
const EXTRACTION_MODEL = 'gemini-2.5-flash';

export const extractProfileFromCV = async (fileBase64: string, mimeType: string): Promise<Partial<UserProfile>> => {
  const prompt = `
    Analyze this CV/Resume and extract the user's professional profile.
    Return a JSON object with:
    - name: Full name
    - currentRole: Most recent job title found in experience
    - yearsExperience: Estimate total years of professional experience based on the timeline
    - skills: List of top technical and soft skills (max 15)
    - bio: A brief professional summary (2-3 sentences) based on their background
    - targetRole: Infer a logical next career step (e.g. if Senior Dev, target Lead Dev). If unclear, return an empty string.
  `;

  const response = await ai.models.generateContent({
    model: EXTRACTION_MODEL,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: fileBase64
          }
        },
        {
          text: prompt
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          currentRole: { type: Type.STRING },
          yearsExperience: { type: Type.INTEGER },
          targetRole: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          bio: { type: Type.STRING },
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to extract information from CV");
  }

  return JSON.parse(response.text) as Partial<UserProfile>;
};

export const analyzeCareerProfile = async (profile: UserProfile): Promise<CareerAnalysis> => {
  const prompt = `
    Act as a world-class Senior Career Consultant. 
    Analyze the following user profile and provide a detailed career growth plan.
    
    User Profile:
    Name: ${profile.name}
    Current Role: ${profile.currentRole}
    Years of Experience: ${profile.yearsExperience}
    Target Role: ${profile.targetRole}
    Skills: ${profile.skills.join(', ')}
    Goals/Bio: ${profile.bio}

    User Preferences & Constraints:
    - Preferred Career Path: ${profile.careerPath} (Tailor the roadmap to this track: e.g. Technical vs Management)
    - Learning Style: ${profile.learningStyles.join(', ')} (Recommend resources that match this style)
    - Weekly Time Commitment: ${profile.timeCommitment} (Ensure the roadmap duration and intensity fits this schedule)

    Provide:
    1. An executive summary of their current standing vs target, acknowledging their preferred path.
    2. A skill gap analysis (rate current vs target 1-10) for their top 5-6 relevant skills.
    3. A concrete roadmap with 3-4 distinct phases/steps.
    4. Salary insights (general trends for the jump).
    5. 3 specific learning resources or certifications (matching their learning style).
  `;

  const response = await ai.models.generateContent({
    model: ANALYSIS_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          skillGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                currentScore: { type: Type.INTEGER, description: "1-10 scale" },
                targetScore: { type: Type.INTEGER, description: "1-10 scale" },
                importance: { type: Type.STRING, description: "High, Medium, or Low" },
                recommendation: { type: Type.STRING, description: "Actionable tip to improve" }
              }
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING, description: "e.g. 'Immediate Actions' or 'Phase 1'" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING, description: "e.g. '1-3 months'" }
              }
            }
          },
          salaryInsights: { type: Type.STRING },
          recommendedResources: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate analysis");
  }

  return JSON.parse(response.text) as CareerAnalysis;
};

export const createCareerChat = (profile: UserProfile) => {
  const systemInstruction = `
    You are a supportive and knowledgeable Career Consultant helping ${profile.name}.
    
    Context:
    - Current Role: ${profile.currentRole}
    - Target Role: ${profile.targetRole}
    - Skills: ${profile.skills.join(', ')}
    - Preferred Path: ${profile.careerPath}
    
    Keep answers concise, motivating, and actionable. 
    Focus on the user's growth towards their target role.
  `;

  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};