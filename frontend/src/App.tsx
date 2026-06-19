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
        <a href="https://pump.fun/9MjHBVmtDh8HiFGtcoUtMqd39NB9yyumQ7qnGxyXpump" target="_blank" 
           className="ml-3 text-xs font-mono text-[#c5a46e] hover:underline">9MjHBVmtDh8HiFGtcoUtMqd39NB9yyumQ7qnGxyXpump</a>
        <p className="tagline text-white/90">Five AI minds. One rigorous debate. A single, thoughtful verdict.</p>
        <div className="model-indicators">
          <span className="model-dot claude" title="Claude"></span>
          <span className="model-dot gpt5" title="GPT-5"></span>
          <span className="model-dot gemini" title="Gemini"></span>
          <span className="model-dot qwen" title="Qwen"></span>
          <span className="model-dot grok" title="Grok"></span>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-8">
        {!debateId ? (
          <div className="w-full max-w-2xl text-center">
            {/* Clean hero-style header + controls like the static site */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-[80px] font-bold tracking-[-6px] leading-none mb-1">WARTABLE</h1>
              <div className="text-6xl md:text-7xl font-light tracking-[3px] -mt-3 mb-2">AGENTS</div>
              <p className="text-white/70 text-lg tracking-wide">5 AIs. One Decision.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-xs tracking-widest text-white/50">
              <div>
                ROUNDS
                <div className="flex gap-1.5 mt-2 justify-center">
                  {[1,2,3].map(r => (
                    <button key={r} onClick={() => setNumRounds(r)}
                      className={`w-7 h-7 rounded text-[10px] border ${numRounds === r ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-w-[260px]">
                AT THE TABLE
                <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                  {allModels.map(m => {
                    const meta = modelMeta[m];
                    const active = selectedModels.includes(m);
                    return (
                      <button key={m} onClick={() => {
                        if (active && selectedModels.length > 1) setSelectedModels(selectedModels.filter(x => x !== m));
                        else if (!active) setSelectedModels([...selectedModels, m]);
                      }} className={`px-2 py-0.5 text-[10px] rounded border ${active ? 'border-white/60 bg-white/5' : 'border-white/15 opacity-50 hover:opacity-100'}`}>
                        {meta.emoji} {meta.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Clean prominent input like the static site */}
            <div className="max-w-md mx-auto w-full">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What should the agents debate?"
                onKeyDown={(e) => e.key === 'Enter' && startDebate()}
                disabled={loading}
                autoFocus
                className="w-full bg-black/40 border border-white/20 focus:border-white/70 rounded-2xl py-5 px-6 text-xl placeholder:text-white/30 focus:outline-none mb-3"
              />
              <button 
                onClick={startDebate}
                disabled={loading || !question.trim() || selectedModels.length === 0}
                className="w-full bg-white text-black py-3.5 rounded-2xl font-semibold text-sm tracking-[1.5px] hover:bg-white/90 transition disabled:opacity-40"
              >
                {loading ? 'THE TABLE IS DELIBERATING...' : 'START THE DEBATE'}
              </button>
            </div>

            {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

            <div className="mt-8 text-[10px] tracking-[3px] text-white/40">TRY A SUGGESTED QUESTION</div>
            <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs text-white/60">
              {["Should we colonize Mars?", "Is AI alignment solvable?", "What is the meaning of life?"].map((ex, i) => (
                <button key={i} onClick={() => setQuestion(ex)} disabled={loading}
                  className="px-4 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="debate-view max-w-4xl mx-auto">
            <div className="debate-content">
            <div className="debate-header">
              <div className="flex items-center gap-3 mb-3 justify-center">
                <span className="inline-block px-3 py-0.5 text-xs font-semibold tracking-[1px] bg-[var(--accent)]/10 text-[var(--accent)] rounded-full">LIVE</span>
                <span className="text-sm text-[var(--text-muted)] font-mono">ROUND {currentRound} / {debateData?.config?.rounds || 3}</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tighter text-center">The agents are debating</h2>
              <div className="war-table">
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
            </div>
            
            {debateData && debateData.rounds.length > 0 ? (
              <div className="space-y-8">
                {debateData.rounds.map((round: any, index: number) => (
                  <div key={index}>
                    <div className="uppercase tracking-[2px] text-xs text-white/40 mb-3 text-center">{getRoundLabel(round.roundNumber)}</div>
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {round.responses.map((response: any) => (
                        <div key={response.modelId} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left" 
                          style={{ borderLeft: `5px solid ${getModelColor(response.modelId)}` }}>
                          <div className="flex items-center gap-2 mb-2 text-sm">
                            <span style={{ color: getModelColor(response.modelId) }} className="font-semibold">
                              {modelMeta[response.modelId]?.name || response.modelId.toUpperCase()}
                            </span>
                            <span className="text-white/30 text-xs">•</span>
                            <span className="text-white/40 text-xs">{new Date(response.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="text-white/90 leading-relaxed text-[15px]">
                            {response.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-white/60 text-sm tracking-widest">THE AGENTS ARE AT THE TABLE...</div>
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
            
            <div className="mt-10 flex flex-col items-center gap-4 text-sm">
              {debateStatus === 'completed' && debateData && (
                <button onClick={() => {
                  const transcript = `War Table Debate\nQuestion: ${debateData.question}\n\n` + 
                    (debateData.rounds || []).map((r: any) => `Round ${r.roundNumber}:\n` + r.responses.map((resp: any) => `  ${resp.modelId.toUpperCase()}: ${resp.content}`).join('\n')).join('\n\n') + `\n\nVerdict: ${debateData.verdict?.summary || ''}`;
                  navigator.clipboard.writeText(transcript);
                }} className="text-white/50 hover:text-white tracking-[1px] text-xs underline-offset-4 hover:underline">
                  COPY TRANSCRIPT
                </button>
              )}

              <button onClick={() => {
                setDebateId(null);
                currentSessionIdRef.current = null;
                setDebateData(null);
                setDebateStatus('idle');
                setCurrentRound(0);
                setQuestion('');
                setError(null);
              }} className="px-8 py-2 mt-1 border border-white/20 rounded-full text-xs tracking-widest hover:bg-white/5 transition">
                {debateStatus === 'completed' ? 'NEW DEBATE' : 'CANCEL'}
              </button>
            </div>
            </div> {/* close debate-content */}
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
