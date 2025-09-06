import React from 'react';
import './Analytics.css';

const Analytics = ({ data }) => {
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate template usage percentages
  const totalTemplates = Object.values(data.templateUsage).reduce((a, b) => a + b, 0);
  const templatePercentages = Object.entries(data.templateUsage).map(([template, count]) => ({
    template,
    count,
    percentage: totalTemplates > 0 ? Math.round((count / totalTemplates) * 100) : 0
  }));

  return (
    <div className="analytics-card">
      <div className="card-header">
        <h2>Activity Summary</h2>
      </div>
      
      <div className="analytics-content">
        <div className="analytics-stats">
          <div className="stat-item">
            <div className="stat-value">{data.resumesCreated}</div>
            <div className="stat-label">Resumes Created</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{data.downloads}</div>
            <div className="stat-label">Total Downloads</div>
          </div>
        </div>
        
        <div className="analytics-section">
          <h3>Last Activity</h3>
          <p>{formatDate(data.lastActivity)}</p>
        </div>
        
        <div className="analytics-section">
          <h3>Template Usage</h3>
          <div className="template-usage">
            {templatePercentages.map(item => (
              <div key={item.template} className="template-bar">
                <div className="template-info">
                  <span className="template-name">{item.template}</span>
                  <span className="template-count">{item.count}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="template-percentage">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
