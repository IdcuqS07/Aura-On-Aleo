#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('badge_minimal')

print("🚀 Deploying badge_minimal.aleo")
print("=" * 40)

try:
    process = subprocess.Popen(
        ['leo', 'deploy', '--network', 'testnet', '--broadcast'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    
    # Send 'y' for confirmation
    process.stdin.write('y\n')
    process.stdin.flush()
    
    # Read output
    for line in process.stdout:
        print(line, end='')
        sys.stdout.flush()
    
    process.wait()
    
    if process.returncode == 0:
        print("\n✅ Deployment completed")
    else:
        print(f"\n⚠️  Process exited with code {process.returncode}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
