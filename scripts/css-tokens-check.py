"""Reports every var(--x) reference that no stylesheet defines.

A missing custom property does not warn: it silently renders as nothing. This
catches that class of breakage across all four surfaces.
"""

import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FILES = [os.path.join(ROOT, f) for f in ['content.css', 'content_productivity.js', 'popup.html', 'options.html']]
DEFINERS = [os.path.join(ROOT, 'tokens.css')]

defined = set()
for path in DEFINERS:
    src = open(path, encoding='utf-8').read()
    defined |= set(re.findall(r'(--[a-zA-Z0-9-]+)\s*:', src))

print('tokens defined in %s: %d' % (', '.join(os.path.basename(p) for p in DEFINERS), len(defined)))

bad_total = 0
for path in FILES:
    src = open(path, encoding='utf-8').read()
    src = re.sub(r'/\*[\s\S]*?\*/', '', src)
    src = re.sub(r'<!--[\s\S]*?-->', '', src)
    used = set(re.findall(r'var\(\s*(--[a-zA-Z0-9-]+)', src))
    # Variables the file defines for itself are fine too.
    local = set(re.findall(r'(--[a-zA-Z0-9-]+)\s*:', src))
    missing = sorted(used - defined - local)
    print('%-26s uses %3d  defines %3d  MISSING %s' % (
        os.path.basename(path), len(used), len(local), ', '.join(missing) if missing else 'none'))
    bad_total += len(missing)
    if missing:
        for name in missing:
            for m in re.finditer(re.escape('var(' + name), src):
                print('      %s' % src[m.start():m.start() + 60].replace('\n', ' '))

print('total undefined references:', bad_total)
sys.exit(1 if bad_total else 0)
