// import Products from "../models/product.js";
// import CartItem from "../models/cartItem.js";

const getEle = (id) => {
    return document.getElementById(id);
};
let productList = [];
let cart = [];
let totalQuatity = 0;

const getListProduct = () => {
    getEle("loading").style.display = "block";

    axios({
        method: "get",
        url: "https://62ce76a0486b6ce82645a474.mockapi.io/Products",
    })
        .then((result) => {
            getEle("loading").style.display = "none";
            result.data.forEach((item) => {
                const product = new Products(
                    item.id,
                    item.name,
                    item.price,
                    item.screen,
                    item.backCamera,
                    item.frontCamera,
                    item.img,
                    item.desc,
                    item.type
                )
                productList.push(product);
            });
            renderProduct(productList);
        })
        .catch((err) => {
            getEle("loading").style.display = "none";
            console.log(err);
        });
};
getListProduct();
const filter = () => {
    let type = getEle("select").value;
    if (type === "all") renderProduct(productList);
    else {
        let filterProducts = productList.filter((product) => product.type === type);
        renderProduct(filterProducts);
    }
};

const renderProduct = (data) => {
    var contentHTML = "";

    data.forEach((item) => {
        var productImg = item.img.includes("https")
            ? item.img
            : `./../../assets/img/${item.img}`;

        contentHTML += `
        <div class="col col-sm-6 col-lg-4 col-xl-3 px-4 py-3">
        <div class="item">
            <img class=""
                src="${productImg}">

                <div class="content pt-2 text-start p-3">
                    <ul>
                        <li class="text-center mb-2">${item.name}</li>
                        <li class="mb-3"><b>"${item.desc}"</b></li>
                        <li>- price: $${item.price}</li>
                        <li>- screen: ${item.screen}</li>
                        <li>- backCamera: ${item.backCamera}</li>
                        <li></li>- frontCamera: ${item.frontCamera}</li>
                    </ul>

                    <button id="addCart" class="addCart" data-id='${item.id}' onclick="addToCart('${item.id}')">
                        <i class="fa fa-shopping-cart"></i>
                        Add to cart
                  </button>
                </div>
        </div>
    </div>
        `;
    });

    getEle("products").innerHTML = contentHTML;
};


const renderCart = (data) => {
    let contentHTML = "";
    let totalPrice = 0;
    data.forEach((cart_item) => {
        contentHTML += `
        <div class="cart-item">
        <div class="cart-img">
            <img
                src="${cart_item.img}">
        </div>
        <strong class="name">${cart_item.name}</strong>
        <div class="qty-change">
            <button class="btn-qty" onclick="minusCart('${cart_item.id}')">
                <i class="fas fa-chevron-left"></i>
            </button>
            <p class="qty">${cart_item.quantity}</p>
            <button class="btn-qty" onclick="plusCart('${cart_item.id}')">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <p class="price">$${cart_item.quantity * cart_item.price}</p>
        <button class="trash" onclick="deleteCart('${cart_item.id}')">
            <i class="fas fa-trash"></i>
        </button>
    </div>
        `
        totalPrice += cart_item.quantity * cart_item.price;
    })
    getEle("cartContent").innerHTML = contentHTML;
    getEle("totalPrice").innerText = `$${totalPrice}`;
};

const addToCart = (id) => {
    let index = productList.findIndex((product) => product.id === id);
    let i = cart.findIndex((item) => item.id === id);

    if (i === -1) {
        const item = new CartItem(
            productList[index].id,
            productList[index].name,
            productList[index].price,
            productList[index].img,
            1
        );
        cart.push(item);
    } else cart[i].quantity++;
    totalQuatity++;
    getEle("total-qty").innerHTML = totalQuatity;
    console.log(cart);
    renderCart(cart);
    saveToLocal();
};

const plusCart = (id) => {
    let curCart = cart.find(item => item.id === id);
    curCart.quantity++;
    totalQuatity++;
    getEle("total-qty").innerHTML = totalQuatity;
    renderCart(cart);
    saveToLocal();
}
const deleteCart = (id) => {
    let index = cart.findIndex(item => item.id === id);
    totalQuatity -= cart[index].quantity;
    cart.splice(index, 1);
    getEle("total-qty").innerHTML = totalQuatity;
    renderCart(cart);
    saveToLocal();
}
const minusCart = (id) => {
    let curCart = cart.find(item => item.id === id);
    if (curCart.quantity > 1) curCart.quantity--;
    else deleteCart(id);
    totalQuatity--;

    getEle("total-qty").innerHTML = totalQuatity;
    renderCart(cart);
    saveToLocal();
}

const clearCart = () => {
    cart = [];
    totalQuatity = 0;
    getEle("total-qty").innerHTML = totalQuatity;
    getEle("totalPrice").innerHTML = "$0"
    getEle("cartContent").innerHTML = "<p class='log'>Looks Like You Haven't Added Any Product In The Cart</p>";
    saveToLocal();
}
getEle("btn-clear").addEventListener("click", clearCart);


//save to local
// const mapCart = (data) => {
//     const results = data.map((item) => {

//         const { id, name, price, img, quantity } = item;

//         return new constructorClass(id, name, price, img, quantity);
//     });

//     return results;
// };
const saveToLocal = () => {
    let cartJSON = JSON.stringify(cart);
    localStorage.setItem("list", cartJSON);

    let qtyJSON = JSON.stringify(totalQuatity);
    localStorage.setItem("qty", qtyJSON);
}

const getLocal = () => {
    let cartJSON = localStorage.getItem("list");
    if (!cartJSON) return;
    let cartLocal = JSON.parse(cartJSON);
    cart = cartLocal;
    renderCart(cart);

    let qtyJSON = localStorage.getItem("qty");
    if (!qtyJSON) return;
    let qtyLocal = JSON.parse(qtyJSON);
    totalQuatity = qtyLocal;
    getEle("total-qty").innerHTML = totalQuatity;
}
getLocal();