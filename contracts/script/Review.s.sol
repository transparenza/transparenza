/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/Review.sol";

contract DeployReview is Script {
    IWorldID public worldID;

    function run() public {
        vm.startBroadcast();

        worldID = IWorldID(address(0xD81dE4BCEf43840a2883e5730d014630eA6b7c4A));

        /// GelatoRelay1BalanceERC2771.sol address from
        /// https://docs.gelato.network/developer-services/relay/networks-and-rate-limits#contract-addresses
        new Review(
            worldID, 
            "app_staging_391283f08c9663b3c213b71c38428724", 
            "create-comment", 
            address(0xd8253782c45a12053594b9deB72d8e8aB2Fca54c)
        );

        vm.stopBroadcast();
    }
}
