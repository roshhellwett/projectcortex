// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

export const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const MODELS = {
  DEFAULT: 'llama-3.1-8b-instant',
  DEFAULT_OR: 'openrouter/free',
  MCQ_GROQ: 'llama-3.3-70b-versatile',
  MCQ_OR: 'openrouter/free',
  FALLBACK_GROQ: 'llama3-8b-8192',
  FALLBACK_OR: 'deepseek/deepseek-chat:free',
};

export const ACTION_CONFIG = {
  correct_answers: {
    maxTokens: 300, temperature: 0, topP: 1,
    overrideModelOnGroq: true,
    overrideModelOnOpenRouter: true,
  },
  summarize: { maxTokens: 2048, temperature: 0.5, topP: 0.9 },
  factcheck: { maxTokens: 2048, temperature: 0.5, topP: 0.9 },
  ask: { maxTokens: 2048, temperature: 0.5, topP: 0.9 },
};
export const DEFAULT_ACTION = { maxTokens: 1024, temperature: 0.65, topP: 0.9 };

export const TIMEOUT_MS = 30000;
export const MAX_RETRIES = 2;
export const RETRY_BASES = [2500, 6000];

export const PROVIDER_GROQ = 'groq';
export const PROVIDER_OPENROUTER = 'openrouter';
export const PROVIDER_CUSTOM = 'custom';
