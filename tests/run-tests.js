/*
 * ProjectCortex test suite.
 *
 * Runs the content scripts inside a VM sandbox and asserts the behaviour that
 * users actually depend on: MCQ parsing, text sanitisation, Markdown export,
 * fuzzy search, workflow storage and recall history.
 *
 * Usage: node tests/run-tests.js
 */

'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { createEnvironment, ROOT } = require('./harness')

const CORE_FILES = ['content_globals.js', 'content_utils.js', 'content_ai.js', 'content_productivity.js']

const tests = []
const test = (name, fn) => tests.push({ name, fn })

function freshEnv() {
  return createEnvironment(CORE_FILES)
}

function fakeEl(tag, text, parent) {
  const node = {
    tagName: String(tag).toUpperCase(),
    nodeType: 1,
    parentElement: parent || null,
    childNodes: text === null || text === undefined ? [] : [{ nodeType: 3, nodeValue: String(text) }],
    textContent: text === null || text === undefined ? '' : String(text),
    closest() { return null },
    getAttribute() { return null }
  }
  return node
}

// Uses the same mechanism as package_webstore.js: node parses the code from
// stdin and throws on the first syntax error.
function assertParses(code, label) {
  const isModule = /^\s*(?:import|export)\s/m.test(code)
  try {
    execSync(isModule ? 'node --input-type=module --check' : 'node --check', {
      input: code,
      stdio: 'pipe'
    })
  } catch (err) {
    const detail = String((err.stderr && err.stderr.toString()) || err.message).split('\n').slice(0, 4).join(' ')
    throw new Error(label + ' no longer parses: ' + detail)
  }
}

/* ------------------------------------------------------------------ MCQ --- */

test('parseAiResponse reads a standard MCQ block', () => {
  const { sandbox } = freshEnv()
  const parsed = sandbox.parseAiResponse(
    'QUESTION: What is the capital of France?\n' +
    'OPTIONS:\nA) Paris\nB) London\nC) Berlin\nD) Madrid\n\n' +
    'ANSWER: A'
  )
  assert.ok(parsed, 'expected a parsed result')
  assert.strictEqual(parsed.question, 'What is the capital of France?')
  assert.strictEqual(parsed.options.length, 4)
  assert.strictEqual(parsed.matched.label, 'A')
  assert.strictEqual(parsed.matched.text, 'Paris')
})

test('parseAiResponse tolerates bold markers and markdown fences', () => {
  const { sandbox } = freshEnv()
  const parsed = sandbox.parseAiResponse(
    '```text\n' +
    '**QUESTION:** Which planet is closest to the Sun?\n' +
    '**OPTIONS:**\n' +
    '**A)** Mercury\n**B)** Venus\n**C)** Earth\n**D)** Mars\n' +
    '**ANSWER:** B\n' +
    '```'
  )
  assert.ok(parsed, 'expected a parsed result')
  assert.strictEqual(parsed.matched.label, 'B')
  assert.strictEqual(parsed.matched.text, 'Venus')
})

test('parseAiResponse converts roman numeral options to letters', () => {
  const { sandbox } = freshEnv()
  const parsed = sandbox.parseAiResponse(
    'QUESTION: Pick the third option.\n' +
    'OPTIONS:\nI. Alpha\nII. Beta\nIII. Gamma\nIV. Delta\n\n' +
    'ANSWER: III'
  )
  assert.ok(parsed, 'expected a parsed result')
  assert.deepStrictEqual(Array.from(parsed.options, o => o.label), ['A', 'B', 'C', 'D'])
  assert.strictEqual(parsed.matched.label, 'C')
  assert.strictEqual(parsed.matched.text, 'Gamma')
})

test('parseAiResponse resolves an answer given as a single roman numeral', () => {
  const { sandbox } = freshEnv()
  // Regression: "I." used to be treated as a literal letter, so an answer of
  // "I" could never be matched and the whole response was thrown away.
  const parsed = sandbox.parseAiResponse(
    'QUESTION: Which is the smallest?\n' +
    'OPTIONS:\nI. One\nII. Two\nIII. Three\nIV. Four\n\n' +
    'ANSWER: I'
  )
  assert.ok(parsed, 'expected a parsed result')
  assert.strictEqual(parsed.matched.label, 'A')
  assert.strictEqual(parsed.matched.text, 'One')
})

test('parseAiResponse reads options that sit on one line', () => {
  const { sandbox } = freshEnv()
  const parsed = sandbox.parseAiResponse(
    'QUESTION: Normal body temperature?\n' +
    'OPTIONS: A) 39 C B) 44 C C) 38 C D) 41 C\n' +
    'ANSWER: D'
  )
  assert.ok(parsed, 'expected a parsed result')
  assert.strictEqual(parsed.matched.label, 'D')
  assert.strictEqual(parsed.matched.text, '41 C')
})

test('parseAiResponse strips reasoning blocks and numeric labels', () => {
  const { sandbox } = freshEnv()
  const parsed = sandbox.parseAiResponse(
    '<think>let me work this out</think>\n' +
    'QUESTION: What is 2 + 2?\n' +
    'OPTIONS:\n1) 3\n2) 4\n3) 5\n4) 6\n' +
    'ANSWER: 2'
  )
  assert.ok(parsed, 'expected a parsed result')
  assert.strictEqual(parsed.question, 'What is 2 + 2?')
  assert.strictEqual(parsed.matched.label, '2')
  assert.strictEqual(parsed.matched.text, '4')
})

test('parseAiResponse returns null when the answer is missing', () => {
  const { sandbox } = freshEnv()
  const parsed = sandbox.parseAiResponse('OPTIONS:\nA) One\nB) Two\n')
  assert.strictEqual(parsed, null)
})

/* -------------------------------------------------------------- sanitise --- */

test('sanitizeText unwraps light LaTeX from model output', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.sanitizeText('\\frac{1}{2}'), '1/2')
  assert.strictEqual(sandbox.sanitizeText('**bold**'), 'bold')
  assert.strictEqual(sandbox.sanitizeText('$$E=mc^2$$'), 'E=mc^2')
  assert.strictEqual(sandbox.sanitizeText('a \\times b'), 'a × b')
  assert.strictEqual(sandbox.sanitizeText('[label](https://example.com)'), 'label')
})

test('convertMath turns LaTeX symbols into readable glyphs', () => {
  const { sandbox } = freshEnv()
  const out = sandbox.convertMath('\\alpha \\times \\beta \\frac{1}{2} x^{2}')
  assert.ok(out.includes('α'), 'expected the alpha glyph')
  assert.ok(out.includes('β'), 'expected the beta glyph')
  assert.ok(out.includes('×'), 'expected the times glyph')
  assert.ok(out.includes('pm-frac'), 'expected a stacked fraction')
  assert.ok(out.includes('<sup>2</sup>'), 'expected a superscript')
})

test('getCleanText normalises whitespace and strips invisibles', () => {
  const { sandbox } = freshEnv()
  const out = sandbox.getCleanText('line one  \u200B\r\n\n\n\n line two')
  assert.strictEqual(out, 'line one\n\n line two')
})

test('esc escapes every HTML metacharacter', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.esc('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;')
})

/* --------------------------------------------------------- option parsing --- */

test('extractInlineOptions only accepts sequential labels', () => {
  const { sandbox } = freshEnv()
  const good = sandbox.extractInlineOptions('A) one B) two C) three')
  assert.strictEqual(good.length, 3)
  assert.deepStrictEqual(Array.from(good, o => o.label), ['A', 'B', 'C'])
  assert.strictEqual(good[1].text, 'two')

  // A then C is prose, not a set of options.
  assert.strictEqual(sandbox.extractInlineOptions('A) one C) three'), null)
  assert.strictEqual(sandbox.extractInlineOptions('no markers here'), null)
})

test('romanToLetter maps roman labels and countOptionMarkers counts runs', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.romanToLetter('iii'), 'C')
  assert.strictEqual(sandbox.romanToLetter('IV'), 'D')
  assert.strictEqual(sandbox.romanToLetter('Z'), 'Z')
  assert.ok(sandbox.countOptionMarkers('A) one B) two C) three D) four') >= 4)
})

/* ------------------------------------------------------------- markdown --- */

test('pcxPageToMarkdown renders headings, lists and code blocks', () => {
  const { sandbox } = freshEnv()
  const article = fakeEl('article', null)
  const ul = fakeEl('ul', null, article)
  const heading = fakeEl('h1', 'Test Page', article)
  const section = fakeEl('h2', 'Section', article)
  const para = fakeEl('p', 'Hello world', article)
  const item1 = fakeEl('li', 'First', ul)
  const item2 = fakeEl('li', 'Second', ul)
  const code = fakeEl('pre', 'const x = 1', article)

  sandbox.document.querySelector = selector => (selector === 'article' ? article : null)
  article.querySelectorAll = () => [heading, section, para, item1, item2, code]

  const md = sandbox.pcxPageToMarkdown()
  assert.ok(md.includes('# Test Page'), 'expected the document title as an H1')
  assert.ok(md.includes('Source: https://example.com/guide'), 'expected a source line')
  assert.ok(md.includes('## Section'), 'expected the H2 heading')
  assert.ok(md.includes('Hello world'), 'expected the paragraph')
  assert.ok(md.includes('- First') && md.includes('- Second'), 'expected list items')
  assert.ok(md.includes('```\nconst x = 1\n```'), 'expected a fenced code block')
})

test('pcxPageToMarkdown returns an empty string when there is no content', () => {
  const { sandbox } = freshEnv()
  sandbox.document.querySelector = () => null
  assert.strictEqual(sandbox.pcxPageToMarkdown(), '')
})

/* --------------------------------------------------------------- helpers --- */

test('pcxInterpolate fills known tokens and blanks unknown ones', () => {
  const { sandbox } = freshEnv()
  const out = sandbox.pcxInterpolate('Hi {{ name }} from {{host}} {{missing}}', { name: 'Ada', host: 'x.com' })
  assert.strictEqual(out, 'Hi Ada from x.com ')
})

test('workflow token filling has exactly one implementation', () => {
  const { sandbox } = freshEnv()
  // content_ai.js (workflow runner) and content_productivity.js (palette) must
  // agree, so both delegate to interpolateTokens in content_utils.js.
  const input = '{{a}}|{{ b }}|{{missing}}|{{context}}'
  const vars = { a: '1', b: '2', context: 'sel' }
  const shared = sandbox.interpolateTokens(input, vars)
  assert.strictEqual(shared, '1|2||sel')
  assert.strictEqual(sandbox.pcxInterpolate(input, vars), shared)
})

test('pcxUsesSelection detects a selection token', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.pcxUsesSelection('Rewrite: {{selection}}'), true)
  assert.strictEqual(sandbox.pcxUsesSelection('Summarise {{page}}'), false)
})

test('pcxTruncate appends a marker only when it cuts', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.pcxTruncate('abcd', 10), 'abcd')
  assert.ok(sandbox.pcxTruncate('abcdefghij', 4).startsWith('abcd'))
  assert.ok(sandbox.pcxTruncate('abcdefghij', 4).includes('truncated'))
})

test('pcxRelativeTime describes recent timestamps', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.pcxRelativeTime(Date.now()), 'just now')
  assert.strictEqual(sandbox.pcxRelativeTime(Date.now() - 5 * 60000), '5m ago')
  assert.strictEqual(sandbox.pcxRelativeTime(Date.now() - 3 * 3600000), '3h ago')
  assert.strictEqual(sandbox.pcxRelativeTime(0), '')
})

test('pcxNormaliseWorkflow validates, trims and caps user input', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.pcxNormaliseWorkflow(null), null)
  assert.strictEqual(sandbox.pcxNormaliseWorkflow({ name: 'x' }), null)
  assert.strictEqual(sandbox.pcxNormaliseWorkflow({ prompt: 'x' }), null)

  const clean = sandbox.pcxNormaliseWorkflow({ name: '  Tweet it  ', prompt: '  Go  ', hint: 'h' })
  assert.strictEqual(clean.name, 'Tweet it')
  assert.strictEqual(clean.prompt, 'Go')
  assert.ok(clean.id.startsWith('wf_'))

  const long = sandbox.pcxNormaliseWorkflow({ name: 'n', prompt: 'p'.repeat(9000) })
  assert.strictEqual(long.prompt.length, 6000)
})

/* ---------------------------------------------------------- fuzzy search --- */

test('pcxFuzzyScore matches subsequences and rejects misses', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(sandbox.pcxFuzzyScore('', 'anything'), 0)
  assert.strictEqual(sandbox.pcxFuzzyScore('zzz', 'Summarize this page'), -1)

  const tight = sandbox.pcxFuzzyScore('summar', 'Summarize this page')
  const scattered = sandbox.pcxFuzzyScore('stp', 'summarize this page')
  assert.ok(tight > 0, 'expected a positive score for a tight match')
  assert.ok(scattered > 0, 'a subsequence should still match')
  assert.ok(tight > scattered, 'a tight match must outrank a scattered one')
  // Shorter targets win when the query matches both equally well.
  assert.ok(
    sandbox.pcxFuzzyScore('summar', 'Summarize this page') <
    sandbox.pcxFuzzyScore('summar', 'Summarize')
  )
  // Word-start matches beat mid-word matches.
  assert.ok(
    sandbox.pcxFuzzyScore('page', 'page summary') >
    sandbox.pcxFuzzyScore('page', 'frontpage')
  )
})

/* ------------------------------------------------------------ workflows --- */

test('CortexWorkflows seeds the default library on first use', async () => {
  const { sandbox } = freshEnv()
  const list = await sandbox.CortexWorkflows.list()
  assert.strictEqual(list.length, sandbox.CortexProductivity.defaultWorkflows.length)
  assert.ok(list.every(w => w.name && w.prompt))
  // Seeding must persist, otherwise every read would reseed.
  const again = await sandbox.CortexWorkflows.list()
  assert.strictEqual(again.length, list.length)
  assert.strictEqual(sandbox.chrome.__store.sync.cortexWorkflowsSeed, 1)
})

test('CortexWorkflows saves, updates, removes and resets', async () => {
  const { sandbox } = freshEnv()
  const wf = sandbox.CortexWorkflows
  const base = (await wf.list()).length

  const saved = await wf.save({ name: 'Tweet thread', prompt: 'Turn this into 5 tweets.\n\n{{context}}' })
  assert.strictEqual(saved.ok, true)
  assert.strictEqual((await wf.list()).length, base + 1)

  // Saving the same id must update in place rather than duplicate.
  const updated = await wf.save({ id: saved.workflow.id, name: 'Tweet thread v2', prompt: 'x' })
  assert.strictEqual(updated.ok, true)
  const afterUpdate = await wf.list()
  assert.strictEqual(afterUpdate.length, base + 1)
  assert.strictEqual(afterUpdate.filter(w => w.id === saved.workflow.id)[0].name, 'Tweet thread v2')

  const rejected = await wf.save({ name: 'no prompt' })
  assert.strictEqual(rejected.ok, false)
  assert.ok(rejected.error)

  await wf.remove(saved.workflow.id)
  assert.strictEqual((await wf.list()).length, base)

  await wf.reset()
  assert.strictEqual((await wf.list()).length, sandbox.CortexProductivity.defaultWorkflows.length)
})

test('every seeded workflow carries a content token', () => {
  const { sandbox } = freshEnv()
  sandbox.CortexProductivity.defaultWorkflows.forEach(workflow => {
    assert.ok(
      /\{\{\s*(context|selection|page)\s*\}\}/.test(workflow.prompt),
      workflow.id + ' has no content token'
    )
  })
})

/* --------------------------------------------------------------- recall --- */

test('CortexMemory keeps a de-duplicated ring buffer', async () => {
  const memory = freshEnv().sandbox.CortexMemory
  assert.strictEqual(await memory.record('A', 'x'), false, 'single characters are not worth storing')
  assert.strictEqual(await memory.record('Answer', 'first answer'), true)

  for (let i = 0; i < 40; i++) await memory.record('Answer', 'answer number ' + i)

  const list = await memory.list()
  assert.strictEqual(list.length, memory.MAX)
  assert.strictEqual(list[0].content, 'answer number 39', 'newest entry must come first')
  assert.strictEqual(list[0].label, 'Answer')
  assert.ok(list[0].ts > 0)
})

test('CortexMemory ignores an identical consecutive answer', async () => {
  const memory = freshEnv().sandbox.CortexMemory
  await memory.record('Answer', 'the same answer')
  assert.strictEqual(await memory.record('Answer', 'the same answer'), false)
  assert.strictEqual((await memory.list()).length, 1)
})

test('CortexMemory can remove one entry and clear everything', async () => {
  const memory = freshEnv().sandbox.CortexMemory
  await memory.record('One', 'first')
  await memory.record('Two', 'second')
  const list = await memory.list()
  assert.strictEqual(list.length, 2)

  await memory.remove(list[0].id)
  assert.strictEqual((await memory.list()).length, 1)

  await memory.clear()
  assert.strictEqual((await memory.list()).length, 0)
})

/* ------------------------------------------------------------- shipping --- */

test('manifest loads the command center and exposes its shortcuts', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  const scripts = manifest.content_scripts[0].js
  const at = name => scripts.indexOf(name)

  assert.ok(scripts.includes('content_productivity.js'), 'manifest is missing the command center')
  assert.ok(at('content_ai.js') < at('content_productivity.js'), 'must load after the AI engine')
  assert.ok(at('content_productivity.js') < at('content_main.js'), 'must load before the message bridge')
  assert.ok(manifest.commands.open_palette, 'open_palette command is not declared')
  assert.ok(/^\d+\.\d+\.\d+$/.test(manifest.version), 'version must be semver')

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  assert.strictEqual(pkg.version, manifest.version, 'package.json and manifest.json version drift')
})

test('every packaged file exists on disk', () => {
  const source = fs.readFileSync(path.join(ROOT, 'package_webstore.js'), 'utf8')
  const block = source.split('const requiredFiles = [')[1].split(']')[0]
  const files = block.match(/'[^']+'/g).map(s => s.slice(1, -1))
  assert.ok(files.length > 15, 'requiredFiles looks empty')
  assert.ok(files.includes('content_productivity.js'), 'packager would ship without the command center')
  files.forEach(file => {
    assert.ok(fs.existsSync(path.join(ROOT, file)), 'required file is missing: ' + file)
  })
})

test('the command center exposes its public API', () => {
  const { sandbox } = freshEnv()
  assert.strictEqual(typeof sandbox.CortexPalette.open, 'function')
  assert.strictEqual(typeof sandbox.CortexPalette.toggle, 'function')
  assert.strictEqual(typeof sandbox.CortexPalette.close, 'function')
  assert.strictEqual(sandbox.CortexPalette.isOpen(), false)
  assert.strictEqual(typeof sandbox.CortexProductivity.fuzzyScore, 'function')
  assert.ok(sandbox.CortexProductivity.version)
  assert.strictEqual(typeof sandbox.__ProjectCortexAI.runWorkflow, 'function')
})

/* ------------------------------------------------------------ the build --- */

test('stripComments keeps its legal header and drops real comments', () => {
  const { stripComments } = require('../build.js')
  const source = fs.readFileSync(path.join(ROOT, 'content_utils.js'), 'utf8')
  const stripped = stripComments(source)

  assert.strictEqual(
    stripped.split('\n').slice(0, 9).join('\n'),
    source.split('\n').slice(0, 9).join('\n'),
    'the 9 line legal header must survive untouched'
  )
  assert.ok(stripped.length < source.length, 'comments should have been removed')
  assert.ok(stripped.includes('function parseAiResponse'), 'real code was removed')
  assert.ok(!stripped.includes('Universal rich-content renderer'), 'a comment survived')
})

test('stripComments never truncates a regex literal ending in a slash', () => {
  const { stripBody } = require('../build.js')
  // Regression: `/^https?:\/\//` used to be cut in half by a naive `//` strip.
  const out = stripBody("const absolute = /^https?:\\/\\//.test(href)\n")
  assert.ok(out.includes('/^https?:\\/\\//'), 'the regex literal was truncated: ' + out)
  assert.ok(out.includes('.test(href)'), 'the code after the regex was lost: ' + out)
})

test('stripComments never touches slashes inside strings or classes', () => {
  const { stripBody } = require('../build.js')
  const kept = stripBody("const url = 'https://example.com/a//b'\nconst cls = /[a-z/]/g\nconst div = a / b / c\n")
  assert.ok(kept.includes("'https://example.com/a//b'"), 'a URL inside a string was damaged')
  assert.ok(kept.includes('/[a-z/]/g'), 'a character class containing a slash was damaged')
  assert.ok(kept.includes('a / b / c'), 'division was damaged')
})

test('every shipped file survives the dist transform and still parses', () => {
  const { stripComments, filesToObfuscate } = require('../build.js')
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  const shipped = new Set([
    ...manifest.content_scripts.flatMap(entry => entry.js),
    ...filesToObfuscate,
    'options.js', 'popup.js', 'package_webstore.js', 'build.js'
  ])

  const checked = []
  shipped.forEach(file => {
    const full = path.join(ROOT, file)
    if (!fs.existsSync(full)) return
    const source = fs.readFileSync(full, 'utf8')
    const stripped = stripComments(source)
    assert.ok(stripped.length > 200, file + ' lost almost all of its content')
    assert.ok(stripped.length <= source.length, file + ' grew during the transform')
    // Files that carry the legal header must keep it verbatim.
    if (source.startsWith('// Copyright (c) 2026 Zenith Open Source Projects')) {
      assert.ok(stripped.includes('SPDX-License-Identifier: MIT'), file + ' lost its legal header')
    }
    assertParses(stripped, file)
    checked.push(file)
  })

  assert.ok(checked.length >= 10, 'expected to check every shipped script, only saw ' + checked.length)
})

test('verifySyntax accepts valid modules and rejects broken output', () => {
  const { verifySyntax } = require('../build.js')
  assert.strictEqual(verifySyntax('const a = 1'), true)
  assert.strictEqual(verifySyntax('export const a = 1'), true)
  assert.strictEqual(verifySyntax('const a = /unterminated'), false)
  assert.strictEqual(verifySyntax('export const a = ('), false)
})

test('the command center can reach every collaborator it depends on', () => {
  // Loads the real load order (ui before ai before the command center) so a
  // rename or a reorder breaks this test instead of the shipped extension.
  const { sandbox } = createEnvironment([
    'content_globals.js',
    'content_utils.js',
    'content_ui.js',
    'content_ai.js',
    'content_productivity.js'
  ])

  const functions = [
    'openPanel', 'closePanel', 'showState', 'showError',
    'getDeepSelectionText', 'getFastPageContext', 'getActionSelectionText',
    'interpolateTokens', 'esc', 'parseAiResponse'
  ]
  functions.forEach(name => {
    assert.strictEqual(typeof sandbox[name], 'function', name + ' is missing or was renamed')
  })

  const engine = sandbox.__ProjectCortexAI
  assert.ok(engine, 'the AI engine namespace vanished')
  ;['runSummarize', 'runDefine', 'runFactCheck', 'runCorrectAnswers', 'runAsk', 'runWorkflow', 'showStoredResult']
    .forEach(name => {
      assert.strictEqual(typeof engine[name], 'function', '__ProjectCortexAI.' + name + ' is missing')
    })

  assert.strictEqual(typeof sandbox.CortexPalette.toggle, 'function')
  assert.strictEqual(typeof sandbox.CortexMemory.record, 'function')
  assert.strictEqual(typeof sandbox.CortexWorkflows.list, 'function')
})

test('every popup action has a handler in the content bridge', () => {
  const html = fs.readFileSync(path.join(ROOT, 'popup.html'), 'utf8')
  const actions = [...html.matchAll(/data-action="([a-z_]+)"/g)].map(match => match[1])
  assert.ok(actions.length >= 5, 'expected the popup to expose its actions')
  assert.ok(actions.includes('command_palette'), 'the popup does not offer the Command Center')

  const bridge = fs.readFileSync(path.join(ROOT, 'content_main.js'), 'utf8')
  actions.forEach(action => {
    assert.ok(
      new RegExp('\\b' + action + '\\s*:').test(bridge),
      'content_main.js has no RUN_ACTION handler for "' + action + '"'
    )
  })
})

/* ------------------------------------------------------------ panel drag --- */

function uiEnv() {
  return createEnvironment(['content_globals.js', 'content_utils.js', 'content_ui.js'])
}

function fakePanel(sandbox) {
  const panel = sandbox.document.createElement('div')
  panel.id = 'pagemind-panel'
  sandbox._panel = panel
  return panel
}

test('a drag released outside the window cannot strand the move cursor', () => {
  // Regression: the panel used to raise a full screen overlay element that was
  // only removed by a mouseup the panel actually received. Releasing the mouse
  // outside the window left it covering the page, killing text selection until
  // the user refreshed.
  const { sandbox } = uiEnv()
  const html = sandbox.document.documentElement
  fakePanel(sandbox)

  sandbox._drag = true
  html.classList.add('pm-dragging')

  sandbox.abortPanelDrag()

  assert.strictEqual(sandbox._drag, false, 'the drag flag was left set')
  assert.strictEqual(html.classList.contains('pm-dragging'), false, 'the move cursor was left behind')
  assert.strictEqual(sandbox.document.getElementById('pm-drag-overlay'), null, 'an overlay was left on the page')
})

test('a completed drag lands the panel and remembers its position', () => {
  const { sandbox } = uiEnv()
  const html = sandbox.document.documentElement
  const panel = fakePanel(sandbox)

  sandbox._drag = true
  sandbox._sx = 100
  sandbox._sy = 100
  sandbox._sl = 20
  sandbox._st = 30
  html.classList.add('pm-dragging')

  sandbox.finishPanelDrag(150, 160)

  assert.strictEqual(sandbox._drag, false)
  assert.strictEqual(html.classList.contains('pm-dragging'), false)
  // 20 + (150 - 100) and 30 + (160 - 100)
  assert.strictEqual(panel.style.left, '70px')
  assert.strictEqual(panel.style.top, '90px')
  assert.ok(panel.classList.contains('pm-positioned'))
  assert.ok(sandbox.localStorage.getItem('pc_panel_pos').includes('"x":70'))
})

test('a leaked drag state is swept up on the next click', () => {
  const { sandbox } = uiEnv()
  const html = sandbox.document.documentElement
  fakePanel(sandbox)
  const memory = sandbox.localStorage

  // Nothing is dragging, but the class somehow survived.
  sandbox._drag = false
  html.classList.add('pm-dragging')
  sandbox.clearStrayDragState()
  assert.strictEqual(html.classList.contains('pm-dragging'), false, 'the stray cursor survived a click')

  // A live drag must not be cancelled by an unrelated mousedown.
  sandbox._drag = true
  html.classList.add('pm-dragging')
  sandbox.clearStrayDragState()
  assert.strictEqual(html.classList.contains('pm-dragging'), true, 'an in-flight drag was cancelled')
  assert.ok(memory.getItem('pc_panel_pos') === null, 'no position should be written by a sweep')
})

test('the drag cursor is driven by the stylesheet, not a page covering element', () => {
  const css = fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8')
  assert.ok(/html\.pm-dragging/.test(css), 'the drag cursor rule is missing')
  assert.ok(/cursor:\s*move\s*!important/.test(css), 'the move cursor is no longer forced')
  assert.ok(/(^|[^-])user-select:\s*none\s*!important/.test(css), 'text selection is not locked during a drag')

  // The overlay element must be gone from the source entirely. These two
  // strings are the exact signature of the element that used to cover the page.
  const ui = fs.readFileSync(path.join(ROOT, 'content_ui.js'), 'utf8')
  assert.ok(!ui.includes('cursor:move;background:transparent'), 'the full screen drag overlay is still created')
  assert.ok(!ui.includes('width:100vw;height:100vh'), 'a viewport covering drag overlay is still created')
  assert.ok(ui.includes("classList.add('pm-dragging')"), 'the drag state is never applied to <html>')
})

test('no decorative animation is left running on a loop', () => {
  // An infinite animation is only justified for real progress feedback. A
  // permanently glowing border or a crawling gradient is decoration.
  const css = fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8')
  const loops = (css.match(/animation:[^;]*infinite[^;]*;/g) || []).map(s => s.trim())
  const allowed = /pmSkeletonShimmer|pmDotPulse|pmBlink/
  const decorative = loops.filter(line => !allowed.test(line))
  assert.deepStrictEqual(decorative, [], 'decorative infinite animation:\n  ' + decorative.join('\n  '))
  assert.ok(loops.length > 0, 'expected the loading indicators to remain')
})

test('the panel slide no longer animates an expensive blur', () => {
  const css = fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8')
  const slide = css.slice(css.indexOf('@keyframes pmSlideIn'), css.indexOf('@keyframes pmDismiss'))
  assert.ok(!/filter:\s*blur/.test(slide), 'the entry/exit keyframes still animate filter: blur()')
  assert.ok(!/will-change:\s*left/.test(css), 'will-change on a non-compositable property is pure cost')
})

test('every surface respects reduced motion and exposes a focus ring', () => {
  const surfaces = {
    'content.css': fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8'),
    'content_productivity.js': fs.readFileSync(path.join(ROOT, 'content_productivity.js'), 'utf8'),
    'popup.html': fs.readFileSync(path.join(ROOT, 'popup.html'), 'utf8'),
    'options.html': fs.readFileSync(path.join(ROOT, 'options.html'), 'utf8')
  }
  Object.keys(surfaces).forEach(name => {
    assert.ok(/prefers-reduced-motion/.test(surfaces[name]), name + ' does not handle reduced motion')
    assert.ok(/focus-visible/.test(surfaces[name]), name + ' has no visible focus treatment')
  })
  assert.ok(/prefers-reduced-motion:\s*reduce/.test(fs.readFileSync(path.join(ROOT, 'tokens.css'), 'utf8')),
    'the token layer should collapse the duration ladder for reduced motion')
})

test('the command palette uses real buttons and never hides its only action', () => {
  const src = fs.readFileSync(path.join(ROOT, 'content_productivity.js'), 'utf8')
  assert.ok(!/act\.setAttribute\('role', 'button'\)/.test(src),
    'a clickable span pretending to be a button is not keyboard accessible')
  assert.ok(/pcxTrapTab/.test(src), 'the modal has no focus trap')
  assert.ok(/tabIndex = isActive \? 0 : -1/.test(src), 'the list does not use roving tabindex')
})

test('no shipped text file carries stray NUL bytes', () => {
  // Regression: a UTF-16LE snippet had been pasted into the UTF-8 content.css,
  // which made the whole @media (prefers-reduced-motion: reduce) block invalid
  // CSS, so browsers silently dropped those accessibility rules.
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  const files = [
    ...manifest.content_scripts.flatMap(entry => entry.js),
    ...manifest.content_scripts.flatMap(entry => entry.css || []),
    'manifest.json', 'options.html', 'options.js', 'popup.html', 'popup.js', 'readme.md'
  ]

  files.forEach(file => {
    const raw = fs.readFileSync(path.join(ROOT, file))
    assert.strictEqual(raw.indexOf(0), -1, file + ' contains a NUL byte (a UTF-16 block was pasted into it)')
  })
})

test('the stylesheet stays syntactically balanced', () => {
  const css = fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8')
  const open = (css.match(/\{/g) || []).length
  const close = (css.match(/\}/g) || []).length
  assert.strictEqual(open, close, 'content.css has unbalanced braces: ' + open + ' open vs ' + close + ' close')
  assert.ok(/@media \(prefers-reduced-motion: reduce\)\s*\{/.test(css), 'the reduced-motion block is missing')
  assert.ok(/html\.pm-dragging\s*\{/.test(css) || /html\.pm-dragging,/.test(css), 'the drag cursor rule is missing')
})

/* ------------------------------------------------------------ design system --- */

function readRootBlocks(css) {
  const names = []
  const re = /:root\s*\{([^}]*)\}/g
  let m
  while ((m = re.exec(css))) {
    const decls = m[1].match(/--[a-zA-Z0-9-]+\s*:/g) || []
    decls.forEach(d => names.push(d.replace(/\s*:$/, '')))
  }
  return names
}

test('the token layer never publishes a generic name onto the host page', () => {
  // tokens.css is injected into whatever site the user is on. A generic custom
  // property such as --text, --surface, --border, --accent or --muted would
  // land on that page's own :root and silently overwrite the site's variables.
  // Tailwind and shadcn themes define exactly those names.
  const css = fs.readFileSync(path.join(ROOT, 'tokens.css'), 'utf8')
  const names = readRootBlocks(css)
  assert.ok(names.length > 50, 'expected the token layer to define many tokens')

  const unsafe = names.filter(name => !/^--(cx|pm|pcx)-/.test(name))
  assert.deepStrictEqual(unsafe, [], 'these names would clobber the host page: ' + unsafe.join(', '))
})

test('content scripts never set color-scheme on the host page', () => {
  // color-scheme on the host :root restyles the site's native form controls.
  const css = fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8')
  assert.ok(!/color-scheme/.test(css), 'content.css must not touch color-scheme')
  assert.ok(!/:root\s*\{/.test(css), 'content.css must not define :root variables')
})

test('every var() reference resolves to a declared token', () => {
  const defined = new Set(readRootBlocks(fs.readFileSync(path.join(ROOT, 'tokens.css'), 'utf8')))
  const surfaces = {
    'content.css': fs.readFileSync(path.join(ROOT, 'content.css'), 'utf8'),
    'content_productivity.js': fs.readFileSync(path.join(ROOT, 'content_productivity.js'), 'utf8'),
    'popup.html': fs.readFileSync(path.join(ROOT, 'popup.html'), 'utf8'),
    'options.html': fs.readFileSync(path.join(ROOT, 'options.html'), 'utf8')
  }

  Object.keys(surfaces).forEach(name => {
    const src = surfaces[name].replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '')
    const used = (src.match(/var\(\s*(--[a-zA-Z0-9-]+)/g) || []).map(s => s.replace(/var\(\s*/, ''))
    const missing = [...new Set(used)].filter(u => !defined.has(u))
    assert.deepStrictEqual(missing, [], name + ' references undefined tokens: ' + missing.join(', '))
  })
})

test('the token layer loads before the panel stylesheet', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  const css = manifest.content_scripts[0].css
  assert.strictEqual(css[0], 'tokens.css', 'tokens.css must be injected first')
  assert.ok(css.includes('content.css'), 'content.css must still be injected')
})

test('both extension pages link the shared token layer', () => {
  ;['popup.html', 'options.html'].forEach(file => {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8')
    // Exactly one link. Two stylesheets means a merge or a re-run duplicated
    // the tag, which browsers will happily fetch twice.
    const links = (html.match(/href="tokens\.css"/g) || []).length
    assert.strictEqual(links, 1, file + ' links tokens.css ' + links + ' times, expected exactly 1')
    assert.ok(/<link[^>]+href="tokens.css"/.test(html), file + ' does not link tokens.css')
    assert.ok(html.indexOf('tokens.css') < html.indexOf('<style'),
      file + ' must load tokens.css before its own styles')
    assert.ok(/color-scheme:\s*dark/.test(html), file + ' should declare a dark color scheme')
    assert.ok(!/:root\s*\{\s*--/.test(html), file + ' must not define its own token block')
    assert.strictEqual((html.match(/<style>/g) || []).length, 1, file + ' should have a single style block')
  })
})

/* --------------------------------------------------------------- runner --- */

async function main() {
  const failures = []
  let passed = 0

  for (const entry of tests) {
    try {
      await entry.fn()
      passed++
      process.stdout.write('.')
    } catch (err) {
      failures.push({ name: entry.name, err })
      process.stdout.write('x')
    }
  }

  process.stdout.write('\n\n')
  failures.forEach(({ name, err }) => {
    console.log('FAIL  ' + name)
    console.log('      ' + String((err && err.message) || err).split('\n').join('\n      '))
    console.log('')
  })

  console.log(passed + ' passed, ' + failures.length + ' failed, ' + tests.length + ' total')
  if (failures.length) process.exitCode = 1
}

main()
