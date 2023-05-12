// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Test.sol";
import "src/Review.sol";
import "src/tokens/MockERC20.sol";
import "src/tokens/MockERC721.sol";
import "src/tokens/MockERC1155.sol";

contract ReviewTest is Test {
    address public alice = address(1);

    MockERC20 public mockERC20;
    MockERC721 public mockERC721;
    MockERC1155 public mockERC1155;

    Review public review;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    function setUp() public {
        mockERC20 = new MockERC20();
        mockERC20.mint(alice);
        mockERC721 = new MockERC721();
        mockERC721.mint(0, alice);
        mockERC1155 = new MockERC1155();
        mockERC1155.mint(0, alice);
        review = new Review();
    }

    function test_commentERC20() public {
        vm.prank(alice);
        review.commentERC20(address(mockERC20), "cid", "pOPId");
    }

    function test_commentERC721() public {
        vm.prank(alice);
        review.commentERC721(address(mockERC721), "cid", "pOPId");
    }

    function test_commentERC1155() public {
        vm.prank(alice);
        review.commentERC1155(address(mockERC1155), 0, "cid", "pOPId");
    }

    function test_RevertWhen_NotHolder() public {
        vm.expectRevert("Not a holder");
        review.commentERC20(address(mockERC20), "cid", "pOPId");
    }

    function test_Name() public {
        assertEq(review.name(), "Transparenza");
    }
}
