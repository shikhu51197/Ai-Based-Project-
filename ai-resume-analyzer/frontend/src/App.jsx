import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import TailorResults from './components/TailorResults';
import InterviewResults from './components/InterviewResults';
import { Sparkles, Edit3, MessageCircle, Clock, Trash2 } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('analyze'); // 'analyze' | 'tailor' | 'interview'
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-resume-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const saveToHistory = (newResult, currentMode) => {
    const updated = [{ mode: currentMode, data: newResult, date: new Date().toISOString() }, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('ai-resume-history', JSON.stringify(updated));
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResults(null);
  };

  const handleAnalyze = async (data) => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      if (data.file) {
        formData.append('resume', data.file);
      } else if (data.resumeText) {
        formData.append('resumeText', data.resumeText);
      }
      
      if (data.jobDescription) {
        formData.append('jobDescription', data.jobDescription);
      }

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const endpoint = `${baseUrl}/api/${mode}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to process request. Check backend connection.');
      }

      const resultData = await response.json();
      setResults(resultData);
      saveToHistory(resultData, mode);
      toast.success('Analysis complete!');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryItem = (item) => {
    setMode(item.mode);
    setResults(item.data);
    toast('Loaded from history', { icon: '🕰️' });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai-resume-history');
    toast.success('History cleared');
  };

  const getHeaderInfo = () => {
    if (mode === 'tailor') return { title: 'Tailor Resume', desc: 'Rewrite your resume to perfectly match a job description.' };
    if (mode === 'interview') return { title: 'Interview Prep', desc: 'Generate customized interview questions based on your resume and the JD.' };
    return { title: 'AI Resume Analyzer', desc: 'Get AI-powered feedback, score, and job fit analysis instantly.' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="app-container">
      <Toaster position="top-center" toastOptions={{
        style: { background: 'var(--bg-tertiary)', color: '#fff', border: '1px solid var(--border)' }
      }} />

      <motion.header 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>{headerInfo.title} <Sparkles style={{ display: 'inline', color: 'var(--accent-primary)', marginBottom: '-4px' }} /></h1>
        <p>{headerInfo.desc}</p>
      </motion.header>

      <main>
        <AnimatePresence mode="wait">
          {!results && !isLoading && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tabs">
                <button 
                  className={`tab-btn ${mode === 'analyze' ? 'active' : ''}`}
                  onClick={() => handleModeChange('analyze')}
                >
                  Analyze
                </button>
                <button 
                  className={`tab-btn ${mode === 'tailor' ? 'active' : ''}`}
                  onClick={() => handleModeChange('tailor')}
                >
                  Tailor Resume
                </button>
                <button 
                  className={`tab-btn ${mode === 'interview' ? 'active' : ''}`}
                  onClick={() => handleModeChange('interview')}
                >
                  Interview Prep
                </button>
              </div>
              
              <UploadForm onAnalyze={handleAnalyze} isLoading={isLoading} mode={mode} />

              {history.length > 0 && (
                <div className="history-section panel" style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} /> Recent Analyses</h3>
                    <button onClick={clearHistory} className="btn-outline" style={{ border: 'none', color: 'var(--danger)' }}>
                      <Trash2 size={16} /> Clear
                    </button>
                  </div>
                  <div className="history-list">
                    {history.map((item, idx) => (
                      <div key={idx} className="history-item" onClick={() => loadHistoryItem(item)}>
                        <span className={`badge ${item.mode === 'analyze' ? 'default' : item.mode === 'tailor' ? 'technical' : 'situational'}`}>
                          {item.mode}
                        </span>
                        <span className="history-date">{new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {isLoading && (
            <motion.div 
              key="loading"
              className="panel" 
              style={{ textAlign: 'center', padding: '4rem' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="spinner" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                {mode === 'tailor' ? <Edit3 size={48} color="var(--accent-primary)" /> : 
                 mode === 'interview' ? <MessageCircle size={48} color="var(--accent-primary)" /> :
                 <Sparkles size={48} color="var(--accent-primary)" />}
              </div>
              <h2>{mode === 'tailor' ? 'Tailoring your resume...' : mode === 'interview' ? 'Generating questions...' : 'Analyzing your resume...'}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Our AI is working its magic.</p>
            </motion.div>
          )}

          {results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button 
                className="btn-outline" 
                style={{ marginBottom: '2rem' }}
                onClick={() => setResults(null)}
              >
                ← Start Over
              </button>
              
              {mode === 'analyze' && <AnalysisResults results={results} />}
              {mode === 'tailor' && <TailorResults results={results} />}
              {mode === 'interview' && <InterviewResults results={results} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
