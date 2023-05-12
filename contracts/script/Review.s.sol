/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/Review.sol";

contract DeployReview is Script {
    function run() public {
        vm.startBroadcast();

        new Review();

        vm.stopBroadcast();
    }
}
