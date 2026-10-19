# Contributing to Project Cortex

Thank you for your interest in contributing to **Project Cortex**! We welcome contributions that maintain our high standards for code quality, design fidelity, security, and performance.

---

## Code of Conduct & Core Directives

1. **Security & Licensing Integrity**: Project Cortex contains enterprise licensing and hardware-bound activation checks (`bg_auth.js`). Under no circumstances are contributions that disable, bypass, or weaken authentication mechanisms accepted.
2. **Design System & Zero-Emoji Policy**: All UI surfaces adhere strictly to the **Obsidian Gold** design system ([docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)). Emojis are strictly prohibited in all UI surfaces, logs, and user-facing code — use clean SVG vector icons only.
3. **Token Encapsulation**: All custom CSS properties must start with `--cx-`, `--pm-`, or `--pcx-`. Never publish generic property names (e.g. `--text`, `--surface`, `--accent`) on `:root` that could collide with host websites.

---

## Local Development Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **Python**: Version 3.8 or higher (for design token linting)
- **Google Chrome**: For testing the extension

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/roshhellwett/projectcortex.git
   cd projectcortex
   ```

2. **Install development dependencies**:
   ```bash
   npm install
   ```

3. **Run the automated test suite**:
   ```bash
   npm test
   ```

4. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** via the top-right toggle.
   - Click **Load unpacked** and select the `projectcortex` project directory.

---

## Verification & QA Commands

Before submitting a Pull Request, all of the following commands must exit with code 0:

```bash
# 1. Run the VM-sandboxed unit tests (53 tests)
npm run unit

# 2. Check CSS token integrity (0 missing tokens)
npm run check:tokens

# 3. Verify Chrome Web Store packaging & security policies
npm run verify

# 4. Verify distribution bundle and syntax
npm run verify:dist
```

---

## Pull Request Guidelines

1. **Branch Naming**: Use descriptive prefixes: `feat/`, `fix/`, `docs/`, `refactor/`.
2. **Commit Messages**: Write concise, imperative commit messages (e.g., `feat: add keyboard shortcut for recall search`).
3. **Tests**: Add unit tests in `tests/run-tests.js` for any new logic, parsers, or workflows.
4. **Documentation**: Update [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) if adding components or changing data flow.
