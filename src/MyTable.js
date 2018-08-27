import React from "react";
import MyTableRow from "./MyTableRow";

let pAname = "";
let pAquantity = "";
let pAprice = "";
let pAeditTableIndex;
let newStoreName = "";
let newAddress = "";

var pAddClearAll = () => {
    pAname = ""
    pAquantity = ""
    pAprice = ""
    newStoreName = ""
    newAddress = ""
}

var pAddClearInputs = () => {
    var inputs = document.getElementsByClassName("b");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

var pAhandleNameChange = (event, storeIndex) => {
    if (pAeditTableIndex !== storeIndex) {
        pAquantity = "";
        pAprice = "";
    }
    pAeditTableIndex = storeIndex
    pAname = event.target.value;
}

var pAhandleQuantityChange = (event, storeIndex) => {
    if (pAeditTableIndex !== storeIndex) {
        pAname = "";
        pAprice = "";
    }
    pAeditTableIndex = storeIndex
    pAquantity = event.target.value;
}

var pAhandlePriceChange = (event, storeIndex) => {
    if (pAeditTableIndex !== storeIndex) {
        pAname = "";
        pAquantity = "";
    }
    pAeditTableIndex = storeIndex
    pAprice = event.target.value;
}

var handleStoreNameChange = (e) => {
    newStoreName = e.target.value;
}

var handleNewAddressChange = (e) => {
    newAddress = e.target.value;
}

var giveOwnerAuthority2 = (e, newAddress, giveOwnerAuthority) => {
    giveOwnerAuthority(e, newAddress)
    newAddress = ""
    pAddClearAll()
    pAddClearInputs()
}

var handlePAdd2 = (e, name, quantity, price, storeIndex, editTableIndex, handlePAdd, doesAlreadyProductWithThisNameExists) => {
    if (storeIndex===editTableIndex) {
        if (!doesAlreadyProductWithThisNameExists(name)) {
            handlePAdd(e, name, quantity, price, storeIndex)
        } else {
            alert("The product with this name already exists. Please use unique product name.")
            e.preventDefault()
        }
    }
    pAddClearAll();
    pAddClearInputs();
}

var addStore2 = (e, storeName, addStore, doesAlreadyStoreWithThisNameExists) => {
    if (!doesAlreadyStoreWithThisNameExists(storeName)) {
        addStore(e, storeName);
    } else {
        alert("The store with this name already exists. Please use unique store name")
        e.preventDefault()
    }
    newStoreName = "";
    pAddClearAll();
    pAddClearInputs();

}





export default ({
    data,
    handleSubmit,
    removeProduct,
    handlePAdd,
    removeStore,
    addStore,
    buyProduct,
    withdraw,
    giveOwnerAuthority,
    authority,
    account,
    doesAlreadyStoreWithThisNameExists,
    doesAlreadyProductWithThisNameExists

}) => (
    <div>
    {data.map((store) =>
        <table key={store.storeName}>
            <thead>
                <tr>
                    {authority!=="Admin" && (
                    <th colSpan='3'>
                        {store.storeName}
                    </th>
                    )}
                    {account===store.owner && (
                    <th>
                        balance: {store.balance} Ξ
                    </th>
                    )}
                    {account===store.owner && (
                    <th> 
                        <button onClick={e => removeStore(e, store.i)}>
                            remove
                        </button>
                        <button onClick={e => withdraw(e,store.i)}>
                            withdraw
                        </button>
                    </th>
                    )}
                </tr>
            </thead>
            {authority!=="Admin" && (
            <tbody>
                {store.productList.map((product) =>
                    <MyTableRow
                        key={product.name} 
                        product={product}
                        buyProduct={buyProduct}
                        handleSubmit={handleSubmit}
                        storeIndex={store.i}
                        removeProduct={removeProduct}
                        authority={authority}
                        account={account}
                        storeOwner={store.owner}
                    />
                )}  
            </tbody>
            )}
            {account===store.owner && (
            <tfoot>
                <tr>
                    <td colSpan='5'>
                        <form onSubmit={e => handlePAdd2(e, pAname, pAquantity, pAprice, store.i, pAeditTableIndex, handlePAdd, doesAlreadyProductWithThisNameExists)}>
                            <label>
                                Name:
                                <input className="b" type="text" onChange={e => pAhandleNameChange(e, store.i)} required/>
                            </label>
                            <label>
                                Quantity:
                                <input className="b" min="0" type="number" onChange={e => pAhandleQuantityChange(e, store.i)} required/>
                            </label>
                            <label>
                                Price:
                                <input className="b" min="0" type="number" onChange={e => pAhandlePriceChange(e, store.i)} required/>
                            </label>
                            <input type="submit" value="Add Product" />
                        </form>
                    </td>
                </tr>
                
            </tfoot>
            )}
        </table>
    )}
    <br/>
    {authority==="Store Owner" && (
        <form onSubmit={e => addStore2(e, newStoreName, addStore, doesAlreadyStoreWithThisNameExists)}>
            <label>
                Name:
                <input className="b" type="text" onChange={handleStoreNameChange} required/>
            </label>
            <input type="submit" value="Add Store" />
        </form>
        )}
        <br/>
        {authority==="Admin" && (
        <form onSubmit={e => giveOwnerAuthority2(e, newAddress, giveOwnerAuthority)}>
            <label>
                Address:
                <input className="b" type="text" onChange={handleNewAddressChange} required/>
            </label>
            <input type="submit" value="Give Permission To Open Store" /> 
        </form>
        )}
    </div>
);

/*
export default ({
    products,
    handleSubmit,
    storeIndex,
    removeProduct
}) => (
    products.map((product) =>
        <MyTableRow
            key={product.name} 
            product={product}
            handleSubmit={handleSubmit}
            storeIndex={storeIndex}
            removeProduct={removeProduct}
        />
        
    )
);
*/
