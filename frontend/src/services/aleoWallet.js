/**
 * Aleo Wallet Integration
 * Support for Leo Wallet and Puzzle Wallet
 */

class AleoWalletService {
  constructor() {
    this.wallet = null;
    this.account = null;
    this.network = 'testnet3';
  }

  /**
   * Check if Aleo wallet is installed
   */
  isWalletInstalled() {
    return typeof window.leoWallet !== 'undefined' || 
           typeof window.puzzleWallet !== 'undefined';
  }

  /**
   * Connect to Aleo wallet
   */
  async connect() {
    try {
      console.log('🔍 Checking for Aleo wallets...');
      console.log('Leo Wallet:', typeof window.leoWallet);
      console.log('Puzzle Wallet:', typeof window.puzzleWallet);
      
      // Try Leo Wallet first
      if (window.leoWallet) {
        console.log('✅ Leo Wallet detected, attempting connection...');
        this.wallet = window.leoWallet;
        
        const response = await this.wallet.connect();
        console.log('Leo Wallet response:', response);
        
        // Handle different response formats
        if (response && response.address) {
          this.account = response.address;
          console.log('✅ Connected to Leo Wallet:', this.account);
          return { success: true, address: this.account, wallet: 'leo' };
        } else if (Array.isArray(response) && response.length > 0) {
          this.account = response[0];
          console.log('✅ Connected to Leo Wallet:', this.account);
          return { success: true, address: this.account, wallet: 'leo' };
        } else {
          console.error('❌ Invalid Leo Wallet response format');
          return { success: false, error: 'Invalid wallet response' };
        }
      }
      
      // Try Puzzle Wallet
      if (window.puzzleWallet) {
        console.log('✅ Puzzle Wallet detected, attempting connection...');
        this.wallet = window.puzzleWallet;
        const accounts = await this.wallet.connect();
        console.log('Puzzle Wallet response:', accounts);
        
        if (accounts && accounts.length > 0) {
          this.account = accounts[0];
          console.log('✅ Connected to Puzzle Wallet:', this.account);
          return { success: true, address: this.account, wallet: 'puzzle' };
        }
      }

      console.error('❌ No Aleo wallet found');
      return { success: false, error: 'No Aleo wallet found. Please install Leo Wallet or Puzzle Wallet.' };
    } catch (error) {
      console.error('❌ Wallet connection error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
      this.account = null;
    }
  }

  /**
   * Get current account
   */
  getAccount() {
    return this.account;
  }

  /**
   * Execute program transition
   */
  async executeTransition(programId, functionName, inputs) {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await this.wallet.requestTransaction({
        program: programId,
        function: functionName,
        inputs: inputs,
        fee: 1000000, // 0.001 Aleo credits
      });

      return { success: true, transactionId: result };
    } catch (error) {
      console.error('Transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Issue badge on Aleo
   */
  async issueBadge(recipient, badgeType, zkProofHash) {
    return this.executeTransition(
      'zkbadge.aleo',
      'issue_badge',
      [recipient, `${badgeType}field`, `${zkProofHash}field`]
    );
  }

  /**
   * Verify badge
   */
  async verifyBadge(badgeRecord) {
    return this.executeTransition(
      'zkbadge.aleo',
      'verify_badge',
      [badgeRecord]
    );
  }

  /**
   * Get wallet balance
   */
  async getBalance() {
    if (!this.wallet || !this.account) {
      return null;
    }

    try {
      const balance = await this.wallet.getBalance(this.account);
      return balance;
    } catch (error) {
      console.error('Balance error:', error);
      return null;
    }
  }
}

export default new AleoWalletService();
