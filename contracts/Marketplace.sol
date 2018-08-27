pragma solidity ^0.4.18;

import "./zeppelin_library/Pausable.sol";
import "./zeppelin_library/SafeMath.sol";

/** @title Online decantralized marketplace. */
contract Marketplace is Pausable {
  
  // Product data structure.
  struct Product {
    bytes32 name;
    uint quantity;
    uint price;
  }

  // Authorities of the app. 
  enum Authority {
    Shopper,
    Owner,
    Admin
  }

  // Total number of stores.
  uint public marketplaceSize;

  /*
    authorityList: Authorities defined to the addresses.
    balances: Balances of the stores.
    storeOwnerList: Owner addresses of the stores.
    storeNameList: Names of the store.
    productListSize: Product number of the stores.
    marketplace: Mapping[store name][product index] = product name
    productList: List of all products.
  */
  mapping (address => Authority) public authorityList;  
  mapping (uint => uint) public balances;
  mapping (uint => address) public storeOwnerList;
  mapping (uint => bytes32) public storeNameList;
  mapping (uint => uint) public productListSize;
  mapping (bytes32 => mapping (uint => bytes32)) public marketplace;
  mapping (bytes32 => Product) public productList; 

  // Events.
  event BuyProduct(uint storeId, uint productId, uint quantity);
  event AddProduct(uint storeId, bytes32 name, uint quantity, uint price);
  event RemoveProduct(uint storeId, uint productId);
  event AddStore(bytes32 name);
  event RemoveStore(uint storeId);
  event ModifyProduct(uint storeId, uint productId, uint quantity, uint price);
  event Withdraw(uint storeId);
  event GiveOwnerAuthority(address account);

  /** @dev Checks whether the function caller is the owner of the store with given store index.
    * @param storeId Index of the store.
    */
  modifier onlyOwnerOf(uint storeId) {
    require(storeOwnerList[storeId] == msg.sender, "Only owner of the store!");
    _;
  }

  /** @dev Checks whether the function caller has store owner authorisation or not.
    */
  modifier onlyStoreOwner() {
    require(authorityList[msg.sender] == Authority.Owner, "Only owner province!");
    _;
  }

  /** @dev Checks whether the function caller is admin or not.
    */
  modifier onlyAdmin() {
    require(authorityList[msg.sender] == Authority.Admin, "Only admin!");
    _;
  }
  
  constructor() public {
    // Deployer of the contract gains Admin authority.
    authorityList[msg.sender] = Authority.Admin;
    
  }

  /** @dev Retrieves marketplace size (number of stores).
    * @return // How many stores does marketplace has (uint).
    */
  function getMarketplaceSize() public view returns (uint) {
    return marketplaceSize;
  }

  /** @dev Retrieves list of how many product variety do stores have.
    * @return // List of how many product variety do stores have. (uint[]).
    */
  function getProductListSize() public view returns (uint[]) {
    uint[] memory pListSize = new uint[](marketplaceSize);
    for (uint i = 0; i<marketplaceSize; i++) {
      pListSize[i] = productListSize[i];
    }
    return pListSize;
  }
  
  /** @dev Retrieves list of store names.
    * @return // List of store names (bytes32[]).
    */
  function getStoreNameList() public view returns (bytes32[]) {
    bytes32[] memory tempStoreNameList = new bytes32[](marketplaceSize);
    for (uint i = 0; i<marketplaceSize; i++) {
      tempStoreNameList[i] = storeNameList[i];
    }
    return tempStoreNameList;
  }

  /** @dev Retrieves list of store names.
    * @param totalPNum Total product variaty number of all marketplace.
    * @return // (list of all products' names, 
    *             list of all products' quantities, 
    *             list of all products' prices) 
    *             (bytes32[], uint[], uint[])
    */
  function getProductList(uint totalPNum) public view returns (bytes32[],uint[],uint[]) {
    
    bytes32[] memory tempNameList = new bytes32[](totalPNum);
    uint[] memory tempQuantityList = new uint[](totalPNum);
    uint[] memory tempPriceList = new uint[](totalPNum);
    uint num = 0;

    for (uint i = 0; i<marketplaceSize; i++) {
      for (uint j = 0; j<productListSize[i]; j++) {
        tempNameList[num] = productList[marketplace[storeNameList[i]][j]].name;
        tempQuantityList[num] = productList[marketplace[storeNameList[i]][j]].quantity;
        tempPriceList[num] = productList[marketplace[storeNameList[i]][j]].price;
        num = SafeMath.add(num, 1);//num++;
      }
    }
    return (tempNameList,tempQuantityList,tempPriceList);
  }

  /** @dev Retrieves list of store owner addresses.
      * @return // List of store owner addresses (address[]).
      */
  function getStoreOwnerList() public view returns (address[]) {
    address[] memory tempStoreOwnerList = new address[](marketplaceSize);
    for(uint i = 0; i<marketplaceSize; i++) {
      tempStoreOwnerList[i] = storeOwnerList[i];
    }
    return tempStoreOwnerList;
  }

  /** @dev Retrieves list of stores' balances based on their index.
    * @return // List of stores' balances (uint[]).
    */
  function getBalances() public view returns (uint[]) {
    uint[] memory tempBalanceList = new uint[](marketplaceSize);
    for(uint i = 0; i<marketplaceSize; i++) {
      tempBalanceList[i] = balances[i];
    }
    return tempBalanceList;
  }

  /** @dev Retrieves authority of address account.
    * @return // Authority (enum value) of account address (Authority).
    */
  function getAuthorityOf(address account) public view returns (Authority) {
    return authorityList[account];
  }

  /** @dev Adds product to relevant store with given name, quantity, price values.
    * @param storeId Index number of the store that the porduct will be added in.
    * @param name Name of the new product.
    * @param quantity Quantity of the new product.
    * @param price Price of the new product
    */
  function addProduct(uint storeId, bytes32 name, uint quantity, uint price) public whenNotPaused onlyOwnerOf(storeId) {
    productList[name] = Product(name, quantity, price);
    marketplace[storeNameList[storeId]][productListSize[storeId]] = name;
    productListSize[storeId] = SafeMath.add(productListSize[storeId], 1);//productListSize[storeId]++;
    emit AddProduct(storeId, name, quantity, price);
  }

  /** @dev Removes the product with the given store and product index.
    * @param storeId Index number of the store.
    * @param productId Index number of the product.
    */
  function removeProduct(uint storeId, uint productId) public whenNotPaused onlyOwnerOf(storeId) {
    for (uint i = productId; i < productListSize[storeId]-1; i++) {
      marketplace[storeNameList[storeId]][i] = marketplace[storeNameList[storeId]][i+1];
    }
    productListSize[storeId] = SafeMath.sub(productListSize[storeId], 1);//productListSize[storeId]--;
    emit RemoveProduct(storeId, productId);
  }

  /** @dev Modifies the product's quantity and price values with the given ones.
    * @param storeId Index number of the store.
    * @param productId Index number of the product.
    * @param quantity Quantity of the new product.
    * @param price Price of the new product
    */
  function modifyProduct(uint storeId, uint productId, uint quantity, uint price) public whenNotPaused onlyOwnerOf(storeId) {
    productList[marketplace[storeNameList[storeId]][productId]].quantity = quantity;
    productList[marketplace[storeNameList[storeId]][productId]].price = price;
    emit ModifyProduct(storeId, productId, quantity, price);
  }

  /** @dev Buys the product with given quantity.
    * @param storeId Index number of the store that the purchase will be done from.
    * @param productId Index number of the product that will be purchased.
    * @param quantity Number of how many product will be purchased.
    */
  function buyProduct(uint storeId, uint productId, uint quantity) public payable whenNotPaused {
    uint tempTotalCost = SafeMath.mul(productList[marketplace[storeNameList[storeId]][productId]].price, quantity); 
    require(tempTotalCost <= msg.value, "Not enough credit");
    balances[storeId] = SafeMath.add(balances[storeId], msg.value);//balances[storeId] += msg.value;
    uint temp = SafeMath.sub(productList[marketplace[storeNameList[storeId]][productId]].quantity, quantity);
    productList[marketplace[storeNameList[storeId]][productId]].quantity = temp;
    //productList[marketplace[storeNameList[storeId]][productId]].quantity -= quantity; 
    emit BuyProduct(storeId, productId, quantity);
  }

  /** @dev Adds a new store with the given store name.
    * @param name Name of the new store.
    */
  function addStore(bytes32 name) public whenNotPaused onlyStoreOwner {
    storeNameList[marketplaceSize] = name;
    balances[marketplaceSize] = 0;
    storeOwnerList[marketplaceSize] = msg.sender;
    marketplaceSize = SafeMath.add(marketplaceSize, 1);//marketplaceSize++;
    emit AddStore(name);
  }
  
  /** @dev Removes the store with the given store index.
    * @param storeId Index of the store.
    */
  function removeStore(uint storeId) public whenNotPaused onlyOwnerOf(storeId) {
    for (uint i = storeId; i < marketplaceSize-1; i++) {
      storeNameList[i] = storeNameList[i+1];
      productListSize[i] = productListSize[i+1];
      storeOwnerList[i] = storeOwnerList[i+1]; 
    }
    marketplaceSize = SafeMath.sub(marketplaceSize, 1);//marketplaceSize--;
    emit RemoveStore(storeId);
  }

  /** @dev Withdraw the balance of the given store to the it's owner account address.
    * @param storeId Index of the storeç
    */
  function withdraw(uint storeId) public whenNotPaused onlyOwnerOf(storeId) {
    uint amountToWithdraw = balances[storeId];
    balances[storeId] = 0;
    msg.sender.transfer(amountToWithdraw);
    emit Withdraw(storeId);
  }

  /** @dev Gives store owner authorization to an address.
    * @param account Account address to be given store owner authorization.
    */
  function giveOwnerAuthority(address account) public whenNotPaused {
    authorityList[account] = Authority.Owner;
    emit GiveOwnerAuthority(account);
  }

}
