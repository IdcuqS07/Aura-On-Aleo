#!/usr/bin/env python3
import pty
import os
import sys
import select

os.chdir('badge_minimal')

print("🚀 Deploying badge_minimal.aleo with PTY")
print("=" * 50)

def deploy():
    master, slave = pty.openpty()
    
    pid = os.fork()
    if pid == 0:
        # Child process
        os.close(master)
        os.dup2(slave, 0)  # stdin
        os.dup2(slave, 1)  # stdout
        os.dup2(slave, 2)  # stderr
        os.close(slave)
        
        os.execvp('leo', ['leo', 'deploy', '--network', 'testnet', '--broadcast'])
    else:
        # Parent process
        os.close(slave)
        
        confirmed = False
        output = []
        
        while True:
            try:
                r, _, _ = select.select([master], [], [], 1)
                if master in r:
                    data = os.read(master, 1024).decode('utf-8', errors='ignore')
                    if not data:
                        break
                    
                    print(data, end='', flush=True)
                    output.append(data)
                    
                    # Auto-confirm
                    if 'continue?' in data.lower() and not confirmed:
                        os.write(master, b'y\n')
                        confirmed = True
                        print("\n[Auto-confirmed: y]", flush=True)
                        
            except OSError:
                break
        
        os.close(master)
        _, status = os.waitpid(pid, 0)
        
        full_output = ''.join(output)
        
        if 'Successfully' in full_output or 'deployed' in full_output:
            print("\n\n✅ DEPLOYMENT SUCCESS!")
            return 0
        elif 'Error' in full_output:
            print("\n\n❌ DEPLOYMENT FAILED")
            return 1
        else:
            print("\n\n⚠️  Deployment status unclear")
            return status >> 8

if __name__ == '__main__':
    sys.exit(deploy())
