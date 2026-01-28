/**
 * Aleo API Service
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';

class AleoAPIService {
  /**
   * Get Aleo integration status
   */
  async getStatus() {
    try {
      const response = await axios.get(`${API_URL}/api/aleo/status`);
      return response.data;
    } catch (error) {
      console.error('Aleo status error:', error);
      throw error;
    }
  }

  /**
   * Issue badge via backend
   */
  async issueBadge(recipient, badgeType, zkProofHash) {
    try {
      const response = await axios.post(`${API_URL}/api/aleo/badge/issue`, {
        recipient,
        badge_type: badgeType,
        zk_proof_hash: zkProofHash
      });
      return response.data;
    } catch (error) {
      console.error('Issue badge error:', error);
      throw error;
    }
  }

  /**
   * Authorize minter
   */
  async authorizeMinter(minterAddress) {
    try {
      const response = await axios.post(`${API_URL}/api/aleo/minter/authorize`, {
        minter_address: minterAddress
      });
      return response.data;
    } catch (error) {
      console.error('Authorize minter error:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${API_URL}/api/aleo/health`);
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export default new AleoAPIService();
