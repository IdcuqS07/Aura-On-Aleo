// Aura Credit Passport - Soulbound Credit Score NFT on Aleo
// Port from CreditPassport.sol

program credit_passport.aleo {
    // Passport record (private NFT)
    record Passport {
        owner: address,
        passport_id: u64,
        credit_score: u64,
        poh_score: u64,
        badge_count: u64,
        onchain_activity: u64,
        issued_at: u64,
        last_updated: u64,
    }

    // Public state
    mapping total_supply: u8 => u64;
    mapping authorized_minters: address => bool;
    mapping user_passport: address => u64;
    mapping passport_scores: u64 => u64;

    // Initialize
    async transition initialize() -> Future {
        return finalize_initialize(self.caller);
    }

    async function finalize_initialize(admin: address) {
        Mapping::set(total_supply, 0u8, 0u64);
        Mapping::set(authorized_minters, admin, true);
    }

    // Mint passport (user self-mint)
    async transition mint_passport(
        poh_score: u64,
        badge_count: u64,
        issued_at: u64
    ) -> (Passport, Future) {
        let credit_score: u64 = calculate_score(poh_score, badge_count, 0u64);
        
        let passport: Passport = Passport {
            owner: self.caller,
            passport_id: 0u64,
            credit_score: credit_score,
            poh_score: poh_score,
            badge_count: badge_count,
            onchain_activity: 0u64,
            issued_at: issued_at,
            last_updated: issued_at,
        };

        return (passport, finalize_mint_passport(self.caller, credit_score));
    }

    async function finalize_mint_passport(user: address, credit_score: u64) {
        // Check if user already has passport
        let existing: u64 = Mapping::get_or_use(user_passport, user, 0u64);
        assert_eq(existing, 0u64);

        // Increment supply
        let current: u64 = Mapping::get_or_use(total_supply, 0u8, 0u64);
        let new_id: u64 = current + 1u64;
        Mapping::set(total_supply, 0u8, new_id);

        // Store passport
        Mapping::set(user_passport, user, new_id);
        Mapping::set(passport_scores, new_id, credit_score);
    }

    // Issue passport (authorized minters)
    async transition issue_passport(
        recipient: address,
        poh_score: u64,
        badge_count: u64,
        issued_at: u64
    ) -> (Passport, Future) {
        let credit_score: u64 = calculate_score(poh_score, badge_count, 0u64);
        
        let passport: Passport = Passport {
            owner: recipient,
            passport_id: 0u64,
            credit_score: credit_score,
            poh_score: poh_score,
            badge_count: badge_count,
            onchain_activity: 0u64,
            issued_at: issued_at,
            last_updated: issued_at,
        };

        return (passport, finalize_issue_passport(self.caller, recipient, credit_score));
    }

    async function finalize_issue_passport(minter: address, recipient: address, credit_score: u64) {
        // Check authorization
        let is_authorized: bool = Mapping::get_or_use(authorized_minters, minter, false);
        assert(is_authorized);

        // Check if user already has passport
        let existing: u64 = Mapping::get_or_use(user_passport, recipient, 0u64);
        assert_eq(existing, 0u64);

        // Increment supply
        let current: u64 = Mapping::get_or_use(total_supply, 0u8, 0u64);
        let new_id: u64 = current + 1u64;
        Mapping::set(total_supply, 0u8, new_id);

        // Store passport
        Mapping::set(user_passport, recipient, new_id);
        Mapping::set(passport_scores, new_id, credit_score);
    }

    // Update score
    async transition update_score(
        passport: Passport,
        poh_score: u64,
        badge_count: u64,
        onchain_activity: u64,
        last_updated: u64
    ) -> (Passport, Future) {
        let new_score: u64 = calculate_score(poh_score, badge_count, onchain_activity);
        
        let updated: Passport = Passport {
            owner: passport.owner,
            passport_id: passport.passport_id,
            credit_score: new_score,
            poh_score: poh_score,
            badge_count: badge_count,
            onchain_activity: onchain_activity,
            issued_at: passport.issued_at,
            last_updated: last_updated,
        };

        return (updated, finalize_update_score(self.caller, passport.passport_id, new_score));
    }

    async function finalize_update_score(minter: address, passport_id: u64, new_score: u64) {
        let is_authorized: bool = Mapping::get_or_use(authorized_minters, minter, false);
        assert(is_authorized);
        
        Mapping::set(passport_scores, passport_id, new_score);
    }

    // Calculate credit score
    function calculate_score(
        poh_score: u64,
        badge_count: u64,
        onchain_activity: u64
    ) -> u64 {
        let score: u64 = 0u64;
        
        // PoH score weight: 4x
        score = score + (poh_score * 4u64);
        
        // Badge count weight: 50 per badge
        score = score + (badge_count * 50u64);
        
        // Bonus for high score
        let bonus: u64 = score > 700u64 ? 100u64 : 0u64;
        score = score + bonus;
        
        // Add onchain activity
        score = score + onchain_activity;
        
        // Cap at 1000
        let final_score: u64 = score > 1000u64 ? 1000u64 : score;
        
        return final_score;
    }

    // Authorize minter
    async transition authorize_minter(minter: address) -> Future {
        return finalize_authorize_minter(self.caller, minter);
    }

    async function finalize_authorize_minter(caller: address, minter: address) {
        let is_authorized: bool = Mapping::get_or_use(authorized_minters, caller, false);
        assert(is_authorized);
        
        Mapping::set(authorized_minters, minter, true);
    }

    // Get passport ID for user
    async transition get_passport_id(user: address) -> Future {
        return finalize_get_passport_id(user);
    }

    async function finalize_get_passport_id(user: address) {
        let passport_id: u64 = Mapping::get_or_use(user_passport, user, 0u64);
    }
}
