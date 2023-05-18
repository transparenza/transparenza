/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/Review.sol";

contract DeployReview is Script {
    function run() public {
        vm.startBroadcast();

        /// GelatoRelay1BalanceERC2771.sol address from
        /// https://docs.gelato.network/developer-services/relay/networks-and-rate-limits#contract-addresses
        new Review( address(0xd8253782c45a12053594b9deB72d8e8aB2Fca54c) );

        vm.stopBroadcast();
    }
}
