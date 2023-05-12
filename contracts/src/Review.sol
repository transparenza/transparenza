// solhint-disable avoid-low-level-calls
/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "forge-std/interfaces/IERC165.sol";
import "forge-std/console.sol";

contract Review {
    /// Token => EOA => hasCommented
    mapping(address => mapping(address => bool)) public accountReviewedToken;
    /// Token => id => EOA => hasCommented
    mapping(address => mapping(uint256 => mapping(address => bool))) public accountReviewed1155;
    /// EOA => counter
    mapping(address => uint256) public counter;

    bytes32 public immutable name = "Transparenza";
    bytes4 private immutable _interfaceIdERC1155 = 0xd9b67a26;
    bytes4 private immutable _interfaceIdERC721 = 0x80ac58cd;

    function commentERC20(address token, string calldata cid, string calldata pOPId) public {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.balanceOf.selector, msg.sender));
        _checkIsHolder(success, data);

        _setReview(token, msg.sender);

        _count(msg.sender);
    }

    function commentERC721(address token, string calldata cid, string calldata pOPId) public {
        (bool success721, bytes memory data721) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC721));

        require(success721 && abi.decode(data721, (bool)), "Not ERC721");

        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC721.balanceOf.selector, msg.sender));
        _checkIsHolder(success, data);

        _setReview(token, msg.sender);

        _count(msg.sender);
    }

    function commentERC1155(address token, uint256 id, string calldata cid, string calldata pOPId) public {
        (bool success1155, bytes memory data1155) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC1155));

        require(success1155 && abi.decode(data1155, (bool)), "Not ERC1155");

        (bool success, bytes memory data) =
            token.call(abi.encodeWithSelector(IERC1155.balanceOf.selector, msg.sender, id));
        _checkIsHolder(success, data);

        _setReview1155(token, id, msg.sender);

        _count(msg.sender);
    }

    function _count(address sender) private {
        counter[sender] = counter[sender] + 1;
    }

    function _setReview(address token, address sender) private {
        require(!accountReviewedToken[token][sender], "Already commented");
        accountReviewedToken[token][sender] = true;
    }

    function _setReview1155(address token, uint256 id, address sender) private {
        require(!accountReviewed1155[token][id][sender], "Already commented");
        accountReviewed1155[token][id][sender] = true;
    }

    function _checkIsHolder(bool success, bytes memory data) private pure {
        require(success && (abi.decode(data, (uint256)) > 0), "Not a holder");
    }
}
