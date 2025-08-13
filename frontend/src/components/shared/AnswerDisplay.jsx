import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

const AnswerDisplay = ({ answer }) => {
  const [activeTab, setActiveTab] = useState('content');
  let tooltipTimeout;

  useEffect(() => {
    if (answer.type === 'answer') {
      const timer = setTimeout(() => {
        initTooltips();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [answer.content, activeTab]);

  if (answer.type === 'question') {
    return (
      <div className="question-display">
        <div className="user-question-card">{answer.content}</div>
      </div>
    );
  }

  if (answer.type === 'error') {
    return <div className="error">{answer.content}</div>;
  }

  const formatContent = (text, sources) => {
    let html = marked.parse(text);

    if (sources) {
      html = html.replace(/\[(\d+)\]/g, (match, num) => {
        const idx = parseInt(num, 10) - 1;
        if (sources[idx]) {
          const source = sources[idx];
          const tooltipData = JSON.stringify({
            title: source.title || source.url || 'Unknown Source',
            url: source.url || '#',
            date: source.date || '',
            lastUpdated: source.last_updated || ''
          });
          return `<a href="${source.url}" class="source-link" data-source="${tooltipData.replace(/"/g, '&quot;')}" target="_blank">[${num}]</a>`;
        }
        return match;
      });
    }
    return html;
  };

  const initTooltips = () => {
    document.querySelectorAll('.citation-tooltip').forEach(tooltip => tooltip.remove());
    
    document.querySelectorAll('.source-link').forEach(link => {
      link.addEventListener('mouseenter', function() {
        const sourceData = this.getAttribute('data-source');
        if (!sourceData) return;
        
        setTimeout(() => {
          try {
            const source = JSON.parse(sourceData.replace(/&quot;/g, '"'));
            
            document.querySelectorAll('.citation-tooltip').forEach(t => t.remove());
            
            const tooltipEl = document.createElement('div');
          tooltipEl.className = 'citation-tooltip';
          tooltipEl.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #1a1a1a; line-height: 1.3;">${source.title}</div>
            <div style="font-size: 13px; color: #666; line-height: 1.4;">Learn how to connect your SAP system to Microsoft Power BI for data visualization and reporting.</div>
          `;
          tooltipEl.style.cssText = `
            position: absolute; background-color: white; color: #333; padding: 16px 20px;
            border-radius: 12px; font-size: 13px; max-width: 320px; z-index: 1000;
            pointer-events: none; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            border: 1px solid #e5e5e5;
          `;
          
          document.body.appendChild(tooltipEl);
          
          const linkRect = this.getBoundingClientRect();
          const tooltipRect = tooltipEl.getBoundingClientRect();
          
          let left = linkRect.left + (linkRect.width / 2) - (tooltipRect.width / 2);
          let top = linkRect.top - tooltipRect.height - 10;
          
          if (left < 10) left = 10;
          if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
          }
          if (top < 10) {
            top = linkRect.bottom + 10;
          }
          
          tooltipEl.style.left = `${left}px`;
          tooltipEl.style.top = `${top}px`;
          } catch (e) {
            console.error('Error parsing source data:', e);
          }
        }, 50);
      });
      
      link.addEventListener('mouseleave', function() {
        document.querySelectorAll('.citation-tooltip').forEach(t => t.remove());
      });
    });
  };

  return (
    <div className="answer-container">
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Answer
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          Sources ({answer.sources?.length || 0})
        </button>
      </div>
      
      <div className="tab-content" style={{ display: activeTab === 'content' ? 'block' : 'none' }}>
        <div 
          className="answer-text"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(answer.content, answer.sources) 
          }}
        />
      </div>
      
      <div className="tab-content" style={{ display: activeTab === 'sources' ? 'block' : 'none' }}>
        {answer.sources && answer.sources.length > 0 ? (
          <div className="sources-list">
            {answer.sources.map((src, i) => (
              <div key={i} className="source-item">
                <div className="source-number">{i + 1}</div>
                <div className="source-info">
                  <div className="source-title">{src.title || src.url || `Source ${i + 1}`}</div>
                  <a href={src.url} className="source-url" target="_blank" rel="noopener noreferrer">
                    {src.url}
                  </a>
                  {src.summary && <div className="source-summary">{src.summary}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-sources">No sources available for this query</div>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;