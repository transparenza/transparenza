// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "forge-std/Test.sol";
import "src/Review.sol";
import "src/tokens/MockERC20.sol";
import "src/tokens/MockERC721.sol";
import "src/tokens/MockERC1155.sol";
import {TypeConverter} from "./helpers/TypeConverter.sol";

contract ReviewTest is Test {
    address public alice = address(1);
    uint256 public root = 0;
    uint256 public nullifierHash = 1;
    uint256[8] public proof = [0, 1, 2, 3, 4, 5, 6, 7];

    MockERC20 public mockERC20;
    MockERC721 public mockERC721;
    MockERC1155 public mockERC1155;

    Review public review;
    IWorldID public worldID;

    event CommentERC20(address indexed token, address indexed sender, string cid);
    event CommentERC721(address indexed token, address indexed sender, string cid);
    event CommentERC1155(address indexed token, uint256 indexed tokenId, address indexed sender, string cid);

    function setUp() public {
        mockERC20 = new MockERC20();
        mockERC20.mint(alice);
        mockERC721 = new MockERC721();
        mockERC721.mint(0, alice);
        mockERC1155 = new MockERC1155();
        mockERC1155.mint(0, alice);

        worldID = IWorldID(address(25));

        review = new Review(worldID, "app_1234", "wid_test");
    }

    function test_commentERC20() public {
        vm.expectEmit(true, true, true, true);
        emit CommentERC20(address(mockERC20), alice, "cid");
        vm.prank(alice);
        review.commentERC20(address(mockERC20), "cid", root, nullifierHash, proof);
        assertEq(review.accountReviewedToken(address(mockERC20), alice), true);
        assertEq(review.counter(alice), 1);
    }

    function test_commentERC721() public {
        vm.expectEmit(true, true, true, true);
        emit CommentERC721(address(mockERC721), alice, "cid");
        vm.prank(alice);
        review.commentERC721(address(mockERC721), "cid", root, nullifierHash, proof);
        assertEq(review.accountReviewedToken(address(mockERC721), alice), true);
        assertEq(review.counter(alice), 1);
    }

    function test_commentERC1155() public {
        vm.expectEmit(true, true, true, true);
        emit CommentERC1155(address(mockERC1155), 0, alice, "cid");
        vm.prank(alice);
        review.commentERC1155(address(mockERC1155), 0, "cid", root, nullifierHash, proof);
        assertEq(review.accountReviewedERC1155(address(mockERC1155), 0, alice), true);
        assertEq(review.counter(alice), 1);
    }

    function test_RevertWhen_DoubleOpinionToken() public {
        vm.startPrank(alice);
        review.commentERC20(address(mockERC20), "cid", root, nullifierHash, proof);
        vm.expectRevert("Already commented");
        review.commentERC20(address(mockERC20), "cid", root, nullifierHash, proof);
        vm.stopPrank();
    }

    function test_RevertWhen_DoubleOpinion1155() public {
        vm.startPrank(alice);
        review.commentERC1155(address(mockERC1155), 0, "cid", root, nullifierHash, proof);
        vm.expectRevert("Already commented");
        review.commentERC1155(address(mockERC1155), 0, "cid", root, nullifierHash, proof);
        vm.stopPrank();
    }

    function test_RevertWhen_NotHolder() public {
        vm.expectRevert("Not a holder");
        review.commentERC20(address(mockERC20), "cid", root, nullifierHash, proof);
    }

    function test_Name() public {
        assertEq(review.name(), "Transparenza");
    }
}
