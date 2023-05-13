/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/Review.sol";

contract DeployReview is Script {
    IWorldID public worldID;

    function run() public {
        vm.startBroadcast();

        worldID = IWorldID(address(25));

        new Review(worldID, "app_1234", "wid_test");

        vm.stopBroadcast();
    }
}
