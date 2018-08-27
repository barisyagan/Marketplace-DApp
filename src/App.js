import React, { Component } from 'react';
import './App.css';
import MyTable from './MyTable';
import getWeb3 from './utils/getWeb3'
import MarketplaceContract from '../build/contracts/Marketplace.json'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      contract: null,
      account: null,
      data: [],
      authority: 0,
      isPaused: false
    }

  }

  componentDidMount = async () => {

    // Get network provider and web3 instance.
    var web3 = null
    var myAccount = null
    var marketplaceInstance = null
    
    await getWeb3.then(results => {
      web3 = results.web3
    })
    const contract = require('truffle-contract')
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(web3.currentProvider)

    myAccount = await web3.eth.accounts[0]

    await marketplace.deployed().then((instance) => {
          marketplaceInstance = instance
    })
   
    var authority = await this.fetchAuthority(marketplaceInstance, web3.eth.accounts[0])

    //console.log(111)
    var isPaused = await marketplaceInstance.paused.call()
  
    var accountInterval = setInterval(async () => {
      if (web3.eth.accounts[0] !== myAccount) {
        myAccount = web3.eth.accounts[0];
        authority = await this.fetchAuthority(marketplaceInstance, myAccount)
        this.setState({account: myAccount, authority: authority})
      }
    }, 100);
      
    const data = await this.fetchData(web3, marketplaceInstance)
    
    this.watchEvents(marketplaceInstance,web3)


    this.setState({web3: web3, contract: marketplaceInstance, account: myAccount, data: data, authority: authority, isPaused: isPaused})
    
  }
    
  fetchAuthority = async (marketplaceInstance, myAccount) => {
    var authority = await marketplaceInstance.getAuthorityOf.call(myAccount)
    authority = authority.c[0]
    authority = this.translateAuthority(authority)
    return authority
  }

  fetchData = async (web3, marketplaceInstance) => {
    var marketplaceSize = await marketplaceInstance.getMarketplaceSize.call()
    marketplaceSize = marketplaceSize.c[0]
    
    var nameList = await marketplaceInstance.getStoreNameList.call()
    nameList = nameList.map(name => web3.toAscii(name)) 

    var balanceList = await marketplaceInstance.getBalances.call()
    balanceList = balanceList.map(number => web3.fromWei(number, 'ether').c[0])
 
    var sizeList = await marketplaceInstance.getProductListSize.call()
    sizeList = sizeList.map(number => number.c[0])

    var storeOwnerList = await marketplaceInstance.getStoreOwnerList.call()

    var totalPNum = 0
    sizeList.map(number => totalPNum += number)
    var productList = await marketplaceInstance.getProductList.call(totalPNum)
    productList[0] = productList[0].map(name => web3.toAscii(name))
    productList[1] = productList[1].map(quantity => quantity.c[0])
    productList[2] = productList[2].map(price => price.c[0])

    var tempData = []
    var num = 0;
    for (var i = 0; i < marketplaceSize; i++) {
      var tempPList = [];
      for (var j = 0; j < sizeList[i]; j++) {
        tempPList.push({name: productList[0][num], quantity: productList[1][num], price: productList[2][num], i: j});
          num++;
      }
        tempData.push({i: i, storeName: nameList[i], productList: tempPList, balance: balanceList[i], owner: storeOwnerList[i]});
    }

    return tempData
  }

  watchEvents = (contract,web3) => {
    
    var highestBlock = 0
    var allEvents = contract.allEvents({}, {fromBlock: '0', toBlock: 'latest'}) 
    allEvents.get((error, eventResult) => {
      if (!error && eventResult.length !== 0) { 
        let i = eventResult.length-1;
        highestBlock = highestBlock < eventResult[i].blockNumber ? eventResult[i].blockNumber : highestBlock;
      }
    })
    
    var removeProductEvent = contract.RemoveProduct({}, {fromBlock: 0, toBlock: 'latest'});
    removeProductEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.removeProductEventTriggered(result.args.storeId.c[0],result.args.productId.c[0])
      }
    })
    
    var addProductEvent = contract.AddProduct({}, {fromBlock: '0', toBlock: 'latest'});
    addProductEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.addProductEventTriggered(web3.toAscii(result.args.name), result.args.quantity.c[0], result.args.price.c[0], result.args.storeId.c[0])
      }
    }) 
    
    var addStoreEvent = contract.AddStore({}, {fromBlock: '0', toBlock: 'latest'});
    addStoreEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.addStoreEventTriggered(web3.toAscii(result.args.name))
      }
    })

    var removeStoreEvent = contract.RemoveStore({}, {fromBlock: '0', toBlock: 'latest'});
    removeStoreEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.removeStoreEventTriggered(result.args.storeId.c[0])
      }
    })

    var modifyProductEvent = contract.ModifyProduct({}, {fromBlock: '0', toBlock: 'latest'});
    modifyProductEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.modifyProductEventTriggered(result.args.quantity.c[0], result.args.price.c[0], result.args.storeId.c[0], result.args.productId.c[0])
      }
    })

    var buyProductEvent = contract.BuyProduct({}, {fromBlock: '0', toBlock: 'latest'});
    buyProductEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.buyProductEventTriggered(result.args.storeId.c[0], result.args.productId.c[0], result.args.quantity.c[0])
      }
    })

    var withdrawEvent = contract.Withdraw({}, {fromBlock: '0', toBlock: 'latest'});
    withdrawEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.withdrawEventTriggered(result.args.storeId.c[0])
      }
    })

    var giveOwnerAuthorityEvent = contract.GiveOwnerAuthority({}, {fromBlock: '0', toBlock: 'latest'});
    giveOwnerAuthorityEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        if (this.state.account === result.args.account) {
          this.setState({authority: "Store Owner"})
        }
      }
    })

    var pauseEvent = contract.Pause({}, {fromBlock: '0', toBlock: 'latest'});
    pauseEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.setState({isPaused: true})
      }
    })

    var unpauseEvent = contract.Unpause({}, {fromBlock: '0', toBlock: 'latest'});
    unpauseEvent.watch((error, result) => {
      if (!error && result.blockNumber > highestBlock) {
        this.setState({isPaused: false})
      }
    })
  }

  handleSubmit = (e, quantity, price, i, j) => {
    this.state.contract.modifyProduct(i, j, quantity, price, {from: this.state.account})
    e.preventDefault();
  }


  modifyProductEventTriggered = (quantity, price, i, j) => {
    this.setState((prevState) => {
      var newData = prevState.data.slice();
      var newQuantity = quantity === "" ? newData[i].productList[j].quantity : quantity;
      var newPrice = price === "" ? newData[i].productList[j].price : price;
        
      newData[i].productList[j].quantity = newQuantity;
      newData[i].productList[j].price = newPrice;

      return {data: newData};
    });
  }

  removeStore = (e, storeIndex) => {
    if (this.state.data.length === 1) {
      this.state.contract.removeStore(storeIndex, {from: this.state.account, gas: 50000})
    } else {
      this.state.contract.removeStore(storeIndex, {from: this.state.account})
    }
    e.preventDefault();
  }

  removeStoreEventTriggered = (storeIndex) => {
    this.setState((prevState) => {
      var newData = prevState.data.slice()

      newData.splice(storeIndex, 1);
      var length = newData.length;
      for (var i = storeIndex; i < length; i++) {
        var oldI = newData[i].i;
        newData[i].i = oldI - 1;
      }
      return {data: newData};
    });
  }
  
  addStoreEventTriggered = (storeName) => {
    this.setState((prevState) => {
      var newData = prevState.data.slice()
      var newI = newData.length;
      var owner = prevState.account
      newData = [...newData, {
          i: newI,
          storeName: storeName,
          productList: [],
          balance: 0,
          owner: owner
        }]
        return {data: newData};
    });
  }

  addStore = (e, storeName) => {
    this.state.contract.addStore(storeName, {from: this.state.account})
    e.preventDefault()
  }
    
  addProductEventTriggered = (name, quantity, price, i) => {
    
    this.setState((prevState) => {
      var newData = prevState.data.slice();
      var newI = newData[i].productList.length;
      var newProductList = [...newData[i].productList, {
        name: name,
        quantity: quantity,
        price: price,
        i: newI
      }]
      newData[i].productList = newProductList;

      return {data: newData};
    });
  }
  
  handlePAdd = (e, name, quantity, price, i) => {
    this.state.contract.addProduct(i, name, quantity, price, {from: this.state.account})
    e.preventDefault()
  }

  removeProduct = (e, storeIndex, rowIndex) => {
    if (this.state.data[storeIndex].productList.length === 1) {
      this.state.contract.removeProduct(storeIndex, rowIndex, {from: this.state.account, gas: 50000})
    } else {
      this.state.contract.removeProduct(storeIndex, rowIndex, {from: this.state.account})
    }
   e.preventDefault()
  }

  removeProductEventTriggered = (storeIndex, rowIndex) => {
    
    this.setState((prevState) => {
      var newData = prevState.data.slice()

      newData[storeIndex].productList.splice(rowIndex, 1);
      var length = newData[storeIndex].productList.length;
      for (var i = rowIndex; i < length; i++) {
        var oldI = newData[storeIndex].productList[i].i;
        newData[storeIndex].productList[i].i = oldI - 1;
      }
      return {data: newData};
    });
  }

  buyProductEventTriggered = (storeIndex, productId, quantity) => {
    this.setState((prevState) => {
      var newData = prevState.data.slice()

      newData[storeIndex].productList[productId].quantity -= quantity
      newData[storeIndex].balance += newData[storeIndex].productList[productId].price*quantity
      
      return {data: newData};
    });
  }

  buyProduct = (e, storeIndex, productId, quantity) => {
    var total = this.state.data[storeIndex].productList[productId].price * quantity
    var totalInWei = this.state.web3.toWei(total, "ether")
    this.state.contract.buyProduct(storeIndex, productId, quantity, {from:this.state.account, value: totalInWei})
    e.preventDefault()
  }

  withdrawEventTriggered = (storeIndex) => {
    this.setState((prevState) => {
      var newData = prevState.data.slice()

      newData[storeIndex].balance = 0
      
      return {data: newData};
    });
  }
  
  withdraw = (e, storeIndex) => {
    this.state.contract.withdraw(storeIndex, {from:this.state.account})
    e.preventDefault()
  }

  giveOwnerAuthority = (e, newAddress) => {
    this.state.contract.giveOwnerAuthority(newAddress, {from: this.state.account})
    e.preventDefault()
  }
   
  translateAuthority = (i) => {
    if (i === 0) {
      return "Shopper"
    } else if (i === 1) {
      return "Store Owner"
    } else if (i === 2) {
      return "Admin"
    }
  }

  doesAlreadyStoreWithThisNameExists = (storeName) => {
    for (let store of this.state.data) {
      var tempStoreName = store.storeName.replace(/\0+/g, '')
      if (tempStoreName === storeName) {
        return true
      }
    }
    return false
  }

  doesAlreadyProductWithThisNameExists = (productName) => {
    for (let store of this.state.data) {
      for (let product of store.productList) {
        var tempProductName = product.name.replace(/\0+/g, '')
        if (tempProductName === productName) {
          return true
        }
      }
    }
    return false
  }

  pauseEverything = (e) => {
    
    this.state.contract.pause({from: this.state.account})
    e.preventDefault()
  }

  unpauseEverything = (e) => {
    this.state.contract.unpause({from: this.state.account})
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <p1>
          Current Account: {this.state.account} ({this.state.authority})
        </p1>
        {!this.state.isPaused && (
          <MyTable 
            data={this.state.data}
            handleSubmit={this.handleSubmit}
            removeProduct={this.removeProduct}
            handlePAdd={this.handlePAdd}
            removeStore={this.removeStore}
            addStore={this.addStore}
            buyProduct={this.buyProduct}
            withdraw={this.withdraw}
            giveOwnerAuthority={this.giveOwnerAuthority}
            authority={this.state.authority}
            account={this.state.account}
            doesAlreadyStoreWithThisNameExists={this.doesAlreadyStoreWithThisNameExists}
            doesAlreadyProductWithThisNameExists={this.doesAlreadyProductWithThisNameExists}
          />
        )}
        {this.state.isPaused && (
          <div> 
            <br/>
            <p2>An Emergency Occured, All Systems Have Been Stopped</p2>
          </div>
        )}
        {this.state.authority === "Admin" && (
          <div>
            <br/>
            <br/>
            Emergency 
            <br/>
            <br/>
            <button onClick={e => this.pauseEverything(e)}>!!!Emergency Pause Everything!!!</button>
            <br/>
            <br/>
            <button onClick={e => this.unpauseEverything(e)}>No Problem! Unpause</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
