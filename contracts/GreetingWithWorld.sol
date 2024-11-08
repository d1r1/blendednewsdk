// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IFluentGreeting.sol";

contract GreetingWithWorld {
    IRustGreeting public fluentGreetingContract;

    constructor(address _fluentGreetingContractAddress) {
        fluentGreetingContract = IRustGreeting(_fluentGreetingContractAddress);
    }

    function getGreeting() external view returns (string memory) {
        // Call the greeting function from the fluentGreetingContract
        string memory greeting = fluentGreetingContract.greeting();

        // Concatenate the returned greeting with " World"
        return string(abi.encodePacked(greeting, " World"));
    }
}
