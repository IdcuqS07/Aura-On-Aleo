"""
Aleo Service - Integration with Aleo blockchain
"""
import os
import subprocess
import json
from typing import Dict, Optional

class AleoService:
    def __init__(self):
        self.program_path = "aleo-programs/zkbadge"
        self.program_name = "zkbadge.aleo"
        
    def execute_transition(self, transition: str, inputs: list) -> Dict:
        """Execute Aleo program transition"""
        try:
            cmd = ["leo", "run", transition] + inputs
            result = subprocess.run(
                cmd,
                cwd=self.program_path,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout,
                    "transition": transition
                }
            else:
                return {
                    "success": False,
                    "error": result.stderr,
                    "transition": transition
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "transition": transition
            }
    
    def issue_badge(self, recipient: str, badge_type: int, zk_proof_hash: int) -> Dict:
        """Issue ZK badge on Aleo"""
        inputs = [
            recipient,
            f"{badge_type}field",
            f"{zk_proof_hash}field"
        ]
        return self.execute_transition("issue_badge", inputs)
    
    def authorize_minter(self, minter_address: str) -> Dict:
        """Authorize minter on Aleo"""
        return self.execute_transition("authorize_minter", [minter_address])
    
    def verify_badge(self, badge_record: str) -> Dict:
        """Verify badge ownership"""
        return self.execute_transition("verify_badge", [badge_record])
    
    def get_program_status(self) -> Dict:
        """Check if Leo is installed and program is ready"""
        try:
            result = subprocess.run(
                ["leo", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            leo_installed = result.returncode == 0
            
            return {
                "leo_installed": leo_installed,
                "leo_version": result.stdout.strip() if leo_installed else None,
                "program_path": self.program_path,
                "program_name": self.program_name
            }
        except FileNotFoundError:
            return {
                "leo_installed": False,
                "leo_version": None,
                "program_path": self.program_path,
                "program_name": self.program_name,
                "error": "Leo not found. Install from: https://developer.aleo.org/leo/installation"
            }
        except Exception as e:
            return {
                "leo_installed": False,
                "error": str(e)
            }

# Singleton instance
aleo_service = AleoService()
