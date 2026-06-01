import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('\x1b[33m%s\x1b[0m', 'Warning: GEMINI_API_KEY environment variable is not set. API calls will fail until it is provided.');
  }
});
