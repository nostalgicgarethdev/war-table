export enum DebateStatus {
  INITIALIZED = 'initialized',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface ModelResponse {
  content: string;
  tokensUsed?: number;
  [key: string]: any;
}

export interface DebateResponse {
  modelId: string;
  content: string;
  timestamp: Date;
  tokensUsed: number;
}

export interface DebateRound {
  roundNumber: number;
  responses: DebateResponse[];
  completedAt?: Date;
}

export interface DebateVerdict {
  summary: string;
  confidence: number; // 0-1
  agreementPoints: string[];
  disagreementPoints: string[];
  supportingModelIds: string[];
  timestamp: Date;
}

export interface DebateConfig {
  rounds: number;
  models: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface DebateSession {
  id: string;
  question: string;
  config: DebateConfig;
  status: DebateStatus;
  rounds: DebateRound[];
  verdict?: DebateVerdict;
  createdAt: Date;
  updatedAt: Date;
}
