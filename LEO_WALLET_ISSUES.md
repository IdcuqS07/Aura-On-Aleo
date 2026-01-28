# Leo Wallet Integration - Known Issues & Solutions

## 🐛 Current Issue

Leo Wallet `connect()` method throws internal error:
```
AleoWalletError: An unknown error occured. Please try again or report it
Cannot read properties of undefined (reading 'toString')
```

This is a **Leo Wallet extension bug**, not our code.

## ✅ Working Solution

Since Leo Wallet's programmatic `connect()` is broken, we use **manual connection workflow**:

### For Users:
1. Install Leo Wallet from https://leo.app/
2. Create/import wallet
3. **Important**: Leo Wallet will auto-inject `window.leoWallet` when page loads
4. Our app auto-detects connection every 2 seconds
5. When Leo Wallet is unlocked and on correct network, connection happens automatically

### Current Implementation:
```javascript
// Auto-detection (works)
useEffect(() => {
  if (window.leoWallet && !isConnected) {
    const checkConnection = () => {
      if (window.leoWallet.publicKey && window.leoWallet.permission) {
        // Auto-connect
        setAddress(window.leoWallet.publicKey);
        setIsConnected(true);
        setWalletType('aleo');
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }
}, [isConnected]);
```

## 🔄 Alternative Approaches Tried

### 1. Direct connect() call
```javascript
await window.leoWallet.connect(); // ❌ Throws error
```

### 2. Promise handling
```javascript
window.leoWallet.connect().then().catch(); // ❌ Still throws
```

### 3. setTimeout isolation
```javascript
setTimeout(() => window.leoWallet.connect(), 0); // ❌ Error still propagates
```

### 4. Try-catch wrapping
```javascript
try {
  await window.leoWallet.connect();
} catch (e) {
  // ❌ Error happens before catch
}
```

## 📋 Leo Wallet API Reference

### Available Properties:
- `publicKey` - User's Aleo address (when connected)
- `permission` - Connection permission status
- `network` - Current network (testnet/mainnet/devnet)
- `appName` - App name

### Available Methods:
- `connect()` - ❌ Broken (throws internal error)
- `disconnect()` - Disconnect wallet
- `signMessage()` - Sign message
- `requestTransaction()` - Request transaction
- `requestExecution()` - Execute program
- `decrypt()` - Decrypt data
- `requestRecords()` - Get records

## 🎯 Recommended User Flow

### Current Working Flow:
1. User visits app
2. Leo Wallet auto-injects if installed
3. If `publicKey` exists → Auto-connect ✅
4. If no `publicKey` → Show message: "Please unlock Leo Wallet"
5. User unlocks Leo Wallet
6. App auto-detects within 2 seconds ✅

### What Doesn't Work:
- Programmatic connection request
- "Connect Wallet" button triggering Leo Wallet popup
- Permission request from dApp

## 🔧 Potential Fixes

### Option 1: Wait for Leo Wallet Fix
Report bug to Leo Wallet team and wait for update.

### Option 2: Use Puzzle Wallet
Puzzle Wallet has working `connect()` method:
```javascript
const accounts = await window.puzzleWallet.connect(); // ✅ Works
```

### Option 3: Manual Connection Only
Accept that Leo Wallet requires manual unlock/connection.

## 📞 Report to Leo Wallet

Bug details to report:
- **Issue**: `connect()` method throws internal error
- **Error**: `Cannot read properties of undefined (reading 'toString')`
- **Impact**: dApps cannot programmatically request connection
- **Workaround**: Users must manually unlock wallet
- **Expected**: `connect()` should trigger popup or return address

## 🚀 Current Status

**Status**: ⚠️ Workaround Implemented
**Solution**: Auto-detection polling
**User Experience**: Requires manual wallet unlock
**Functionality**: ✅ Works once wallet is unlocked

---

**Last Updated**: January 2025
**Leo Wallet Version**: Latest (as of testing)
