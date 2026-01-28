# Leo Wallet Connection Debug Guide

## 🔧 Perbaikan yang Dilakukan

### 1. WalletContext.js
- ✅ Menambahkan handling untuk berbagai format response Leo Wallet
- ✅ Menambahkan detailed console logging
- ✅ Memisahkan error handling untuk Leo Wallet dan Puzzle Wallet
- ✅ Menambahkan try-catch untuk setiap wallet type

### 2. aleoWallet.js
- ✅ Menambahkan console logging untuk debugging
- ✅ Handle response format: `{address: "..."}` dan `["address"]`
- ✅ Improved error messages

### 3. WalletSelector.js
- ✅ Menambahkan error display dengan AlertCircle icon
- ✅ Menambahkan link install Leo Wallet
- ✅ Update nama dari "Aleo Wallet" ke "Leo Wallet"
- ✅ Update icon dan description

## 🧪 Cara Testing

### Step 1: Install Leo Wallet
1. Buka https://leo.app/
2. Install Leo Wallet extension di browser
3. Create atau import wallet
4. Pastikan connected ke Aleo Testnet

### Step 2: Test Connection
1. Jalankan frontend: `cd frontend && yarn start`
2. Buka browser console (F12)
3. Klik "Connect Wallet"
4. Pilih "Leo Wallet"
5. Perhatikan console logs:

```
🔗 Attempting to connect Aleo wallet...
✅ Leo Wallet detected
Leo Wallet response: {address: "aleo1..."}
✅ Connected to Leo Wallet: aleo1...
```

### Step 3: Check Console Logs

**Jika Berhasil:**
```
✅ Leo Wallet detected
✅ Connected to Leo Wallet: aleo1xxxxx
```

**Jika Gagal - Wallet Tidak Terinstall:**
```
❌ No Aleo wallet extension found
```

**Jika Gagal - User Reject:**
```
❌ Leo Wallet error: User rejected the request
```

**Jika Gagal - Invalid Response:**
```
❌ Invalid response format: undefined
```

## 🐛 Troubleshooting

### Problem 1: "Please install Leo Wallet"
**Solution:**
- Install Leo Wallet dari https://leo.app/
- Refresh halaman setelah install
- Pastikan extension enabled

### Problem 2: Connection popup tidak muncul
**Solution:**
- Check browser console untuk error
- Pastikan Leo Wallet unlocked
- Coba disconnect dan connect ulang
- Clear browser cache

### Problem 3: "Invalid wallet response"
**Solution:**
- Leo Wallet mungkin menggunakan API berbeda
- Check console log untuk melihat response format
- Update code sesuai format response

### Problem 4: Address tidak muncul di UI
**Solution:**
- Check WalletContext state di React DevTools
- Pastikan `setAddress()` dipanggil
- Check `isConnected` state

## 📝 Leo Wallet API Reference

### Standard API (Expected)
```javascript
// Connect
const response = await window.leoWallet.connect();
// Response format 1: {address: "aleo1..."}
// Response format 2: ["aleo1..."]

// Disconnect
await window.leoWallet.disconnect();

// Get accounts
const accounts = await window.leoWallet.getAccounts();

// Sign transaction
const result = await window.leoWallet.requestTransaction({
  program: "program_name.aleo",
  function: "function_name",
  inputs: ["input1", "input2"],
  fee: 1000000
});
```

## 🔍 Debug Checklist

- [ ] Leo Wallet extension installed?
- [ ] Leo Wallet unlocked?
- [ ] Connected to Aleo Testnet?
- [ ] Browser console shows logs?
- [ ] `window.leoWallet` exists?
- [ ] No CORS errors?
- [ ] React app running on correct port?

## 📊 Expected Behavior

1. User clicks "Connect Wallet"
2. Modal opens with Leo Wallet option
3. User clicks "Leo Wallet"
4. Leo Wallet popup appears
5. User approves connection
6. Address appears in navigation bar
7. Wallet type shows "(Aleo)"

## 🚀 Next Steps

Jika masih tidak berfungsi:
1. Check Leo Wallet documentation
2. Test dengan Puzzle Wallet sebagai alternatif
3. Contact Leo Wallet support
4. Consider using Aleo SDK directly

## 📞 Support

- Leo Wallet: https://leo.app/
- Aleo Discord: https://discord.gg/aleo
- Aleo Docs: https://developer.aleo.org/
