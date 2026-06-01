import { extractResumeText } from '../utils/extractText.js';
import { generateJSON, streamText } from '../services/geminiService.js';
import { analyzeResumePrompt, tailorResumePrompt, interviewPrepPrompt, evaluateAnswerPrompt } from '../utils/prompts.js';

export const analyzeResume = async (req, res, next) => {
  try {
    const jobDescription = req.body.jobDescription || '';
    const resumeText = await extractResumeText(req);
    const prompt = `Job Description (Optional):\n${jobDescription}\n\nResume Text:\n${resumeText}`;
    
    const analysis = await generateJSON(analyzeResumePrompt, prompt);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

export const tailorResume = async (req, res, next) => {
  try {
    const jobDescription = req.body.jobDescription || '';
    if (!jobDescription.trim()) {
      return res.status(400).json({ error: 'Job Description is required for tailoring.' });
    }
    const resumeText = await extractResumeText(req);
    const prompt = `Job Description:\n${jobDescription}\n\nResume Text:\n${resumeText}`;
    
    const tailored = await generateJSON(tailorResumePrompt, prompt);
    res.json(tailored);
  } catch (error) {
    next(error);
  }
};

export const interviewPrep = async (req, res, next) => {
  try {
    const jobDescription = req.body.jobDescription || '';
    if (!jobDescription.trim()) {
      return res.status(400).json({ error: 'Job Description is required for interview prep.' });
    }
    const resumeText = await extractResumeText(req);
    const prompt = `Job Description:\n${jobDescription}\n\nResume Text:\n${resumeText}`;
    
    const questions = await generateJSON(interviewPrepPrompt, prompt);
    
    // Ensure IDs exist for the interactive part
    if (questions.questions && Array.isArray(questions.questions)) {
      questions.questions = questions.questions.map((q, i) => ({ ...q, id: `q${i}` }));
    }
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

export const evaluateAnswer = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }

    const promptText = evaluateAnswerPrompt.replace('{question}', question).replace('{answer}', answer);
    
    // We will stream the evaluation back
    await streamText(promptText, res);
  } catch (error) {
    next(error);
  }
};
