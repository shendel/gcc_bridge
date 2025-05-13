// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ReentrancyGuard.sol";
import "./Ownable.sol";
import "./IERC20Burnable.sol";
//import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GCCTargetBridge is Ownable, ReentrancyGuard {
    //using SafeERC20 for IERC20;
    IERC20Burnable  public token;
    
    struct Request {
        uint256             id;
        address             to;
        uint256             inAmount;
        uint256             rate;
        uint256             outAmount;
        uint256             outUtx;
    }

    mapping (uint256 => Request) private query;
    uint256 public bridgeRate = 100;

    modifier onlyOracle() {
        require(msg.sender == owner(), "Only oracle");
        _;
    }
    modifier notContract() {
        require(msg.sender == tx.origin, "contract call not allowed");
        _;
    }

    function getRequest(uint256 requestId) public view returns (Request memory) {
        return query[requestId];
    }
    constructor (address bridgeToken) Ownable (msg.sender) {
        require(bridgeToken != address(0), "Invalid token address");
        token = IERC20Burnable(bridgeToken);
    }

    function setBridgeRate(uint256 _rate) public onlyOwner {
        bridgeRate = _rate;
    }
    function getBridgeRate() public view returns (uint256) {
        return bridgeRate;
    }
    event BridgeIn(uint256 id, address to, uint256 inAmount, uint256 rate, uint256 outAmount);
    function bridgeIn(uint256 id, address to, uint256 inAmount) public onlyOracle nonReentrant notContract {
        uint256 outAmount = inAmount * bridgeRate;
        require(token.allowance(msg.sender, address(this)) >= outAmount, "allowance");
        require(token.balanceOf(msg.sender) >= outAmount, "balanceOf");
        require(query[id].id == 0, "Already processes");

        query[id] = Request({
            id:         id,
            to:         to,
            inAmount:   inAmount,
            outAmount:  outAmount,
            rate:       bridgeRate,
            outUtx: block.timestamp
        });

        token.transferFrom(msg.sender, to, outAmount);
        emit BridgeIn(id, to, inAmount, bridgeRate, outAmount);
    }
}