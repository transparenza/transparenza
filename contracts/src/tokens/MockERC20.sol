// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import {ERC20} from "../../lib/solmate/src/tokens/ERC20.sol";

contract MockERC20 is ERC20("Transparenza", "TRP", 18) {
    function mint(address to) public {
        _mint(to, 10000);
    }
}
