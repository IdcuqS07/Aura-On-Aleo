#!/usr/bin/env python3
"""
Fix duplicate DeFi route imports in server.py
Run this on VPS: python3 fix_duplicate_imports.py
"""

import os
import shutil
from datetime import datetime

SERVER_FILE = 'server.py'

def fix_duplicates():
    if not os.path.exists(SERVER_FILE):
        print(f"❌ {SERVER_FILE} not found")
        return False
    
    # Backup
    backup_name = f"{SERVER_FILE}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    shutil.copy(SERVER_FILE, backup_name)
    print(f"📦 Backup created: {backup_name}")
    
    # Read file
    with open(SERVER_FILE, 'r') as f:
        lines = f.readlines()
    
    # Find all DeFi import blocks
    defi_blocks = []
    i = 0
    while i < len(lines):
        if 'from defi_routes import router as defi_router' in lines[i]:
            # Found import, check next 2 lines for include_router and logger
            block_start = i
            block_end = i + 1
            
            # Check if next lines are part of the block
            if i + 1 < len(lines) and 'app.include_router(defi_router' in lines[i + 1]:
                block_end = i + 2
            if i + 2 < len(lines) and 'logger.info' in lines[i + 2] and 'DeFi routes' in lines[i + 2]:
                block_end = i + 3
            
            defi_blocks.append((block_start, block_end))
            i = block_end
        else:
            i += 1
    
    print(f"Found {len(defi_blocks)} DeFi import blocks:")
    for idx, (start, end) in enumerate(defi_blocks):
        print(f"  Block {idx + 1}: lines {start + 1}-{end}")
        for line_num in range(start, end):
            print(f"    {line_num + 1}: {lines[line_num].rstrip()}")
    
    if len(defi_blocks) <= 1:
        print("✅ No duplicates found")
        return True
    
    # Remove duplicate blocks (keep first, remove rest)
    print(f"\n🔧 Removing {len(defi_blocks) - 1} duplicate blocks...")
    
    # Remove in reverse order to maintain line numbers
    for block_start, block_end in reversed(defi_blocks[1:]):
        del lines[block_start:block_end]
        print(f"  ✓ Removed lines {block_start + 1}-{block_end}")
    
    # Write back
    with open(SERVER_FILE, 'w') as f:
        f.writelines(lines)
    
    print(f"\n✅ Fixed! Removed {len(defi_blocks) - 1} duplicate blocks")
    print(f"📝 Original backed up to: {backup_name}")
    
    # Verify syntax
    print("\n🔍 Verifying Python syntax...")
    import py_compile
    try:
        py_compile.compile(SERVER_FILE, doraise=True)
        print("✅ Syntax OK")
        return True
    except py_compile.PyCompileError as e:
        print(f"❌ Syntax error: {e}")
        print(f"Restoring from backup...")
        shutil.copy(backup_name, SERVER_FILE)
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("Fix Duplicate DeFi Imports")
    print("=" * 60)
    
    if fix_duplicates():
        print("\n" + "=" * 60)
        print("✅ SUCCESS - Now restart the backend:")
        print("   systemctl restart aura-backend")
        print("   systemctl status aura-backend")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ FAILED - Check the error above")
        print("=" * 60)
