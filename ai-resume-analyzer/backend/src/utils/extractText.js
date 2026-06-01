import { PDFParse } from 'pdf-parse';

export const extractResumeText = async (req) => {
  let resumeText = '';
  if (req.file) {
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    
    if (mimeType === 'application/pdf') {
      const pdfParser = new PDFParse({ data: fileBuffer });
      const textResult = await pdfParser.getText();
      resumeText = textResult.text;
      await pdfParser.destroy();
    } else if (mimeType === 'text/plain') {
      resumeText = fileBuffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
    }
  } else if (req.body.resumeText) {
    resumeText = req.body.resumeText;
  } else {
    throw new Error('No resume provided. Please upload a file or paste text.');
  }

  if (!resumeText.trim()) {
    throw new Error('Resume text is empty.');
  }
  return resumeText;
};
