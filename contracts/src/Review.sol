// solhint-disable avoid-low-level-calls
// solhint-disable private-vars-leading-underscore
/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "forge-std/interfaces/IERC165.sol";

contract Review {
    using ByteHasher for bytes;

    /// Token => EOA => hasCommented
    mapping(address => mapping(address => bool)) public accountReviewedToken;
    /// Token => tokenId => EOA => hasCommented
    mapping(address => mapping(uint256 => mapping(address => bool))) public accountReviewedERC1155;
    /// EOA => counter
    mapping(address => uint256) public counter;

    bytes32 public immutable name = "Transparenza";
    bytes4 private immutable _interfaceIdERC1155 = 0xd9b67a26;
    bytes4 private immutable _interfaceIdERC721 = 0x80ac58cd;

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a
    /// single person
    mapping(uint256 => bool) internal nullifierHashes;

    event CommentERC20(address indexed token, address indexed sender, string cid);
    event CommentERC721(address indexed token, address indexed sender, string cid);
    event CommentERC1155(address indexed token, uint256 indexed tokenId, address indexed sender, string cid);

    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
        worldId = _worldId;
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }

    function commentERC20(
        address token,
        string calldata cid,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        verifyAndExecute(signal, root, nullifierHash, proof);
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.balanceOf.selector, msg.sender));
        _checkIsHolder(success, data);

        _setReview(token, msg.sender);

        _count(msg.sender);

        emit CommentERC20(token, msg.sender, cid);
    }

    function commentERC721(
        address token,
        string calldata cid,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        verifyAndExecute(signal, root, nullifierHash, proof);
        (bool success721, bytes memory data721) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC721));

        require(success721 && abi.decode(data721, (bool)), "Not ERC721");

        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC721.balanceOf.selector, msg.sender));
        _checkIsHolder(success, data);

        _setReview(token, msg.sender);

        _count(msg.sender);

        emit CommentERC721(token, msg.sender, cid);
    }

    function commentERC1155(
        address token,
        uint256 tokenId,
        string calldata cid,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        verifyAndExecute(signal, root, nullifierHash, proof);
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

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further
    /// details)
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by
    /// the JS widget).
    /// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
    function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
        uint256 chainId;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainId := chainid()
        }

        if (chainId == 137) {
            // First, we make sure this person hasn't done this before
            if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

            // We now verify the provided proof is valid and the user is verified by World ID
            worldId.verifyProof(
                root, groupId, abi.encodePacked(signal).hashToField(), nullifierHash, externalNullifier, proof
            );

            // We now record the user has done this, so they can't do it again (proof of uniqueness)
            nullifierHashes[nullifierHash] = true;
        }
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
