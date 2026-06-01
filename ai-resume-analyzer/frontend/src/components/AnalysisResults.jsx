import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalysisResults({ results }) {
  if (!results) return null;

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
      {/* Score Card */}
      <motion.div variants={itemVariants} className="score-card">
        <div className="score-circle">
          {results.overallScore}
        </div>
        <div className="score-details">
          <h2>Resume Score</h2>
          <p>{results.summary}</p>
        </div>
      </motion.div>

      <div className="grid-2">
        {/* Strengths */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="success"><CheckCircle size={20} /> Strengths</h3>
          <ul className="list">
            {results.strengths.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Areas for Improvement */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="warning"><AlertTriangle size={20} /> Areas to Improve</h3>
          <ul className="list">
            {results.weaknesses.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Skills */}
      <motion.div variants={itemVariants} className="card">
        <h3 className="info"><TrendingUp size={20} /> Key Skills Detected</h3>
        <div className="tags">
          {results.skills.map((skill, idx) => (
            <span key={idx} className="tag">{skill}</span>
          ))}
        </div>
      </motion.div>

      {/* Job Fit */}
      <motion.div variants={itemVariants} className="card">
        <h3 className="info"><Briefcase size={20} /> Job Fit Analysis</h3>
        <p className="job-fit">{results.jobFit}</p>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="card">
        <h3 className="info">Actionable Recommendations</h3>
        <ul className="list">
          {results.recommendations.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
