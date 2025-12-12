"""
Discord OAuth Service
Handles Discord authentication and data fetching
"""

import os
import requests
from typing import Dict, Optional

DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID', '')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET', '')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI', 'https://www.aurapass.xyz/poh/callback')

def exchange_code_for_token(code: str) -> Optional[str]:
    """Exchange Discord OAuth code for access token"""
    try:
        response = requests.post(
            'https://discord.com/api/oauth2/token',
            data={
                'client_id': DISCORD_CLIENT_ID,
                'client_secret': DISCORD_CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': DISCORD_REDIRECT_URI
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if response.status_code == 200:
            return response.json().get('access_token')
        return None
    except Exception as e:
        print(f"Discord token exchange error: {e}")
        return None

def fetch_discord_data(access_token: str) -> Dict:
    """Fetch Discord user data"""
    try:
        response = requests.get(
            'https://discord.com/api/users/@me',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 200:
            user_data = response.json()
            return {
                'discord_id': user_data.get('id'),
                'username': user_data.get('username'),
                'discriminator': user_data.get('discriminator'),
                'verified': user_data.get('verified', False),
                'avatar': user_data.get('avatar'),
                'created_at': user_data.get('id')  # Snowflake ID contains timestamp
            }
        return {}
    except Exception as e:
        print(f"Discord data fetch error: {e}")
        return {}
