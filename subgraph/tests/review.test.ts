import {
    describe,
    test,
    clearStore,
    beforeEach,
    afterEach
} from 'matchstick-as/assembly/index';
import { BigInt, Address } from '@graphprotocol/graph-ts';
import { handleCommentERC20, handleCommentERC721, handleCommentERC1155  } from '../src/review';
import { createCommentERC20Event, createCommentERC721Event, createCommentERC1155Event } from './review_utils';
import { CommentERC20, CommentERC721, CommentERC1155 } from '../src/types/Review/Review';

let commentERC20Event: CommentERC20;
let commentERC721Event: CommentERC721;
let commentERC1155Event: CommentERC1155;
describe('Scoped / Nested block', () => {
    beforeEach(() => {
        const token = Address.fromString(
            '0x0000000000000000000000000000000000000001'
        );
        const sender = Address.fromString(
            '0x0000000000000000000000000000000000000002'
        );
        const cid = 'cid';
        const tokenId = BigInt.fromI32(0);
        commentERC20Event = createCommentERC20Event(token, sender, cid);
        handleCommentERC20(commentERC20Event);
        commentERC721Event = createCommentERC721Event(token, sender, cid);
        handleCommentERC721(commentERC721Event);
        commentERC1155Event = createCommentERC1155Event(token, tokenId, sender, cid);
        handleCommentERC1155(commentERC1155Event);
    });
    afterEach(() => {
        clearStore();
    });

    test('Comment Review ERC20', () => {
        commentERC20Event = createCommentERC20Event(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            'cid'
        );
        handleCommentERC20(commentERC20Event);
    });

    test('Comment Review ERC721', () => {
        commentERC721Event = createCommentERC721Event(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            'cid'
        );
        handleCommentERC721(commentERC721Event);
    });

    test('Comment Review ERC1155', () => {
        commentERC1155Event = createCommentERC1155Event(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            BigInt.fromI32(0),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            'cid'
        );
        handleCommentERC1155(commentERC1155Event);
    });
});
