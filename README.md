# Marketplace-DApp
Please do not start evaluation before reading the important notes below.
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
-- See other store owner's products.
#### Shopper
Shopper is able to purchase the product.
## Prerequisites
Node.js (https://nodejs.org/en/)  
NPM (https://www.npmjs.com/get-npm)  
Truffle (https://truffleframework.com/docs/truffle/getting-started/installation)   
Ganache-CLI (https://github.com/trufflesuite/ganache-cli/blob/develop/README.md)  
Metamask (https://metamask.io)  

Google Chrome seems work better than Firefox with Metamask extension.  
  
Here it is how I set up my virtual box with ubuntu for evaluation:  
After I have installed virtual box and ubuntu on it, I hava started ubuntu on virtual box and opened terminal:    
1 ```sudo apt-get update```  
2 ```sudo apt-get install build-essential```  
3 ```sudo apt-get install libssl-dev```  
4 ```sudo apt-get install curl```  
5 ```sudo apt-get install git```  
6 ```sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash```  
7 ```nvm install node```  
8 ```npm install -g truffle```  
9 ```npm install -g ganache-cli```  
## Running The App
1. Download the app from this repository.  
2. Inside of the file downloaded open terminal and command to prepare " node_modules " file:  
```npm install```  
#### Run Tests
In terminal go the downloaded file.  
```cd Marketplace-Dapp-Master```  
At here open an another tab. In that tab run Ganache-cli:    
```ganache-cli```  
Then at the previously opened terminal run these commands to run the tests:    
``` truffle test --reset ```   
.  
##### ------ !!! Important Note !!! ------
Test run should be made on new and clean ganache session:  
Every time to run tests, existing already used ganache-cli should be terminated (close the tab) and new ganache session (at new terminal session run the command described above) should be started so accounts with required ethers will be assigned again. Because nearly all of the ether that ganache account has, have been consumed at 1 test run.  
##### ------ ------ 
#### Running App And Website
##### ------ !!!! Important Note !!! ------
At this stage do not use ganache session that test runs are made on. Use new one. After the test run, close and open a new ganache session (ganache-cli)  
##### ------ ------  
For the conveniece please terminate the ganache session by closing the terminal tab. Then restart a new one as described above. Once the ganache session is started again:  
1. Find and copy the Mnemonic seed phrases at the top of the ganache session.  
2. Open browser and the Metamask extension of the browser.
3. Click " import using account seed phrase " at the metamask. If this option is unavailable changing the network may help.  
4. Complete step 3 with the Mnemonic seed phrases copied from ganache and with your new unimportant password. 
5. Change network at the Metamask to " local host 8545 ".   
6. In the terminal that opened at the inside of the app folder run these truffle commands:  
```
truffle compile --reset
truffle migrate --reset
```
7. Open a new terminal tab in the app folder again then run web server command:  
```npm run start```
8. Go to "localhost:3000" in the browser and app website should be waiting for you :)  
  
App may work slowly especially on virtual box so please wait for the website's response everytime you get in touch with it.
#### Website Interactions
Metamask by default only show the first account of the ganache, for interacting with the website with different user roles, just click "add account" option at the metamask settings. Add 2-3 new accounts so there will be enough accounts to see what every user role can do. At the admin account's page(I mean the page when account 1 is selected at the metamask) where you give store owner authority, these addresses can be used to give store owner authorization. And by changing the account at the metamask, store owner role and shopper role can be examined.

At metamask related problems, reset account option at metamask settings or closing and re-openig of browser may help.

