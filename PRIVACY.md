# Privacy Policy for Project Cortex

**Last Updated: September 16, 2026**

Zenith Open Source Projects ("we", "our", or "us") operates the **Project Cortex** Chrome Extension. This Privacy Policy informs users of our policies regarding the collection, use, and disclosure of data when using our extension.

---

## 1. Data Collection and Usage

Project Cortex is designed with a privacy-first, local-first architecture:

* **Website Content**: When you explicitly activate an AI action (such as summarizing a page, solving an exam question, fact-checking a claim, or asking a question), the selected text or page excerpt is sent directly to your configured AI inference provider (Groq or OpenRouter) via secure HTTPS requests to generate the response. We do not store, log, or sell your text snippets on any intermediate tracking servers.
* **Authentication Information & API Keys**: Your Groq and OpenRouter API keys, model preferences, and activation credentials are stored exclusively in your local browser storage (`chrome.storage.sync` / `chrome.storage.local`). They are never transmitted to third parties other than the direct AI provider you have selected to execute queries.
* **No Analytics or Telemetry**: Project Cortex does not inject tracking pixels, third-party analytics (like Google Analytics), or behavioral telemetry scripts.
* **No User Activity Tracking**: We do not monitor your keystrokes, browsing history, clicks, or mouse movements outside of direct user interaction with the extension interface (e.g. clicking the Cortex floating bubble or pressing `Ctrl+Shift+L`).

---

## 2. Third-Party Service Providers

When executing AI requests, your queries are processed by the provider you have configured in Settings:
* **Groq Inc.** ([Privacy Policy](https://groq.com/privacy-policy/))
* **OpenRouter** ([Privacy Policy](https://openrouter.ai/privacy))

Queries are governed by the respective privacy policies of these API providers.

---

## 3. Data Retention and Security

* **Local Storage**: All extension settings and cached preferences remain on your device and are cleared automatically if you uninstall the extension.
* **Encryption in Transit**: All communications with AI APIs and authentication servers occur over TLS/HTTPS encrypted connections.

---

## 4. Compliance with Chrome Web Store Policies

Project Cortex strictly complies with the **Google Chrome Web Store Developer Program Policies**, including the Limited Use requirements:
* We do not sell or transfer user data to third parties.
* We do not use user data for advertising, creditworthiness, or lending purposes.
* We do not use or execute remote code (Manifest V3 compliant).

---

## 5. Contact Us

If you have any questions or suggestions regarding this Privacy Policy, please contact us:
* **Email**: [zenithprojects@icloud.com](mailto:zenithprojects@icloud.com)
* **GitHub**: [https://github.com/roshhellwett/projectcortex](https://github.com/roshhellwett/projectcortex)
