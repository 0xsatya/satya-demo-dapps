// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract BankDapp {
    uint256 totalBankBalance;
    address payable public owner;
    mapping(address => uint256) userBankAccountBalances;

    constructor() {
        owner = payable(msg.sender);
    }

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    event LogDepositMade(address indexed _from, uint256);

    function deposit() public payable {
        require(address(msg.sender).balance > msg.value, "User has not sufficient balance");
        totalBankBalance += msg.value;
        userBankAccountBalances[msg.sender] += msg.value;
        emit LogDepositMade(msg.sender, msg.value);
    }

    event LogWithdrawMade(address indexed, uint256);

    // function withdraw() public {
    //     require(userBankAccountBalances[msg.sender] > msg.value, "Your Bank Account balance is low");
    //     require(totalBankBalance > msg.value, "Withdrawal can't be made as Bank balance is low");
    //     totalBankBalance -= msg.value;
    //     userBankAccountBalances[msg.sender] -= msg.value;
    //     // address to = payable(msg.sender);
    //     // (bool sent, bytes memory data) = to.call{value: msg.value}("");
    //     (bool sent,) = payable(address(msg.sender)).call{value: msg.value}("");
    //     // bool sent = payable(msg.sender).send(msg.value);
    //     require(sent, "Failed to withdraw money");
    //     emit LogWithdrawMade(msg.sender, msg.value);
    // }
    function withdrawMoney(address payable _to, uint _amount) public {
        require(address(msg.sender) == address(_to), "You can transfer money to your account only");
        require(userBankAccountBalances[_to] >= _amount, "Your Bank Account balance is low");
        require(totalBankBalance >= _amount, "Withdrawal can't be made as Bank balance is low");
        totalBankBalance -= _amount;
        userBankAccountBalances[_to] -= _amount;
        (bool sent,) = payable(address(_to)).call{value: _amount}("");
        require(sent, "Failed to withdraw money");
        emit LogWithdrawMade(msg.sender, _amount );
    }

    function withdrawAllBankBalance() public payable {
        require(address(msg.sender) == owner, "Only owner of the Bank can perform this function");
        userBankAccountBalances[msg.sender] -= msg.value;
        // (bool sent, bytes memory data) = to.call{value: totalBankBalance}("");
        (bool sent, ) = payable(msg.sender).call{value: totalBankBalance}("");

        require(sent, "Failed to send money");
        totalBankBalance = 0;
        emit LogWithdrawMade(msg.sender, totalBankBalance);
    }

    function userBankAccountBalance() public view returns (uint256) {
        return userBankAccountBalances[msg.sender];
    }
    function userBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    function totalBankDappBalance() public view returns (uint256) {
        return totalBankBalance;
    }
    function bankBalance() public view returns (uint256) {
        return payable(address(this)).balance;
    }
}
