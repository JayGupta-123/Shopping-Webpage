
var cartList = document.querySelector('#CartList'); 
var itemList = document.querySelector('#itemList');
var cartItem = document.querySelector('.tbody');
var EmptyCart = document.querySelector('#EmptyCart');
var AddToCart = document.querySelector('.AddToCart');
console.log(cartList);

var cart = document.querySelector('#cart')
var index = 0;
cart.addEventListener('click', function(event){
    if(index == 0){
        cartList.style.display = "block";
        index = 1;
    }
    else{
        cartList.style.display = "none";
        index = 0;
    }
})


function searchFunction(){
    let searchBar = document.querySelector("#searchBar");
    let filter = searchBar.value.toUpperCase();
    let itemNames = itemList.getElementsByClassName('smallCards');
    var flag = true;

    for( var i = 0; i < itemNames.length; i++){
        let proName = itemNames[i].getElementsByTagName('h6')[0];
        if(proName){
            let textValue = proName.innerHTML || proName.textContent;
            if(textValue.toUpperCase().indexOf(filter) > -1 ){
                itemNames[i].style.display = "";
            }
            else{
                itemNames[i].style.display = "none";
                itemList.innerHTML = `<h1 class="warning">No Results found.</h1>`;
                flag = false;
                break;
            }
        }
    }
    if(flag == false){
        console.log('hello');
    }
}


function loadEventListener(){
    itemList.addEventListener('click' , buyCourse);
    EmptyCart.addEventListener('click' , emptyCart);
    cartList.addEventListener('click' , deleteItem);
    document.addEventListener('DOMContentLoaded' , readLocalStorage);
}

loadEventListener();

function buyCourse(event){
    if(event.target.classList.contains("AddToCart")){
        const product = event.target.parentElement.parentElement;
        readProductData(product);
    }
}

function readProductData(product){
    var rawPrice = product.querySelector('.discountPrice').textContent;
    var filteredPrice = rawPrice.replace('$', " ");
    const productInfo = {
        name: product.querySelector('.productName').textContent,
        image: product.querySelector('.productImage').src,
        price: product.querySelector('.discountPrice').textContent,
        count: (product.querySelector('.quantity').selectedIndex)+1,
        id: product.querySelector('.AddToCart').getAttribute('data-id'),
        filteredPrice: filteredPrice
    }
    insertInCart(productInfo);
}

function insertInCart(productInfo){
    var product = getProductFromLS();
    var arr = [];
    for(var i=0; i<product.length; i++){
        arr.push(product[i].id);
    }
        if(arr.indexOf(productInfo.id) == -1){
            var totalPrice = productInfo.count * productInfo.filteredPrice;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td> <img class="rowImg" src="${productInfo.image}"> </td>
            <td> <h4 class="rowName">${productInfo.name}</h4> </td>
            <td> <h4 class="qty">${productInfo.count}</h4> </td>
            <td> <h5 class="rowPrice">$ ${totalPrice}</h5> </td>
            <td> <a href="#" class="remove" data-id="${productInfo.id}">x</a> </td>
            `;
            cartItem.appendChild(row);
            saveToLocalStorage(productInfo);
        }
        else{
            saveToLocalStorage(productInfo);
        }
}

function saveToLocalStorage(productInfo){
    let preProduct;
    preProduct = getProductFromLS();
    preProduct.push(productInfo);
    localStorage.setItem('Products' , JSON.stringify(preProduct) );
}

function readLocalStorage(){
    let productList = getProductFromLS();
    var arry = [];
    for(var i=0; i<productList.length; i++){
        arry.push(productList[i].id);
    }
    
    result = removeDuplicates(arry);

    function removeDuplicates(arry){
        var x, len = arry.length;
        filterArry = [];
        var obj = {};

        for(var x=0; x<arry.length;x++){
            obj[arry[x]] = 0;
        }

        for(x in obj){
            filterArry.push(x);
        }
        return filterArry;
    }

    for(var i = 0; i < result.length; i++){
        var listElement = result[i];
       var a = 0;
       while(a < productList.length){
           if(productList[a].id == listElement){

            const row = document.createElement('tr');
            row.innerHTML = `
            <td> <img class="rowImg" src="${productList[a].image}"> </td>
            <td> <h4 class="rowName">${productList[a].name}</h4> </td>
            <td> <h4 class="qty">${productList[a].count}</h4> </td>
            <td> <h5 class="rowPrice">${productList[a].price}</h5> </td>
            <td> <a href="#" class="remove" data-id="${productList[a].id}">x</a> </td>
            `;
             cartList.appendChild(row);
            break;
           }
       }
    }

}

function getProductFromLS(){
    let productList;
    if(localStorage.getItem('Products') === null){
        productList = [];
    }
    else{
        productList = JSON.parse( localStorage.getItem('Products') );
    }
    return productList;
}

function emptyCart(){
    while(cartItem.firstChild){
        cartItem.removeChild(cartItem.firstChild)
    }
    emptyLocalStorage();
    return false;
}

function deleteItem(event){
    let product , productID;
    if(event.target.classList.contains('remove')){
        let deleteItem = event.target.parentElement.parentElement.remove();
        product = event.target.parentElement.parentElement;
        productID = product.querySelector('a').getAttribute('data-id');
        console.log(productID);
    }
    deleteItemFromLS(productID);
}

function deleteItemFromLS(productID){
    let productList;
    productList = getProductFromLS();
    productList.forEach(function(product, index){
        if(product.id == productID){
            productList.splice(index, 1);
        }
    });
    localStorage.setItem('Products' , JSON.stringify(productList));
}

function emptyLocalStorage(){
    localStorage.clear();
}