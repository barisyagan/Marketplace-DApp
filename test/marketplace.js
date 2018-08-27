const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', async (accounts) => {
  

  describe('unit testing of smart function methods',() => {
    
    let marketplace;

    beforeEach(async () => {
      marketplace = await Marketplace.new({from: accounts[0]});
      await marketplace.giveOwnerAuthority(accounts[1], {from: accounts[0]});
      await marketplace.giveOwnerAuthority(accounts[2], {from: accounts[0]});
      await marketplace.addStore(0x61616100000000000000000000000000, {from: accounts[1]});
      await marketplace.addStore(0x62626200000000000000000000000000, {from: accounts[2]})
      await marketplace.addProduct(0, 0x6465736b000000000000000000000000, 4, 4, {from: accounts[1]});
      await marketplace.addProduct(0, 0x736f6661000000000000000000000000, 5, 5, {from: accounts[1]});
      await marketplace.addProduct(1, 0x6a65616e000000000000000000000000, 3, 3, {from: accounts[2]})
      await marketplace.buyProduct(0, 1, 1, {from: accounts[8], value: web3.toWei(5, 'ether')})
      await marketplace.buyProduct(1, 0, 1, {from: accounts[8], value: web3.toWei(3, 'ether')})
    }) 
    

    it('Should give store owner authority and emit event.', async () => {
      var eventEmitted = false
      var event = marketplace.GiveOwnerAuthority()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      var newAddress = accounts[2]
      
      await marketplace.giveOwnerAuthority(newAddress, {from: accounts[0]})

      var expected = 1 //Owner

      var result = await marketplace.getAuthorityOf(newAddress, {from: accounts[0]})
      result = result.c[0]

      assert.equal(result, expected, 'Owner authority is not set for new address.')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted.')
    })

    it('Should withdraw store balance to owner and emit event.', async () => {
      var eventEmitted = false
      var event = marketplace.Withdraw()
      await event.watch((err,res) => {
        eventEmitted = true
      })
      
      var storeOwnerBalanceExpected = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether').toNumber() + 5
      await marketplace.withdraw(0, {from: accounts[1]})
      var storeOwnerBalanceResult =  web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether').toNumber()

      var storeBalanceResult = await marketplace.balances.call(0)
      storeBalanceResult = storeBalanceResult.c[0]
      var storeBalanceExpected = 0

      assert.closeTo(storeOwnerBalanceResult, storeOwnerBalanceExpected, 0.05, 'Owner should receive')
      assert.equal(storeBalanceResult, storeBalanceExpected, 'Store balance should be zero')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted.')
    })

    it('Should remove store and emit event.', async() => {
      var eventEmitted = false
      var event = marketplace.RemoveStore()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      await marketplace.removeStore(0, {from: accounts[1]})

      var storeNameResult = await web3.toAscii(await marketplace.storeNameList.call(0))
      storeNameResult = storeNameResult.substring(0,3)
      var storeNameExpected = "bbb"

      var productListSizeResult = await marketplace.productListSize.call(0)
      productListSizeResult.c[0]
      var productListSizeExpected = 1

      var storeOwnerListResult = await marketplace.storeOwnerList.call(0)
      var storeOwnerListExpected = accounts[2]


      assert.equal(storeNameResult, storeNameExpected, 'Store name should be updated')
      assert.equal(productListSizeResult, productListSizeExpected, 'ProductListSize should be updated')
      assert.equal(storeOwnerListResult, storeOwnerListExpected, 'StoreOwnerList should be updated')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted')
    })

    it('Should add store and emit event.', async() => {
      var eventEmitted = false
      var event = marketplace.AddStore()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      await marketplace.addStore("ccc", {from: accounts[1]})

      var storeNameResult = await web3.toAscii(await marketplace.storeNameList.call(2))
      storeNameResult = storeNameResult.substring(0,3)
      var storeNameExpected = "ccc"

      var storeBalanceResult = (await marketplace.balances.call(2)).c[0]
      var storeBalanceExpected = 0

      var storeOwnerListResult = await marketplace.storeOwnerList.call(2)
      var storeOwnerListExpected = accounts[1]

      var marketplaceSizeResult = await marketplace.marketplaceSize.call()
      var marketplaceSizeExpected = 3

      assert.equal(storeNameResult, storeNameExpected, 'Store name should be assigned')
      assert.equal(storeBalanceResult, storeBalanceExpected, 'Store balance should be assigned as 0')
      assert.equal(storeOwnerListResult, storeOwnerListExpected, 'Store owner should be assigned')
      assert.equal(marketplaceSizeResult, marketplaceSizeExpected, 'Marketplace size should be updated')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted')
    })

    it('Should buy product and emit event.', async() => {
      var eventEmitted = false
      var event = marketplace.BuyProduct()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      await marketplace.buyProduct(0, 0, 1, {from: accounts[8], value: web3.toWei(4, 'ether')})

      var storeBalanceResult = await web3.fromWei(await marketplace.balances.call(0), 'ether').c[0]
      var storeBalanceExpected = 9

      var productQuantityResult = await marketplace.productList.call(0x6465736b000000000000000000000000)
      productQuantityResult = productQuantityResult[1]
      productQuantityResult = productQuantityResult.c[0]
      var productQuantityExpected = 3

      assert.equal(storeBalanceResult, storeBalanceExpected, 'Store balance should be updated')
      assert.equal(productQuantityResult, productQuantityExpected, 'Product quantity should be updated')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted')    
    })

    it('Should modify product and emit event', async() => {
      var eventEmitted = false
      var event = marketplace.ModifyProduct()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      await marketplace.modifyProduct(0, 0, 1, 1, {from: accounts[1]})

      var modifiedProduct = await marketplace.productList.call(0x6465736b000000000000000000000000)
      
      var productQuantityResult = modifiedProduct[1].c[0]
      var productQuantityExpected = 1

      var productPriceResult = modifiedProduct[2].c[0]
      var productPriceExpected = 1

      assert.equal(productQuantityResult, productQuantityExpected, 'Product quantity should be updated')
      assert.equal(productPriceResult, productPriceExpected, 'Product price should be updated')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted')
    })

    it('Should remove product and emit event', async() => {
      var eventEmitted = false
      var event = marketplace.RemoveProduct()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      await marketplace.removeProduct(0, 0, {from: accounts[1]})

      var productResult = await marketplace.marketplace.call(0x61616100000000000000000000000000,0)
      productResult = await web3.toAscii(productResult)
      productResult = productResult.substring(0,4)
      var productExpected = "sofa"

      var productListSizeResult = (await marketplace.productListSize.call(0)).c[0]
      var productListSizeExpected = 1

      assert.equal(productResult, productExpected, 'Product should be updated')
      assert.equal(productListSizeResult, productListSizeExpected, 'Product list size shoul be updated')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted') 
    })

    it('Should add product and emit event', async() => {
      var eventEmitted = false
      var event = marketplace.AddProduct()
      await event.watch((err,res) => {
        eventEmitted = true
      })

      await marketplace.addProduct(0, "chair", 2, 2, {from: accounts[1]})
      
      var newProduct = await marketplace.productList.call(await web3.toHex("chair"))
      newProductNameResult = await web3.toAscii(newProduct[0])
      newProductNameResult= newProductNameResult.substring(0,5)
      newProductNameExpected = "chair"
      newProductQuantityResult = (newProduct[1]).c[0]
      newProductQuantityExpected = 2
      newProductPriceResult = (newProduct[2]).c[0]
      newProductPriceExpected = 2

      var productNameInListResult = await marketplace.marketplace.call(0x61616100000000000000000000000000,2)
      productNameInListResult = await web3.toAscii(productNameInListResult)
      productNameInListResult = productNameInListResult.substring(0,5)
      var productNameInListExpected = "chair"

      var productListSizeResult = (await marketplace.productListSize.call(0)).c[0]
      var productListSizeExpected = 3

      assert.equal(newProductNameResult, newProductNameExpected, 'New product name should be assigned')
      assert.equal(newProductQuantityResult, newProductQuantityExpected, 'New product quantity should be assigned')
      assert.equal(newProductPriceResult, newProductPriceResult, 'New product price should be assigned')
      assert.equal(productNameInListResult, productNameInListExpected, 'Product in product list should be assigned')
      assert.equal(productListSizeResult, productListSizeExpected, 'Product list size should be updated')
      assert.equal(eventEmitted, true, 'Relevant event should be emitted')
    })
  })
})