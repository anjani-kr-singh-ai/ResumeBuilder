import React, { useState, useEffect, useCallback } from 'react';
import GeminiAIService from '../../utils/geminiAI';
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
  const [error, setError] = useState(null);
  const [textToImprove, setTextToImprove] = useState('');
  const [improvementContext, setImprovementContext] = useState('general');
  const [apiKeyValid, setApiKeyValid] = useState(true);

  // Check API key on component mount
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        setApiKeyValid(false);
        setError('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
        return false;
      }
      return true;
    };
    
    checkApiKey();
  }, []);

  // Debounce function for real-time suggestions
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };

  const debouncedTextToImprove = useDebounce(textToImprove, 1000);
  const debouncedJobTitle = useDebounce(resumeData?.personal?.title || '', 1500);
  
  // Real-time text improvement
  useEffect(() => {
    if (apiKeyValid && debouncedTextToImprove.trim().length > 20) {
      generateRealTimeTextImprovements(debouncedTextToImprove);
    }
  }, [debouncedTextToImprove, apiKeyValid]);
  
  // Real-time keyword suggestions based on job title
  useEffect(() => {
    if (apiKeyValid && debouncedJobTitle.trim().length > 2) {
      generateRealTimeKeywords(debouncedJobTitle);
    }
  }, [debouncedJobTitle, apiKeyValid]);

  // Generate real-time text improvements using Gemini AI
  const generateRealTimeTextImprovements = async (text) => {
    if (!apiKeyValid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const improvement = await GeminiAIService.improveText(text, improvementContext);
      
      setSuggestions(prev => ({
        ...prev,
        textImprovements: [{
          context: improvementContext,
          original: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
          improved: improvement.improved.substring(0, 60) + (improvement.improved.length > 60 ? '...' : ''),
          fullImproved: improvement.improved,
          reason: improvement.reason
        }]
      }));
      
    } catch (error) {
      console.error('Error generating text improvements:', error);
      if (error.message.includes('API key')) {
        setApiKeyValid(false);
        setError('Invalid API key. Please check your Gemini API key configuration.');
      } else {
        setError('Failed to generate text improvements. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate real-time keyword suggestions
  const generateRealTimeKeywords = async (jobTitle) => {
    if (!apiKeyValid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const currentSkills = resumeData?.skills?.map(skill => skill.name).filter(Boolean) || [];
      const keywords = await GeminiAIService.suggestKeywords(jobTitle, currentSkills);
      
      setSuggestions(prev => ({
        ...prev,
        keywords: keywords || []
      }));
      
    } catch (error) {
      console.error('Error generating keywords:', error);
      if (error.message.includes('API key')) {
        setApiKeyValid(false);
        setError('Invalid API key. Please check your Gemini API key configuration.');
      } else {
        setError('Failed to generate keyword suggestions. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle custom AI prompt submission
  const handleCustomPromptSubmit = async (e) => {
    e.preventDefault();
    if (!customPrompt.trim() || !apiKeyValid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await GeminiAIService.getCustomAdvice(customPrompt, resumeData);
      
      setSuggestions(prev => ({
        ...prev,
        customResponse: response
      }));
      
    } catch (error) {
      console.error('Error getting custom advice:', error);
      if (error.message.includes('API key')) {
        setApiKeyValid(false);
        setError('Invalid API key. Please check your Gemini API key configuration.');
      } else {
        setError('Failed to get AI advice. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion) => {
    if (suggestion.context === 'general' || suggestion.context === 'summary') {
      // Copy improved text to clipboard
      navigator.clipboard.writeText(suggestion.fullImproved || suggestion.improved);
      alert('Improved text copied to clipboard!');
    } else {
      // Apply to specific resume section
      onApplySuggestion('personal', null, 'summary', suggestion.fullImproved || suggestion.improved);
    }
  };

  const handleAddKeyword = (keyword) => {
    const emptySkill = resumeData?.skills?.find(skill => !skill.name.trim());
    
    if (emptySkill) {
      onApplySuggestion('skills', emptySkill.id, 'name', keyword);
    } else {
      navigator.clipboard.writeText(keyword);
      alert(`Keyword "${keyword}" copied to clipboard!`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const retryApiConnection = () => {
    setError(null);
    setApiKeyValid(true);
    // Re-check API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      setApiKeyValid(false);
      setError('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <h3>
          <span className="ai-icon">✨</span> 
          AI Resume Assistant (Powered by Gemini)
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
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          {!apiKeyValid && (
            <button className="retry-button" onClick={retryApiConnection}>
              Retry Connection
            </button>
          )}
        </div>
      )}
      
      <div className="assistant-content">
        {activeTab === 'improvements' && (
          <div className="improvements-section">
            <div className="text-input-section">
              <h4>Paste Your Text for AI Improvement</h4>
              <div className="context-selector">
                <label>Context:</label>
                <select 
                  value={improvementContext} 
                  onChange={(e) => setImprovementContext(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="summary">Professional Summary</option>
                  <option value="experience">Work Experience</option>
                  <option value="achievement">Achievement/Accomplishment</option>
                  <option value="skill">Skill Description</option>
                </select>
              </div>
              <textarea
                className="text-improvement-input"
                value={textToImprove}
                onChange={(e) => setTextToImprove(e.target.value)}
                placeholder="Paste your text here for real-time AI improvements..."
                rows={4}
                disabled={!apiKeyValid}
              />
              <p className="input-hint">
                {apiKeyValid 
                  ? "Type or paste text (minimum 20 characters) to get real-time AI suggestions"
                  : "Please configure your Gemini API key to use this feature"
                }
              </p>
            </div>
            
            {isLoading && (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>AI is analyzing your text...</p>
              </div>
            )}
            
            {!isLoading && suggestions.textImprovements.length > 0 && (
              <div className="improvements-list">
                <h4>AI Suggestions</h4>
                {suggestions.textImprovements.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <div className="suggestion-context">{suggestion.context}</div>
                    <div className="suggestion-text">
                      <div className="original-text">
                        <strong>Original:</strong>
                        <span>"{suggestion.original}"</span>
                      </div>
                      <div className="arrow">↓</div>
                      <div className="improved-text">
                        <strong>Improved:</strong>
                        <span>"{suggestion.improved}"</span>
                      </div>
                    </div>
                    <div className="suggestion-reason">
                      <span className="reason-icon">💡</span>
                      {suggestion.reason}
                    </div>
                    <div className="suggestion-actions">
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(suggestion.fullImproved || suggestion.improved)}
                      >
                        Copy Improved Text
                      </button>
                      <button 
                        className="apply-suggestion"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply to Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'keywords' && (
          <div className="keywords-section">
            <div className="keywords-info">
              <h4>Dynamic Keyword Suggestions</h4>
              <p>Based on your job title: <strong>"{resumeData?.personal?.title || 'Enter a job title in your resume'}"</strong></p>
            </div>
            
            {isLoading && (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>AI is generating keywords...</p>
              </div>
            )}
            
            {!isLoading && suggestions.keywords.length > 0 && (
              <div className="keywords-list">
                <h4>Recommended Keywords</h4>
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
                  <p>These keywords are generated in real-time based on your job title and current skills.</p>
                </div>
              </div>
            )}
            
            {!isLoading && suggestions.keywords.length === 0 && resumeData?.personal?.title && apiKeyValid && (
              <div className="empty-state">
                <p>Enter a job title in your resume to get AI-powered keyword suggestions.</p>
              </div>
            )}
            
            {!apiKeyValid && (
              <div className="empty-state">
                <p>Please configure your Gemini API key to use keyword suggestions.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'custom' && (
          <div className="custom-prompt">
            <h4>Ask AI for Resume Help</h4>
            <p className="custom-prompt-intro">
              Ask our AI for specific advice about your resume:
            </p>
            <div className="prompt-examples">
              <span className="prompt-example" onClick={() => setCustomPrompt("How can I improve my professional summary?")}>How can I improve my professional summary?</span>
              <span className="prompt-example" onClick={() => setCustomPrompt("What skills should I add for my role?")}>What skills should I add for my role?</span>
              <span className="prompt-example" onClick={() => setCustomPrompt("How can I make my experience more impactful?")}>How can I make my experience more impactful?</span>
              <span className="prompt-example" onClick={() => setCustomPrompt("What's missing from my resume?")}>What's missing from my resume?</span>
            </div>
            
            <form onSubmit={handleCustomPromptSubmit}>
              <textarea 
                className="custom-prompt-input"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask the AI anything about your resume..."
                rows={3}
                disabled={!apiKeyValid}
              />
              <button type="submit" className="submit-prompt-button" disabled={isLoading || !apiKeyValid}>
                <span className="send-icon">↗</span> 
                {isLoading ? 'Getting AI Advice...' : 'Get AI Advice'}
              </button>
            </form>
            
            {isLoading && (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>AI is analyzing your resume...</p>
              </div>
            )}
            
            {suggestions.customResponse && (
              <div className="custom-response">
                <h4>AI Response</h4>
                <div className="response-content">
                  {suggestions.customResponse.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <button 
                  className="copy-response"
                  onClick={() => copyToClipboard(suggestions.customResponse)}
                >
                  Copy Response
                </button>
              </div>
            )}
            
            {!apiKeyValid && (
              <div className="empty-state">
                <p>Please configure your Gemini API key to use custom AI help.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
