// solhint-disable avoid-low-level-calls
/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "forge-std/interfaces/IERC165.sol";
import {ERC2771Context} from "relay-context-contracts/vendor/ERC2771Context.sol";

contract Review is ERC2771Context {
    /// Token => EOA => hasCommented
    mapping(address => mapping(address => bool)) public accountReviewedToken;
    /// Token => tokenId => EOA => hasCommented
    mapping(address => mapping(uint256 => mapping(address => bool))) public accountReviewedERC1155;
    /// EOA => counter
    mapping(address => uint256) public counter;

    bytes32 public immutable name = "Transparenza";
    bytes4 private immutable _interfaceIdERC1155 = 0xd9b67a26;
    bytes4 private immutable _interfaceIdERC721 = 0x80ac58cd;

    mapping(address => uint256) public contextCounter;

    event IncrementContextCounter(address _msgSender);

    event CommentERC20(address indexed token, address indexed sender, string cid);
    event CommentERC721(address indexed token, address indexed sender, string cid);
    event CommentERC1155(address indexed token, uint256 indexed tokenId, address indexed sender, string cid);

    // solhint-disable no-empty-blocks
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    // `incrementContext` is the target function to call
    // This function increments a counter variable which is
    // mapped to every _msgSender(), the address of the user.
    // This way each user off-chain has their own counter
    // variable on-chain.
    function incrementContext() external {
        // Remember that with the context shift of relaying,
        // where we would use `_msgSender()` before,
        // this now refers to Gelato Relay's address,
        // and to find the address of the user,
        // which has been verified using a signature,
        // please use _msgSender()!

        // If this contract was not not called by the
        // trusted forwarder, _msgSender() will simply return
        // the value of _msgSender() instead.

        // Incrementing the counter mapped to the _msgSender!
        contextCounter[_msgSender()]++;

        // Emitting an event for testing purposes
        emit IncrementContextCounter(_msgSender());
    }

    function commentERC20(address token, string calldata cid) public {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.balanceOf.selector, _msgSender()));
        _checkIsHolder(success, data);

        _setReview(token, _msgSender());

        _count(_msgSender());

        emit CommentERC20(token, _msgSender(), cid);
    }

    function commentERC721(address token, string calldata cid) public {
        (bool success721, bytes memory data721) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC721));

        require(success721 && abi.decode(data721, (bool)), "Not ERC721");

        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC721.balanceOf.selector, _msgSender()));
        _checkIsHolder(success, data);

        _setReview(token, _msgSender());

        _count(_msgSender());

        emit CommentERC721(token, _msgSender(), cid);
    }

    function commentERC1155(address token, uint256 tokenId, string calldata cid) public {
        (bool success1155, bytes memory data1155) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC1155));

        require(success1155 && abi.decode(data1155, (bool)), "Not ERC1155");

        (bool success, bytes memory data) =
            token.call(abi.encodeWithSelector(IERC1155.balanceOf.selector, _msgSender(), tokenId));
        _checkIsHolder(success, data);

        _setReview1155(token, tokenId, _msgSender());

        _count(_msgSender());

        emit CommentERC1155(token, tokenId, _msgSender(), cid);
    }

    function _count(address sender) private {
        counter[sender] = counter[sender] + 1;
    }

    function _setReview(address token, address sender) private {
        require(!accountReviewedToken[token][sender] || _isMumbai(), "Already commented");
        accountReviewedToken[token][sender] = true;
    }

    function _setReview1155(address token, uint256 tokenId, address sender) private {
        /// Mumbai chain should allow multiple reviews to demo easily
        require(!accountReviewedERC1155[token][tokenId][sender] || _isMumbai(), "Already commented");
        accountReviewedERC1155[token][tokenId][sender] = true;
    }

    function _isMumbai() private view returns (bool) {
        uint256 chainId;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainId := chainid()
        }
        return chainId == 80001;
    }

    function _checkIsHolder(bool success, bytes memory data) private pure {
        require(success && (abi.decode(data, (uint256)) > 0), "Not a holder");
    }
}
