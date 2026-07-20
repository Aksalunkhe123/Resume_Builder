let GoogleGenerativeAI;

const loadGemini = () => {
  if (!GoogleGenerativeAI) {
    GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
  }
  return GoogleGenerativeAI;
};

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const GenAI = loadGemini();
  const genAI = new GenAI(apiKey);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });
};

const buildPrompt = (resumeText) => `
You are an expert resume analyst and career coach. Analyze the resume text below and return a structured JSON report.

Return ONLY valid JSON with this exact structure (no markdown, no extra keys):
{
  "summary": "A 2-3 sentence overall assessment of the resume quality and candidate profile",
  "skills": ["list of technical and soft skills found in the resume"],
  "projects": [{"title": "project name", "description": "brief description of the project"}],
  "certifications": ["list of certifications mentioned"],
  "education": [{"degree": "degree name", "institution": "college/university", "year": "graduation year or duration"}],
  "strengths": ["3-5 key strengths of this resume"],
  "weaknesses": ["3-5 areas that need improvement"],
  "missingKeywords": ["important industry keywords or skills missing from the resume that would improve ATS score"]
}

Rules:
- Extract only information present or reasonably inferred from the resume
- If a section has no data, use an empty array (or empty string for summary fields)
- Be specific and actionable in strengths, weaknesses, and missing keywords
- missingKeywords should focus on skills/terms commonly expected for the candidate's field

RESUME TEXT:
---
${resumeText.slice(0, 12000)}
---
`;

const parseAnalysisResponse = (rawText) => {
  const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    summary: parsed.summary || '',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
  };
};

const analyzeResumeWithGemini = async (resumeText) => {
  try {
    const model = getModel();
    const prompt = buildPrompt(resumeText);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Empty response from Gemini API.');
    }

    return parseAnalysisResponse(responseText);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Gemini SDK not installed. Run "npm install" in the backend folder.'
      );
    }
    throw error;
  }
};

module.exports = { analyzeResumeWithGemini };
