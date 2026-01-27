from fastapi import APIRouter, HTTPException
from multichain_config import get_all_networks, get_network_config, get_contract_address, NETWORKS

router = APIRouter()

@router.get("/networks")
async def get_supported_networks():
    """Get all supported blockchain networks"""
    return {
        "success": True,
        "networks": get_all_networks(),
        "total": len(NETWORKS)
    }

@router.get("/networks/{chain_id}")
async def get_network_by_chain_id(chain_id: int):
    """Get network configuration by chain ID"""
    config = get_network_config(chain_id=chain_id)
    if not config:
        raise HTTPException(status_code=404, detail="Network not found")
    return {
        "success": True,
        "network": config
    }

@router.get("/contracts/{contract_name}")
async def get_contract_addresses(contract_name: str):
    """Get contract addresses across all networks"""
    addresses = {}
    for network_key, config in NETWORKS.items():
        if contract_name in config["contracts"]:
            addresses[network_key] = {
                "address": config["contracts"][contract_name],
                "chain_id": config["chain_id"],
                "explorer": f"{config['explorer']}/address/{config['contracts'][contract_name]}"
            }
    
    if not addresses:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    return {
        "success": True,
        "contract": contract_name,
        "addresses": addresses
    }

@router.get("/contracts/{contract_name}/{chain_id}")
async def get_contract_address_by_chain(contract_name: str, chain_id: int):
    """Get specific contract address on specific chain"""
    address = get_contract_address(contract_name, chain_id=chain_id)
    if not address:
        raise HTTPException(status_code=404, detail="Contract not found on this network")
    
    config = get_network_config(chain_id=chain_id)
    return {
        "success": True,
        "contract": contract_name,
        "address": address,
        "network": config["name"],
        "chain_id": chain_id,
        "explorer": f"{config['explorer']}/address/{address}"
    }
