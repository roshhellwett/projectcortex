const fs = require('fs')
const vm = require('vm')
const path = require('path')

const dir = path.resolve(__dirname, '..', 'dist')
if (!fs.existsSync(dir)) {
  console.log('dist/ not found. Run `npm run assets` first, or use `npm run verify:dist`.')
  process.exit(1)
}
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'))
let failures = 0
for (const f of files) {
  const code = fs.readFileSync(path.join(dir, f), 'utf8')
  const isModule = /^\s*(?:import|export)\s/m.test(code)
  try {
    if (isModule) {
      require('child_process').execSync('node --input-type=module --check', { input: code, stdio: 'pipe' })
    } else {
      new vm.Script(code)
    }
    console.log('OK    ' + f)
  } catch (err) {
    failures++
    const msg = String((err.stderr && err.stderr.toString()) || err.message).split('\n')[0]
    console.log('FAIL  ' + f + '  ::  ' + msg)
  }
}

const prod = fs.readFileSync(path.join(dir, 'content_productivity.js'), 'utf8')
const markers = ['/^https?:\\/\\//.test(href)', 'PCX_CSS', 'pcxPageToMarkdown', 'CortexWorkflows', 'pcxOpenPalette']
markers.forEach(m => console.log((prod.includes(m) ? 'KEPT  ' : 'LOST  ') + m))

// Every stylesheet is minified rather than parsed, so check them structurally.
;['tokens.css', 'content.css'].forEach(cssName => {
  const cssPath = path.join(dir, cssName)
  if (!fs.existsSync(cssPath)) {
    failures++
    console.log('FAIL  ' + cssName + ' is missing from the build')
    return
  }
  const cssBuf = fs.readFileSync(cssPath)
  const css = cssBuf.toString('utf8')
  const open = (css.match(/\{/g) || []).length
  const close = (css.match(/\}/g) || []).length
  const checks = [
    ['no NUL bytes', cssBuf.indexOf(0) === -1],
    ['balanced braces', open === close],
    ['reduced-motion rule present', css.includes('prefers-reduced-motion')]
  ]
  if (cssName === 'content.css') {
    checks.push(['drag cursor rule present', css.includes('html.pm-dragging')])
  } else {
    // The token layer must keep a prefixed namespace; a generic name would
    // clobber the host page's own custom properties.
    checks.push(['tokens stay namespaced', !/:root\{--(?!cx-|pm-|pcx-)/.test(css)])
    checks.push(['duration ladder present', css.includes('--cx-dur-fast')])
  }
  checks.forEach(([label, ok]) => {
    if (!ok) failures++
    console.log((ok ? 'OK    ' : 'FAIL  ') + cssName + ': ' + label)
  })
})

// The extension pages must actually link the token layer.
;['popup.html', 'options.html'].forEach(name => {
  const p = path.join(dir, name)
  if (!fs.existsSync(p)) return
  const html = fs.readFileSync(p, 'utf8')
  const ok = html.includes('tokens.css')
  if (!ok) failures++
  console.log((ok ? 'OK    ' : 'FAIL  ') + name + ': links tokens.css')
})

console.log(failures ? failures + ' dist checks failed' : 'ALL DIST JS FILES PARSE')
process.exitCode = failures ? 1 : 0
