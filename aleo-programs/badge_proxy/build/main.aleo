program badge_proxy.aleo;

mapping implementation:
    key as u8.public;
    value as address.public;

mapping admin:
    key as u8.public;
    value as address.public;

function initialize:
    input r0 as address.private;
    async initialize self.caller r0 into r1;
    output r1 as badge_proxy.aleo/initialize.future;

finalize initialize:
    input r0 as address.public;
    input r1 as address.public;
    set r0 into admin[0u8];
    set r1 into implementation[0u8];

function upgrade:
    input r0 as address.private;
    async upgrade self.caller r0 into r1;
    output r1 as badge_proxy.aleo/upgrade.future;

finalize upgrade:
    input r0 as address.public;
    input r1 as address.public;
    get admin[0u8] into r2;
    assert.eq r0 r2;
    set r1 into implementation[0u8];
