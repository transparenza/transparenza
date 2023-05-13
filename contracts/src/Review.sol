// solhint-disable avoid-low-level-calls
/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "forge-std/interfaces/IERC165.sol";

contract Review {
    /// Token => EOA => hasCommented
    mapping(address => mapping(address => bool)) public accountReviewedToken;
    /// Token => tokenId => EOA => hasCommented
    mapping(address => mapping(uint256 => mapping(address => bool))) public accountReviewedERC1155;
    /// EOA => counter
    mapping(address => uint256) public counter;

    bytes32 public immutable name = "Transparenza";
    bytes4 private immutable _interfaceIdERC1155 = 0xd9b67a26;
    bytes4 private immutable _interfaceIdERC721 = 0x80ac58cd;

    event CommentERC20(address indexed token, address indexed sender, string cid);
    event CommentERC721(address indexed token, address indexed sender, string cid);
    event CommentERC1155(address indexed token, uint256 indexed tokenId, address indexed sender, string cid);

    function commentERC20(address token, string calldata cid, string calldata pOPId) public {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.balanceOf.selector, msg.sender));
        _checkIsHolder(success, data);

        _setReview(token, msg.sender);

        _count(msg.sender);

        emit CommentERC20(token, msg.sender, cid);
    }

    function commentERC721(address token, string calldata cid, string calldata pOPId) public {
        (bool success721, bytes memory data721) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC721));

        require(success721 && abi.decode(data721, (bool)), "Not ERC721");

        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC721.balanceOf.selector, msg.sender));
        _checkIsHolder(success, data);

        _setReview(token, msg.sender);

        _count(msg.sender);

        emit CommentERC721(token, msg.sender, cid);
    }

    function commentERC1155(address token, uint256 tokenId, string calldata cid, string calldata pOPId) public {
        (bool success1155, bytes memory data1155) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC1155));

        require(success1155 && abi.decode(data1155, (bool)), "Not ERC1155");

        (bool success, bytes memory data) =
            token.call(abi.encodeWithSelector(IERC1155.balanceOf.selector, msg.sender, tokenId));
        _checkIsHolder(success, data);

        _setReview1155(token, tokenId, msg.sender);

        _count(msg.sender);

        emit CommentERC1155(token, tokenId, msg.sender, cid);
    }

    function _count(address sender) private {
        counter[sender] = counter[sender] + 1;
    }

    function _setReview(address token, address sender) private {
        require(!accountReviewedToken[token][sender], "Already commented");
        accountReviewedToken[token][sender] = true;
    }

    function _setReview1155(address token, uint256 tokenId, address sender) private {
        require(!accountReviewedERC1155[token][tokenId][sender], "Already commented");
        accountReviewedERC1155[token][tokenId][sender] = true;
    }

    function _checkIsHolder(bool success, bytes memory data) private pure {
        require(success && (abi.decode(data, (uint256)) > 0), "Not a holder");
    }
}
