# Project Cortex — System Architecture & Engineering Blueprint

This document outlines the architectural design, security model, and directory structure of **Project Cortex**.

---

## 1. High-Level System Overview

Project Cortex is divided into two primary subsystems:
1. **Client Layer (Chrome Extension MV3)**: An in-browser intelligence operating system delivering zero-latency page intelligence, command palette workflows, context-aware AI interactions, and hardware-authenticated enterprise features.
2. **Server Layer (Next.js 14 & Prisma)**: A modern full-stack web and API backend (`server/`) managing enterprise telemetry, activation tokens, account portals, and SaaS subscription synchronization.

```
                           +----------------------------------------+
                           |           User Host Browser            |
                           +----------------------------------------+
                                        |              |
                      DOM & Selection   |              | Host Injection
                                        v              v
+-------------------------------------------------------------------------------+
|                       Chrome Extension Runtime (Manifest V3)                   |
|                                                                               |
|  +---------------------------+             +-------------------------------+  |
|  |     Content Scripts       |             |   Main World Script           |  |
|  |   (ISOLATED Browser World)|             |   (MAIN Browser World)        |  |
|  |                           |             |                               |  |
|  | - content_globals.js      |             | - main_world.js               |  |
|  | - content_utils.js        |             |   (Anti-cheat & integrity)   |  |
|  | - content_anti_cheat.js   |             +-------------------------------+  |
|  | - content_ui.js           |                             |                  |
|  | - content_ai.js           |                             | Custom Events    |
|  | - content_productivity.js |<----------------------------+                  |
|  | - content_main.js         |                                                |
|  +---------------------------+                                                |
|                |                                                              |
|                |  chrome.runtime.sendMessage (IPC)                           |
|                v                                                              |
|  +-------------------------------------------------------------------------+  |
|  |                Background Service Worker (ES Modules)                   |  |
|  |                                                                         |  |
|  |  bg_main.js  --->  bg_api.js  --->  bg_config.js                        |  |
|  |      |                                                                  |  |
|  |      v                                                                  |  |
|  |  bg_auth.js (JWT Hardware-Bound License Security Engine)                |  |
|  +-------------------------------------------------------------------------+  |
|        |                                                   |                  |
|        | HTTPS Streaming                                   | HTTPS Telemetry  |
|        v                                                   v                  |
+--------|---------------------------------------------------|------------------+
         |                                                   |
         v                                                   v
+------------------+                               +--------------------+
|  LLM Gateways    |                               |  Project Cortex    |
| (Groq / Open-    |                               |  Cloud Server      |
|  Router / Custom)|                               | (Next.js / Prisma) |
+------------------+                               +--------------------+
```

---

## 2. Chrome Extension Architecture

### A. Isolated World Content Scripts
Loaded sequentially in `document_idle` with `all_frames: true`:
1. **`content_globals.js`**: Global state containers, event dispatchers, and runtime constants.
2. **`content_utils.js`**: DOM text extraction, selection range calculations, and markdown formatting.
3. **`content_anti_cheat.js`**: Integrity validation and listeners detecting host site interference.
4. **`content_ui.js`**: In-page floating assistant panel and contextual bubble UI.
5. **`content_ai.js`**: AI response parsers (MCQ detection, definition formats, fact check verdicts).
6. **`content_productivity.js`**: Cortex Command Center (`Alt + K`), custom user workflows (`{{selection}}`, `{{page}}`), recall history, and markdown export.
7. **`content_main.js`**: Content script entry point and lifecycle orchestrator.

### B. Main World Script
- **`main_world.js`**: Runs in `document_start` inside `world: "MAIN"` to protect core JavaScript prototypes from malicious script overrides or host-level tampering.

### C. Background Service Worker
Operates as a persistent Manifest V3 Service Worker:
- **`bg_main.js`**: Context menus, keyboard command dispatchers (`Ctrl+Shift+L`, `Ctrl+Shift+K`), and lifecycle alarms (`authCheck`).
- **`bg_api.js`**: Multi-provider LLM request broker with exponential backoff retries, failover routing (Groq $\to$ OpenRouter $\to$ Custom), and streaming handlers.
- **`bg_auth.js`**: Hardware fingerprinting, JWT validation, offline cache management, and license activation gates.
- **`bg_config.js`**: Model constants, timeout thresholds, and endpoint registries.

### D. UI Surfaces & Design Tokens
- **Popup Launcher** (`popup.html`, `popup.js`): Fast-action 380px Obsidian Gold widget for instant page Q&A and workflow access.
- **Settings & Copilot Dashboard** (`options.html`, `options.js`): Enterprise configuration panel for AI models, API keys, HUD styling, storage utilities, and license management.
- **Design Tokens** (`tokens.css`): Single source of truth containing 159 strict `--cx-*` custom properties. Fully isolated to prevent any leakage or collision with host page styles.

---

## 3. Server Architecture (`server/`)

The backend is structured as a scalable Next.js 14 App Router application:
- **Framework**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Database & ORM**: PostgreSQL via Prisma ORM (`server/prisma/schema.prisma`)
- **Authentication & Licensing**: Supabase auth schema and JWT cryptographic verification
- **Deployment**: Vercel Serverless / Edge Infrastructure

---

## 4. Repository Directory Structure

```
projectcortex/
├── .agents/                 # Development agent skills and guidelines
├── .github/                 # GitHub Actions workflows and issue templates
│   ├── ISSUE_TEMPLATE/     # Standard bug report and feature request templates
│   └── workflows/          # Automated CI test and packaging verification
├── docs/                    # Technical documentation and specifications
│   ├── ARCHITECTURE.md     # System architecture and engineering blueprint (this document)
│   ├── DESIGN_SYSTEM.md    # Obsidian Gold token specs and UX guidelines
│   ├── PRIVACY.md          # User privacy policy and data protection disclosures
│   └── STORE_LISTING.md    # Chrome Web Store copy and promotional asset guidelines
├── releases/                # Chrome Web Store and distribution ZIP archives
├── scripts/                 # Developer, build, packaging, and QA scripts
│   ├── build.js            # Release bundler (comment stripping, minification, obfuscation)
│   ├── clean.js            # Cross-platform workspace and cache cleaner
│   ├── css-audit.py        # Color token auditor for hex and rgba literals
│   ├── css-tokens-check.py # Token integrity linter (0 missing token guarantee)
│   └── package-webstore.js # Web Store packager and Manifest V3 policy verifier
├── server/                  # Full-stack Next.js 14 + Prisma + Supabase API server
├── tests/                   # VM-sandboxed unit test suite
│   ├── harness.js          # Node.js VM DOM/Chrome mock environment
│   ├── run-tests.js        # 53 comprehensive unit tests
│   └── verify-dist.js      # Distribution syntax and obfuscation verifier
├── icons/                   # Vector-rendered production PNG icons (16, 48, 128)
├── bg_*.js                  # Background Service Worker modules
├── content_*.js             # In-page content script modules
├── main_world.js            # Main-world browser protection script
├── options.html / .js       # Enterprise settings dashboard
├── popup.html / .js         # Extension popup launcher
├── tokens.css               # Design system token definitions
├── content.css              # In-page panel styling
├── manifest.json            # Manifest V3 extension configuration
├── package.json             # Root workspace scripts and dependencies
├── CHANGELOG.md             # Version release notes and changes
├── CONTRIBUTING.md          # Contributor guide and coding standards
├── LICENSE                  # Open source license (MIT)
└── README.md                # Project landing documentation
```

---

## 5. Security & Verification Guarantees

1. **Zero Undefined Tokens**: Enforced by `scripts/css-tokens-check.py` — every `var(--cx-*)` reference across all surfaces must resolve to a valid definition in `tokens.css`.
2. **Zero Unsandboxed Logic**: All unit tests in `tests/run-tests.js` execute against Node VM sandboxes mimicking the Chrome extension runtime without external internet dependencies.
3. **Web Store Compliance**: `scripts/package-webstore.js` verifies icon dimensions, script CSP policies, absence of sensitive files (`.env`, `node_modules`), and Manifest V3 specifications prior to creating release archives in `releases/`.
