import { log, BigInt } from '@graphprotocol/graph-ts';
import { CommentERC20, CommentERC721, CommentERC1155 } from './types/Review/Review';
import { CommentERC20Event, CommentERC721Event, CommentERC1155Event } from './types/schema';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_10K = BigInt.fromI32(10000);

export function handleCommentERC20(event: CommentERC20): void {

    const commentERC20Event = new CommentERC20Event(
        event.transaction.hash.toHexString()
    );

    commentERC20Event.token = event.params.token.toHexString();
    commentERC20Event.sender = event.params.sender.toHexString();
    commentERC20Event.cid = event.params.cid;
    commentERC20Event.blockNumber = event.block.number;
    commentERC20Event.blockTimestamp = event.block.timestamp;
    commentERC20Event.save();

    log.info('Log Event Block: {} Time: {} token: {} sender: {} cid: {}', [
        event.block.number.toString(),
        event.block.timestamp.toString(),
        event.params.token.toHexString(),
        event.params.sender.toHexString(),
        event.params.cid
    ]);
}

export function handleCommentERC721(event: CommentERC721): void {

    const commentERC721Event = new CommentERC721Event(
        event.transaction.hash.toHexString()
    );

    commentERC721Event.token = event.params.token.toHexString();
    commentERC721Event.sender = event.params.sender.toHexString();
    commentERC721Event.cid = event.params.cid;
    commentERC721Event.blockNumber = event.block.number;
    commentERC721Event.blockTimestamp = event.block.timestamp;
    commentERC721Event.save();

    log.info('Log Event Block: {} Time: {} token: {} sender: {} cid: {}', [
        event.block.number.toString(),
        event.block.timestamp.toString(),
        event.params.token.toHexString(),
        event.params.sender.toHexString(),
        event.params.cid
    ]);
}

export function handleCommentERC1155(event: CommentERC1155): void {

    const commentERC1155Event = new CommentERC1155Event(
        event.transaction.hash.toHexString()
    );

    commentERC1155Event.token = event.params.token.toHexString();
    commentERC1155Event.tokenId = event.params.tokenId;
    commentERC1155Event.sender = event.params.sender.toHexString();
    commentERC1155Event.cid = event.params.cid;
    commentERC1155Event.blockNumber = event.block.number;
    commentERC1155Event.blockTimestamp = event.block.timestamp;
    commentERC1155Event.save();

    log.info('Log Event Block: {} Time: {} token: {} tokenId: {} sender: {} cid: {}', [
        event.block.number.toString(),
        event.block.timestamp.toString(),
        event.params.token.toHexString(),
        event.params.tokenId.toString(),
        event.params.sender.toHexString(),
        event.params.cid
    ]);
}


