import { newMockEvent } from 'matchstick-as';
import { ethereum, Address } from '@graphprotocol/graph-ts';
import { CommentERC20 } from '../src/types/Review/Review';

export function createCommentERC20Event(
    token: Address,
    sender: Address,
    cid: string
): CommentERC20 {
    const transferEvent = changetype<CommentERC20>(newMockEvent());
    transferEvent.parameters = [
        new ethereum.EventParam('from', ethereum.Value.fromAddress(token)),
        new ethereum.EventParam('to', ethereum.Value.fromAddress(sender)),
        new ethereum.EventParam(
            'cid',
            ethereum.Value.fromString(cid)
        )
    ];

    return transferEvent;
}