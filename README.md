# Marketplace-DApp
## Description
This demo applicaiton is a decantralized online marketplace where users can sell & buy their goods and acquire their financial transactions without any 3rd party intervention. In the app there are three user roles:
#### Admin
Admin is the deployer of the contract and can give the permission to open a store to the users via their ethereum account addresses. Also Admin can pause and unpause the smart contract upon necessary emergency situtaions.
#### Store Owner
Store Owner is able to:  
-- Add new store to the marketplace.  
-- Add new product to the store.  
-- Remove product from the store.  
-- Modify the product related data such as price and quantity.  
-- Remove the store from the marketplace.  
-- Withdraw the amount accumulated at the store balance to his personal account.
#### Shopper
Shopper is able to purchase the product.
## Prerequisites
Node.js (https://nodejs.org/en/)  
NPM (https://www.npmjs.com/get-npm)  
Truffle (https://truffleframework.com/docs/truffle/getting-started/installation)   
Ganache-CLI (https://github.com/trufflesuite/ganache-cli/blob/develop/README.md)  
Metamask (https://metamask.io)
## Running The App
Download the app from this repository.
#### Run Tests
In terminal go the downloaded file.  
```cd Marketplace-Dapp```  
At here open and another tab. In that tab run Ganache-cli:    
```ganache-cli```  
Then at the previously opened terminal run these commands to run the tests:    
```
truffle compile --reset  
truffle migrate --reset  
truffle test --reset 
```
#### Running App And Website
For the conveniece please terminate the ganache session by closing the terminal tab. Then restart a new one as described above. Once the ganache session is started again:  
1. Find and copy the mnemic key words at the top of the ganache session.  
2. Open browser and the Metamask extension of the browser.
3. Click " import using account seed phrase " at the metamask. If this option is unavailable changing the network may help.  
4. Complete step 3 with the seed phrases copied from ganache and wtih your new unimportant password. 
5. Change network at the Metamask to " local host 8545 ".   
6. In the terminal that opened at the inside of the app folder run these truffle commands:  
```
truffle compile --reset
truffle migrate --reset
```




