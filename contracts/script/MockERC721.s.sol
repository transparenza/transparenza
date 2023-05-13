/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "src/tokens/MockERC721.sol";

contract DeployMockERC721 is Script {
    MockERC721 public mockERC721;

    function run() public {
        vm.startBroadcast();

        mockERC721 = new MockERC721();

        /// Mint 5 to Sebastian
        for (uint256 i = 0; i < 5; i++) {
            mockERC721.mint(i, address(0xB95417Cd0B8641e5ea922f0399250cf30ad36a5d));
        }
        for (uint256 i = 5; i < 10; i++) {
            mockERC721.mint(i, address(0x75336b7F786dF5647f6B20Dc36eAb9E27D704894));
        }
        for (uint256 i = 10; i < 15; i++) {
            mockERC721.mint(i, address(0xC776cBDDeA014889E8BaB4323C894C5c34DB214D));
        }

        vm.stopBroadcast();
    }
}
