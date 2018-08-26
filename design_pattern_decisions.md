## Design Pattern Decisions
#### Fail Early and Fail Loud
All of the condition checkings in functions are made as early as possible via modifiers or inline checking before function body which guarantees failing early. Also every condition check is made with require keyword which guarantees failing loudly. All of these reduce unnecessary code execution. 
#### Restricting Access
Our app uses user roles such as Admim, Store Owner, Shopper. Access to some functions in the contract is restricted to the  some designated user roles only. By following this design pattern, user experinece and capabilities of the app differentiates according to the authorization of the user and which user role is assigned to the current address. Also some contract related mechanisms such as pausing the contract's run is restricted and accesible only by the Admin.     
#### Pull over Push Payments
Pull over Push Payment design pattern is followed to handle financial payment functionalities of the contract since this pattern is one of the best ways to get protected against re-entrancy and denial of service attacks. So to follow this pattern, payment function at the product buy stage and withrawing the store's balance to the store owner are totally seperated from each other.
#### Circuit Braker
Circuit Braker (pausable) is applied on to every function of the smart contract. So in case of an emergency whole functionality of the contract can be stopped by Admin to avoid continuation of the bug exploitation. After the fix implemented, smart contract can be unpaused again by Admin and can continue to function as intended.
 
