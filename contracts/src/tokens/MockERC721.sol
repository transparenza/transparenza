// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {ERC721} from "../../lib/solmate/src/tokens/ERC721.sol";

contract MockERC721 is ERC721("Transparenza", "TRP") {
    function mint(uint256 id, address to) public {
        _mint(to, id);
    }

    function tokenURI(uint256 id) public pure override returns (string memory) {
        return tokenURI(id);
    }
}
