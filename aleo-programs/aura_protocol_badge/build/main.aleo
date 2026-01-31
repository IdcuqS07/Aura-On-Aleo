program aura_protocol_badge.aleo;

record Badge:
    owner as address.private;
    badge_type as field.private;

mapping initialized:
    key as u8.public;
    value as boolean.public;

function init:
    async init into r0;
    output r0 as aura_protocol_badge.aleo/init.future;

finalize init:
    set true into initialized[0u8];

function mint:
    input r0 as address.private;
    input r1 as field.private;
    cast r0 r1 into r2 as Badge.record;
    output r2 as Badge.record;
