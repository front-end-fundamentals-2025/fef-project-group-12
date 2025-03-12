document.addEventListener("DOMContentLoaded", function () {
  // Cart functionality
  let cartItems = []; // Stores items in the cart
  const cartIcon = document.querySelector(".icon-cart");
  const cartTab = document.querySelector(".cart-tab");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartList = document.querySelector(".cart-list");
  const cartCount = document.querySelector(".cart-count");
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  const checkoutButton = document.querySelector('.cart-footer .check-out');

  // Toggle Cart visibility and show empty cart message if needed
  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");
    emptyCartMessage.style.display = cartItems.length === 0 ? "block" : "none";
  });

  // Close Cart Button
  closeCartBtn.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });

  // Checkout Button functionality
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cartItems.length === 0) {
        alert("Your cart is empty! Add some products before checking out.");
        return;
      }

      const totalCost = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
      const checkoutDetails = cartItems.map(item =>
        `${item.name} - ${item.quantity} x ${item.price} SEK = ${item.quantity * item.price} SEK`
      ).join('\n');

      const confirmationMessage = `
Checkout Details:
-----------------------
${checkoutDetails}

Total: ${totalCost} SEK

Thank you for your purchase!`;

      alert(confirmationMessage);
      cartItems = []; // Clear cart after checkout
      updateCartUI();
    });
  }

  // Function to add items to the cart
  function addItemToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));  // Save cart to localStorage
    updateCartUI();
  }

  // Expose addToCart if needed globally (for inline calls)
  window.addToCart = function(name, price) {
    addItemToCart(name, price);
  };

  // Update the cart UI based on the items
  function updateCartUI() {
    cartList.innerHTML = "";
    cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (cartItems.length === 0) {
      cartList.innerHTML = "<p>Your cart is empty</p>";
      return;
    }

  let totalCost = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  document.querySelector(".cart-total").textContent = `Total: ${totalCost} SEK`;

    cartItems.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <p>${item.name} x ${item.quantity} - ${item.price} SEK</p>
        <p>Total: ${item.quantity * item.price} SEK</p>
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

    // Attach event listeners for quantity controls and removal
    document.querySelectorAll(".increase").forEach(button =>
      button.addEventListener("click", increaseQuantity)
    );
    document.querySelectorAll(".decrease").forEach(button =>
      button.addEventListener("click", decreaseQuantity)
    );
    document.querySelectorAll(".remove-item").forEach(button =>
      button.addEventListener("click", removeItem)
    );

    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) {
      cartTotal.textContent = `Total: ${totalCost} SEK`;
    }
  }

  function increaseQuantity(event) {
    const index = event.target.dataset.index;
    cartItems[index].quantity++;
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
    updateCartUI();
  }

  // Remove item from cart
  function removeItem(event) {
    const itemName = event.target.getAttribute("data-name");
    cartItems = cartItems.filter(item => item.name !== itemName);
    updateCartUI();
  }

  // Event listener for "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.stopPropagation(); // Prevent event from bubbling up to the image click event
      const productItem = button.closest(".product-item");
      const image = productItem.querySelector(".product-image");
      const name = image.getAttribute("data-name");
      const price = parseFloat(image.getAttribute("data-price"));
      addItemToCart(name, price);
    });
  });

  // Toggle product details when a product image is clicked
  const productImages = document.querySelectorAll(".product-image");
  productImages.forEach(image => {
    image.addEventListener("click", function(event) {
      const details = image.closest(".product-item").querySelector(".details");
      if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block";
      } else {
        details.style.display = "none";
      }
    });
  });
});
