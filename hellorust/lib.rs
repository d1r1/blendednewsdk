#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use alloc::string::{String, ToString};
use fluentbase_sdk::{
    basic_entrypoint,
    derive::{function_id, router, Contract},
    SharedAPI,
};

#[derive(Contract)]
struct ROUTER<SDK> {
    sdk: SDK,
}

pub trait RouterAPI {
    fn greeting(&self) -> String;
}

#[router(mode = "solidity")]
impl<SDK: SharedAPI> RouterAPI for ROUTER<SDK> {
    #[function_id("greeting()")]
    fn greeting(&self) -> String {
        "Hello,".to_string()
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // any custom deployment logic here
    }
}

basic_entrypoint!(ROUTER);

#[cfg(test)]
mod tests {

    use super::*;
    use fluentbase_sdk::{codec::SolidityABI, journal::JournalState, runtime::TestingContext};

    #[test]
    fn test_contract_method_works() {
        let input = GreetingCall::new(()).encode();
        println!("input: {:?}", input);

        let native_sdk = TestingContext::empty().with_input(input);
        let sdk = JournalState::empty(native_sdk.clone());
        let mut router = ROUTER::new(sdk);

        router.deploy();
        router.main();

        let output = native_sdk.take_output();

        println!("output: {:?}", hex::encode(&output));

        // encoded string "Hello,"
        let expected_output = "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000648656c6c6f2c0000000000000000000000000000000000000000000000000000";

        assert_eq!(hex::encode(&output), expected_output);

        let msg: String = SolidityABI::decode(&&output[..], 0).unwrap();

        assert_eq!(msg, "Hello,");
    }
}
