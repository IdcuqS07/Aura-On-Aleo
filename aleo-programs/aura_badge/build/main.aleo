program aura_badge.aleo;

record Badge:
    owner as address.private;
    badge_type as field.private;

function mint:
    input r0 as field.private;
    cast self.caller r0 into r1 as Badge.record;
    output r1 as Badge.record;
