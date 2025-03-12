document.addEventListener("DOMContentLoaded", function () {
  let cartItems = []; // Store cart items

  // Select elements
  const cartIcon = document.querySelector(".icon-cart");
  const cartTab = document.querySelector(".cart-tab");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartList = document.querySelector(".cart-list");
  const cartCount = document.querySelector(".cart-count");
  const emptyCartMessage = document.querySelector(".empty-cart-message");
  const checkoutButton = document.querySelector(".cart-footer .check-out");

  // 🛒 Open & Close Cart
  cartIcon?.addEventListener("click", () => {
    cartTab.classList.toggle("show");
    emptyCartMessage.style.display = cartItems.length === 0 ? "block" : "none";
  });

  closeCartBtn?.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });

  // 🏷 Checkout Button
  checkoutButton?.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some products before checking out.");
      return;
    }

    let totalCost = cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    let checkoutDetails = cartItems
      .map(
        (item) =>
          `${item.name} - ${item.quantity} x ${item.price} KR = ${
            item.quantity * item.price
          } KR`
      )
      .join("\n");

    alert(
      `Checkout Details:\n\n${checkoutDetails}\n\nTotal: ${totalCost} KR\n\nThank you for your purchase!`
    );

    cartItems = []; // Clear cart after checkout
    updateCartUI();
  });

  // 🛍 Add Item to Cart (ONLY on Button Click)
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent bubbling up to parent elements

      const productItem = button.closest(".product-item");
      const name = productItem.querySelector(".product-name").textContent;
      const price = parseFloat(
        productItem.querySelector(".price").textContent.replace(" KR", "")
      );
      const imageSrc = productItem.querySelector(".product-image").src;

      addItemToCart(name, price, imageSrc);
    });
  });

  function addItemToCart(name, price, imageSrc) {
    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ name, price, imageSrc, quantity: 1 });
    }
    updateCartUI();
  }

  // 📦 Update Cart UI
  function updateCartUI() {
    cartList.innerHTML = "";
    cartCount.textContent = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    emptyCartMessage.style.display = cartItems.length === 0 ? "block" : "none";

    let totalCost = 0;

    cartItems.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
              <img src="${item.imageSrc}" class="cart-item-image">
              <p>${item.name} x ${item.quantity} - ${item.price} KR</p>
              <div class="quantity-controls">
                  <button class="decrease" data-index="${index}">-</button>
                  <span>${item.quantity}</span>
                  <button class="increase" data-index="${index}">+</button>
              </div>
              <button class="remove-item" data-name="${item.name}">Remove</button>
          `;
      cartList.appendChild(cartItem);
      totalCost += item.quantity * item.price;
    });

    document.querySelector(
      ".cart-total"
    ).textContent = `Total: ${totalCost} KR`;
    attachCartEventListeners();
  }

  // 🆙 Quantity Change & Removal
  function attachCartEventListeners() {
    document
      .querySelectorAll(".increase")
      .forEach((button) => button.addEventListener("click", increaseQuantity));
    document
      .querySelectorAll(".decrease")
      .forEach((button) => button.addEventListener("click", decreaseQuantity));
    document
      .querySelectorAll(".remove-item")
      .forEach((button) => button.addEventListener("click", removeItem));
  }

  function increaseQuantity(event) {
    const index = event.target.dataset.index;
    cartItems[index].quantity++;
    updateCartUI();
  }

  function decreaseQuantity(event) {
    const index = event.target.dataset.index;
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
    } else {
      cartItems.splice(index, 1);
    }
    updateCartUI();
  }

  function removeItem(event) {
    const itemName = event.target.getAttribute("data-name");
    cartItems = cartItems.filter((item) => item.name !== itemName);
    updateCartUI();
  }

  // 🔍 Clicking Product Image Toggles Details
  document.querySelectorAll(".product-image").forEach((image) => {
    image.addEventListener("click", function () {
      const details = image.closest(".product-item").querySelector(".details");
      details.style.display =
        details.style.display === "none" || details.style.display === ""
          ? "block"
          : "none";
    });
  });
});
