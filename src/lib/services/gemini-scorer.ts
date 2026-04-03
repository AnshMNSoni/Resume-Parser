import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScoreResult, ExtractedSkill } from '@/lib/types';
import { env } from '@/lib/env';

const SCORING_PROMPT = `You are an expert technical recruiter and resume analyst. Analyze the following resume text and provide a comprehensive evaluation.

Return your response as a valid JSON object with exactly this structure (no markdown, no code blocks, just pure JSON):
{
  "technicalSkills": <number 0-100>,
  "codingSkills": <number 0-100>,
  "softSkills": <number 0-100>,
  "overallJobFit": <number 0-100>,
  "technicalFeedback": "<2-3 sentence evaluation of technical skills>",
  "codingFeedback": "<2-3 sentence evaluation of coding/DSA abilities>",
  "softSkillsFeedback": "<2-3 sentence evaluation of soft skills and communication>",
  "overallFeedback": "<2-3 sentence overall assessment and recommendation>",
  "extractedSkills": [{"name": "<skill>", "category": "<language|framework|tool|database|cloud|soft|other>"}]
}

Scoring Criteria:
- **Technical Skills (0-100):** Evaluate breadth and depth of technical knowledge, tools, platforms, and technologies mentioned. Consider relevance to modern tech roles.
- **Coding/DSA Skills (0-100):** Evaluate evidence of programming proficiency, algorithmic thinking, competitive programming, data structures usage, system design, and code-related projects.
- **Soft Skills (0-100):** Evaluate leadership, communication, teamwork, mentoring, project management, and interpersonal skills demonstrated through descriptions and achievements.
- **Overall Job Fit (0-100):** Holistic evaluation of the candidate's suitability for a technical role considering experience level, skill diversity, project quality, and career progression.

Be thorough but fair. Score generously for strong indicators but realistically for gaps.

{{CONTEXT}}

RESUME TEXT:
`;

export async function scoreResumeWithGemini(resumeText: string, targetRole: string | null = null, requiredSkills: string | null = null): Promise<ScoreResult> {
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not configured, using fallback scoring');
    return fallbackScoring(resumeText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let contextBlock = '';
    if (targetRole || requiredSkills) {
      contextBlock = `\nRECRUITER CONTEXT:\n- Target Role: ${targetRole || 'Not specified'}\n- Required Skills: ${requiredSkills || 'Not specified'}\nPlease strictly evaluate the candidate's suitability against these specific requirements.\n`;
    }

    const prompt = SCORING_PROMPT.replace('{{CONTEXT}}', contextBlock) + resumeText.substring(0, 8000); // Limit text length

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response - handle possible markdown wrapping
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Try to find JSON object in the response
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      console.error('No JSON object found in Gemini response');
      return fallbackScoring(resumeText);
    }

    const parsed = JSON.parse(objectMatch[0]);

    return {
      technicalSkills: clampScore(parsed.technicalSkills),
      codingSkills: clampScore(parsed.codingSkills),
      softSkills: clampScore(parsed.softSkills),
      overallJobFit: clampScore(parsed.overallJobFit),
      technicalFeedback: parsed.technicalFeedback || 'No feedback available',
      codingFeedback: parsed.codingFeedback || 'No feedback available',
      softSkillsFeedback: parsed.softSkillsFeedback || 'No feedback available',
      overallFeedback: parsed.overallFeedback || 'No feedback available',
      extractedSkills: parsed.extractedSkills || [],
    };
  } catch (error) {
    console.error('Gemini scoring failed:', error);
    return fallbackScoring(resumeText);
  }
}

function clampScore(value: unknown): number {
  const num = Number(value);
  if (isNaN(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

// ─── Fallback Keyword-Based Scoring ───
function fallbackScoring(text: string): ScoreResult {
  const textLower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  // Technical skills: count tech keywords
  const techKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'typescript',
    'aws', 'docker', 'kubernetes', 'api', 'database', 'sql', 'cloud', 'machine learning',
    'ai', 'devops', 'microservices', 'architecture', 'system design', 'backend', 'frontend',
    'fullstack', 'full-stack', 'software', 'engineer', 'developer', 'programming',
  ];
  const techCount = techKeywords.filter((k) => textLower.includes(k)).length;
  const technicalSkills = Math.min(95, Math.round((techCount / 10) * 40 + 20));

  // Coding skills: look for DSA/competitive programming indicators
  const codingKeywords = [
    'algorithm', 'data structure', 'leetcode', 'hackerrank', 'codeforces', 'competitive',
    'sorting', 'binary', 'graph', 'dynamic programming', 'optimization', 'complexity',
    'oop', 'design pattern', 'clean code', 'testing', 'unit test', 'tdd', 'debug',
    'git', 'version control', 'open source', 'contribution',
  ];
  const codingCount = codingKeywords.filter((k) => textLower.includes(k)).length;
  const codingSkills = Math.min(90, Math.round((codingCount / 8) * 40 + 15));

  // Soft skills
  const softKeywords = [
    'leadership', 'team', 'communication', 'collaboration', 'mentored', 'managed',
    'presented', 'led', 'coordinated', 'organized', 'facilitated', 'trained',
    'stakeholder', 'client', 'cross-functional', 'agile', 'scrum',
  ];
  const softCount = softKeywords.filter((k) => textLower.includes(k)).length;
  const softSkills = Math.min(90, Math.round((softCount / 6) * 35 + 20));

  // Overall: weighted combo + experience factor
  const expFactor = Math.min(20, Math.round(wordCount / 100));
  const overallJobFit = Math.min(95, Math.round(
    technicalSkills * 0.35 + codingSkills * 0.25 + softSkills * 0.2 + expFactor * 1.0
  ));

  const skills: ExtractedSkill[] = techKeywords
    .filter((k) => textLower.includes(k))
    .map((k) => ({ name: k, category: 'other' as const }));

  return {
    technicalSkills,
    codingSkills,
    softSkills,
    overallJobFit,
    technicalFeedback: `Detected ${techCount} technical keywords. ${techCount > 8 ? 'Strong technical profile.' : 'Consider highlighting more technologies.'}`,
    codingFeedback: `Found ${codingCount} coding-related indicators. ${codingCount > 5 ? 'Good programming foundation.' : 'More coding experience details would strengthen the profile.'}`,
    softSkillsFeedback: `Identified ${softCount} soft skill indicators. ${softCount > 4 ? 'Good interpersonal skills demonstrated.' : 'Consider adding more examples of teamwork and leadership.'}`,
    overallFeedback: `Overall assessment based on keyword analysis. Resume length: ${wordCount} words. ${wordCount > 300 ? 'Well-detailed resume.' : 'Consider adding more detail to strengthen your application.'}`,
    extractedSkills: skills,
  };
}
