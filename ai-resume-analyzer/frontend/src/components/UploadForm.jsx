import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function UploadForm({ onAnalyze, isLoading, mode }) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain') {
        setFile(droppedFile);
        setResumeText(''); // Clear text if file is uploaded
      } else {
        alert('Please upload a PDF or TXT file.');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setResumeText(''); // Clear text if file is uploaded
      } else {
        alert('Please upload a PDF or TXT file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      alert('Please provide a resume (upload or text).');
      return;
    }
    if ((mode === 'tailor' || mode === 'interview') && !jobDescription.trim()) {
      alert('A Job Description is required for this feature.');
      return;
    }
    onAnalyze({ file, resumeText, jobDescription });
  };

  const getButtonText = () => {
    if (isLoading) return 'Analyzing...';
    if (mode === 'tailor') return 'Tailor Resume';
    if (mode === 'interview') return 'Generate Questions';
    return 'Analyze Resume';
  };

  const jdRequired = mode === 'tailor' || mode === 'interview';

  return (
    <div className="panel fade-in">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Job Description {jdRequired ? <span style={{color: 'var(--danger)'}}>* (Required)</span> : '(Optional)'}
          </label>
          <textarea 
            className="form-textarea" 
            placeholder={jdRequired ? "Paste the job description here (Required for this feature)..." : "Paste the job description here to get a tailored fit analysis..."}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required={jdRequired}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Resume Input <span style={{color: 'var(--danger)'}}>*</span></label>
          
          {!file ? (
            <div 
              className={clsx('upload-zone', dragActive && 'drag-active')}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="upload-icon" />
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-hint">PDF or TXT (Max 5MB)</p>
              <input 
                ref={inputRef}
                type="file" 
                accept=".pdf,.txt"
                className="hidden" 
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="upload-zone" style={{ padding: '2rem 1rem' }}>
              <FileText className="upload-icon" style={{ width: '2rem', height: '2rem' }} />
              <p className="upload-text">{file.name}</p>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                style={{ background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                Remove
              </button>
            </div>
          )}
          
          {!file && (
            <>
              <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)' }}>OR</div>
              <textarea 
                className="form-textarea" 
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required={!file}
              />
            </>
          )}
        </div>

        <button type="submit" className="btn" disabled={isLoading || (!file && !resumeText.trim()) || (jdRequired && !jobDescription.trim())}>
          {isLoading ? (
            <>
              <Loader2 className="spinner" /> {getButtonText()}
            </>
          ) : (
            <>
              <Send size={18} /> {getButtonText()}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
