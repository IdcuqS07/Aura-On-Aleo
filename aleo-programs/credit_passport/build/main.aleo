program credit_passport.aleo;

record Passport:
    owner as address.private;
    passport_id as u64.private;
    credit_score as u64.private;
    poh_score as u64.private;
    badge_count as u64.private;
    onchain_activity as u64.private;
    issued_at as u64.private;
    last_updated as u64.private;

mapping total_supply:
    key as u8.public;
    value as u64.public;

mapping authorized_minters:
    key as address.public;
    value as boolean.public;

mapping user_passport:
    key as address.public;
    value as u64.public;

mapping passport_scores:
    key as u64.public;
    value as u64.public;

function initialize:
    async initialize self.caller into r0;
    output r0 as credit_passport.aleo/initialize.future;

finalize initialize:
    input r0 as address.public;
    set 0u64 into total_supply[0u8];
    set true into authorized_minters[r0];

closure calculate_score:
    input r0 as u64;
    input r1 as u64;
    input r2 as u64;
    mul r0 4u64 into r3;
    add 0u64 r3 into r4;
    mul r1 50u64 into r5;
    add r4 r5 into r6;
    gt r6 700u64 into r7;
    ternary r7 100u64 0u64 into r8;
    add r6 r8 into r9;
    add r9 r2 into r10;
    gt r10 1000u64 into r11;
    ternary r11 1000u64 r10 into r12;
    output r12 as u64;

function mint_passport:
    input r0 as u64.private;
    input r1 as u64.private;
    input r2 as u64.private;
    call calculate_score r0 r1 0u64 into r3;
    cast self.caller 0u64 r3 r0 r1 0u64 r2 r2 into r4 as Passport.record;
    async mint_passport self.caller r3 into r5;
    output r4 as Passport.record;
    output r5 as credit_passport.aleo/mint_passport.future;

finalize mint_passport:
    input r0 as address.public;
    input r1 as u64.public;
    get.or_use user_passport[r0] 0u64 into r2;
    assert.eq r2 0u64;
    get.or_use total_supply[0u8] 0u64 into r3;
    add r3 1u64 into r4;
    set r4 into total_supply[0u8];
    set r4 into user_passport[r0];
    set r1 into passport_scores[r4];

function issue_passport:
    input r0 as address.private;
    input r1 as u64.private;
    input r2 as u64.private;
    input r3 as u64.private;
    call calculate_score r1 r2 0u64 into r4;
    cast r0 0u64 r4 r1 r2 0u64 r3 r3 into r5 as Passport.record;
    async issue_passport self.caller r0 r4 into r6;
    output r5 as Passport.record;
    output r6 as credit_passport.aleo/issue_passport.future;

finalize issue_passport:
    input r0 as address.public;
    input r1 as address.public;
    input r2 as u64.public;
    get.or_use authorized_minters[r0] false into r3;
    assert.eq r3 true;
    get.or_use user_passport[r1] 0u64 into r4;
    assert.eq r4 0u64;
    get.or_use total_supply[0u8] 0u64 into r5;
    add r5 1u64 into r6;
    set r6 into total_supply[0u8];
    set r6 into user_passport[r1];
    set r2 into passport_scores[r6];

function update_score:
    input r0 as Passport.record;
    input r1 as u64.private;
    input r2 as u64.private;
    input r3 as u64.private;
    input r4 as u64.private;
    call calculate_score r1 r2 r3 into r5;
    cast r0.owner r0.passport_id r5 r1 r2 r3 r0.issued_at r4 into r6 as Passport.record;
    async update_score self.caller r0.passport_id r5 into r7;
    output r6 as Passport.record;
    output r7 as credit_passport.aleo/update_score.future;

finalize update_score:
    input r0 as address.public;
    input r1 as u64.public;
    input r2 as u64.public;
    get.or_use authorized_minters[r0] false into r3;
    assert.eq r3 true;
    set r2 into passport_scores[r1];

function authorize_minter:
    input r0 as address.private;
    async authorize_minter self.caller r0 into r1;
    output r1 as credit_passport.aleo/authorize_minter.future;

finalize authorize_minter:
    input r0 as address.public;
    input r1 as address.public;
    get.or_use authorized_minters[r0] false into r2;
    assert.eq r2 true;
    set true into authorized_minters[r1];

function get_passport_id:
    input r0 as address.private;
    async get_passport_id r0 into r1;
    output r1 as credit_passport.aleo/get_passport_id.future;

finalize get_passport_id:
    input r0 as address.public;
    get.or_use user_passport[r0] 0u64 into r1;
