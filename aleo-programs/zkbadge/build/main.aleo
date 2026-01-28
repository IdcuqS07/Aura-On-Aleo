program zkbadge.aleo;

record Badge:
    owner as address.private;
    badge_id as u64.private;
    badge_type as field.private;
    zk_proof_hash as field.private;
    issued_at as u64.private;

mapping total_supply:
    key as u8.public;
    value as u64.public;

mapping authorized_minters:
    key as address.public;
    value as boolean.public;

mapping badge_owners:
    key as u64.public;
    value as address.public;

function initialize:
    async initialize self.caller into r0;
    output r0 as zkbadge.aleo/initialize.future;

finalize initialize:
    input r0 as address.public;
    set 0u64 into total_supply[0u8];
    set true into authorized_minters[r0];

function authorize_minter:
    input r0 as address.private;
    async authorize_minter self.caller r0 into r1;
    output r1 as zkbadge.aleo/authorize_minter.future;

finalize authorize_minter:
    input r0 as address.public;
    input r1 as address.public;
    get.or_use authorized_minters[r0] false into r2;
    assert.eq r2 true;
    set true into authorized_minters[r1];

function issue_badge:
    input r0 as address.private;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as u64.private;
    cast r0 0u64 r1 r2 r3 into r4 as Badge.record;
    async issue_badge self.caller r0 into r5;
    output r4 as Badge.record;
    output r5 as zkbadge.aleo/issue_badge.future;

finalize issue_badge:
    input r0 as address.public;
    input r1 as address.public;
    get.or_use authorized_minters[r0] false into r2;
    assert.eq r2 true;
    get.or_use total_supply[0u8] 0u64 into r3;
    add r3 1u64 into r4;
    set r4 into total_supply[0u8];
    set r1 into badge_owners[r4];

function verify_badge:
    input r0 as Badge.record;
    is.eq r0.owner self.caller into r1;
    output r1 as boolean.private;

function get_total_supply:
    async get_total_supply into r0;
    output r0 as zkbadge.aleo/get_total_supply.future;

finalize get_total_supply:
    get.or_use total_supply[0u8] 0u64 into r0;

function revoke_minter:
    input r0 as address.private;
    async revoke_minter self.caller r0 into r1;
    output r1 as zkbadge.aleo/revoke_minter.future;

finalize revoke_minter:
    input r0 as address.public;
    input r1 as address.public;
    get.or_use authorized_minters[r0] false into r2;
    assert.eq r2 true;
    set false into authorized_minters[r1];
