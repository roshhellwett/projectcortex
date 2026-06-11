![Stars](https://img.shields.io/github/stars/roshhellwett/projectcortex?style=for-the-badge)
![Chrome](https://img.shields.io/badge/Chrome-Extension-brightgreen?style=for-the-badge)
![Manifest](https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge)

# PROJECT CORTEX

AI-powered productivity assistant for your browser. Summarize pages, fact-check claims, solve MCQs, and ask anything about any webpage — all powered by Groq and OpenRouter.

---

## ✨ Key Features

### 🤖 AI-Powered Actions
* **Summarize Page:** Get concise, structured summaries of any webpage or selected text in seconds.
* **Fact Check:** Select a claim on any page and get an AI-powered fact-check with evidence and reasoning.
* **Correct Answer:** Select a question with multiple-choice options and let AI find the correct answer.
* **Ask About Page:** Type any question related to the current page and get instant answers with context.

### ⚡ Smart Page Integration
* **Context-Aware Panel:** Floating dark-mode panel that follows your workflow without interrupting it.
* **Selection Bubble:** Select text on any page to instantly reveal fact-check, summarize, and answer options.
* **Always Active Window:** Prevents websites from detecting tab visibility changes — useful for music players, timers, and streaming.

### 🛡 Utility Layer
* **Copy & Paste Enabler:** Bypass sites that block right-click, copy, paste, or selection on specific domains.
* **Adaptive Model Selection:** Automatic fallback between Groq and OpenRouter models on rate limits or failures.
* **Retry Smart:** Exponential backoff with model fallback chain ensures reliability even under API strain.

## 🔧 Installation

### From Chrome Web Store
*(Coming soon — install manually for now)*

### Easy Installation (For Everyone)

No coding knowledge required! Just follow these simple steps:

1. Click the green **Code** button at the top of this page and select **Download ZIP**.
2. Extract the downloaded ZIP file to a folder on your computer.
3. Open Chrome and go to `chrome://extensions/` (or click the puzzle piece icon > Manage extensions).
4. Turn on **Developer mode** using the toggle switch in the top-right corner.
5. Click the **Load unpacked** button in the top-left.
6. Select the extracted folder (`projectcortex-main`).
7. Done! Click the puzzle piece icon to pin **Project Cortex** to your toolbar for easy access.

### For Developers (Git)

```bash
git clone https://github.com/roshhellwett/projectcortex.git
```

1. Open `chrome://extensions` in your browser.
2. Enable **Developer mode** (toggle in top-right).
3. Click **Load unpacked** and select the cloned `projectcortex` folder.

## 🚀 Quick Start

1. Click the **Cortex** icon in your toolbar or press the floating FAB on any page.
2. Open **Settings** and enter your API key (Groq or OpenRouter — both offer free tiers).
3. Select text on any page to see the floating action bar.
4. Choose an action: **Summarize**, **Fact Check**, or **Correct Answer**.
5. Alternatively, use the **Ask** bar to type questions about the page.

---

© 2026 [Zenith Open Source Projects](https://zenithopensourceprojects.vercel.app/). All Rights Reserved. Zenith is an Open Source Project Idea by Developer: @roshhellwett
