## Avoiding Common Attacks  
### Reentrancy
To avoid reentrancy attacks, at all payable functions, internal work is done before the external function call. So all balance adjusting jobs of internal smart contract logic, are done before actually sending ether to out of the contract. Also to prevent these kind of reentracy attacks, at payable functions transfer() method is used instead of call.value().
### Cross-Function Race Conditions
Since no payable functions share the same state, there is no chance of race condition occuring. All the funcions that have jobs related to the ether value transfer, do their job independently, no other funciton is called inside of these functions.
### Timestamp Dependence
Since our application has no logic dependent to timestamp, it is protected against timestamp manuplations.
### Integer Overflow and Underflow
To avoid integer overflow and underflow all mathematical operations in all of the contract functions are changed with openzeppelin's SafeMath library functions. So all mathematical operations in the smart contract are made using SafeMath library.
### DoS with (Unexpected) Revert
To avoid DoS with (unexpected) revert attacks, pull over push methadology is followed at payment functions. So buyProduct and withdraw store balance to owner functions are independent of each other.
### DoS with Block Gas Limit
To avoid DoS with Block Gas Limit, again pull over push methadology is followed as expalined above. Also at payment functions, any kind of loops are avoided.
## Forcibly Sending Ether to a Contract
No smart contract logic is dependent on smart contract's balance, so our smart contract is nothing to do with contract balance and there is no way that balance of the contract can affect contract's working mechanism.
## External Contracts and Libraries
All of the imported contracts and libraries are well audited and tested resources from Zeppelin. (Ownable, Pausable, SafeMath)
