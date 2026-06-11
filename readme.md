<div align="center">
  <img src="https://raw.githubusercontent.com/roshhellwett/projectcortex/main/icons/logo128.png" alt="Project Cortex Logo" width="120" />
</div>

<h1 align="center">ProjectCortex</h1>

<div align="center">
  <strong>Enterprise-Grade AI Productivity Assistant & Web Platform</strong>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/github/stars/roshhellwett/projectcortex?style=for-the-badge&color=2196F3" alt="Stars" />
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge&color=1976D2" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/SaaS-Ready-success?style=for-the-badge&color=4ade80" alt="SaaS Ready" />
</div>

<br />

ProjectCortex is an enterprise-tier Google Chrome extension and fully integrated SaaS platform. Powered by state-of-the-art LLMs via Groq and OpenRouter, ProjectCortex gives users unprecedented control over web content—allowing them to summarize vast documents, fact-check claims against live contexts, and instantly solve complex MCQs.

Built with a stunning, Apple-inspired Next.js frontend, ProjectCortex is fully equipped with zero-touch JWT license management, enterprise obfuscation, and anti-cheat capabilities.

---

## 🚀 Enterprise Features

### 🧠 Advanced AI Tooling
* **Summarize Page:** Get concise, structured summaries of any webpage or selected text in seconds.
* **Instant Fact Check:** Select a claim on any page and get an AI-powered fact-check with evidence, reasoning, and source context.
* **MCQ Solver:** Highlight any multiple-choice question and instantly reveal the correct answer.
* **Ask About Page:** Type any question related to the current page and get instant answers without losing your workflow.

### 🛡️ Enterprise Architecture & Security
* **Zero-Touch License Management:** Fully automated JWT-based authentication. Admins can generate, extend, or revoke licenses from the central dashboard. Changes sync globally to users within 2.5 minutes without requiring re-logins.
* **Code Obfuscation:** The extension build pipeline automatically flattens, minifies, and encrypts core logic to prevent tampering and reverse engineering.
* **Rate Limit Resilience:** Built-in exponential backoff, jitter, and automatic failovers between Groq and OpenRouter ensure 99.9% uptime for AI queries.
* **Anti-Cheat Stealth:** Advanced observer-blocking prevents examination portals or restrictive enterprise websites from detecting tab visibility changes or tracking selection state.

### 💎 Premium User Experience
* **Glassmorphism UI:** A sleek, non-intrusive floating panel utilizing high-performance CSS backdrop filters.
* **Universal Selection Bubble:** Select text on any webpage to instantly reveal action shortcuts.
* **Right-Click Bypass:** Override draconian copy/paste and right-click blockers on rigid enterprise or educational domains.

---

## 📦 Download & Installation

The latest enterprise build is fully compiled, obfuscated, and ready for deployment.

**[📥 Download ProjectCortex (Latest ZIP)](https://github.com/roshhellwett/projectcortex/archive/refs/heads/main.zip)**

### Installation Guide:
1. Download and extract the ZIP file above.
2. Inside, locate the `dist/` folder (this contains the obfuscated, production-ready extension).
3. Open Chrome and navigate to `chrome://extensions/`.
4. Turn on **Developer mode** using the toggle switch in the top-right corner.
5. Click **Load unpacked** and select the `dist/` folder.
6. Click the extension icon to pin Cortex to your toolbar!

---

## 💻 Tech Stack

* **Extension Core:** Manifest V3, Vanilla JS, Chrome Storage API, Chrome Alarms.
* **Web Platform & Admin Dashboard:** Next.js 14, React, Tailwind / Vanilla CSS.
* **Authentication & Database:** Supabase (PostgreSQL), JSON Web Tokens (JWT).
* **AI Providers:** Groq API (Llama 3), OpenRouter API.
* **Build System:** Node.js, `javascript-obfuscator`.

---

## 🔐 Licensing & Support

ProjectCortex operates on a premium SaaS model. You will need an active License Key to unlock the extension functionality. 

* **To purchase a license or extend your trial:** Please note your **Install ID** from the extension settings panel and contact the administrator.
* **Support & Enterprise Inquiries:** Reach out directly to [zenithprojects@icloud.com](mailto:zenithprojects@icloud.com) or ping [@roshhellwett on Telegram](https://t.me/roshhellwett).

---

<div align="center">
  <br />
  <p><i>© 2026 Zenith Open Source Projects. All Rights Reserved.</i></p>
  <p>Developed by <b>@roshhellwett</b></p>
</div>
