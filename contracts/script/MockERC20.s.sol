/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/tokens/MockERC20.sol";

contract DeployMockERC20 is Script {
    MockERC20 public mockERC20;

    function run() public {
        vm.startBroadcast();

        mockERC20 = new MockERC20();

        /// Mint to Sebastian
        mockERC20.mint(address(0xB95417Cd0B8641e5ea922f0399250cf30ad36a5d));

        mockERC20.mint(address(0x75336b7F786dF5647f6B20Dc36eAb9E27D704894));

        mockERC20.mint(address(0xC776cBDDeA014889E8BaB4323C894C5c34DB214D));

        vm.stopBroadcast();
    }
}
