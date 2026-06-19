import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [debateId, setDebateId] = useState<string | null>(null);
  const [debateData, setDebateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debateStatus, setDebateStatus] = useState<string>('idle'); // idle, started, in_progress, completed
  const [currentRound, setCurrentRound] = useState(0);
  const pollIntervalRef = useRef<any>(null);
  const currentSessionIdRef = useRef<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Frontend config (makes the demo interactive and powerful)
  const [numRounds, setNumRounds] = useState(3);
  const allModels = ['claude', 'gpt5', 'gemini', 'qwen', 'grok'];
  const [selectedModels, setSelectedModels] = useState<string[]>(allModels);

  const modelMeta: Record<string, { name: string; color: string; emoji: string }> = {
    claude: { name: 'Claude', color: '#1e3c72', emoji: '🧠' },
    gpt5: { name: 'GPT-5', color: '#10b981', emoji: '📊' },
    gemini: { name: 'Gemini', color: '#f59e0b', emoji: '🔭' },
    qwen: { name: 'Qwen', color: '#8b5cf6', emoji: '⚙️' },
    grok: { name: 'Grok', color: '#ef4444', emoji: '🚀' },
  };

  // Rich client-side simulator - the heart of the public demo experience.
  // Fully self-contained, no backend required. Configurable rounds & models.
  const simulateDebate = (q: string) => {
    const sid = 'demo-' + Date.now().toString(36);
    const trimmedQ = q.trim();

    const modelOrder = selectedModels.length > 0 ? selectedModels : allModels;
    const totalRounds = Math.min(Math.max(numRounds, 1), 3);

    // Dynamic rich responses (personalities preserved, adapted to question)
    const getResponse = (modelId: string, round: number): string => {
      const base = {
        claude: `As Claude, I approach "${trimmedQ}" with care for stakeholders and long-term impact.`,
        gpt5: `GPT-5 sees "${trimmedQ}" as a multi-dimensional challenge spanning ethics, feasibility and society.`,
        gemini: `Gemini analyzes "${trimmedQ}" through systematic risk/reward and governance lenses.`,
        qwen: `Qwen focuses on practical value and efficiency for "${trimmedQ}".`,
        grok: `Grok cuts through noise on "${trimmedQ}" with maximum truth-seeking.`
      }[modelId] || `Regarding "${trimmedQ}"...`;

      if (round === 1) return base + ' My opening position balances ambition with responsibility.';
      if (round === 2) return base + ' I rebut extremes and advocate evidence-based safeguards.';
      return base + ' In synthesis, a measured, collaborative path emerges that respects all perspectives.';
    };

    const initialSession = {
      id: sid,
      question: trimmedQ,
      config: { rounds: totalRounds, models: modelOrder },
      status: 'in_progress',
      rounds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDebateId(sid);
    currentSessionIdRef.current = sid;
    setDebateData(initialSession);
    setDebateStatus('in_progress');
    setCurrentRound(0);
    setLoading(false);
    setIsPolling(true);

    // Run rounds with realistic timing
    let roundNum = 1;

    const runNextRound = () => {
      if (roundNum > totalRounds) {
        const finalSession = {
          ...initialSession,
          status: 'completed',
          rounds: initialSession.rounds,
          verdict: {
            summary: `After a ${totalRounds}-round structured debate, the models reached a thoughtful consensus on "${trimmedQ}". The discussion balanced innovation, caution, and practical wisdom.`,
            confidence: 0.76 + Math.random() * 0.1,
            agreementPoints: [
              'All participating models recognize the depth and stakes of the question',
              'Rigorous evaluation and phased approaches were strongly supported'
            ],
            disagreementPoints: [
              'Views differ on the ideal pace and acceptable level of risk',
              'Trade-offs between speed of progress and thorough safeguards'
            ],
            supportingModelIds: modelOrder,
            timestamp: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };

        setDebateData(finalSession);
        setDebateStatus('completed');
        setCurrentRound(totalRounds);
        setIsPolling(false);
        return;
      }

      const roundResponses = modelOrder.map((modelId) => ({
        modelId,
        content: getResponse(modelId, roundNum),
        timestamp: new Date().toISOString(),
        tokensUsed: 85 + Math.floor(Math.random() * 55)
      }));

      const newRound = {
        roundNumber: roundNum,
        responses: roundResponses,
        completedAt: new Date().toISOString()
      };

      setDebateData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          rounds: [...prev.rounds, newRound],
          updatedAt: new Date().toISOString()
        };
      });

      setCurrentRound(roundNum);

      roundNum += 1;

      const delay = roundNum <= totalRounds ? (1200 + Math.random() * 600) : 0;
      setTimeout(runNextRound, delay);
    };

    // Kick off after a short thinking pause
    setTimeout(runNextRound, 550);
  };

  const startDebate = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setError(null);
    setLoading(true);

    // Always use rich local simulation for a reliable, beautiful public demo.
    // (When developing locally with backend, you can easily swap this back to fetch.)
    simulateDebate(question);
  };

  // No real polling needed anymore — the simulator drives progressive updates directly.
  const stopSimulation = () => {
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current);
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
      stopSimulation();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-[2.65rem] md:text-[2.85rem] tracking-tighter">War Table</h1>
        <p className="tagline text-white/90">Five AI minds. One rigorous debate. A single, thoughtful verdict.</p>
        <div className="model-indicators">
          <span className="model-dot claude" title="Claude"></span>
          <span className="model-dot gpt5" title="GPT-5"></span>
          <span className="model-dot gemini" title="Gemini"></span>
          <span className="model-dot qwen" title="Qwen"></span>
          <span className="model-dot grok" title="Grok"></span>
        </div>
      </header>
      
      <main className="flex-1 pb-16">
        {!debateId ? (
          <div className="debate-setup max-w-2xl mx-auto">
            {/* Config controls - makes the frontend interactive and powerful */}
            <div className="config-panel mb-6">
              <div className="config-row">
                <div>
                  <label className="text-sm font-medium text-[var(--text-muted)]">Rounds</label>
                  <div className="flex gap-2 mt-1">
                    {[1,2,3].map(r => (
                      <button 
                        key={r}
                        onClick={() => setNumRounds(r)}
                        className={`px-3.5 py-0.5 text-xs rounded-full border transition font-medium ${numRounds === r ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] hover:bg-white/5'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-[var(--text-muted)]">Models ({selectedModels.length}/5)</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allModels.map(m => {
                      const meta = modelMeta[m];
                      const active = selectedModels.includes(m);
                      return (
                        <button
                          key={m}
                          onClick={() => {
                            if (active && selectedModels.length > 1) {
                              setSelectedModels(selectedModels.filter(x => x !== m));
                            } else if (!active) {
                              setSelectedModels([...selectedModels, m]);
                            }
                          }}
                          className={`px-2.5 py-0.5 text-xs rounded-full border transition flex items-center gap-1 ${active ? 'font-medium' : 'opacity-55 hover:opacity-90'}`}
                          style={{ 
                            borderColor: active ? meta.color : '#d1d5db',
                            background: active ? meta.color + '15' : 'transparent',
                            color: active ? meta.color : undefined
                          }}
                        >
                          <span>{meta.emoji}</span>
                          <span>{meta.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything the AIs should debate…"
                aria-label="Debate question input"
                onKeyDown={(e) => e.key === 'Enter' && startDebate()}
                disabled={loading}
                autoFocus
                className="text-lg"
              />
              <button 
                onClick={startDebate}
                disabled={loading || !question.trim() || selectedModels.length === 0}
                className="primary-button text-base"
                aria-label={loading ? 'Starting debate...' : 'Start debate'}
              >
                {loading ? 'Thinking…' : 'Start Debate'}
              </button>
            </div>
            
            {error && (
              <div className="error-message" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="error-close">×</button>
              </div>
            )}

            <div className="examples">
              <div className="examples-label">Try these questions:</div>
              <div className="example-chips">
                {[
                  "Should we colonize Mars?",
                  "Is AI alignment solvable?",
                  "What is the meaning of life?",
                  "Should we fear artificial intelligence?",
                  "Is free will real or an illusion?"
                ].map((ex, i) => (
                  <button
                    key={i}
                    className="example-chip"
                    onClick={() => { setQuestion(ex); }}
                    disabled={loading}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="debate-view max-w-4xl mx-auto">
            <div className="debate-header">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-0.5 text-xs font-semibold tracking-[1px] bg-[var(--accent)]/10 text-[var(--accent)] rounded-full">LIVE</span>
                <span className="text-sm text-[var(--text-muted)] font-mono">ROUND {currentRound} / {debateData?.config?.rounds || 3}</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tighter">The agents are debating</h2>
              <p className="debate-question">"{debateData?.question || question}"</p>
              <div className="debate-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(currentRound / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {currentRound > 0 ? getRoundLabel(currentRound) : 'Preparing debate...'}
                  {debateStatus === 'completed' && <span className="status-badge">Completed</span>}
                  {debateStatus === 'in_progress' && <span className="status-badge">In Progress</span>}
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
                            <div className="model-icon flex items-center justify-center" style={{ backgroundColor: modelMeta[response.modelId]?.color + '20' || '#e5e7eb', color: modelMeta[response.modelId]?.color }}>
                              {modelMeta[response.modelId]?.emoji || response.modelId[0].toUpperCase()}
                            </div>
                            <div className="model-info">
                              <span className="model-name font-semibold">{modelMeta[response.modelId]?.name || response.modelId.toUpperCase()}</span>
                              <span className="model-time text-xs opacity-70">
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
                    Models are debating...
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
              {debateStatus === 'completed' && debateData && (
                <button 
                  onClick={() => {
                    const transcript = `War Table Debate\nQuestion: ${debateData.question}\n\n` + 
                      (debateData.rounds || []).map((r: any) => 
                        `Round ${r.roundNumber}:\n` + 
                        r.responses.map((resp: any) => `  ${resp.modelId.toUpperCase()}: ${resp.content}`).join('\n')
                      ).join('\n\n') +
                      `\n\nVerdict: ${debateData.verdict?.summary || ''}`;
                    
                    navigator.clipboard.writeText(transcript).then(() => {
                      const btn = document.activeElement as HTMLButtonElement;
                      if (btn) {
                        const original = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => { if (btn) btn.textContent = original || 'Copy Transcript'; }, 1400);
                      }
                    });
                  }}
                  className="copy-btn"
                  style={{ marginRight: '0.75rem' }}
                >
                  📋 Copy Transcript
                </button>
              )}

              <button 
                onClick={() => {
                  setDebateId(null);
                  currentSessionIdRef.current = null;
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
                      currentSessionIdRef.current = null;
                      setDebateData(null);
                      setDebateStatus('idle');
                      setCurrentRound(0);
                      setQuestion('');
                      setError(null);
                      stopSimulation();
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

      <footer className="mt-auto py-8 text-center text-[10px] tracking-[1.5px] text-[var(--text-muted)] opacity-60">
        WARTABLE AGENTS  •  5 AIs. ONE DECISION.
      </footer>
    </div>
  );
}

export default App;
