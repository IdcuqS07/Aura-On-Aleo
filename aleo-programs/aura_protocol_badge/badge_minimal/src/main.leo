program badge_minimal.aleo {
    record Badge {
        owner: address,
        badge_type: field,
    }

    mapping initialized: u8 => bool;

    async transition init() -> Future {
        return finalize_init();
    }

    async function finalize_init() {
        Mapping::set(initialized, 0u8, true);
    }

    transition mint(owner: address, badge_type: field) -> Badge {
        return Badge {
            owner: owner,
            badge_type: badge_type,
        };
    }
}
