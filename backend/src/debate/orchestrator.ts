import { v4 as uuidv4 } from 'uuid';
import type { DebateSession, DebateRound, ModelResponse, DebateConfig, DebateResponse } from '../types/debate';
import { DebateStatus } from '../types/debate';
import { ModelProvider } from '../models/provider';
import { ConsensusEngine } from './consensus';

export class DebateOrchestrator {
  private sessions: Map<string, DebateSession> = new Map();
  private modelProvider: ModelProvider;
  private consensusEngine: ConsensusEngine;
  
  constructor() {
    this.modelProvider = new ModelProvider();
    this.consensusEngine = new ConsensusEngine();
  }
  
  /**
   * Start a new debate session
   */
  async startDebate(question: string, config: Partial<DebateConfig> = {}): Promise<string> {
    const sessionId = uuidv4();
    
    const debateConfig: DebateConfig = {
      rounds: 3,
      models: ['claude', 'gpt5', 'gemini', 'qwen', 'grok'],
      ...config
    };
    
    const session: DebateSession = {
      id: sessionId,
      question,
      config: debateConfig,
      status: DebateStatus.INITIALIZED,
      rounds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.sessions.set(sessionId, session);
    
    // Start the first round asynchronously
    this.executeRound(sessionId).catch(console.error);
    
    return sessionId;
  }
  
  /**
   * Execute a debate round
   */
  private async executeRound(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);
    
    const roundNumber = session.rounds.length + 1;
    if (roundNumber > session.config.rounds) {
      // All rounds completed, generate final verdict
      await this.finalizeDebate(sessionId);
      return;
    }
    
    session.status = DebateStatus.IN_PROGRESS;
    session.updatedAt = new Date();
    
    // Create round with proper typing for exactOptionalPropertyTypes
    const round: DebateRound = {
      roundNumber,
      responses: [] as DebateResponse[]
      // completedAt is omitted initially (optional property)
    };
    
    // Get responses from each model for this round
    for (const modelId of session.config.models) {
      try {
        const context = this.buildContext(session, roundNumber);
        const prompt = this.buildPrompt(session.question, roundNumber, context);
        
        const response: ModelResponse = await this.modelProvider.getResponse(
          modelId,
          prompt,
          { temperature: 0.7, maxTokens: 1500 }
        );
        
        round.responses.push({
          modelId,
          content: response.content,
          timestamp: new Date(),
          tokensUsed: response.tokensUsed ?? 0
        });
      } catch (error) {
        console.error(`Error getting response from ${modelId}:`, error);
        // Add error response
        round.responses.push({
          modelId,
          content: `[ERROR: Failed to get response from ${modelId}]`,
          timestamp: new Date(),
          tokensUsed: 0
        });
      }
    }
    
    session.rounds.push(round);
    session.updatedAt = new Date();
    
    // Check if round is complete
    if (round.responses.length === session.config.models.length) {
      // Now we can set completedAt since all responses are in
      round.completedAt = new Date();
      
      // If this was the final round, finalize the debate
      if (roundNumber >= session.config.rounds) {
        await this.finalizeDebate(sessionId);
      } else {
        // Otherwise, continue to next round after a brief delay
        setTimeout(() => this.executeRound(sessionId).catch(console.error), 1000);
      }
    }
  }
  
  /**
   * Build context for a model based on previous rounds
   */
  private buildContext(session: DebateSession, currentRound: number): string {
    if (currentRound === 1) {
      return '';
    }
    
    let context = `Previous rounds summary:\n\n`;
    
    const safeIndex = Math.min(currentRound - 1, session.rounds.length);
    for (let i = 0; i < safeIndex; i++) {
      const round = session.rounds[i];
      // Add null check to satisfy TypeScript
      if (!round) continue;
      
      context += `Round ${round.roundNumber}:\n`;
      
      for (const response of round.responses) {
        context += `- ${response.modelId.toUpperCase()}: ${response.content.substring(0, 200)}...\n`;
      }
      context += '\n';
    }
    
    return context;
  }
  
  /**
   * Build prompt for a model based on round number and context
   */
  private buildPrompt(question: string, roundNumber: number, context: string): string {
    let prompt = `You are participating in a structured debate. The question is: "${question}"\n\n`;
    
    if (context) {
      prompt += context + '\n';
    }
    
    switch (roundNumber) {
      case 1:
        prompt += `Round 1 - Opening Statement:\n`;
        prompt += `Present your initial position on the question. Provide clear reasoning and evidence for your stance. Be concise but thorough.\n\n`;
        prompt += `Your response:`;
        break;
        
      case 2:
        prompt += `Round 2 - Rebuttal:\n`;
        prompt += `Review the opening statements from all participants. Provide rebuttals to points you disagree with and defend your own position against potential criticisms.\n\n`;
        prompt += `Your response:`;
        break;
        
      case 3:
        prompt += `Round 3 - Synthesis:\n`;
        prompt += `Review all previous rounds. Work toward synthesizing the different perspectives into a coherent perspective. Identify areas of agreement and disagreement.\n\n`;
        prompt += `Your response:`;
        break;
        
      default:
        prompt += `Provide your contribution to the debate:\n\n`;
        prompt += `Your response:`;
    }
    
    return prompt;
  }
  
  /**
   * Finalize the debate and generate consensus verdict
   */
  private async finalizeDebate(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    session.status = DebateStatus.COMPLETED;
    session.updatedAt = new Date();
    
    // Generate consensus verdict using the consensus engine
    const verdict = await this.consensusEngine.generateVerdict(session);
    session.verdict = verdict;
  }
  
  /**
   * Get debate session by ID
   */
  getSession(sessionId: string): DebateSession | undefined {
    return this.sessions.get(sessionId);
  }
  
  /**
   * List all debate sessions
   */
  listSessions(): DebateSession[] {
    return Array.from(this.sessions.values());
  }
}
