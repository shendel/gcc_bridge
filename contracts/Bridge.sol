// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ReentrancyGuard.sol";
import "./Ownable.sol";
import "./IERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GCCBridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    IERC20  public token;
    uint256 public refundTimeout = 7 days;

    enum RequestStatus {
        PENDING,
        READY,
        REJECT,
        REFUNDED
    }

    enum RejectAction {
        REFUND,
        BURN,
        RESOLVE
    }

    struct Request {
        uint256             id;
        address             from;
        address             to;
        uint256             amount;
        uint256             inUtx;
        uint256             outUtx;
        string              outTx;
        RequestStatus       status;
        string              remark;
    }

    mapping (uint256 => Request) private query;
    uint256 private count;

    mapping (address => uint256[]) private userSwaps;

    modifier onlyOracle() {
        require(msg.sender == owner(), "Only oracle");
        _;
    }
    modifier notContract() {
        require(msg.sender == tx.origin, "contract call not allowed");
        _;
    }

    function getUserRequests(address user, uint256 offset, uint256 limit)
        public
        view
        returns (Request[] memory ret)
    {
        uint256[] storage ids = userSwaps[user];

        if (offset >= ids.length) {
            return new Request[](0);
        }

        uint256 available = ids.length - offset;

        uint256 size = available > limit ? limit : available;
        ret = new Request[](size);
        for (uint256 i = 0; i < size; i++) {
            uint256 id = ids[ids.length - offset - i - 1];
            ret[i] = query[id];
        }
    }

    function getUserRequestsCount(address user) public view returns (uint256) {
        return userSwaps[user].length;
    }

    function getQueryLength() public view returns (uint256) {
        return count;
    }

    function getRequests(uint256 offset, uint256 limit) public view returns (Request[] memory ret) {
        if (offset >= count) {
            return new Request[](0);
        }

        uint256 available = count - offset;
        uint256 size = available > limit ? limit : available;

        ret = new Request[](size);

        for (uint256 i = 0; i < size; i++) {
            // uint256 id = count - offset - i;
            ret[i] = query[count - offset - i /* id */ ];
        }
    }

    constructor (address bridgeToken) Ownable (msg.sender) {
        require(bridgeToken != address(0), "Invalid token address");
        token = IERC20(bridgeToken);
    }

    function setRefundTimeout(uint256 _time) public onlyOwner {
        refundTimeout = _time;
    }

    function initBridge(uint256 amount) public nonReentrant notContract {
        require(token.allowance(msg.sender, address(this)) >= amount, "allowance");
        require(token.balanceOf(msg.sender) >= amount, "balanceOf");

        count++;
        uint256 requestId = count;

        query[requestId] = Request({
            id: count,
            from: msg.sender,
            to: msg.sender,
            amount: amount,
            inUtx: block.timestamp,
            outUtx: 0,
            status: RequestStatus.PENDING,
            outTx: "",
            remark: ""
        });

        userSwaps[msg.sender].push(requestId);

        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function approve(uint256 id, string memory outTx) public onlyOracle nonReentrant {
        require(query[id].id != 0, "Request does not exist");
        require(query[id].status == RequestStatus.PENDING, "not pending");
        require(token.balanceOf(address(this)) >= query[id].amount, "Not enough balance to burn");
        
        query[id].status = RequestStatus.READY;
        query[id].outTx = outTx;

        IERC20Burnable(address(token)).burn(query[id].amount);
    }

    function reject(
        uint256 id,
        RejectAction action,
        string memory remark
    ) public onlyOracle nonReentrant {
        require(query[id].id != 0, "Request does not exist");
        require(query[id].status == RequestStatus.PENDING, "not pending");
        
        Request storage req = query[id];

        req.status = RequestStatus.REJECT;
        req.remark = remark;

        if (action == RejectAction.REFUND) {
            token.safeTransfer(req.from, req.amount);
        }
        if (action == RejectAction.BURN) {
            IERC20Burnable(address(token)).burn(req.amount);
        }
    }

    function refund(uint256 id) public nonReentrant notContract {
        require(query[id].id != 0, "Request does not exist");
        require(query[id].from == msg.sender, "not allowed");
        require(query[id].status == RequestStatus.PENDING, "not pending");
        require(block.timestamp >= query[id].inUtx + refundTimeout, "Too early to refund");

        query[id].status = RequestStatus.REFUNDED;
        token.safeTransfer(query[id].from, query[id].amount);
    }

}