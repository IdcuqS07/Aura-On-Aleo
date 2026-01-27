# Multi-Chain Contract Addresses
# Generated from Wave 6 deployment

NETWORKS = {
    "polygon_amoy": {
        "chain_id": 80002,
        "name": "Polygon Amoy",
        "rpc_url": "https://rpc-amoy.polygon.technology",
        "explorer": "https://amoy.polygonscan.com",
        "contracts": {
            "SimpleZKBadge": "0x9e6343BB504Af8a39DB516d61c4Aa0aF36c54678",
            "CreditPassport": "0x1112373c9954B9bbFd91eb21175699b609A1b551",
            "ProofRegistry": "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B"
        }
    },
    "ethereum_sepolia": {
        "chain_id": 11155111,
        "name": "Ethereum Sepolia",
        "rpc_url": "https://ethereum-sepolia-rpc.publicnode.com",
        "explorer": "https://sepolia.etherscan.io",
        "contracts": {
            "SimpleZKBadge": "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B",
            "CreditPassport": "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83",
            "ProofRegistry": "0xb697a2D5F57718c26D55cBC7bE4A5b380465bB0f"
        }
    },
    "bsc_testnet": {
        "chain_id": 97,
        "name": "BSC Testnet",
        "rpc_url": "https://bsc-testnet-rpc.publicnode.com",
        "explorer": "https://testnet.bscscan.com",
        "contracts": {
            "SimpleZKBadge": "0x36C14E63D040D20e7259d7e5f03F43f7710df8b6",
            "CreditPassport": "0x98Ea8DA03Cf68152Eb54608161F2347ee36C9259",
            "ProofRegistry": "0x1Fa89b9EAec5D2AbcfE02548e9873330000C32C7"
        }
    },
    "arbitrum_sepolia": {
        "chain_id": 421614,
        "name": "Arbitrum Sepolia",
        "rpc_url": "https://sepolia-rollup.arbitrum.io/rpc",
        "explorer": "https://sepolia.arbiscan.io",
        "contracts": {
            "SimpleZKBadge": "0x9e6343BB504Af8a39DB516d61c4Aa0aF36c54678",
            "CreditPassport": "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B",
            "ProofRegistry": "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83"
        }
    },
    "optimism_sepolia": {
        "chain_id": 11155420,
        "name": "Optimism Sepolia",
        "rpc_url": "https://sepolia.optimism.io",
        "explorer": "https://sepolia-optimism.etherscan.io",
        "contracts": {
            "SimpleZKBadge": "0x9e6343BB504Af8a39DB516d61c4Aa0aF36c54678",
            "CreditPassport": "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B",
            "ProofRegistry": "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83"
        }
    }
}

# Default network (backward compatibility)
DEFAULT_NETWORK = "polygon_amoy"

def get_network_config(chain_id: int = None, network_name: str = None):
    """Get network configuration by chain ID or network name"""
    if chain_id:
        for net_name, config in NETWORKS.items():
            if config["chain_id"] == chain_id:
                return config
    if network_name:
        return NETWORKS.get(network_name)
    return NETWORKS[DEFAULT_NETWORK]

def get_contract_address(contract_name: str, chain_id: int = None, network_name: str = None):
    """Get contract address for specific network"""
    config = get_network_config(chain_id, network_name)
    return config["contracts"].get(contract_name) if config else None

def get_all_networks():
    """Get list of all supported networks"""
    return [
        {
            "network": key,
            "chain_id": val["chain_id"],
            "name": val["name"],
            "explorer": val["explorer"]
        }
        for key, val in NETWORKS.items()
    ]
