document.addEventListener("DOMContentLoaded", function () {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve cart data from storage
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
    if (!cartList || !cartCount) return; // Exit if cart elements are missing

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

    document.querySelector(
      ".cart-total"
    ).textContent = `Total: ${totalCost} SEK`;
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

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const productItem = button.closest(".product-item");
      const name = productItem.getAttribute("data-name");
      const price = parseFloat(productItem.getAttribute("data-price"));
      const imageSrc = productItem.querySelector(".product-image").src;
      addItemToCart(name, price, imageSrc);
    });
  });

  updateCartUI(); // Ensure cart is updated on all pages
});
