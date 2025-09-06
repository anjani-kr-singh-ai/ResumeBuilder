import React, { useState, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ resumeData, onApplySuggestion }) => {
  const [activeTab, setActiveTab] = useState('improvements');
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [suggestions, setSuggestions] = useState({
    textImprovements: [],
    keywords: [],
    customResponse: ''
  });
  
  // This effect simulates fetching AI suggestions when the resume data changes
  useEffect(() => {
    if (resumeData.personal.title) {
      generateKeywordSuggestions(resumeData.personal.title);
    }
    
    // Only generate text improvements if there's substantial text
    if (resumeData.personal.summary && resumeData.personal.summary.length > 30) {
      generateTextImprovements();
    }
  }, [resumeData.personal.title, resumeData.personal.summary]);
  
  // Simulates AI-generated text improvements
  const generateTextImprovements = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockImprovements = [
        {
          context: "Summary",
          original: resumeData.personal.summary.substring(0, 40) + "...",
          improved: enhanceText(resumeData.personal.summary).substring(0, 40) + "...",
          reason: "More impactful language and clearer structure"
        }
      ];
      
      // Add improvement suggestions for experiences if they exist
      if (resumeData.experience && resumeData.experience.length > 0) {
        const exp = resumeData.experience[0];
        if (exp.description && exp.description.length > 20) {
          mockImprovements.push({
            context: `${exp.position} at ${exp.company}`,
            original: exp.description.substring(0, 40) + "...",
            improved: enhanceText(exp.description).substring(0, 40) + "...",
            reason: "Added measurable achievements and action verbs"
          });
        }
      }
      
      setSuggestions(prev => ({
        ...prev,
        textImprovements: mockImprovements
      }));
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Simulates keyword suggestions based on job title
  const generateKeywordSuggestions = (jobTitle) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let keywords = [];
      
      if (jobTitle.toLowerCase().includes('software') || jobTitle.toLowerCase().includes('developer')) {
        keywords = ['React', 'JavaScript', 'Node.js', 'TypeScript', 'API Design', 'CI/CD', 'Docker', 'AWS', 'Agile', 'Problem Solving'];
      } else if (jobTitle.toLowerCase().includes('data')) {
        keywords = ['Python', 'SQL', 'Data Visualization', 'Machine Learning', 'Statistics', 'Tableau', 'Power BI', 'ETL', 'Big Data', 'Data Mining'];
      } else if (jobTitle.toLowerCase().includes('manager')) {
        keywords = ['Team Leadership', 'Strategic Planning', 'Budget Management', 'KPIs', 'Stakeholder Management', 'Agile', 'Project Management', 'Process Optimization', 'Performance Reviews', 'Cross-functional Collaboration'];
      } else {
        keywords = ['Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Adaptability', 'Time Management', 'Leadership', 'Attention to Detail', 'Creativity', 'Project Management'];
      }
      
      setSuggestions(prev => ({
        ...prev,
        keywords
      }));
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Helper function to enhance text with more professional language
  const enhanceText = (text) => {
    // This would be much more sophisticated in a real AI implementation
    // Here we're just replacing some words to simulate improvement
    return text
      .replace(/managed/gi, 'orchestrated')
      .replace(/helped/gi, 'facilitated')
      .replace(/made/gi, 'developed')
      .replace(/good/gi, 'exceptional')
      .replace(/increased/gi, 'significantly boosted')
      .replace(/used/gi, 'leveraged')
      .replace(/led/gi, 'spearheaded');
  };
  
  // Handle custom AI prompt submission
  const handleCustomPromptSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const response = generateCustomResponse(customPrompt, resumeData);
      
      setSuggestions(prev => ({
        ...prev,
        customResponse: response
      }));
      
      setIsLoading(false);
    }, 2000);
  };
  
  // Generate a custom response based on the prompt
  const generateCustomResponse = (prompt, data) => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('improve summary') || promptLower.includes('better summary')) {
      return `Here's an improved summary for your profile:\n\n"Dynamic ${data.personal.title} with a proven track record of delivering innovative solutions in fast-paced environments. Leveraging ${data.experience.length}+ years of expertise in ${data.skills.slice(0, 3).map(s => s.name).join(', ')}, I excel at driving projects from conception to completion while ensuring optimal performance and scalability."`;
    }
    
    if (promptLower.includes('keywords') || promptLower.includes('skills')) {
      return `Based on your profile as a ${data.personal.title}, consider adding these industry-specific keywords: Strategic Planning, Cross-functional Leadership, Performance Optimization, Stakeholder Communication, and Technical Documentation.`;
    }
    
    if (promptLower.includes('experience') || promptLower.includes('job')) {
      return `I noticed your experience section could be strengthened by quantifying your achievements. For example, instead of "Led team projects", try "Spearheaded a cross-functional team of 8 engineers that delivered 3 critical projects ahead of schedule, resulting in 27% cost savings."`;
    }
    
    return `Based on your resume, I recommend focusing on highlighting your ${data.skills.slice(0, 2).map(s => s.name).join(' and ')} skills more prominently. Consider reorganizing your experience section to showcase these skills through specific achievements and measurable outcomes.`;
  };

  const handleApplySuggestion = (suggestion) => {
    // Improved implementation
    if (suggestion.context === "Summary") {
      onApplySuggestion('personal', null, 'summary', enhanceText(resumeData.personal.summary));
    } else {
      // For experience items, find the right one and update it
      const expItem = resumeData.experience.find(exp => 
        suggestion.context.includes(exp.position) && suggestion.context.includes(exp.company)
      );
      
      if (expItem) {
        onApplySuggestion('experience', expItem.id, 'description', enhanceText(expItem.description));
      }
    }
  };
  
  const handleAddKeyword = (keyword) => {
    // Find the first skill with an empty name or add a new one
    const emptySkill = resumeData.skills.find(skill => !skill.name.trim());
    
    if (emptySkill) {
      onApplySuggestion('skills', emptySkill.id, 'name', keyword);
    } else {
      // In a real implementation, you would use an onAddItem function prop
      // For now, we'll just show an alert
      alert(`Skill "${keyword}" would be added to your resume`);
    }
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <h3>
          <span className="ai-icon">✨</span> 
          AI Resume Assistant
        </h3>
        <div className="assistant-tabs">
          <button 
            className={`assistant-tab ${activeTab === 'improvements' ? 'active' : ''}`}
            onClick={() => setActiveTab('improvements')}
          >
            Text Improvements
          </button>
          <button 
            className={`assistant-tab ${activeTab === 'keywords' ? 'active' : ''}`}
            onClick={() => setActiveTab('keywords')}
          >
            Keyword Suggestions
          </button>
          <button 
            className={`assistant-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom AI Help
          </button>
        </div>
      </div>
      
      <div className="assistant-content">
        {isLoading && (
          <div className="ai-loading">
            <div className="loading-spinner"></div>
            <p>AI is analyzing your resume...</p>
          </div>
        )}
        
        {!isLoading && activeTab === 'improvements' && (
          <div className="improvements-list">
            {suggestions.textImprovements.length === 0 ? (
              <div className="empty-state">
                <p>Start filling out your resume to get AI-powered text improvement suggestions.</p>
                <button 
                  className="refresh-button"
                  onClick={generateTextImprovements}
                >
                  <span className="refresh-icon">↻</span> Analyze My Resume
                </button>
              </div>
            ) : (
              <>
                <div className="suggestions-header">
                  <h4>Recommended Improvements</h4>
                  <button className="refresh-button" onClick={generateTextImprovements}>
                    <span className="refresh-icon">↻</span> Refresh
                  </button>
                </div>
                {suggestions.textImprovements.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <div className="suggestion-context">{suggestion.context}</div>
                    <div className="suggestion-text">
                      <span className="original">"{suggestion.original}"</span>
                      <span className="arrow">→</span>
                      <span className="improved">"{suggestion.improved}"</span>
                    </div>
                    <div className="suggestion-reason">
                      <span className="reason-icon">💡</span>
                      {suggestion.reason}
                    </div>
                    <button 
                      className="apply-suggestion"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      Apply Suggestion
                    </button>
                  </div>
                ))}
                <div className="ai-info">
                  <p>Our AI analyzes your resume and suggests improvements to make your content more impactful.</p>
                </div>
              </>
            )}
          </div>
        )}
        
        {!isLoading && activeTab === 'keywords' && (
          <div className="keywords-list">
            {suggestions.keywords.length === 0 ? (
              <div className="empty-state">
                <p>Enter a job title to get AI-powered keyword suggestions relevant to your role.</p>
              </div>
            ) : (
              <>
                <div className="suggestions-header">
                  <h4>Industry-Relevant Keywords</h4>
                  <button 
                    className="refresh-button" 
                    onClick={() => generateKeywordSuggestions(resumeData.personal.title)}
                  >
                    <span className="refresh-icon">↻</span> Refresh
                  </button>
                </div>
                <p className="keywords-intro">
                  Based on the job title "<strong>{resumeData.personal.title}</strong>", here are keywords you might want to include:
                </p>
                <div className="keywords-grid">
                  {suggestions.keywords.map((keyword, index) => (
                    <div key={index} className="keyword-item">
                      <span>{keyword}</span>
                      <button 
                        className="add-keyword"
                        onClick={() => handleAddKeyword(keyword)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
                <div className="ai-info">
                  <p>Adding industry-specific keywords helps your resume pass through Applicant Tracking Systems (ATS).</p>
                </div>
              </>
            )}
          </div>
        )}
        
        {!isLoading && activeTab === 'custom' && (
          <div className="custom-prompt">
            <h4>Ask AI for Resume Help</h4>
            <p className="custom-prompt-intro">
              Ask our AI for specific advice about your resume. Try questions like:
            </p>
            <div className="prompt-examples">
              <span className="prompt-example" onClick={() => setCustomPrompt("How can I improve my summary?")}>
                How can I improve my summary?
              </span>
              <span className="prompt-example" onClick={() => setCustomPrompt("Suggest keywords for my role")}>
                Suggest keywords for my role
              </span>
              <span className="prompt-example" onClick={() => setCustomPrompt("Make my experience more impactful")}>
                Make my experience more impactful
              </span>
            </div>
            
            <form onSubmit={handleCustomPromptSubmit}>
              <textarea 
                className="custom-prompt-input"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask the AI for resume advice..."
                rows={3}
              />
              <button type="submit" className="submit-prompt-button">
                <span className="send-icon">↗</span> Get AI Advice
              </button>
            </form>
            
            {suggestions.customResponse && (
              <div className="custom-response">
                <h4>AI Response</h4>
                <div className="response-content">
                  {suggestions.customResponse.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
