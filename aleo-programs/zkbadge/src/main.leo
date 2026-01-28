// Aura ZK Badge - Soulbound NFT on Aleo
// Port from SimpleZKBadge.sol

program zkbadge.aleo {
    // Badge record (private NFT)
    record Badge {
        owner: address,
        badge_id: u64,
        badge_type: field,
        zk_proof_hash: field,
        issued_at: u64,
    }

    // Public state mappings
    mapping total_supply: u8 => u64;
    mapping authorized_minters: address => bool;
    mapping badge_owners: u64 => address;

    // Initialize program (only once)
    async transition initialize() -> Future {
        return finalize_initialize(self.caller);
    }

    async function finalize_initialize(admin: address) {
        // Set initial supply to 0
        Mapping::set(total_supply, 0u8, 0u64);
        // Authorize admin as minter
        Mapping::set(authorized_minters, admin, true);
    }

    // Authorize minter (admin only)
    async transition authorize_minter(minter: address) -> Future {
        return finalize_authorize_minter(self.caller, minter);
    }

    async function finalize_authorize_minter(caller: address, minter: address) {
        // Check if caller is authorized
        let is_authorized: bool = Mapping::get_or_use(authorized_minters, caller, false);
        assert(is_authorized);
        
        // Authorize new minter
        Mapping::set(authorized_minters, minter, true);
    }

    // Issue badge (authorized minters only)
    async transition issue_badge(
        recipient: address,
        badge_type: field,
        zk_proof_hash: field,
        issued_at: u64
    ) -> (Badge, Future) {
        let badge_id: u64 = 0u64;
        
        let new_badge: Badge = Badge {
            owner: recipient,
            badge_id: badge_id,
            badge_type: badge_type,
            zk_proof_hash: zk_proof_hash,
            issued_at: issued_at,
        };

        return (new_badge, finalize_issue_badge(self.caller, recipient));
    }

    async function finalize_issue_badge(minter: address, recipient: address) {
        // Check authorization
        let is_authorized: bool = Mapping::get_or_use(authorized_minters, minter, false);
        assert(is_authorized);

        // Increment supply
        let current_supply: u64 = Mapping::get_or_use(total_supply, 0u8, 0u64);
        let new_supply: u64 = current_supply + 1u64;
        Mapping::set(total_supply, 0u8, new_supply);

        // Record badge owner
        Mapping::set(badge_owners, new_supply, recipient);
    }

    // Verify badge ownership (public)
    transition verify_badge(badge: Badge) -> bool {
        return badge.owner == self.caller;
    }

    // Get total supply (public view)
    async transition get_total_supply() -> Future {
        return finalize_get_total_supply();
    }

    async function finalize_get_total_supply() {
        let supply: u64 = Mapping::get_or_use(total_supply, 0u8, 0u64);
    }

    // Revoke minter authorization
    async transition revoke_minter(minter: address) -> Future {
        return finalize_revoke_minter(self.caller, minter);
    }

    async function finalize_revoke_minter(caller: address, minter: address) {
        let is_authorized: bool = Mapping::get_or_use(authorized_minters, caller, false);
        assert(is_authorized);
        
        Mapping::set(authorized_minters, minter, false);
    }
}
