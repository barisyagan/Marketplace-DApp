import React from "react";

let quantity = "";
let price = "";
var buyProductQuantity = "";
var editRowIndex;
var editTableIndex;

var clearInputs = () => {
    var inputs = document.getElementsByClassName("a");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

var handleQuantityChange = (event, storeIndex, editIndex) => {
    if ((editRowIndex !== editIndex) || (editTableIndex !== storeIndex)) {
        price = "";
    }
    editRowIndex = editIndex
    editTableIndex = storeIndex
    quantity = event.target.value;
}

var handlePriceChange = (event, storeIndex, editIndex) => {
    if ((editRowIndex !== editIndex) || (editTableIndex !== storeIndex)) {
        quantity = "";
    }
    editRowIndex = editIndex
    editTableIndex = storeIndex
    price = event.target.value;
}

var clearAll = () => {
    quantity = "";
    price = "";
    buyProductQuantity = "";
}

var handleSubmit2 = (e, quantity, price, storeIndex, i, editTableIndex, editRowIndex, handleSubmit) => {
    if (storeIndex===editTableIndex && i===editRowIndex) {
        handleSubmit(e, quantity, price, storeIndex, i);
    }
    clearAll();
    clearInputs();
    e.preventDefault()
}

var buyProduct2 = (e, storeIndex, productId, buyProductQuantity, editTableIndex, editRowIndex, buyProduct) => {
    if (storeIndex===editTableIndex && productId===editRowIndex) {
        buyProduct(e, storeIndex, productId, buyProductQuantity);
    }
    clearAll();
    clearInputs();
    e.preventDefault()
}

var handleBuyQuantityChange = (e, storeIndex, editIndex) => {
    editRowIndex = editIndex
    editTableIndex = storeIndex
    buyProductQuantity = e.target.value
    
}


export default ({
    product,
    handleSubmit,
    storeIndex,
    removeProduct,
    buyProduct,
    authority,
    account,
    storeOwner
}) => (
    <tr>
        <style>{'td{border:1px solid black;}'}</style>
        <td>{product.name}</td>
        <td>Qty: {product.quantity}</td>
        <td>Ξ {product.price}</td>
        {authority==="Shopper" && ( 
        <td>
            <form onSubmit={e => buyProduct2(e, storeIndex, product.i, buyProductQuantity, editTableIndex, editRowIndex, buyProduct)}>
                <input className="a" type="number" min="1" max={product.quantity} onChange={e => handleBuyQuantityChange(e, storeIndex, product.i)} required/>
                <input type="submit" value="buy"/>
            </form>
        </td>
        )}
        {account===storeOwner && (
        <td>
            <form onSubmit={e => handleSubmit2(e, quantity, price, storeIndex, product.i, editTableIndex, editRowIndex, handleSubmit)}>
                <label>
                    Quantity:
                    <input className="a" type="number" min="0" onChange={e => handleQuantityChange(e, storeIndex, product.i)}/>
                </label>
                <label>
                    Price:
                    <input className="a" type="number" min="0" onChange={e => handlePriceChange(e, storeIndex, product.i)}/>
                </label>
                <input type="submit" value="submit" />
            </form>
        </td>
        )}
        {account===storeOwner && (
        <td>
            <button onClick={e => removeProduct(e, storeIndex, product.i)}>
                remove
            </button>
        </td>
        )}
    </tr>
);

//<form onSubmit={e => handlePriceSubmit(e, numberValue, storeIndex, product.i)}>