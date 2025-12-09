"""
AI Risk Oracle - Aura Protocol's Flagship Feature
Predictive risk scoring using machine learning
"""

import numpy as np
from typing import Dict, List
from datetime import datetime

class AIRiskOracle:
    """AI-powered risk assessment oracle"""
    
    def __init__(self):
        # Simple rule-based model (can be replaced with trained ML model)
        self.weights = {
            'poh_score': 0.25,
            'badge_count': 0.15,
            'onchain_activity': 0.15,
            'account_age': 0.10,
            'score_velocity': 0.10,
            'defi_supply': 0.10,
            'defi_protocols': 0.05,
            'defi_health': 0.05,
            'defi_debt': 0.05
        }
    
    def predict_risk_score(self, user_data: Dict, wallet_address: str = None) -> Dict:
        """
        Predict risk score using AI model
        
        Args:
            user_data: {
                'poh_score': 0-100,
                'badge_count': int,
                'onchain_activity': int,
                'credit_score': 0-1000,
                'account_age_days': int,
                'score_history': [scores]
            }
        
        Returns:
            {
                'risk_score': 0-100 (lower = less risky),
                'risk_level': 'low'|'medium'|'high',
                'confidence': 0-1,
                'factors': {...}
            }
        """
        
        # Extract features
        poh_score = user_data.get('poh_score', 0)
        badge_count = user_data.get('badge_count', 0)
        onchain_activity = user_data.get('onchain_activity', 0)
        account_age_days = user_data.get('account_age_days', 0)
        score_history = user_data.get('score_history', [])
        
        # Get REAL DeFi data if wallet provided
        defi_features = {}
        if wallet_address:
            defi_features = self._get_defi_features(wallet_address)
        
        # Feature engineering
        features = self._extract_features(
            poh_score, badge_count, onchain_activity, 
            account_age_days, score_history
        )
        
        # Merge DeFi features
        features.update(defi_features)
        
        # Calculate risk score (inverse of trust score)
        trust_score = self._calculate_trust_score(features)
        risk_score = 100 - trust_score
        
        # Determine risk level
        risk_level = self._get_risk_level(risk_score)
        
        # Calculate confidence
        confidence = self._calculate_confidence(features)
        
        # Identify key risk factors
        risk_factors = self._identify_risk_factors(features, risk_score)
        
        return {
            'risk_score': round(risk_score, 2),
            'risk_level': risk_level,
            'confidence': round(confidence, 2),
            'trust_score': round(trust_score, 2),
            'factors': risk_factors,
            'prediction_time': datetime.utcnow().isoformat()
        }
    
    def _extract_features(self, poh_score, badge_count, onchain_activity, 
                         account_age_days, score_history) -> Dict:
        """Extract and normalize features with REAL DeFi data"""
        
        # Normalize features to 0-1 scale
        poh_normalized = poh_score / 100
        badge_normalized = min(badge_count / 10, 1.0)
        onchain_normalized = min(onchain_activity / 100, 1.0)
        age_normalized = min(account_age_days / 365, 1.0)
        
        # Calculate score velocity
        velocity = 0.5
        if len(score_history) >= 2:
            recent_change = score_history[-1] - score_history[0]
            velocity = 0.5 + (recent_change / 1000)
            velocity = max(0, min(1, velocity))
        
        return {
            'poh_score': poh_normalized,
            'badge_count': badge_normalized,
            'onchain_activity': onchain_normalized,
            'account_age': age_normalized,
            'score_velocity': velocity
        }
    
    def _calculate_trust_score(self, features: Dict) -> float:
        """Calculate trust score using weighted features"""
        
        trust_score = 0
        for feature, value in features.items():
            weight = self.weights.get(feature, 0)
            trust_score += value * weight * 100
        
        return min(100, max(0, trust_score))
    
    def _get_risk_level(self, risk_score: float) -> str:
        """Determine risk level from score"""
        if risk_score <= 30:
            return 'low'
        elif risk_score <= 60:
            return 'medium'
        else:
            return 'high'
    
    def _calculate_confidence(self, features: Dict) -> float:
        """Calculate prediction confidence based on data completeness"""
        
        # More complete data = higher confidence
        data_completeness = sum(1 for v in features.values() if v > 0) / len(features)
        
        # Account age increases confidence
        age_factor = features.get('account_age', 0)
        
        confidence = (data_completeness * 0.7) + (age_factor * 0.3)
        return min(1.0, max(0.3, confidence))
    
    def _identify_risk_factors(self, features: Dict, risk_score: float) -> Dict:
        """Identify key risk factors"""
        
        factors = {}
        
        # PoH Score
        if features['poh_score'] < 0.5:
            factors['low_poh_score'] = {
                'severity': 'high',
                'impact': 35,
                'description': 'Low Proof of Humanity score indicates potential bot/fake account'
            }
        
        # Badge Count
        if features['badge_count'] < 0.3:
            factors['few_badges'] = {
                'severity': 'medium',
                'impact': 20,
                'description': 'Limited verification badges reduce trust'
            }
        
        # On-chain Activity
        if features['onchain_activity'] < 0.2:
            factors['low_activity'] = {
                'severity': 'medium',
                'impact': 25,
                'description': 'Minimal on-chain activity history'
            }
        
        # Account Age
        if features['account_age'] < 0.1:
            factors['new_account'] = {
                'severity': 'low',
                'impact': 10,
                'description': 'Recently created account'
            }
        
        # Score Velocity
        if features['score_velocity'] < 0.3:
            factors['declining_score'] = {
                'severity': 'high',
                'impact': 10,
                'description': 'Credit score trending downward'
            }
        
        return factors
    
    def batch_predict(self, users_data: List[Dict]) -> List[Dict]:
        """Batch prediction for multiple users"""
        return [self.predict_risk_score(user) for user in users_data]
    
    def get_lending_recommendation(self, risk_score: float, loan_amount: float) -> Dict:
        """Get lending recommendation based on risk score"""
        
        if risk_score <= 30:
            # Low risk
            max_loan = loan_amount * 1.5
            interest_rate = 5.0
            collateral_ratio = 110
        elif risk_score <= 60:
            # Medium risk
            max_loan = loan_amount
            interest_rate = 8.0
            collateral_ratio = 130
        else:
            # High risk
            max_loan = loan_amount * 0.5
            interest_rate = 12.0
            collateral_ratio = 150
        
        return {
            'approved': risk_score <= 70,
            'max_loan_amount': max_loan,
            'interest_rate': interest_rate,
            'collateral_ratio': collateral_ratio,
            'recommendation': self._get_recommendation_text(risk_score)
        }
    
    def _get_recommendation_text(self, risk_score: float) -> str:
        """Get human-readable recommendation"""
        if risk_score <= 30:
            return 'Highly trustworthy. Approve with favorable terms.'
        elif risk_score <= 60:
            return 'Moderate risk. Approve with standard terms.'
        else:
            return 'High risk. Require additional collateral or decline.'
    
    def _get_defi_features(self, wallet_address: str) -> Dict:
        """Extract features from REAL DeFi data"""
        try:
            from defi_indexer import fetch_defi_data, get_defi_risk_score
            
            # Fetch real DeFi data
            defi_data = fetch_defi_data(wallet_address)
            summary = defi_data.get('summary', {})
            aave = defi_data.get('protocols', {}).get('aave', {})
            
            # Extract DeFi features
            total_supplied = summary.get('total_supplied_usd', 0)
            total_borrowed = summary.get('total_borrowed_usd', 0)
            protocols_used = summary.get('protocols_used', 0)
            health_factor = aave.get('health_factor', 0)
            
            # Normalize features
            defi_supply_score = min(total_supplied / 10000, 1.0)  # Max $10k
            defi_protocols_score = min(protocols_used / 5, 1.0)  # Max 5 protocols
            
            # Health factor score (1.5+ is good)
            health_score = 0
            if health_factor > 0:
                if health_factor >= 2.0:
                    health_score = 1.0
                elif health_factor >= 1.5:
                    health_score = 0.8
                elif health_factor >= 1.2:
                    health_score = 0.5
                else:
                    health_score = 0.2
            
            # Debt ratio (lower is better)
            debt_ratio = 0
            if total_supplied > 0:
                debt_ratio = total_borrowed / total_supplied
            debt_score = max(0, 1.0 - debt_ratio)
            
            return {
                'defi_supply': defi_supply_score,
                'defi_protocols': defi_protocols_score,
                'defi_health': health_score,
                'defi_debt': debt_score
            }
        except Exception as e:
            print(f"Error fetching DeFi features: {e}")
            return {}

# Singleton instance
ai_oracle = AIRiskOracle()
