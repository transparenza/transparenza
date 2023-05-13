// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {ERC1155} from "../../lib/solmate/src/tokens/ERC1155.sol";

contract MockERC1155 is ERC1155 {
    function mint(uint256 id, address to) public {
        _mint(to, id, 100, "");
    }

    function uri(uint256 id) public pure override returns (string memory) {
        return uri(id);
    }
}
