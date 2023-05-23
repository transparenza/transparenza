// solhint-disable avoid-low-level-calls
// solhint-disable private-vars-leading-underscore
/// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {IInterchainQueryRouter} from './interfaces/IInterchainQueryRouter.sol';
import {IInterchainGasPaymaster} from './interfaces/IInterchainGasPaymaster.sol';

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "forge-std/interfaces/IERC165.sol";
import {ERC2771Context} from "relay-context-contracts/vendor/ERC2771Context.sol";
import './constants/Call.sol';

contract Review is ERC2771Context {
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

    address constant iqsRouter = 0x234b19282985882d6d6fd54dEBa272271f4eb784;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a
    /// single person
    mapping(uint256 => bool) internal nullifierHashes;

    mapping(address => uint256) public contextCounter;

    event IncrementContextCounter(address _msgSender);

    event CommentERC20(address indexed token, address indexed sender, string cid);
    event CommentERC721(address indexed token, address indexed sender, string cid);
    event CommentERC1155(address indexed token, uint256 indexed tokenId, address indexed sender, string cid);

    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(IWorldID _worldId, string memory _appId, string memory _actionId, address trustedForwarder)
        ERC2771Context(trustedForwarder)
    {
        worldId = _worldId;
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }

    modifier onlyCallback() {
        require(msg.sender == iqsRouter);
        _;
    }

    function commentERC20(
        address token,
        string calldata cid,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] memory proof
    ) public {
        verifyAndExecute(_msgSender(), root, nullifierHash, proof);
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.balanceOf.selector, _msgSender()));
        _checkIsHolder(success, data);

        _setReview(token, _msgSender());

        _count(_msgSender());

        emit CommentERC20(token, _msgSender(), cid);
    }

    /*
    function commentERC721(
        address token,
        string calldata cid,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] memory proof
    ) public {
        verifyAndExecute(_msgSender(), root, nullifierHash, proof);

        (bool success721, bytes memory data721) =
            token.call(abi.encodeWithSelector(IERC165.supportsInterface.selector, _interfaceIdERC721));

        require(success721 && abi.decode(data721, (bool)), "Not ERC721");

        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC721.balanceOf.selector, _msgSender()));
        _checkIsHolder(success, data);

        uint256 chainId;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainId := chainid()
        }

        /// Mumbai chain should allow multiple reviews to demo easily
        if (chainId == 137) {
            _setReview(token, _msgSender());
        } else {
            accountReviewedToken[token][_msgSender()] = true;
        }

        _count(_msgSender());

        emit CommentERC721(token, _msgSender(), cid);
    }
    */

   function commentERC721(address tokenAddress, string calldata cid) public {
        uint32 destinationDomain = 5; // goerli
        uint256 gasAmount = 100000;
        IERC721 token = IERC721(tokenAddress);
        Call memory _balanceOfCall = Call({
            to: tokenAddress,
            data: abi.encodeWithSelector(IERC721.balanceOf.selector, _msgSender())
        });

        bytes memory _callback = abi.encodePacked(this._writeCommentERC721.selector);

        bytes32 messageId = IInterchainQueryRouter(iqsRouter).query(
            destinationDomain, // goerli
            _balanceOfCall,
            _callback
        );


        IInterchainGasPaymaster igp = IInterchainGasPaymaster(0x56f52c0A1ddcD557285f7CBc782D3d83096CE1Cc);
            uint256 quote = igp.quoteGasPayment(
            destinationDomain,
            gasAmount
        );

        igp.payForGas{ value: quote }(
            messageId, // The ID of the message that was just dispatched
            destinationDomain, // The destination domain of the message
            gasAmount,
            address(this) // refunds are returned to this contract
        );
   }


    function commentERC1155(
        address token,
        uint256 tokenId,
        string calldata cid,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] memory proof
    ) public {
        verifyAndExecute(_msgSender(), root, nullifierHash, proof);
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

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further
    /// details)
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by
    /// the JS widget).
    /// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
    function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] memory proof) public {
        uint256 chainId;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainId := chainid()
        }

        /// Only works in Polygon chain currently
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

    function _writeCommentERC721() onlyCallback() external {
        emit CommentERC721(0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6, _msgSender(), '3');
    }

    receive() external payable {}
}
