import type { DebateSession, DebateVerdict } from '../types/debate';

export class ConsensusEngine {
  /**
   * Generate a consensus verdict from debate rounds
   */
  async generateVerdict(session: DebateSession): Promise<DebateVerdict> {
    // Simple consensus algorithm for MVP
    // In a real implementation, this would be more sophisticated
    
    const finalRound = session.rounds[session.rounds.length - 1];
    if (!finalRound) {
      return this.createEmptyVerdict();
    }
    
    // Extract key points from final round responses
    const allResponses = finalRound.responses;
    
    // Simple approach: look for common themes and agreements
    const agreementPoints: string[] = [];
    const disagreementPoints: string[] = [];
    
    // For MVP, we'll create a basic summary
    const summary = this.generateSummary(session);
    
    // Determine which models contributed most to the consensus
    const supportingModelIds = allResponses
      .filter(r => r.content.length > 50) // Arbitrary threshold
      .map(r => r.modelId);
    
    return {
      summary,
      confidence: 0.75, // Placeholder
      agreementPoints,
      disagreementPoints,
      supportingModelIds: supportingModelIds.length > 0 ? supportingModelIds : ['consensus-fallback'],
      timestamp: new Date()
    };
  }
  
  private generateSummary(session: DebateSession): string {
    const finalRound = session.rounds[session.rounds.length - 1];
    if (!finalRound || finalRound.responses.length === 0) {
      return "Unable to generate consensus due to insufficient responses.";
    }
    
    // Take a balanced approach: combine perspectives
    const perspectives = finalRound.responses
      .map(r => `${r.modelId.toUpperCase()}: ${r.content.substring(0, 150)}...`)
      .join(' | ');
    
    return `After multi-round debate among AI models, the consensus perspective incorporates elements from all viewpoints. Key considerations include: ${perspectives}`;
  }
  
  private createEmptyVerdict(): DebateVerdict {
    return {
      summary: "Debate did not produce sufficient responses for consensus.",
      confidence: 0,
      agreementPoints: [],
      disagreementPoints: [],
      supportingModelIds: [],
      timestamp: new Date()
    };
  }
}
