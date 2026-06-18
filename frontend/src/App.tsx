import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [debateId, setDebateId] = useState<string | null>(null);
  const [debateData, setDebateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debateStatus, setDebateStatus] = useState<string>('idle'); // idle, started, in_progress, completed
  const [currentRound, setCurrentRound] = useState(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      
      // Start polling for updates
      startPolling();
    } catch (err) {
      setError('Failed to start debate. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
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
        stopPolling();
      }
    }, 2000); // Poll every 2 seconds
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const getRoundLabel = (roundNum: number): string => {
    switch (roundNum) {
      case 1: return 'Opening Statements';
      case 2: return 'Rebuttals';
      case 3: return 'Synthesis & Verdict';
      default: return `Round ${roundNum}`;
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
        <h1>War Table: AI Debate Arena</h1>
        <p>Watch Claude, GPT-5, Gemini, Qwen, and Grok debate your toughest questions</p>
      </header>
      
      <main>
        {!debateId ? (
          <div className="debate-setup">
            <div className="input-group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question for the AI models to debate..."
                onKeyDown={(e) => e.key === 'Enter' && startDebate()}
                disabled={loading}
              />
              <button 
                onClick={startDebate}
                disabled={loading || !question.trim()}
                className="primary-button"
              >
                {loading ? 'Starting Debate...' : 'Start Debate'}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className="debate-view">
            <div className="debate-header">
              <h2>Debate in Progress</h2>
              <p className="debate-question">"{debateData?.question || question}"</p>
              <div className="debate-meta">
                <span>Status: {debateStatus}</span>
                {debateStatus !== 'idle' && (
                  <span> | Round: {currentRound}/3</span>
                )}
              </div>
            </div>
            
            {debateData && debateData.rounds.length > 0 ? (
              <div className="debate-rounds">
                {debateData.rounds.map((round: any, index: index) => (
                  <div key={index} className="debate-round">
                    <h3>{getRoundLabel(round.roundNumber)}</h3>
                    <div className="model-responses">
                      {round.responses.map((response: any) => (
                        <div key={response.modelId} className="model-response">
                          <div className="model-header">
                            <span className="model-name">{response.modelId.toUpperCase()}</span>
                            <span className="timestamp">
                                              {new Date(response.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="model-content">
                            {response.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="debate-waiting">
                <p>Waiting for debate to start...</p>
                <div className="spinner"></div>
              </div>
            )}
            
            {debateStatus === 'completed' && debateData.verdict ? (
              <div className="debate-verdict">
                <h2>Final Verdict</h2>
                <div className="verdict-content">
                  <p>{debateData.verdict.summary}</p>
                  {debateData.verdict.agreementPoints.length > 0 && (
                    <div className="verdict-section">
                      <h3>Points of Agreement:</h3>
                      <ul>
                        {debateData.verdict.agreementPoints.map((point: string, index: index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {debateData.verdict.disagreementPoints.length > 0 && (
                    <div className="verdict-section">
                      <h3>Points of Disagreement:</h3>
                      <ul>
                        {debateData.verdict.disagreementPoints.map((point: string, index: index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="verdict-meta">
                    <span>Confidence: {Math.round(debateData.verdict.confidence * 100)}%</span>
                    <span> | Supporting Models: {debateData.verdict.supportingModelIds.join(', ').toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ) : (
              debateStatus === 'completed' && !debateData.verdict ? (
                <div className="debate-verdict">
                  <h2>Debate Completed</h2>
                  <p>The debate has concluded but no verdict was generated.</p>
                </div>
              ) : null
            )}
            
            <div className="debate-actions">
              {!debateId ? (
                <button onClick={() => {
                  setDebateId(null);
                  setDebateData(null);
                  setDebateStatus('idle');
                  setCurrentRound(0);
                  setQuestion('');
                }} className="secondary-button">
                  New Debate
                </button>
              ) : (
                <>
                  {debateStatus !== 'completed' && (
                    <button 
                      onClick={() => {
                        setDebateId(null);
                        setDebateData(null);
                        setDebateStatus('idle');
                        setCurrentRound(0);
                        setQuestion('');
                      }}
                      className="secondary-button"
                    >
                      Cancel Debate
                    </button>
                  )}
                  {debateStatus === 'completed' && (
                    <button 
                      onClick={() => {
                        setDebateId(null);
                        setDebateData(null);
                        setDebateStatus('idle');
                        setCurrentRound(0);
                        setQuestion('');
                      }}
                      className="primary-button"
                    >
                      New Debate
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
