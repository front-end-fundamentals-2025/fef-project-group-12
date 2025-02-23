
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart (product, price) {
    cart.push({product, price});
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart");
    cartList.innerHTML = "";
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.product} - $${item.price}`;
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeFromCart(index);
        li.appendChild(removeButton);
        cartList.appendChild(li);
    });
}

function toggleMenu() {
    document.getElementById("navbar").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", updateCart);