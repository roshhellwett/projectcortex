// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

var SYSTEM_PROMPT_MCQ =
  'You are an expert test-taker. You will be given a raw text extraction from a webpage containing a multiple choice question.\n' +
  'Extract the exact question, all options, and determine the correct answer.\n' +
  'Respond EXACTLY in this format with NO conversational text:\n\n' +
  'QUESTION: <Question text>\n' +
  'OPTIONS:\n' +
  'A) <Option 1>\n' +
  'B) <Option 2>\n' +
  'C) <Option 3>\n' +
  'D) <Option 4>\n\n' +
  'ANSWER: <Correct Letter>';

var MCQ_SELECTOR =
  '.options, .answers, .choices, .mcq, .quiz, .question, .exam, ' +
  '[class*="option"], [class*="answer"], [class*="choice"], ' +
  '[class*="mcq"], [class*="quiz"], [class*="question"], ' +
  'ol, ul, table, form, section, fieldset';

var SANITIZE_RULES = [
  [/\$\$([\s\S]*?)\$\$/g, '$1'],
  [/\$([^$\n]+)\$/g, '$1'],
  [/\\boxed\{([^}]*)\}/g, '$1'],
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2'],
  [/\\(?:text|textbf|textit|texttt|mathrm|displaystyle|emph)\{([^}]*)\}/g, '$1'],
  [/\\(times|div|pm|cdot)/g, m => ({ times:'\u00D7', div:'\u00F7', pm:'\u00B1', cdot:'\u00B7' })[m.slice(1)] || m],
  [/\\%/g, '%'],
  [/_\{([^}]*)\}/g, '_$1'],
  [/\^\{([^}]*)\}/g, '^$1'],
  [/\{([^}]*)\}/g, '$1'],
  [/\\\\/g, '\\'],
  [/\\[a-zA-Z]+/g, ''],
  [/^#{1,6}\s+/gm, ''],
  [/\*\*([^*]+)\*\*/g, '$1'],
  [/__([^_]+)__/g, '$1'],
  [/\*([^*]+)\*/g, '$1'],
  [/\[([^\]]+)\]\([^)]+\)/g, '$1'],
  [/`([^`]+)`/g, '$1'],
  [/^---+\s*$/gm, ''],
  [/\n{3,}/g, '\n\n'],
];

var _busy = false;
var _lastAction = null;

var _typeTimer = null;
var _thinkTimer = null;
var _hideTimer = null;

var _bubble = null;

var _panel = null;
var _panelPos = null;

let _isLocked = false;

try {
  var saved = localStorage.getItem('pc_panel_pos');
  if (saved) _panelPos = JSON.parse(saved);
} catch (_) {}

var _dragListenersAdded = false;
var _drag = false;
var _sx, _sy, _sl, _st;

var _selectionListenersAdded = false;
var _messageListenerAdded = false;

var _lastURL = location.href;
