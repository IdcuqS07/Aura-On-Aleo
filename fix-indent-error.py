#!/usr/bin/env python3
import shutil
from datetime import datetime

SERVER_FILE = 'server.py'

# Backup
backup = f"{SERVER_FILE}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
shutil.copy(SERVER_FILE, backup)
print(f"📦 Backup: {backup}")

# Read
with open(SERVER_FILE, 'r') as f:
    lines = f.readlines()

# Fix line 707 - add pass statement after except
if 707 < len(lines):
    # Check lines around 707
    for i in range(max(0, 705), min(len(lines), 712)):
        print(f"{i+1}: {lines[i].rstrip()}")
    
    # If line 707 is 'except ImportError as e:' and next line is not indented
    if 'except' in lines[706] and (len(lines) > 707):
        next_line = lines[707]
        # If next line is not indented or is another except/try/from
        if not next_line.startswith('    ') or next_line.strip().startswith(('except', 'try', 'from', 'import', 'app.')):
            # Insert pass statement
            indent = '    '  # 4 spaces for except block
            lines.insert(707, f'{indent}pass\n')
            print(f"\n✅ Added 'pass' after line 707")

# Write
with open(SERVER_FILE, 'w') as f:
    f.writelines(lines)

# Verify
import py_compile
try:
    py_compile.compile(SERVER_FILE, doraise=True)
    print("✅ Syntax OK")
except Exception as e:
    print(f"❌ Error: {e}")
    shutil.copy(backup, SERVER_FILE)
