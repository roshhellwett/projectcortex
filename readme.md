<div align="center">
  <img src="https://raw.githubusercontent.com/roshhellwett/projectcortex/main/icons/logo128.png" alt="Project Cortex Logo" width="120" />
</div>

<h1 align="center">ProjectCortex — Intelligence</h1>

<div align="center">
  <strong>AI Web Assistant & Productivity Platform</strong>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/github/stars/roshhellwett/projectcortex?style=for-the-badge&color=2196F3" alt="Stars" />
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge&color=1976D2" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Version-8.0.0-black?style=for-the-badge" alt="Version 8.0.0" />
  <img src="https://img.shields.io/badge/SaaS-Ready-success?style=for-the-badge&color=4ade80" alt="SaaS Ready" />
</div>

<br />

ProjectCortex is a Google Chrome extension and AI SaaS platform. Powered by LLMs via Groq and OpenRouter, it gives users more control over web content — summarize documents, fact-check claims against live context, define complex terms, and solve multiple-choice questions.

Currently at **Version 8.0.0** with JWT license management, build obfuscation, and anti-cheat capabilities.

---

## ✨ Premium Features

### 🧠 High-Impact AI Tooling
* **Summarize Selection:** Get precise, high-impact summaries of any selected text. Distills the core message into a clear overview paragraph with punchy bullet points.
* **Instant Fact Check:** Select a claim on any page and get an AI-powered fact-check. Returns a definitive **TRUE**, **FALSE**, or **MIXED** verdict alongside the exact evidence needed.
* **Define:** Select complex terminology and instantly receive a crystal-clear definition with high-value context.
* **MCQ Solver:** Highlight any multiple-choice question and instantly reveal the correct answer.
* **Ask About Page:** Open the floating intelligence panel and type any question related to the current page to get instant answers without losing your workflow.

### 🎨 Design System
* **Options Dashboard:** Centered, fluid dashboard layout built with CSS flexbox/grid.
* **Glassmorphic Popup & Floating Bubble:** Frosted glass UI elements (`backdrop-filter: blur(32px)`) with spring animations and accent gradients (`#6366f1` to `#a855f7`).

### 🛡️ Enterprise Architecture
* **Hardware-Bound Licensing:** Secure, JWT-based license verification tied to the user's hardware ID (`bg_auth.js`).
* **Production Build Pipeline:** Custom Node.js build scripts (`build.js`) that securely obfuscate API keys, licensing logic, and premium features into a distributed `dist/` package.
* **Anti-Cheat Mechanics:** Deeply integrated anti-cheat listeners (`content_anti_cheat.js`) deployed in isolated browser worlds to protect enterprise functionality.

---

## 📦 Deployment & Installation

The latest enterprise build (`CortexV11.0.0.zip`) is fully compiled, obfuscated, and ready for deployment.

**[📥 Download ProjectCortex (Latest ZIP)](https://drive.google.com/drive/folders/19xYd3LPdYIJ3fpsCbbUkMH5IzndQpS6b)**

### Local Installation Guide:
1. Download and extract `CortexV11.0.0.zip`.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click **Load unpacked** and select your extracted `dist/` or unzipped folder.
5. Click the extension puzzle piece icon to pin Cortex to your toolbar!

---

## 🔐 Licensing & Support

ProjectCortex operates on a premium SaaS model. You will need an active License Key to unlock the extension functionality. 

* **To purchase a license or extend your trial:** Please note your **Install ID** from the extension settings panel and contact the administrator.
* **Support & Enterprise Inquiries:** Reach out directly to [zenithprojects@icloud.com](mailto:zenithprojects@icloud.com) or ping [@roshhellwett on Telegram](https://t.me/roshhellwett).

---

© 2026 [Zenith Open Source Projects](https://zenithopensourceprojects.vercel.app/). All Rights Reserved.
Zenith is an Open Source Project Idea by @roshhellwett

