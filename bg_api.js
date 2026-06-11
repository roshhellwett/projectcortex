// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

import {
  GROQ_URL, OPENROUTER_URL, MODELS, ACTION_CONFIG, DEFAULT_ACTION,
  TIMEOUT_MS, MAX_RETRIES, RETRY_BASES, PROVIDER_GROQ, PROVIDER_OPENROUTER, PROVIDER_CUSTOM
} from './bg_config.js';

export const resolveEndpoint = (apiProvider, customEndpoint) => {
  if (apiProvider === PROVIDER_OPENROUTER) return OPENROUTER_URL;
  if (apiProvider === PROVIDER_CUSTOM && customEndpoint) return customEndpoint;
  return GROQ_URL;
};

export const resolveModel = (apiProvider, model, action) => {
  const cfg = ACTION_CONFIG[action];
  if (!cfg) return model || (apiProvider === PROVIDER_OPENROUTER ? MODELS.DEFAULT_OR : MODELS.DEFAULT);
  if (cfg.overrideModelOnGroq && apiProvider === PROVIDER_GROQ) return MODELS.MCQ_GROQ;
  if (cfg.overrideModelOnOpenRouter && apiProvider === PROVIDER_OPENROUTER) return MODELS.MCQ_OR;
  return model || (apiProvider === PROVIDER_OPENROUTER ? MODELS.DEFAULT_OR : MODELS.DEFAULT);
};

export const nextFallback = (apiProvider, currentModel) => {
  if (apiProvider === PROVIDER_GROQ) {
    if (currentModel === MODELS.MCQ_GROQ) return MODELS.FALLBACK_GROQ;
    if (currentModel === MODELS.FALLBACK_GROQ) return MODELS.DEFAULT;
    return MODELS.FALLBACK_GROQ;
  }
  if (apiProvider === PROVIDER_OPENROUTER) {
    if (currentModel === MODELS.MCQ_OR) return MODELS.FALLBACK_OR;
    return MODELS.FALLBACK_OR;
  }
  return currentModel;
};

export const buildHeaders = (apiProvider, apiKey, customEndpoint) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  if (apiProvider === PROVIDER_OPENROUTER || customEndpoint?.includes('openrouter')) {
    headers['HTTP-Referer'] = 'https://projectcortex.ext';
    headers['X-Title'] = 'ProjectCortex';
  }
  return headers;
};

export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const jitter = base => base + Math.random() * base * 0.4;

export async function attemptFetch(endpoint, headers, body, signal) {
  const res = await fetch(endpoint, {
    method: 'POST', headers, body: JSON.stringify(body), signal
  });
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json')
    ? await res.json().catch(() => ({}))
    : { error: { message: `Non-JSON response (${res.status}): ${(await res.text().catch(() => '')).substring(0, 300)}` } };
  return { res, data };
}

export function classifyError(status, data, apiProvider) {
  const msg = data?.error?.message || data?.message || data?.error || '';
  const lower = typeof msg === 'string' ? msg.toLowerCase() : '';

  let sanitizedMsg = lower.replace(/sk_[a-zA-Z0-9_\-]{20,}/g, 'sk_***');
  sanitizedMsg = sanitizedMsg.replace(/gsk_[a-zA-Z0-9_\-]{20,}/g, 'gsk_***');
  sanitizedMsg = sanitizedMsg.replace(/sk-or-[a-zA-Z0-9_\-]{20,}/g, 'sk-or-***');

  if (sanitizedMsg.includes('no free model') || sanitizedMsg.includes('currently no free')) {
    return { type: 'rate_limit', message: 'All OpenRouter free models are busy. Retrying with a fallback model…', retryable: true };
  }
  if (sanitizedMsg.includes('free tier') && sanitizedMsg.includes('rate limit')) {
    return { type: 'rate_limit', message: 'OpenRouter free tier rate limit hit (20 req/min, 200 req/day). Wait or add $10 credits for 5x limits.', retryable: true };
  }
  if (status === 429 || sanitizedMsg.includes('rate limit') || sanitizedMsg.includes('too many') || sanitizedMsg.includes('limit reached') || sanitizedMsg.includes('try again later')) {
    return { type: 'rate_limit', message: 'Rate limit hit. Waiting and retrying…', retryable: true };
  }
  if (status === 401 || sanitizedMsg.includes('unauthorized') || sanitizedMsg.includes('invalid key')) {
    return { type: 'auth', message: `${apiProvider === PROVIDER_GROQ ? 'Groq' : 'OpenRouter'} rejected your API key. Check it in Settings and make sure it starts with "${apiProvider === PROVIDER_GROQ ? 'gsk_' : 'sk-or-'}".`, retryable: false };
  }
  if (sanitizedMsg.includes('model at capacity') || sanitizedMsg.includes('overloaded') || (status === 503 && sanitizedMsg.includes('model'))) {
    return { type: 'rate_limit', message: `${apiProvider === PROVIDER_GROQ ? 'Groq' : 'OpenRouter'} model is at capacity. Retrying with a fallback model…`, retryable: true };
  }
  if (status === 403) {
    if (sanitizedMsg.includes('insufficient') || sanitizedMsg.includes('quota')) {
      return { type: 'quota', message: 'API quota exhausted. Add credits or switch provider.', retryable: false };
    }
    if (sanitizedMsg.includes('model')) {
      return { type: 'model', message: `Model not found or not available on ${apiProvider}. Try a different model in Settings.`, retryable: false };
    }
    if (apiProvider === PROVIDER_GROQ) {
      return { type: 'quota', message: 'Groq blocked the request. Check billing at console.groq.com or switch to OpenRouter.', retryable: false };
    }
    return { type: 'quota', message: 'OpenRouter blocked the request. Check billing at openrouter.ai/activity or switch to Groq.', retryable: false };
  }
  if (sanitizedMsg.includes('model not found') || sanitizedMsg.includes('model_not_found') || sanitizedMsg.includes('does not exist')) {
    return { type: 'model', message: `Model not found on ${apiProvider}. Select a different model in Settings.`, retryable: false };
  }
  if (status === 400 && sanitizedMsg.includes('must provide')) {
    return { type: 'error', message: 'The API rejected the request format. Try updating the extension.', retryable: false };
  }
  if (status === 400 && (sanitizedMsg.includes('context length') || sanitizedMsg.includes('maximum context') || sanitizedMsg.includes('token limit'))) {
    return { type: 'error', message: 'The page content is too long for the selected model. Try summarizing shorter sections.', retryable: false };
  }
  if (status >= 500) {
    return { type: 'server_error', message: `${apiProvider} server returned ${status}. Retrying…`, retryable: true };
  }
  if (status === 0 || !status) {
    return { type: 'network', message: 'Network request failed. Check your internet connection.', retryable: true };
  }
  return { type: 'error', message: msg || `HTTP ${status}: Request failed`, retryable: false };
}

export async function handleAIRequest(payload, sendResponse) {
  const {
    prompt, systemPrompt, apiKey,
    apiProvider = 'groq', customEndpoint = '',
    action = '', model
  } = payload;

  let responded = false;
  const safeRespond = msg => {
    if (responded) return;
    responded = true;
    try { sendResponse(msg); } catch (e) { console.warn('[Cortex] safeRespond failed:', e.message); }
  };

  if (!apiKey) {
    safeRespond({ error: 'NO_KEY' });
    return;
  }

  let modelToTry = resolveModel(apiProvider, model, action);
  const cfg = ACTION_CONFIG[action] || DEFAULT_ACTION;
  let attempt = 0;
  let lastError = '';

  const retry = async (errMsg) => {
    if (attempt >= MAX_RETRIES) return false;
    attempt++;
    lastError = errMsg;
    const fb = nextFallback(apiProvider, modelToTry);
    if (fb !== modelToTry) modelToTry = fb;
    await sleep(jitter(RETRY_BASES[Math.min(attempt - 1, RETRY_BASES.length - 1)]));
    return true;
  };

  while (attempt <= MAX_RETRIES) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const endpoint = resolveEndpoint(apiProvider, customEndpoint);

    const body = {
      model: modelToTry || MODELS.DEFAULT,
      messages: [
        { role: 'system', content: systemPrompt || '' },
        { role: 'user', content: prompt || '' }
      ],
      max_tokens: cfg.maxTokens,
      temperature: cfg.temperature,
      top_p: cfg.topP
    };

    try {
      const { res, data } = await attemptFetch(
        endpoint, buildHeaders(apiProvider, apiKey, customEndpoint), body, controller.signal
      );
      clearTimeout(timeout);

      if (res.ok) {
        if (!data?.choices?.[0]?.message) {
          safeRespond({ error: `The model responded with an unexpected format. This may be a ${apiProvider} compatibility issue. Try a different model.` });
          return;
        }
        const content = data.choices[0].message.content ?? '';
        if (!content.trim()) {
          safeRespond({ error: `The model returned an empty response (status 200 but no content). ${apiProvider === PROVIDER_OPENROUTER ? 'The free tier may be overloaded. Try again or add credits.' : 'Try again or select a different model.'}` });
          return;
        }
        safeRespond({ result: content });
        return;
      }

      const errInfo = classifyError(res.status, data, apiProvider);
      if (!errInfo.retryable) {
        safeRespond({ error: errInfo.message });
        return;
      }
      if (await retry(errInfo.message)) continue;
      safeRespond({ error: errInfo.message || `HTTP ${res.status}: Failed after retries.` });
      return;
    } catch (err) {
      clearTimeout(timeout);

      if (err.name === 'AbortError') {
        if (await retry('Timed out')) continue;
        safeRespond({ error: `Request timed out after ${TIMEOUT_MS / 1000}s across ${MAX_RETRIES + 1} attempts. Your network or ${apiProvider} may be slow. Try again later.` });
        return;
      }
      if (await retry(err.message)) continue;
      safeRespond({ error: `Network error after ${MAX_RETRIES + 1} attempts. Check your connection: ${err.message}` });
      return;
    }
  }

  safeRespond({ error: lastError || `Request failed after retries. ${apiProvider === PROVIDER_OPENROUTER ? 'OpenRouter free tier may be overloaded. Try adding $10 credits for higher limits.' : 'Check your API key and network.'}` });
}
