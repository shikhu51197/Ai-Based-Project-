import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Lightbulb, ChevronRight, MessageSquare, PlayCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function InterviewResults({ results }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerInput, setAnswerInput] = useState('');
  const [evaluations, setEvaluations] = useState({}); // { qId: "evaluation text" }
  const [isEvaluating, setIsEvaluating] = useState(false);
  const evaluationEndRef = useRef(null);

  const questions = results.questions || [];

  const handleEvaluate = async (qId, questionText) => {
    if (!answerInput.trim()) {
      toast.error('Please enter an answer first.');
      return;
    }

    setIsEvaluating(true);
    setEvaluations(prev => ({ ...prev, [qId]: '' })); // Clear previous evaluation or set empty
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, answer: answerInput })
      });

      if (!response.ok) throw new Error('Failed to evaluate answer');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                setEvaluations(prev => ({
                  ...prev,
                  [qId]: (prev[qId] || '') + data.text
                }));
                // Auto scroll
                evaluationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
      setAnswerInput('');
    } catch (err) {
      toast.error(err.message);
      setEvaluations(prev => ({ ...prev, [qId]: 'Error: Could not complete evaluation.' }));
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!questions.length) return null;

  return (
    <div className="interview-container">
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <PlayCircle size={32} color="var(--accent-primary)" />
          Interactive Mock Interview
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Select a question below, type in your best answer, and get instant feedback from our AI interviewer to improve your delivery.
        </p>
      </div>

      <div className="interview-grid" style={{ display: 'grid', gridTemplateColumns: activeQuestion ? '1fr 1fr' : '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>
        {/* Question List */}
        <div className="question-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map((q, idx) => (
            <motion.div 
              key={idx}
              className={`card interactive-card ${activeQuestion?.id === q.id ? 'active-card' : ''}`}
              style={{ cursor: 'pointer', transition: 'all 0.2s', border: activeQuestion?.id === q.id ? '2px solid var(--accent-primary)' : '1px solid var(--border)' }}
              onClick={() => { setActiveQuestion(q); setAnswerInput(''); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className={`badge ${q.category === 'Technical' ? 'technical' : q.category === 'Behavioral' ? 'behavioral' : 'situational'}`}>
                  {q.category}
                </span>
                {evaluations[q.id] && <CheckCircle size={18} color="var(--success)" />}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{q.question}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem' }}>
                {evaluations[q.id] ? 'Review Feedback' : 'Practice Answer'} <ChevronRight size={16} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Workspace */}
        <AnimatePresence>
          {activeQuestion && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card interactive-workspace"
              style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px' }}
            >
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} color="var(--accent-primary)"/> Practice Mode
              </h3>
              
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <strong>Q:</strong> {activeQuestion.question}
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Lightbulb size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '0.25rem' }}>Interviewer Tip</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{activeQuestion.tip}</span>
                </div>
              </div>

              {/* Chat Area */}
              <div className="chat-area" style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                {evaluations[activeQuestion.id] && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      <Sparkles size={16} /> AI Evaluation
                    </div>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {evaluations[activeQuestion.id]}
                    </div>
                    <div ref={evaluationEndRef} />
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <textarea 
                  className="form-textarea"
                  style={{ minHeight: '80px', flexGrow: 1, padding: '0.75rem' }}
                  placeholder="Type your answer here..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleEvaluate(activeQuestion.id, activeQuestion.question);
                    }
                  }}
                  disabled={isEvaluating}
                />
                <button 
                  className="btn" 
                  style={{ width: 'auto', padding: '0 1.5rem', alignSelf: 'flex-end', height: '80px' }}
                  onClick={() => handleEvaluate(activeQuestion.id, activeQuestion.question)}
                  disabled={isEvaluating || !answerInput.trim()}
                >
                  {isEvaluating ? <div className="spinner"><PlayCircle /></div> : <Send size={20} />}
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>
                Press <kbd style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>Cmd+Enter</kbd> to submit
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InterviewResults;
