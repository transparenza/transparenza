// solhint-disable avoid-low-level-calls
// solhint-disable no-unused-vars
/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {Review} from "src/Review.sol";
import {MockERC20} from "src/tokens/MockERC20.sol";
import {MockERC721} from "src/tokens/MockERC721.sol";
import {MockERC1155} from "src/tokens/MockERC1155.sol";

contract SeedReviews is Script {
    address public mockERC20 = 0x123E232f519Cd384d2E12077C6d05385FF3B0C52;
    address public mockERC721 = 0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211;
    address public mockERC1155 = 0x9368f43c881dD2C32Df6ff56898BAE9a4100e20B;

    function run() public {
        vm.startBroadcast();

        uint256 chainId;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainId := chainid()
        }
        (bool success20, bytes memory data20) =
            mockERC20.call(abi.encodeWithSelector(MockERC20.mint.selector, msg.sender));
        (bool success721, bytes memory data721) =
            mockERC721.call(abi.encodeWithSelector(mockERC721.mint.selector, 5, msg.sender));
        (bool success1155, bytes memory data1155) =
            mockERC1155.call(abi.encodeWithSelector(MockERC1155.mint.selector, 3, msg.sender));
        vm.stopBroadcast();
    }
}
