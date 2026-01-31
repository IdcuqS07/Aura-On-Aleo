program badge_proxy.aleo {
    mapping implementation: u8 => address;
    mapping admin: u8 => address;
    
    async transition initialize(impl_address: address) -> Future {
        return finalize_initialize(self.caller, impl_address);
    }
    
    async function finalize_initialize(caller: address, impl: address) {
        Mapping::set(admin, 0u8, caller);
        Mapping::set(implementation, 0u8, impl);
    }
    
    async transition upgrade(new_impl: address) -> Future {
        return finalize_upgrade(self.caller, new_impl);
    }
    
    async function finalize_upgrade(caller: address, new_impl: address) {
        let admin_addr: address = Mapping::get(admin, 0u8);
        assert_eq(caller, admin_addr);
        Mapping::set(implementation, 0u8, new_impl);
    }
}
