"""
The Graph Service - Query subgraph data
"""

import os
import requests
from typing import Dict, List, Optional
from datetime import datetime

# Subgraph URL (update after deployment)
SUBGRAPH_URL = os.getenv(
    "SUBGRAPH_URL",
    "https://api.studio.thegraph.com/query/<YOUR_SUBGRAPH_ID>/aura-protocol/version/latest"
)

class GraphService:
    def __init__(self, url: str = SUBGRAPH_URL):
        self.url = url
    
    def query(self, query: str, variables: Optional[Dict] = None) -> Dict:
        """Execute GraphQL query"""
        try:
            response = requests.post(
                self.url,
                json={"query": query, "variables": variables or {}},
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Graph query error: {e}")
            return {"data": None, "errors": [str(e)]}
    
    def get_user_badges(self, wallet_address: str) -> List[Dict]:
        """Get all badges for a user"""
        query = """
        query GetUserBadges($address: Bytes!) {
          user(id: $address) {
            badges {
              id
              tokenId
              badgeType
              zkProofHash
              issuedAt
              txHash
            }
          }
        }
        """
        result = self.query(query, {"address": wallet_address.lower()})
        user = result.get("data", {}).get("user")
        return user.get("badges", []) if user else []
    
    def get_user_passports(self, wallet_address: str) -> List[Dict]:
        """Get all passports for a user"""
        query = """
        query GetUserPassports($address: Bytes!) {
          user(id: $address) {
            passports {
              id
              tokenId
              creditScore
              pohScore
              badgeCount
              issuedAt
              lastUpdated
              scoreHistory {
                oldScore
                newScore
                timestamp
              }
            }
          }
        }
        """
        result = self.query(query, {"address": wallet_address.lower()})
        user = result.get("data", {}).get("user")
        return user.get("passports", []) if user else []
    
    def get_passport_by_id(self, token_id: int) -> Optional[Dict]:
        """Get passport by token ID"""
        query = """
        query GetPassport($tokenId: String!) {
          passport(id: $tokenId) {
            id
            tokenId
            owner {
              address
            }
            creditScore
            pohScore
            badgeCount
            issuedAt
            lastUpdated
            scoreHistory {
              oldScore
              newScore
              timestamp
              txHash
            }
          }
        }
        """
        result = self.query(query, {"tokenId": str(token_id)})
        return result.get("data", {}).get("passport")
    
    def get_global_stats(self) -> Dict:
        """Get global protocol statistics"""
        query = """
        query GetGlobalStats {
          globalStats(id: "global") {
            totalBadges
            totalPassports
            totalUsers
            totalScoreUpdates
            averageCreditScore
            lastUpdated
          }
        }
        """
        result = self.query(query)
        stats = result.get("data", {}).get("globalStats")
        return stats if stats else {}
    
    def get_daily_stats(self, days: int = 7) -> List[Dict]:
        """Get daily statistics for last N days"""
        query = """
        query GetDailyStats($first: Int!) {
          dailyStats(first: $first, orderBy: date, orderDirection: desc) {
            date
            badgesMinted
            passportsIssued
            scoreUpdates
            newUsers
          }
        }
        """
        result = self.query(query, {"first": days})
        return result.get("data", {}).get("dailyStats", [])
    
    def get_recent_badges(self, limit: int = 10) -> List[Dict]:
        """Get recently minted badges"""
        query = """
        query GetRecentBadges($first: Int!) {
          badges(first: $first, orderBy: issuedAt, orderDirection: desc) {
            id
            tokenId
            owner {
              address
            }
            badgeType
            issuedAt
            txHash
          }
        }
        """
        result = self.query(query, {"first": limit})
        return result.get("data", {}).get("badges", [])
    
    def get_recent_passports(self, limit: int = 10) -> List[Dict]:
        """Get recently issued passports"""
        query = """
        query GetRecentPassports($first: Int!) {
          passports(first: $first, orderBy: issuedAt, orderDirection: desc) {
            id
            tokenId
            owner {
              address
            }
            creditScore
            issuedAt
            txHash
          }
        }
        """
        result = self.query(query, {"first": limit})
        return result.get("data", {}).get("passports", [])
    
    def get_score_history(self, token_id: int) -> List[Dict]:
        """Get credit score history for a passport"""
        query = """
        query GetScoreHistory($tokenId: String!) {
          passport(id: $tokenId) {
            scoreHistory(orderBy: timestamp, orderDirection: asc) {
              oldScore
              newScore
              timestamp
              txHash
            }
          }
        }
        """
        result = self.query(query, {"tokenId": str(token_id)})
        passport = result.get("data", {}).get("passport")
        return passport.get("scoreHistory", []) if passport else []
    
    def search_users(self, min_badges: int = 0, min_passports: int = 0) -> List[Dict]:
        """Search users by criteria"""
        query = """
        query SearchUsers($minBadges: BigInt!, $minPassports: BigInt!) {
          users(
            where: {
              totalBadges_gte: $minBadges,
              totalPassports_gte: $minPassports
            }
            orderBy: lastActivity
            orderDirection: desc
          ) {
            address
            totalBadges
            totalPassports
            createdAt
            lastActivity
          }
        }
        """
        result = self.query(query, {
            "minBadges": str(min_badges),
            "minPassports": str(min_passports)
        })
        return result.get("data", {}).get("users", [])


# Singleton instance
_graph_service = None

def get_graph_service() -> GraphService:
    """Get or create GraphService instance"""
    global _graph_service
    if _graph_service is None:
        _graph_service = GraphService()
    return _graph_service
