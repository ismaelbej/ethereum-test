const Web3 = require('web3');
const solc = require('solc');

const web3 = new Web3("http://localhost:8545");

const recipientSource = `
pragma solidity ^0.4.20;
contract Recipient {
  uint public id;
  function deposit(uint _id) public payable {
    id = _id;
  }
}`;

function compileContract(source, name) {
  const result = solc.compile(source, 1);
  const compiled = result.contracts[`:${name}`];
  return compiled;
}

async function deployQueryContract() {
  const compiled = compileContract(recipientSource, 'Recipient');

  const accounts = await web3.eth.personal.getAccounts();

  const Recipient = new web3.eth.Contract(JSON.parse(compiled.interface));
  const recipient = await Recipient.deploy({
    data: `0x${compiled.bytecode}`
  })
  .send({
    from: accounts[0],
    gas: 2000000,
    gasPrice: '30000000000'
  });

  console.log(`Deployed at: ${recipient.options.address}`);
  // console.log(JSON.stringify(result, null, '  '));

  await recipient.methods.deposit(4321)
  .send({
    from: accounts[0],
    value: 1000
  });

  const result = await recipient.methods.id().call();
  console.log(`Result: ${result}`);
}

deployQueryContract();
