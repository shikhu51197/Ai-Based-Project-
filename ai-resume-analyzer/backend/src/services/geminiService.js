import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder-key-set-env-variable');
  }
  return genAI;
};

export const generateJSON = async (systemInstruction, promptText) => {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await model.generateContent(promptText);
      const text = response.response.text();
      return JSON.parse(text);
    } catch (apiError) {
      lastError = apiError;
      const isRateLimit = apiError.message?.includes('429') || apiError.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit && attempt < 3) {
        console.log(`Rate limited (attempt ${attempt}/3). Waiting 2s before retry...`);
        await new Promise(r => setTimeout(r, 2000));
      } else {
        break;
      }
    }
  }

  const isQuotaError = lastError?.message?.includes('429') || lastError?.message?.includes('quota');
  const errorObj = new Error(isQuotaError ? 'API rate limit reached. Please wait a minute and try again.' : 'Failed to analyze with AI');
  errorObj.status = isQuotaError ? 429 : 500;
  errorObj.details = lastError?.message;
  throw errorObj;
};

export const streamText = async (promptText, res) => {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  try {
    const result = await model.generateContentStream(promptText);
    
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // Format as SSE
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error streaming text:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate response.' })}\n\n`);
    res.end();
  }
};
