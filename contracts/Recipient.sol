pragma solidity ^0.7.0;

contract Recipient {
  uint public id;

  function deposit(uint _id) public payable {
    id = _id;
  }
}
