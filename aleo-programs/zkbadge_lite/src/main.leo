// Aura ZK Badge Lite - Minimal version for lower deployment cost

program zkbadge_lite.aleo {
    record Badge {
        owner: address,
        badge_type: field,
        issued_at: u64,
    }

    mapping total_supply: u8 => u64;

    async transition issue_badge(
        recipient: address,
        badge_type: field,
        issued_at: u64
    ) -> (Badge, Future) {
        let badge: Badge = Badge {
            owner: recipient,
            badge_type: badge_type,
            issued_at: issued_at,
        };

        return (badge, finalize_issue(self.caller));
    }

    async function finalize_issue(minter: address) {
        let current: u64 = Mapping::get_or_use(total_supply, 0u8, 0u64);
        Mapping::set(total_supply, 0u8, current + 1u64);
    }
}
