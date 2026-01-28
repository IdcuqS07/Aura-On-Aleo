# Aleo Integration - ZK Badge

## Setup Aleo Environment

### 1. Install Leo Compiler

```bash
# Install Leo
curl -L https://raw.githubusercontent.com/AleoHQ/leo/testnet3/install.sh | bash

# Verify installation
leo --version
```

### 2. Install SnarkVM

```bash
# Install SnarkVM
curl -L https://raw.githubusercontent.com/AleoHQ/snarkVM/testnet3/install.sh | bash

# Verify installation
snarkvm --version
```

## Project Structure

```
aleo-programs/
└── zkbadge/
    ├── program.json          # Program metadata
    ├── src/
    │   └── main.leo         # Main program (ported from SimpleZKBadge.sol)
    └── README.md            # This file
```

## Key Differences: Solidity vs Leo

| Feature | Solidity (EVM) | Leo (Aleo) |
|---------|---------------|------------|
| NFT Model | ERC721 (public) | Record (private by default) |
| Storage | Public mappings | Private records + public mappings |
| Transfers | Prevented via hooks | Soulbound by design (records) |
| Authorization | modifier + mapping | Finalize + mapping |
| Events | emit Event | Implicit in finalize |

## Program Functions

### Admin Functions
- `initialize()` - Setup program, authorize admin
- `authorize_minter(address)` - Add authorized minter
- `revoke_minter(address)` - Remove minter authorization

### Core Functions
- `issue_badge(recipient, badge_type, zk_proof_hash)` - Mint soulbound badge
- `verify_badge(badge)` - Verify badge ownership
- `get_total_supply()` - Get total badges issued

## Build & Deploy

```bash
cd aleo-programs/zkbadge

# Build program
leo build

# Run tests
leo test

# Deploy to testnet
leo deploy --network testnet3
```

## Usage Example

```bash
# Initialize program
leo run initialize

# Authorize minter
leo run authorize_minter aleo1xxx...

# Issue badge
leo run issue_badge aleo1recipient... 1field 2field
```

## Next Steps

1. ✅ Port SimpleZKBadge.sol → main.leo
2. ⏳ Install Leo compiler
3. ⏳ Build and test program
4. ⏳ Deploy to Aleo testnet
5. ⏳ Integrate with backend API
6. ⏳ Update frontend for Aleo wallet support

## Resources

- [Leo Documentation](https://developer.aleo.org/leo/)
- [Aleo SDK](https://developer.aleo.org/sdk/)
- [Leo Examples](https://github.com/AleoHQ/leo/tree/testnet3/examples)
