// Ultra minimal v2

program aura_badge.aleo {
    record Badge {
        owner: address,
        badge_type: field,
    }

    transition mint(badge_type: field) -> Badge {
        return Badge {
            owner: self.caller,
            badge_type: badge_type,
        };
    }
}
