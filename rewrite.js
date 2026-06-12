const fs = require('fs');

let html = fs.readFileSync('options.html', 'utf8');

// The new CSS to replace the old CSS
const newCss = `
        :root {
            --bg: #050505;
            --surface: #101010;
            --surface-raised: #181818;
            --border: #262626;
            --border-highlight: #333333;
            --text: #ededed;
            --text-muted: #888888;
            --accent: #ffffff;
            --shadow-inner: inset 0 1px 3px rgba(0, 0, 0, 0.8), inset 0 -1px 0 rgba(255, 255, 255, 0.05);
            --shadow-outer: 0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
            font-size: 14px;
            height: 100vh;
            overflow: hidden;
            padding: 24px;
            display: flex;
            justify-content: center;
        }

        .dashboard-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            max-width: 1800px;
            gap: 24px;
        }

        /* --- LEFT SIDEBAR --- */
        .sidebar-left {
            width: 90px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 32px 0;
            box-shadow: var(--shadow-outer);
            flex-shrink: 0;
        }

        .sidebar-logo {
            margin-bottom: 48px;
        }
        .sidebar-logo img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }

        .nav-menu {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
            align-items: center;
        }

        .nav-item {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .nav-item:hover {
            background: rgba(255,255,255,0.05);
            color: var(--text);
        }

        .nav-item.active {
            background: #fff;
            color: #000;
            box-shadow: 0 4px 12px rgba(255,255,255,0.2);
        }

        .sidebar-bottom {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00d1ff, #3a00ff);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 13px;
            box-shadow: 0 4px 10px rgba(0, 209, 255, 0.3);
            border: 2px solid var(--surface);
        }

        /* --- MAIN CONTENT --- */
        .content-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px 48px;
            overflow-y: auto;
            box-shadow: var(--shadow-outer);
        }

        .content-header {
            margin-bottom: 40px;
        }
        .content-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: var(--accent);
            letter-spacing: -0.02em;
            margin-bottom: 8px;
        }
        .content-header p {
            color: var(--text-muted);
            font-size: 15px;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: start;
        }

        /* --- RIGHT SIDEBAR --- */
        .sidebar-right {
            width: 360px;
            display: flex;
            flex-direction: column;
            background: transparent;
            overflow-y: auto;
            gap: 20px;
            padding-right: 8px;
            flex-shrink: 0;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-highlight); border-radius: 4px; }

        /* --- SHARED COMPONENTS --- */
        .section {
            background: var(--surface-raised);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .section:hover { border-color: #444; transform: translateY(-2px); }

        .section-title {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.15em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
        }

        .field { margin-bottom: 24px; }
        .field:last-child { margin-bottom: 0; }

        label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text);
            letter-spacing: 0.02em;
        }

        select, input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            background: #000;
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            font-size: 14px;
            font-family: inherit;
            outline: none;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-inner);
        }
        select:focus, input[type="text"]:focus, input[type="password"]:focus {
            border-color: #555;
            box-shadow: 0 0 0 1px #555, var(--shadow-inner);
        }

        .hint { font-size: 12px; color: var(--text-muted); margin-top: 8px; line-height: 1.4; }
        .hint a { color: #00D1FF; text-decoration: none; }
        .hint a:hover { text-decoration: underline; }

        .btn {
            background: var(--surface-raised);
            color: var(--text);
            border: 1px solid var(--border);
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: var(--shadow-outer);
        }
        .btn:hover { background: #222; border-color: #444; }
        .btn-save { background: #fff; color: #000; border: none; box-shadow: 0 4px 12px rgba(255,255,255,0.15); }
        .btn-save:hover { background: #e0e0e0; border-color: transparent; }

        .row { display: flex; gap: 16px; align-items: center; }

        .content-footer {
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .eye-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 16px;
            padding: 0 8px;
            transition: color 0.2s;
        }
        .eye-btn:hover { color: var(--accent); }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-wrap input { padding-right: 40px; }
        .input-wrap .eye-btn { position: absolute; right: 8px; }

        .toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            background: #080808;
            border: 1px solid var(--border);
            border-radius: 12px;
            margin-bottom: 16px;
            box-shadow: var(--shadow-inner);
        }
        .toggle-left { display: flex; flex-direction: column; gap: 4px; }
        .toggle-label { font-size: 14px; font-weight: 600; color: var(--text); }
        .toggle-hint { font-size: 12px; color: var(--text-muted); }

        .toggle-switch {
            position: relative;
            width: 48px;
            height: 26px;
            background: #000;
            border: 1px solid var(--border);
            border-radius: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            padding: 2px;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        .toggle-switch.active { background: #1a1a1a; border-color: #444; }
        .toggle-circle {
            width: 20px;
            height: 20px;
            background: #444;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
        .toggle-switch.active .toggle-circle { transform: translateX(22px); background: var(--accent); }

        .info-box {
            background: #080808;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
            font-size: 12px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-top: 16px;
        }
        .info-box strong { color: var(--text); font-weight: 600; }

        @media (max-width: 1024px) {
            .cards-grid { grid-template-columns: 1fr; }
            .dashboard-wrapper { flex-direction: column; height: auto; padding-bottom: 40px; }
            body { overflow: auto; height: auto; }
            .sidebar-left { width: 100%; flex-direction: row; justify-content: space-between; padding: 16px 24px; border-radius: 16px; margin-bottom: 0; }
            .sidebar-logo { margin-bottom: 0; }
            .nav-menu { flex-direction: row; width: auto; gap: 8px; }
            .sidebar-right { width: 100%; flex-direction: row; flex-wrap: wrap; }
            .sidebar-right > * { flex: 1; min-width: 300px; margin-bottom: 0; }
            .content-main { padding: 32px 24px; }
        }
`;

html = html.replace(/:root {[\s\S]*?<\/style>/, newCss + '\n    </style>');

// Extract overlay sections
const overlaysMatch = html.match(/(<div id="loadingOverlay"[\s\S]*?)<div class="container" id="mainContainer"/);
let overlays = overlaysMatch ? overlaysMatch[1] : '';

// Extract sections by regex or manual search
const apiConfigMatch = html.match(/<div class="section">\s*<div class="section-title">API Configuration<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<div class="section">/);
let apiConfig = '';
if(apiConfigMatch) {
    let raw = apiConfigMatch[0];
    apiConfig = raw.substring(0, raw.lastIndexOf('<div class="section">')).trim();
}

const modelMatch = html.match(/<div class="section">\s*<div class="section-title">Model Selection<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
let modelConfig = '';
if(modelMatch) {
    let raw = modelMatch[0];
    modelConfig = raw.substring(0, raw.lastIndexOf('</div>')).trim();
}

const windowMatch = html.match(/<div class="section">\s*<div class="section-title">Window Control<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<div class="section">/);
let windowConfig = '';
if(windowMatch) {
    let raw = windowMatch[0];
    windowConfig = raw.substring(0, raw.lastIndexOf('<div class="section">')).trim();
}

const pageUtilsMatch = html.match(/<div class="section">\s*<div class="section-title">Page Utilities<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
let pageConfig = '';
if(pageUtilsMatch) {
    let raw = pageUtilsMatch[0];
    pageConfig = raw.substring(0, raw.lastIndexOf('</div>')).trim();
}

const updateMatch = html.match(/<div id="updatePanel"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
let updatePanel = updateMatch ? updateMatch[0] : '';

const licenseMatch = html.match(/<div class="section" style="background: linear-gradient[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
let licenseDetails = '';
if(licenseMatch) {
    let raw = licenseMatch[0];
    licenseDetails = raw.substring(0, raw.lastIndexOf('</div>')).trim();
}

const backupMatch = html.match(/<div class="section" style="margin-top: 32px; border-color: #333; background: #0c0c0c;">\s*<div class="section-title" style="color: #fff;">Data Backup & Sync<\/div>[\s\S]*?<\/div>\s*<\/div>/);
let backupDetails = backupMatch ? backupMatch[0] : '';

const toastMatch = html.match(/<div id="toast"[\s\S]*?<\/script>/);
let toastAndScript = toastMatch ? toastMatch[0] : '';

// Build new HTML structure
const newHtmlBody = `
${overlays}

    <div class="dashboard-wrapper" id="mainContainer" style="opacity: 0; transition: opacity 0.4s ease, filter 0.4s ease;">
        <!-- LEFT SIDEBAR -->
        <aside class="sidebar-left">
            <div class="sidebar-logo">
                <img src="icons/logo.png" alt="Logo" onerror="this.style.display='none'; document.getElementById('fallbackLogo2').style.display='block';" />
                <svg id="fallbackLogo2" style="display:none;" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            </div>
            <nav class="nav-menu">
                <div class="nav-item active" title="Settings">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </div>
                <div class="nav-item" title="Help / Support" onclick="window.open('mailto:zenithprojects@icloud.com')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
            </nav>
            <div class="sidebar-bottom">
                <div class="user-avatar" id="optionsCreditsInstallId" style="font-size: 11px;">ZN</div>
                <div style="font-size:10px; color:#555; margin-top:24px; font-weight:600;">&copy;26</div>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="content-main">
            <header class="content-header">
                <h1>Settings & Preferences</h1>
                <p>Configure your intelligence providers and web utilities to personalize your experience.</p>
            </header>

            <div class="cards-grid">
                <div class="grid-column">
                    ${apiConfig}
                    ${modelConfig}
                </div>
                <div class="grid-column">
                    ${windowConfig}
                    ${pageConfig}
                </div>
            </div>

            <div class="content-footer">
                <button class="btn btn-save" id="saveBtn" aria-label="Save your settings">Save Settings</button>
                <button class="btn" id="testBtn" aria-label="Test your API connection">🧪 Test Connection</button>
                <div id="status" style="margin-left: 12px;"></div>
            </div>
        </main>

        <!-- RIGHT SIDEBAR -->
        <aside class="sidebar-right">
            ${updatePanel}
            ${licenseDetails}
            ${backupDetails}
        </aside>
    </div>

    ${toastAndScript}
</body>
</html>
`;

html = html.replace(/<body>[\s\S]*<\/html>/, '<body>\n' + newHtmlBody);
fs.writeFileSync('options.html', html);
console.log('Successfully rewrote options.html');
