# AI Resume Analyzer & Interview Prep

An intelligent, full-stack application designed to help job seekers optimize their resumes and prepare for interviews. Built with a modern React frontend and a robust Node.js backend powered by Google's Gemini AI.

## 🚀 Features

* **Resume Analysis**: Upload your PDF resume and a Job Description. The AI will analyze the match, give you a score, identify strengths, and provide actionable improvements.
* **Resume Tailoring**: Automatically rewrite and tailor your resume's content to perfectly match the keywords and requirements of a specific job description.
* **Interactive Mock Interview**: Generates customized behavioral and technical interview questions based on your specific resume and the target job. Practice your answers in a chat-like interface and receive instant, constructive feedback from the AI.
* **PDF & Text Support**: Flexible inputs allow you to upload a PDF directly or simply paste your resume text.
* **Local History**: Automatically saves your recent analyses in your browser's local storage so you can easily review past feedback.
* **Modern & Responsive UI**: A beautiful, animated interface built with Framer Motion and custom CSS properties.

## 💻 Tech Stack

### Frontend
* **React.js**: Core UI library
* **Vite**: Ultra-fast build tool and development server
* **Framer Motion**: For smooth, dynamic micro-animations and page transitions
* **Lucide React**: Beautiful, consistent iconography
* **Vanilla CSS**: Custom styling leveraging modern CSS variables and flex/grid layouts

### Backend
* **Node.js & Express.js**: Fast, scalable server infrastructure
* **Google Gemini AI API**: Powers all generative AI features (analysis, tailoring, and interview feedback)
* **Multer**: Middleware for handling `multipart/form-data` (PDF uploads)
* **PDF-Parse**: Extracts raw text from uploaded PDF files
* **Zod**: Schema declaration and data validation
* **Express Rate Limit & Helmet**: Security middleware to protect the API endpoints

---

## 🛠️ Local Development

### Prerequisites
* Node.js installed
* A Google Gemini API Key

### Setup

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd ai-resume-analyzer/backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```
   Start the backend server:
   ```bash
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ai-resume-analyzer/frontend
   npm install
   ```
   *(Optional)* Create a `.env` file in the `frontend` directory if your backend runs on a different port:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```
