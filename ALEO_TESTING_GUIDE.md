# Aleo Integration Testing Guide

## Prerequisites

### 1. Install Leo Compiler

```bash
# Install Leo
curl -L https://raw.githubusercontent.com/AleoHQ/leo/mainnet/install.sh | bash

# Add to PATH
export PATH="$HOME/.aleo/bin:$PATH"

# Verify
leo --version
```

### 2. Install Aleo Wallet

Choose one:
- **Leo Wallet**: https://leo.app/
- **Puzzle Wallet**: https://puzzle.online/

## Testing Steps

### Step 1: Build Programs

```bash
# Build ZK Badge
cd aleo-programs/zkbadge
leo build

# Build Credit Passport
cd ../credit_passport
leo build
```

### Step 2: Test Backend API

```bash
# Start backend
cd backend
python server.py

# Test Aleo status
curl http://localhost:9000/api/aleo/status

# Expected response:
{
  "leo_installed": true,
  "leo_version": "...",
  "program_path": "aleo-programs/zkbadge",
  "program_name": "zkbadge.aleo"
}
```

### Step 3: Test Frontend

```bash
# Start frontend
cd frontend
yarn start

# Navigate to:
http://localhost:3000/aleo
```

### Step 4: Deploy to Testnet (Optional)

```bash
# Deploy ZK Badge
cd aleo-programs/zkbadge
leo deploy --network testnet3

# Deploy Credit Passport
cd ../credit_passport
leo deploy --network testnet3
```

## API Testing

### Check Status
```bash
curl http://localhost:9000/api/aleo/status
```

### Issue Badge
```bash
curl -X POST http://localhost:9000/api/aleo/badge/issue \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc",
    "badge_type": 1,
    "zk_proof_hash": 123456789
  }'
```

### Health Check
```bash
curl http://localhost:9000/api/aleo/health
```

## Frontend Testing

1. **Connect Wallet**
   - Click "Connect Aleo Wallet"
   - Approve connection in wallet extension
   - Verify address displayed

2. **Issue Badge**
   - Click "Issue ZK Badge"
   - Approve transaction in wallet
   - Wait for confirmation

3. **Check Status**
   - Verify Leo installation status
   - Check program information

## Troubleshooting

### Leo Not Found
```bash
# Check installation
which leo

# Reinstall if needed
curl -L https://raw.githubusercontent.com/AleoHQ/leo/mainnet/install.sh | bash
```

### Build Errors
```bash
# Clean and rebuild
leo clean
leo build
```

### Wallet Connection Failed
- Ensure wallet extension is installed
- Check network is set to testnet3
- Refresh page and try again

## Expected Results

✅ Leo compiler installed
✅ Programs build successfully
✅ Backend API responds
✅ Wallet connects
✅ Transactions execute

## Next Steps

1. Deploy programs to testnet
2. Test with real wallet
3. Integrate with existing features
4. Add UI components
5. Production deployment

## Resources

- [Leo Documentation](https://developer.aleo.org/leo/)
- [Aleo SDK](https://developer.aleo.org/sdk/)
- [Leo Wallet](https://leo.app/)
- [Puzzle Wallet](https://puzzle.online/)
