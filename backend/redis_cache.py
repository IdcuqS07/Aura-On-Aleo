"""
Redis Cache Service
Fast caching for DeFi data and API responses
"""

import os
import json
import redis
from typing import Optional, Any
from datetime import timedelta

class RedisCache:
    def __init__(self):
        self.host = os.getenv("REDIS_HOST", "localhost")
        self.port = int(os.getenv("REDIS_PORT", "6379"))
        self.db = int(os.getenv("REDIS_DB", "0"))
        
        try:
            self.client = redis.Redis(
                host=self.host,
                port=self.port,
                db=self.db,
                decode_responses=True
            )
            self.client.ping()
            self.enabled = True
        except:
            self.client = None
            self.enabled = False
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.enabled:
            return None
        
        try:
            value = self.client.get(key)
            return json.loads(value) if value else None
        except:
            return None
    
    def set(self, key: str, value: Any, ttl: int = 300):
        """Set value in cache with TTL (seconds)"""
        if not self.enabled:
            return False
        
        try:
            self.client.setex(key, ttl, json.dumps(value))
            return True
        except:
            return False
    
    def delete(self, key: str):
        """Delete key from cache"""
        if not self.enabled:
            return False
        
        try:
            self.client.delete(key)
            return True
        except:
            return False
    
    def clear_pattern(self, pattern: str):
        """Clear all keys matching pattern"""
        if not self.enabled:
            return False
        
        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
            return True
        except:
            return False


_cache = None

def get_cache() -> RedisCache:
    """Get or create cache instance"""
    global _cache
    if _cache is None:
        _cache = RedisCache()
    return _cache
