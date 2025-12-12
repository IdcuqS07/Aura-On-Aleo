#!/bin/bash

# Fix duplicate DeFi imports on VPS
echo "🔧 Fixing duplicate DeFi imports on VPS..."

# SSH into VPS and fix
ssh root@159.65.134.137 << 'ENDSSH'
cd /root/Aura-Protocol-V.1-main/backend

# Backup current file
cp server.py server.py.broken

# Use Python to remove duplicate DeFi imports
python3 << 'ENDPYTHON'
with open('server.py', 'r') as f:
    lines = f.readlines()

# Find all lines with "from defi_routes"
defi_import_lines = []
for i, line in enumerate(lines):
    if 'from defi_routes import router as defi_router' in line:
        defi_import_lines.append(i)

print(f"Found {len(defi_import_lines)} DeFi imports at lines: {defi_import_lines}")

# Keep only the first occurrence, remove others
if len(defi_import_lines) > 1:
    # Remove duplicates (in reverse order to maintain line numbers)
    for line_num in reversed(defi_import_lines[1:]):
        # Remove the import line and the next 2 lines (include_router and logger)
        del lines[line_num:line_num+3]
    
    # Write back
    with open('server.py', 'w') as f:
        f.writelines(lines)
    
    print(f"✅ Removed {len(defi_import_lines)-1} duplicate imports")
else:
    print("✅ No duplicates found")

ENDPYTHON

# Verify syntax
echo "Checking Python syntax..."
python3 -m py_compile server.py
if [ $? -eq 0 ]; then
    echo "✅ Syntax OK"
    
    # Restart backend
    echo "Restarting backend..."
    systemctl restart aura-backend
    sleep 3
    
    # Check status
    systemctl status aura-backend --no-pager -l
    
    # Test DeFi endpoint
    echo ""
    echo "Testing DeFi endpoint..."
    curl -s http://localhost:9000/api/defi/health | jq .
else
    echo "❌ Syntax error, restoring backup"
    cp server.py.broken server.py
fi

ENDSSH

echo "✅ Done!"
