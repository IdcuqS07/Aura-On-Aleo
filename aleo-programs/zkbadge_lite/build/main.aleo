program zkbadge_lite.aleo;

record Badge:
    owner as address.private;
    badge_type as field.private;
    issued_at as u64.private;

mapping total_supply:
    key as u8.public;
    value as u64.public;

function issue_badge:
    input r0 as address.private;
    input r1 as field.private;
    input r2 as u64.private;
    cast r0 r1 r2 into r3 as Badge.record;
    async issue_badge self.caller into r4;
    output r3 as Badge.record;
    output r4 as zkbadge_lite.aleo/issue_badge.future;

finalize issue_badge:
    input r0 as address.public;
    get.or_use total_supply[0u8] 0u64 into r1;
    add r1 1u64 into r2;
    set r2 into total_supply[0u8];
