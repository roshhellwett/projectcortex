import collections
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
target = sys.argv[1] if len(sys.argv) > 1 else 'content.css'
path = target if os.path.isabs(target) else os.path.join(ROOT, target)

if not os.path.exists(path):
    print(f"File not found: {path}")
    sys.exit(1)

s = open(path, encoding='utf-8').read()

hexes = collections.Counter(m.group(0).lower() for m in re.finditer(r'#[0-9a-fA-F]{3,8}\b', s))
rgbas = collections.Counter(
    re.sub(r'\s+', '', m.group(0)).lower()
    for m in re.finditer(r'rgba?\([^)]*\)', s)
)

print('=== %s ===' % os.path.basename(path))
print('--- hex (%d distinct) ---' % len(hexes))
for k, v in hexes.most_common():
    print('%4d  %s' % (v, k))
print('--- rgba (%d distinct) ---' % len(rgbas))
for k, v in rgbas.most_common():
    print('%4d  %s' % (v, k))
