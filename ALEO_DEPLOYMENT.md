# Aleo Contract Deployment Guide

## 📦 zkbadge.aleo Program

Soulbound NFT badge program for Aura Protocol on Aleo blockchain.

## 🔑 Deployment Account

**Address:** `aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke`

**Private Key:** Stored in `aleo-programs/zkbadge/.env` (DO NOT COMMIT)

## 📋 Prerequisites

1. **Leo CLI** installed (v3.0.0+)
   ```bash
   cargo install leo-lang
   ```

2. **Testnet Credits**
   - Visit: https://faucet.aleo.org/
   - Enter address: `aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke`
   - Request credits (usually 10-50 credits)
   - Wait 1-2 minutes for confirmation

3. **Check Balance**
   ```bash
   curl -X POST https://api.explorer.provable.com/v1 \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"getBalance","params":["aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke"]}'
   ```

## 🚀 Deployment Steps

### Step 1: Build Program

```bash
cd aleo-programs/zkbadge
leo build
```

**Expected Output:**
```
✅ Compiled 'zkbadge.aleo' into Aleo instructions
```

### Step 2: Deploy to Testnet

```bash
leo deploy --network testnet
```

**Interactive Prompts:**
- Confirm deployment: `y`
- Broadcast transaction: `y`

**Expected Output:**
```
✅ Successfully deployed 'zkbadge.aleo'
Transaction ID: at1xxxxx...
```

### Step 3: Verify Deployment

Check on Aleo Explorer:
```
https://explorer.aleo.org/program/zkbadge.aleo
```

Or via API:
```bash
curl -X POST https://api.explorer.provable.com/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getProgram","params":["zkbadge.aleo"]}'
```

## 📝 Program Functions

### 1. Initialize
```bash
leo run initialize
```

### 2. Authorize Minter
```bash
leo run authorize_minter <minter_address>
```

### 3. Issue Badge
```bash
leo run issue_badge <recipient> <badge_type> <zk_proof_hash> <issued_at>
```

### 4. Verify Badge
```bash
leo run verify_badge <badge_record>
```

## 🔧 Troubleshooting

### Error: Insufficient Balance
**Solution:** Get more credits from faucet

### Error: Program Already Exists
**Solution:** Program name must be unique. Change in `program.json`

### Error: Network Timeout
**Solution:** Try again or use different endpoint

## 📊 Deployment Costs

Estimated fees:
- Deploy program: ~5-10 credits
- Initialize: ~0.1 credits
- Issue badge: ~0.1 credits per badge

## 🔗 Resources

- **Aleo Faucet:** https://faucet.aleo.org/
- **Aleo Explorer:** https://explorer.aleo.org/
- **Leo Docs:** https://developer.aleo.org/leo/
- **API Endpoint:** https://api.explorer.provable.com/v1

## ✅ Post-Deployment

After successful deployment:

1. **Save Program ID** to backend config
2. **Update frontend** with program address
3. **Test functions** via Leo CLI
4. **Integrate** with Aleo Wallet Adapter

## 🎯 Next Steps

1. Deploy `credit_passport.aleo` program
2. Integrate deployed programs with frontend
3. Test badge issuance via UI
4. Setup backend API for program interactions

---

**Last Updated:** January 2025
**Status:** Ready for Deployment
