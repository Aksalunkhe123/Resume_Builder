let GoogleGenerativeAI;

const loadGemini = () => {
  if (!GoogleGenerativeAI) {
    GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
  }
  return GoogleGenerativeAI;
};

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MOCK_REQUIRED');
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
    if (error.message === 'MOCK_REQUIRED' || (error.message && error.message.includes('API_KEY_INVALID'))) {
      console.log('Using mocked Gemini response due to missing/invalid API key.');
      return {
        summary: "This is a mocked analysis because a valid Gemini API key was not provided. The candidate has a solid foundation in software engineering with a focus on full-stack web development.",
        skills: ["Java", "Python", "JavaScript", "React", "Node.js", "SQL", "MongoDB", "Data Structures", "Algorithms", "Git"],
        projects: [
          { title: "E-commerce Platform", description: "Built a full-stack e-commerce app using MERN stack." },
          { title: "Portfolio Website", description: "Created a personal portfolio using React and Tailwind CSS." }
        ],
        certifications: ["AWS Certified Cloud Practitioner", "HackerRank Problem Solving (Basic)"],
        education: [
          { degree: "B.Tech in Computer Science", institution: "Tech University", year: "2024" }
        ],
        strengths: ["Strong problem-solving skills", "Good grasp of web technologies", "Relevant project experience"],
        weaknesses: ["Lacks cloud deployment experience", "No mention of testing frameworks (Jest, Mocha)"],
        missingKeywords: ["Docker", "Kubernetes", "CI/CD", "TypeScript"]
      };
    }
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Gemini SDK not installed. Run "npm install" in the backend folder.'
      );
    }
    throw error;
  }
};

module.exports = { analyzeResumeWithGemini };
