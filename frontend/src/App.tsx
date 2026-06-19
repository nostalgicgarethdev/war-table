import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Use React to satisfy TypeScript unused variable check
const _react = React;
_react && console.log('React loaded'); // Use _react to prevent unused variable warning

function App() {
  const [question, setQuestion] = useState('');
  const [debateId, setDebateId] = useState<string | null>(null);
  const [debateData, setDebateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debateStatus, setDebateStatus] = useState<string>('idle'); // idle, started, in_progress, completed
  const [currentRound, setCurrentRound] = useState(0);
  const pollIntervalRef = useRef<any>(null); // Fixed NodeJS.Timeout issue
  const [isPolling, setIsPolling] = useState(false);

  const startDebate = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/debate/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to start debate');
      }

      const data = await response.json();
      setDebateId(data.sessionId);
      setDebateStatus('started');
      setDebateData(data);
      
      // Start polling for updates
      startPolling();
    } catch (err) {
      setError('Failed to start debate. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    setIsPolling(true);
    pollIntervalRef.current = setInterval(async () => {
      if (!debateId) return;
      
      try {
        const response = await fetch(`http://localhost:3001/api/debate/${debateId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch debate data');
        }
        
        const data = await response.json();
        setDebateData(data);
        setDebateStatus(data.status);
        
        // Update current round
        if (data.rounds) {
          setCurrentRound(data.rounds.length);
        }
        
        // Stop polling if debate is completed
        if (data.status === 'completed') {
          stopPolling();
        }
      } catch (err) {
        console.error('Error polling debate data:', err);
        // Continue polling despite errors - might be temporary
      }
    }, 3000); // Poll every 3 seconds
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  };

  const getRoundLabel = (roundNum: number): string => {
    switch (roundNum) {
      case 1: return 'Opening Statements';
      case 2: return 'Rebuttals';
      case 3: return 'Synthesis & Verdict';
      default: return `Round ${roundNum}`;
    }
  };

  const getModelColor = (modelId: string): string => {
    switch (modelId.toLowerCase()) {
      case 'claude': return '#1e3c72';
      case 'gpt5': return '#10b981';
      case 'gemini': return '#f59e0b';
      case 'qwen': return '#8b5cf6';
      case 'grok': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>War Table</h1>
        <p className="tagline">Where AI models debate your toughest questions</p>
        <div className="model-indicators">
          <span className="model-dot claude" title="Claude"></span>
          <span className="model-dot gpt5" title="GPT-5"></span>
          <span className="model-dot gemini" title="Gemini"></span>
          <span className="model-dot qwen" title="Qwen"></span>
          <span className="model-dot grok" title="Grok"></span>
        </div>
      </header>
      
      <main>
        {!debateId ? (
          <div className="debate-setup">
            <div className="input-group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What question should the AI models debate?"
                aria-label="Debate question input"
                onKeyDown={(e) => e.key === 'Enter' && startDebate()}
                disabled={loading}
                autoFocus
              />
              <button 
                onClick={startDebate}
                disabled={loading || !question.trim()}
                className="primary-button"
                aria-label={loading ? 'Starting debate...' : 'Start debate'}
              >
                {loading ? (
                  <>
                    <span className="loader-small"></span>
                    Starting debate...
                  </>
                ) : 'Start Debate'}
              </button>
            </div>
            
            {error && (
              <div className="error-message" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="error-close">×</button>
              </div>
            )}
            
            {!loading && !error && !question.trim() && (
              <div className="placeholder-text">
                Try questions like:<br/>
                <strong>"What is the meaning of life?"</strong><br/>
                <strong>"Should we fear artificial intelligence?"</strong><br/>
                <strong>"Is free will real or an illusion?"</strong>
              </div>
            )}
          </div>
        ) : (
          <div className="debate-view">
            <div className="debate-header">
              <h2>Debate in Progress</h2>
              <p className="debate-question">"{debateData?.question || question}"</p>
              <div className="debate-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(currentRound / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {getRoundLabel(currentRound + 1)} 
                  {debateStatus === 'completed' && <span className="status-badge">Completed</span>}
                  {debateStatus === 'in_progress' && <span className="status-badge">In Progress</span>}
                  {debateStatus === 'started' && <span className="status-badge">Starting...</span>}
                </div>
              </div>
            </div>
            
            {debateData && debateData.rounds.length > 0 ? (
              <div className="debate-rounds">
                {debateData.rounds.map((round: any, index: number) => (
                  <div key={index} className="debate-round">
                    <h3>{getRoundLabel(round.roundNumber)}</h3>
                    <div className="model-responses-grid">
                      {round.responses.map((response: any) => (
                        <div 
                          key={response.modelId} 
                          className="model-response-card"
                          style={{ borderLeft: `4px solid ${getModelColor(response.modelId)}` }}
                        >
                          <div className="model-header">
                            <div className="model-icon">
                              {response.modelId.toUpperCase().charAt(0)}
                            </div>
                            <div className="model-info">
                              <span className="model-name">{response.modelId.toUpperCase()}</span>
                              <span className="model-time">
                                {new Date(response.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                          <div className="model-content">
                            {response.content}
                          </div>
                          <div className="model-footer">
                            <span className="token-count">
                              ~{response.tokensUsed?.toLocaleString() || '0'} tokens
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="debate-waiting">
                <div className="waiting-icon">⏳</div>
                <p>The debate is initializing...</p>
                {isPolling && (
                  <div className="polling-status">
                    <span className="loader-small"></span>
                    Waiting for AI responses...
                  </div>
                )}
              </div>
            )}
            
            {debateStatus === 'completed' && debateData.verdict ? (
              <div className="debate-verdict">
                <div className="verdict-header">
                  <h2>Final Verdict</h2>
                  <div className="verdict-stats">
                    <span className="confidence-badge">
                      {Math.round(debateData.verdict.confidence * 100)}% Confidence
                    </span>
                    <span className="models-badge">
                      {debateData.verdict.supportingModelIds.length} Models
                    </span>
                  </div>
                </div>
                
                <div className="verdict-summary">
                  <p>{debateData.verdict.summary}</p>
                </div>
                
                {debateData.verdict.agreementPoints.length > 0 || debateData.verdict.disagreementPoints.length > 0 ? (
                  <div className="verdict-details">
                    {debateData.verdict.agreementPoints.length > 0 && (
                      <div className="verdict-section agreement">
                        <h3>✅ Points of Agreement</h3>
                        <ul>
                          {debateData.verdict.agreementPoints.map((point: string, index: number) => (
                            <li key={index}>
                              <span className="section-icon">▹</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {debateData.verdict.disagreementPoints.length > 0 && (
                      <div className="verdict-section disagreement">
                        <h3>⚖️ Points of Disagreement</h3>
                        <ul>
                          {debateData.verdict.disagreementPoints.map((point: string, index: number) => (
                            <li key={index}>
                              <span className="section-icon">▹</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
                
                <div className="verdict-footer">
                  <span className="supporting-models">
                    Supported by: {debateData.verdict.supportingModelIds.map((m: string) => m.toUpperCase()).join(', ')}
                  </span>
                </div>
              </div>
            ) : (
              debateStatus === 'completed' && !debateData.verdict ? (
                <div className="debate-verdict">
                  <h2>Debate Completed</h2>
                  <p>The debate has concluded but no formal verdict was generated.</p>
                </div>
              ) : null
            )}
            
            <div className="debate-actions">
              <button 
                onClick={() => {
                  setDebateId(null);
                  setDebateData(null);
                  setDebateStatus('idle');
                  setCurrentRound(0);
                  setQuestion('');
                  setError(null);
                }}
                className={debateStatus === 'completed' ? 'primary-button' : 'secondary-button'}
              >
                {debateStatus === 'completed' ? 'Start New Debate' : 'Cancel Debate'}
              </button>
              
              {debateStatus !== 'completed' && debateId && (
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this debate?')) {
                      setDebateId(null);
                      setDebateData(null);
                      setDebateStatus('idle');
                      setCurrentRound(0);
                      setQuestion('');
                      setError(null);
                      stopPolling();
                    }
                  }}
                  className="logout-button"
                >
                  Exit Debate
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
