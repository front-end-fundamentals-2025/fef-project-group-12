let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartIcon = document.querySelector(".icon-cart");
const cartTab = document.querySelector(".cart-tab");
const closeCartBtn = document.querySelector(".close-cart");
const cartList = document.querySelector(".cart-list");
const cartCount = document.querySelector(".cart-count");
const emptyCartMessage = document.querySelector(".empty-cart-message");
const checkoutButton = document.querySelector(".cart-footer .check-out");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function calculateTotalCost() {
  return cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
}

function updateCartUI() {
  if (!cartList || !cartCount) return;

  cartList.innerHTML = "";
  cartCount.textContent = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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

window.addToCart = function (name, price, imageSrc) {
  addItemToCart(name, price, imageSrc);
};

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
    cartItems.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function removeItem(event) {
  const itemName = event.target.getAttribute("data-name");
  cartItems = cartItems.filter((item) => item.name !== itemName);
  saveCart();
  updateCartUI();

  // Check if the cart is empty
  if (cartItems.length === 0) {
    document.querySelector(".cart-total").textContent = "Total: 0 SEK";
  } else {
    updateCartTotal();
  }
}

function updateCartTotal() {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  document.querySelector(".cart-total").textContent = `Total: ${total} SEK`;
}

if (cartList) {
  cartList.addEventListener("click", function (event) {
    const btn = event.target;
    if (btn.classList.contains("increase")) {
      increaseQuantity(event);
    } else if (btn.classList.contains("decrease")) {
      decreaseQuantity(event);
    } else if (btn.classList.contains("remove-item")) {
      removeItem(event);
    }
  });
}

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some products before checking out.");
      return;
    }

    const totalCost = calculateTotalCost();
    const checkoutDetails = cartItems
      .map(
        (item) =>
          `${item.name} - ${item.quantity} x ${item.price} SEK = ${
            item.quantity * item.price
          } SEK`
      )
      .join("\n");

    alert(
      `Checkout Details:\n-----------------------\n${checkoutDetails}\n\nTotal: ${totalCost} SEK\n\nThank you for your purchase!`
    );

    cartItems = [];
    saveCart();
    updateCartUI();

    const cartTotalElement = document.querySelector(".cart-total");
    if (cartTotalElement) {
      cartTotalElement.textContent = "Total: 0 SEK";
    }
  });
}

if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");
    if (emptyCartMessage) {
      emptyCartMessage.style.display =
        cartItems.length === 0 ? "block" : "none";
    }
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");
  const desc = params.get("desc");

  if (name && price && desc) {
    document.getElementById("product-name").textContent = name;
    document.getElementById("product-price").textContent = price + " SEK";
    document.getElementById("product-description").textContent = desc;
  } else {
    document.getElementById("product-details").innerHTML =
      "<p>Product not found.</p>";
  }
});

const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    // Prevent adding to cart
    if (event.target.tagName.toLowerCase() === "img") {
      return;
    }

    event.stopPropagation();
    const productItem = button.closest(".product-item");
    const name = productItem.getAttribute("data-name");
    const price = parseFloat(productItem.getAttribute("data-price"));
    const imageSrc = productItem.querySelector(".product-image").src;
    addItemToCart(name, price, imageSrc);
  });
});

//product detailj page

const productImages = document.querySelectorAll(".product-image");
productImages.forEach((image) => {
  image.addEventListener("click", function () {
    const productItem = image.closest(".product-item");
    const name = encodeURIComponent(productItem.getAttribute("data-name"));
    const price = encodeURIComponent(productItem.getAttribute("data-price"));
    const desc = encodeURIComponent(
      productItem.querySelector(".details").textContent
    );

    // Redirect to the product-details.html page with query parameters
    window.location.href = `product-details.html?name=${name}&price=${price}&desc=${desc}`;
  });
});

const productDetails = {
  "rounded-silver": {
    id: "rounded-silver",
    name: "Rounded │ Silver",
    price: 1000,
    imageSrc: "/img/rounded-ring-a.png",
    description: "A sleek and stylish silver ring.",
    sizesAvailable: [16, 17, 18, 19, 20],
    material: "Silver",
  },
  "signet-silver": {
    id: "signet-silver",
    name: "Signet │ Silver",
    price: 3500,
    imageSrc: "/img/diamond-signet-b.png",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
  "moulded-silver": {
    id: "moulded-silver",
    name: "Moulded │ Silver",
    price: 1800,
    imageSrc: "/img/moulded-ring-c.png",
    description: "An elegant moulded silver ring with a modern touch.",
    sizesAvailable: [16, 17, 18],
    material: "Silver",
  },
  "char-silver": {
    id: "char-silver",
    name: "CHAR │ Silver",
    price: 2100,
    imageSrc: "/img/CHAR-necklace.jpeg",
    description: "An elegant moulded silver ring with a modern touch.",
    sizesAvailable: [16, 17, 18],
    material: "Silver",
  },
  "dance-ring-silver": {
    id: "dance-ring-silver",
    name: "DANCE ring │ Silver",
    price: 4100,
    imageSrc: "/img/new-dance-ring.jpeg",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
  "flat-silver": {
    id: "flat-silver",
    name: "Flat │ Silver",
    price: 1800,
    imageSrc: "/img/FLAT-ring.jpeg",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
  "dri-silver": {
    id: "dri-silver",
    name: "Dri │ Silver",
    price: 1150,
    imageSrc: "/img/DRI-earings.jpeg",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
  "loop-silver": {
    id: "loop-silver",
    name: "Loop │ Silver",
    price: 2350,
    imageSrc: "/img/necklace,loopy.jpg",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
  "mara-silver": {
    id: "mara-silver",
    name: "Mara │ Silver",
    price: 2550,
    imageSrc: "/img/MARA-ring.jpeg",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
  "ril-silver": {
    id: "ril-silver",
    name: "Ril │ Silver",
    price: 2400,
    imageSrc: "/img/Ril.jpeg",
    description: "A diamond signet ring, perfect for any occasion.",
    sizesAvailable: [16, 17, 18, 19],
    material: "Silver, Diamond",
  },
};
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function loadProductDetails() {
  const productId = getUrlParameter("id");
  const product = productDetails[productId]; // Get product details based on the ID

  if (product) {
    document.getElementById("product-name").textContent = product.name;
    document.getElementById(
      "product-price"
    ).textContent = `Price: ${product.price} SEK`;
    document.getElementById(
      "product-sizes"
    ).textContent = `Sizes Available: ${product.sizesAvailable.join(", ")}`;
    document.getElementById(
      "product-material"
    ).textContent = `Material: ${product.material}`;
    document.getElementById("product-description").textContent =
      product.description;
    document.getElementById("product-image").src = product.imageSrc;
    document.getElementById("product-image").alt = product.name;
  }
}

window.onscroll = function () {
  let button = document.getElementById("back-to-top");
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    button.classList.add("show");
  } else {
    button.classList.remove("show");
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.onload = loadProductDetails;

updateCartUI();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const sendButton = document.querySelector(".send-button");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Hide the form and show a confirmation message
    form.style.display = "none";
    const message = document.createElement("p");
    message.textContent = "Your message has been sent successfully!";
    message.style.fontSize = "1.2em";
    message.style.color = "grey";
    document.querySelector(".contact-container").appendChild(message);
  });
});

//Refrences:
// Create a Product Detail Page Template using HTML and CSS
// This tutorial provides guidance on designing a product detail page layout using HTML and CSS.
// Source: https://www.geeksforgeeks.org/create-a-product-detail-page-template-using-html-and-css/

// Local Storage for Shopping Cart in JavaScript
// This article provides guidance on using JavaScript objects to store cart items and utilizing localStorage to persist cart data.
// Source: https://dev.to/haamid/local-storage-for-shopping-cart-in-javascript-2mef

// Shopping Cart Using Local Storage in JavaScript (YouTube Video)
// This video tutorial demonstrates how to implement a shopping cart with localStorage in JavaScript, covering adding, removing, and updating cart items.
// Source: https://www.youtube.com/watch?v=pRkHOD_nkH4
