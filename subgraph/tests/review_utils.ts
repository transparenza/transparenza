import { newMockEvent } from 'matchstick-as';
import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts';
import { CommentERC20, CommentERC721, CommentERC1155 } from '../src/types/Review/Review';

export function createCommentERC20Event(
    token: Address,
    sender: Address,
    cid: string
): CommentERC20 {
    const transferEvent = changetype<CommentERC20>(newMockEvent());
    transferEvent.parameters = [
        new ethereum.EventParam('token', ethereum.Value.fromAddress(token)),
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
        new ethereum.EventParam(
            'cid',
            ethereum.Value.fromString(cid)
        )
    ];

    return transferEvent;
}

export function createCommentERC721Event(
    token: Address,
    sender: Address,
    cid: string
): CommentERC721 {
    const transferEvent = changetype<CommentERC721>(newMockEvent());
    transferEvent.parameters = [
        new ethereum.EventParam('token', ethereum.Value.fromAddress(token)),
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
        new ethereum.EventParam(
            'cid',
            ethereum.Value.fromString(cid)
        )
    ];

    return transferEvent;
}

export function createCommentERC1155Event(
    token: Address,
    tokenId: BigInt,
    sender: Address,
    cid: string
): CommentERC1155 {
    const transferEvent = changetype<CommentERC1155>(newMockEvent());
    transferEvent.parameters = [
        new ethereum.EventParam('token', ethereum.Value.fromAddress(token)),
        new ethereum.EventParam(
            'tokenId',
            ethereum.Value.fromUnsignedBigInt(tokenId)
        ),
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
        new ethereum.EventParam(
            'cid',
            ethereum.Value.fromString(cid)
        )
    ];

    return transferEvent;
}