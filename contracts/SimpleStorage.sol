// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public data;
    uint256 public contractEtherBalance;
    address payable owner;
    mapping(address => uint256) public userBalances;

    constructor() {
        owner = payable(msg.sender);
    }

    function updateData(uint256 _data) external {
        data = _data;
    }

    function readData() external view returns (uint256) {
        return data;
    }

    event LogDepositMade(address, uint256);

    function deposit() public payable {
        contractEtherBalance += msg.value;
        userBalances[msg.sender] += msg.value;
        emit LogDepositMade(msg.sender, msg.value);
    }

    event LogWithdrawMade(address, uint256);

    function withdraw() public payable {
        require(msg.sender == owner, "Only owner can call this function.");
        require(contractEtherBalance > msg.value, "Withdrawal can't be made as contract balance is low");
        contractEtherBalance -= msg.value;
        userBalances[msg.sender] -= msg.value;
        owner.transfer(msg.value);
        emit LogWithdrawMade(msg.sender, msg.value);
    }

    function totalBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function totalContractBalance() public view returns (uint256) {
        return contractEtherBalance;
    }

    
}
