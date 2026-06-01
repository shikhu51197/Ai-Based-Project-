import React from 'react';
import { Copy, CheckCircle, Plus, Download, FileText, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function TailorResults({ results }) {
  if (!results) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(results.fullResumeText);
    toast.success('Tailored resume copied to clipboard!');
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - (margin * 2);
      
      const textLines = doc.splitTextToSize(results.fullResumeText, maxWidth);
      
      let cursorY = margin + 5;
      const pageHeight = doc.internal.pageSize.getHeight();
      const lineHeight = 6;
      
      textLines.forEach(line => {
        if (cursorY + lineHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = margin + 5;
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });
      
      doc.save("Tailored_Resume.pdf");
      toast.success('PDF downloaded successfully!');
    } catch (e) {
      toast.error('Failed to generate PDF');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="results-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={28} color="var(--success)" /> Tailored Resume Ready!
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>We've rewritten your resume to match the job description.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={handleCopy}>
            <Copy size={16} /> Copy Text
          </button>
          <button className="btn" style={{ width: 'auto' }} onClick={handleDownload}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </motion.div>

      <div className="split-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top summary section */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} /> New Professional Summary
          </h3>
          <p className="job-fit" style={{ fontSize: '1.1rem' }}>{results.tailoredSummary}</p>
        </motion.div>

        {/* Highlights & Changes */}
        <div className="grid-2">
          <motion.div variants={itemVariants} className="card">
            <h3 className="success"><CheckCircle size={20} /> Highlighted Experience</h3>
            <ul className="list">
              {results.tailoredExperience.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 className="success" style={{ marginBottom: '0.75rem' }}><Plus size={20} /> Keywords Added</h3>
              <div className="tags">
                {results.addedKeywords.map((keyword, idx) => (
                  <span key={idx} className="tag" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <h3 className="info" style={{ marginBottom: '0.75rem' }}>Tailored Skills</h3>
              <div className="tags">
                {results.tailoredSkills.map((skill, idx) => (
                  <span key={idx} className="tag" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
            <ArrowRight size={20} /> Key Changes Made
          </h3>
          <ul className="list">
            {results.changesMade.map((change, idx) => (
              <li key={idx}>{change}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="info">Full Tailored Resume</h3>
          <div className="markdown-body" style={{ maxHeight: '600px' }}>
            {results.fullResumeText}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
