<div align="center">
  <img src="https://raw.githubusercontent.com/roshhellwett/projectcortex/main/icons/logo128.png" alt="Project Cortex Logo" width="120" />
</div>

<h1 align="center">Project Cortex — Intelligence</h1>

<div align="center">
  <strong>Enterprise AI Browser Operating System & Productivity Platform</strong>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge&color=1976D2" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Version-11.3.0-black?style=for-the-badge" alt="Version 11.3.0" />
  <img src="https://img.shields.io/badge/Tests-53%20Passed-success?style=for-the-badge&color=059669" alt="Tests" />
  <img src="https://img.shields.io/badge/Design_Tokens-159%20Verified-gold?style=for-the-badge&color=D4A017" alt="Design Tokens" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge" alt="License" />
</div>

<br />

**Project Cortex** is an enterprise-grade AI browser operating system and SaaS platform built on Manifest V3. Powered by multi-provider LLM gateways (Groq, OpenRouter, and custom enterprise endpoints), Cortex provides context-aware document summarization, instant claim fact-checking against live page content, complex terminology definition, and an isolated command palette productivity suite.

---

## 📑 Table of Contents

- [Directory Structure & Architecture](#-directory-structure)
- [Key Features](#-key-features)
  - [High-Impact AI Tooling](#-high-impact-ai-tooling)
  - [Cortex Command Center](#-cortex-command-center)
  - [Design System — "Obsidian Gold"](#-design-system--obsidian-gold)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Installation & Quick Start](#-installation--quick-start)
- [Development, Testing & Build Pipeline](#-development-testing--build-pipeline)
- [Technical Documentation](#-technical-documentation)
- [Security & Licensing](#-security--licensing)

---

## 📂 Directory Structure

```
projectcortex/
├── .agents/                 # Development agent skills and workflow guides
├── .github/                 # GitHub Actions CI workflows and issue templates
│   ├── ISSUE_TEMPLATE/     # Bug report & feature request templates
│   └── workflows/ci.yml    # Automated CI (Unit tests, token linters, Web Store QA)
├── docs/                    # Architectural blueprints and technical specifications
│   ├── ARCHITECTURE.md     # Deep-dive system architecture and IPC lifecycle
│   ├── DESIGN_SYSTEM.md    # Obsidian Gold design token specifications
│   ├── PRIVACY.md          # Chrome Web Store privacy & security disclosures
│   └── STORE_LISTING.md    # Web Store copy and promotional asset guidelines
├── releases/                # Chrome Web Store production distribution archives
├── scripts/                 # Build, clean, packager, and audit tooling
│   ├── build.js            # Distribution bundler (minification, comment stripping)
│   ├── clean.js            # Workspace cleaner for dist and temp artifacts
│   ├── css-audit.py        # Color literal auditor
│   ├── css-tokens-check.py # Design token linter (0 missing token guarantee)
│   └── package-webstore.js # Web Store packager and Manifest V3 policy verifier
├── server/                  # Full-stack Next.js 14 + Prisma + Supabase API server
├── tests/                   # VM-sandboxed unit test suite
│   ├── harness.js          # Node.js VM DOM/Chrome mock environment
│   ├── run-tests.js        # 53 comprehensive unit tests
│   └── verify-dist.js      # Distribution syntax and obfuscation verifier
├── icons/                   # High-resolution vector-rendered icons (16, 48, 128)
├── bg_*.js                  # Background Service Worker modules (ES Modules)
├── content_*.js             # In-page content script modules
├── main_world.js            # Main-world protection script
├── options.html / .js       # Enterprise settings dashboard
├── popup.html / .js         # Extension launcher popup
├── tokens.css               # Obsidian Gold design token layer
├── content.css              # In-page floating panel styling
├── manifest.json            # Manifest V3 extension configuration
├── package.json             # Root workspace scripts and dependencies
├── CHANGELOG.md             # Version release notes and changes
├── CONTRIBUTING.md          # Contributor guide and coding standards
├── LICENSE                  # Open source license (MIT)
└── README.md                # Project documentation
```

---

## ✨ Key Features

### 🧠 High-Impact AI Tooling
* **Summarize Selection:** Distills selected text into an executive overview paragraph with concise bullet points.
* **Instant Fact Check:** Cross-examines selected claims against page context, returning a definitive **TRUE**, **FALSE**, or **MIXED** verdict alongside supporting evidence.
* **Define:** Decodes industry jargon, technical terms, and complex nomenclature with high-context definitions.
* **MCQ Solver:** Analyzes highlighted multiple-choice questions and pinpoints the verified correct answer.
* **Ask About Page:** Launches the contextual intelligence panel to ask freeform queries regarding the active tab.

### ⌘ Cortex Command Center
* **Command Palette (`Alt + K`):** Spotlight-style modal overlay to fuzzy-search actions, custom workflows, and recall history.
* **Custom Workflows:** Create and persist prompt templates using `{{selection}}`, `{{page}}`, `{{context}}`, `{{title}}`, `{{host}}`, `{{url}}`, and `{{date}}` tokens. Ships with 7 production presets.
* **Recall Engine:** Searchable local history preserving all past answers, fact-checks, and summaries across page reloads.
* **Copy as Markdown:** Converts current page headings, lists, links, and code blocks into clean Markdown for issues, documentation, or notes.
* **Shadow DOM Isolation:** The Command Center renders inside a closed Shadow DOM, completely immune to host site stylesheet interference.

### 🎨 Design System — "Obsidian Gold"
* **Unified Token Layer:** [tokens.css](tokens.css) governs all four surfaces (Popup, Dashboard, In-Page Panel, and Command Palette) with 159 verified tokens.
* **Obsidian Palette:** Warm near-black backgrounds (`#0B0A07` → `#453B2B`) paired with an identity gold ramp (`#B8860B` → `#F2D071`) and signal-green status indicators (`#059669`).
* **Zero Emojis:** 100% bespoke SVG vector iconography across all surfaces.
* **Glassmorphic Depth:** `backdrop-filter: blur(24px) saturate(1.5)` over an opaque backing guaranteeing 4.5:1 WCAG contrast on any web page.
* **Motion Ladder:** Refined transition ladder (`90ms` press → `150ms` hover → `320ms` enter → `220ms` exit) with automatic collapse when `prefers-reduced-motion: reduce` is detected.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Context | Function |
| :--- | :--- | :--- |
| `Alt + K` / `Ctrl + Shift + K` | Any webpage | Toggle Cortex Command Center |
| `↑` / `↓` | Command Palette | Navigate commands, workflows, and history |
| `↵` (Enter) | Command Palette | Execute highlighted action |
| `Alt + N` | Command Palette | Create new prompt workflow |
| `Alt + S` | Workflow Editor | Save workflow changes |
| `Esc` | Palette / Modal | Dismiss Command Center or exit editor |
| `Alt + A` | Any webpage | Toggle in-page floating assistant panel |
| `Ctrl + Shift + L` | Any webpage | Open assistant panel (rebindable in shortcuts) |

---

## 📦 Installation & Quick Start

Project Cortex is distributed through the **Google Chrome Web Store**.

### Developer Mode (Local Installation):
1. Clone this repository:
   ```bash
   git clone https://github.com/roshhellwett/projectcortex.git
   cd projectcortex
   ```
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** via the toggle switch in the top-right corner.
4. Click **Load unpacked** and select the `projectcortex` project directory.
5. Pin Project Cortex to your toolbar for instant access.

---

## 🧪 Development, Testing & Build Pipeline

The project includes an automated test harness running in a sandboxed Node VM without external dependencies.

```bash
# Run the complete test suite + Chrome Web Store packager
npm test

# Run 53 VM-sandboxed unit tests
npm run unit

# Verify design tokens integrity (0 undefined references)
npm run check:tokens

# Audit color literals across stylesheets
npm run check:audit

# Build distribution bundle in dist/ and zips in releases/
npm run build

# Verify build syntax and obfuscation
npm run verify:dist

# Verify Chrome Web Store packaging policies
npm run verify

# Clean build artifacts, dist, releases, and caches
npm run clean
```

---

## 📚 Technical Documentation

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Deep-dive architecture blueprint, IPC messaging, and security model.
- **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)**: Design system contract, color scales, tokens, and accessibility rules.
- **[docs/PRIVACY.md](docs/PRIVACY.md)**: Privacy policy, data practices, and Chrome Web Store compliance.
- **[docs/STORE_LISTING.md](docs/STORE_LISTING.md)**: Web Store copy, feature lists, and promotional specs.
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Contributor code of conduct, PR guidelines, and testing checklist.
- **[CHANGELOG.md](CHANGELOG.md)**: Complete release history and version changes.

---

## 🔐 Security & Licensing

Project Cortex operates on an enterprise model. Enterprise features utilize hardware-bound JWT licensing validated by `bg_auth.js`.

* **License Inquiries & Enterprise Deployment:** Contact [zenithprojects@icloud.com](mailto:zenithprojects@icloud.com) or reach out via Telegram [@roshhellwett](https://t.me/roshhellwett).
* **Security Disclosures:** Please review [SECURITY.md](SECURITY.md) for responsible disclosure procedures.

---

© 2026 [Zenith Open Source Projects](https://zenithopensourceprojects.vercel.app/). All Rights Reserved.
