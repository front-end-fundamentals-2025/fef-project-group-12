// cart data start with an empty array
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// DOM elements for cart functionality
const cartIcon = document.querySelector(".icon-cart");
const cartTab = document.querySelector(".cart-tab");
const closeCartBtn = document.querySelector(".close-cart");
const cartList = document.querySelector(".cart-list");
const cartCount = document.querySelector(".cart-count");
const emptyCartMessage = document.querySelector(".empty-cart-message");
const checkoutButton = document.querySelector(".cart-footer .check-out");

//SHOPPING CART LOGIC
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// Calculate total price 
function calculateTotalCost() {
  return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
}

// Show cart items on the page
function updateCartUI() {
  if (!cartList || !cartCount) return;

  cartList.innerHTML = "";
  cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty</p>";
    if (emptyCartMessage) emptyCartMessage.style.display = "block";
    return;
  }

  if (emptyCartMessage) emptyCartMessage.style.display = "none";

  let totalCost = 0;

  cartItems.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.imageSrc}" alt="${item.name}" class="cart-image">
      <div class="cart-details">
        <p>${item.name} x ${item.quantity} - ${item.price} SEK</p>
        <p>Total: ${item.quantity * item.price} SEK</p>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <button class="remove-item" data-name="${item.name}">Remove</button>
      </div>
    `;

    cartList.appendChild(cartItem);
    totalCost += item.quantity * item.price;
  });

  document.querySelector(".cart-total").textContent = `Total: ${totalCost} SEK`;
}

//Add an item to the cart 
function addItemToCart(name, price, imageSrc) {
  const existingItem = cartItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name, price, imageSrc, quantity: 1 });
  }

  saveCart();
  updateCartUI();
}

// usable in HTML onclick attributes
window.addToCart = function (name, price, imageSrc) {
  addItemToCart(name, price, imageSrc);
};


//CART QUANTITY AND REMOVE BUTTONS
function increaseQuantity(event) {
  const index = event.target.dataset.index;
  cartItems[index].quantity++;
  saveCart();
  updateCartUI();
}

function decreaseQuantity(event) {
  const index = event.target.dataset.index;
  let item = cartItems[index];
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cartItems.splice(index, 1); // remove it if quantity is 1
  }
  saveCart();
  updateCartUI();
}

function removeItem(event) {
  const itemName = event.target.getAttribute("data-name");
  cartItems = cartItems.filter((item) => item.name !== itemName);
  saveCart();
  updateCartUI();

  if (cartItems.length === 0) {
    document.querySelector(".cart-total").textContent = "Total: 0 SEK";
  } else {
    updateCartTotal();
  }
}

function updateCartTotal() {
  const total = calculateTotalCost();
  document.querySelector(".cart-total").textContent = `Total: ${total} SEK`;
}

//CART EVENT LISTNER
if (cartList) {
  cartList.addEventListener("click", (event) => {
    const btn = event.target;
    if (btn.classList.contains("increase")) increaseQuantity(event);
    if (btn.classList.contains("decrease")) decreaseQuantity(event);
    if (btn.classList.contains("remove-item")) removeItem(event);
  });
}

//Checkout
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some products before checking out.");
      return;
    }

    const totalCost = calculateTotalCost();
    const details = cartItems
      .map(
        (item) =>
          `${item.name} - ${item.quantity} x ${item.price} SEK = ${item.quantity * item.price} SEK`
      )
      .join("\n");

    alert(`Checkout Details:\n${details}\n\nTotal: ${totalCost} SEK\n\nThank you!`);

    cartItems = [];
    saveCart();
    updateCartUI();
    document.querySelector(".cart-total").textContent = "Total: 0 SEK";
  });
}


//CART OPEN/CLOSE
if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");
    if (emptyCartMessage) {
      emptyCartMessage.style.display = cartItems.length === 0 ? "block" : "none";
    }
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });
}

//PRODUCT DETAILJ PAGE
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");
  const desc = params.get("desc");

  if (name && price && desc) {
    document.getElementById("product-name").textContent = name;
    document.getElementById("product-price").textContent = price + " SEK";
    document.getElementById("product-description").textContent = desc;
  } else {
    document.getElementById("product-details").innerHTML = "<p>Product not found.</p>";
  }
});

//ADD TO CART BUTTONS
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "img") return;
    event.stopPropagation();

    const productItem = button.closest(".product-item");
    const name = productItem.getAttribute("data-name");
    const price = parseFloat(productItem.getAttribute("data-price"));
    const imageSrc = productItem.querySelector(".product-image").src;

    addItemToCart(name, price, imageSrc);
  });
});


//REDIRECT PRODUCT FROM IMAGE CLICK
const productImages = document.querySelectorAll(".product-image");
productImages.forEach((image) => {
  image.addEventListener("click", () => {
    const item = image.closest(".product-item");
    const name = encodeURIComponent(item.getAttribute("data-name"));
    const price = encodeURIComponent(item.getAttribute("data-price"));
    const desc = encodeURIComponent(item.querySelector(".details").textContent);

    window.location.href = `product-details.html?name=${name}&price=${price}&desc=${desc}`;
  });
});


//BACK TO TOP
window.onscroll = () => {
  const button = document.getElementById("back-to-top");
  button.classList.toggle("show", window.scrollY > 200);
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


//CONTACT FORM CONFORMATION
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const sendButton = document.querySelector(".send-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    form.style.display = "none";
    const message = document.createElement("p");
    message.textContent = "Your message has been sent successfully!";
    message.style.fontSize = "1.2em";
    message.style.color = "grey";

    document.querySelector(".contact-container").appendChild(message);
  });
});
S