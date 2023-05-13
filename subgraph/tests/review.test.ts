import {
    describe,
    test,
    clearStore,
    beforeEach,
    afterEach
} from 'matchstick-as/assembly/index';
import { Address } from '@graphprotocol/graph-ts';
import { handleCommentERC20, handleCommentERC721  } from '../src/review';
import { createCommentERC20Event, createCommentERC721Event } from './review_utils';
import { CommentERC20, CommentERC721 } from '../src/types/Review/Review';

let commentERC20Event: CommentERC20;
let commentERC721Event: CommentERC721;
describe('Scoped / Nested block', () => {
    beforeEach(() => {
        const token = Address.fromString(
            '0x0000000000000000000000000000000000000001'
        );
        const sender = Address.fromString(
            '0x0000000000000000000000000000000000000002'
        );
        const cid = 'cid';
        commentERC20Event = createCommentERC20Event(token, sender, cid);
        handleCommentERC20(commentERC20Event);
        commentERC721Event = createCommentERC721Event(token, sender, cid);
        handleCommentERC721(commentERC721Event);
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
});
