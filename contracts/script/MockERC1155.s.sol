/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/tokens/MockERC1155.sol";

contract DeployMockERC1155 is Script {
    MockERC1155 public mockERC1155;

    function run() public {
        vm.startBroadcast();

        mockERC1155 = new MockERC1155();

        /// Mint 5 to Sebastian
        for (uint256 i = 0; i < 5; i++) {
            mockERC1155.mint(i, address(0xB95417Cd0B8641e5ea922f0399250cf30ad36a5d));
        }
        for (uint256 i = 5; i < 10; i++) {
            mockERC1155.mint(i, address(0x75336b7F786dF5647f6B20Dc36eAb9E27D704894));
        }
        for (uint256 i = 10; i < 15; i++) {
            mockERC1155.mint(i, address(0xC776cBDDeA014889E8BaB4323C894C5c34DB214D));
        }

        vm.stopBroadcast();
    }
}
