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
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  // Cart Toggle and Empty Cart Message
  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");
    emptyCartMessage.style.display = cartItems.length === 0 ? 'block' : 'none';
  });

  // Close Cart Button
  closeCartBtn.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });

  // Checkout Button
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cartItems.length === 0) {
        alert("Your cart is empty! Add some products before checking out.");
        return;
      }

      const totalCost = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
      const checkoutDetails = cartItems.map(item => `${item.name} - ${item.quantity} x ${item.price} SEK = ${item.quantity * item.price} SEK`).join('\n');
      
      const confirmationMessage = `
        Checkout Details:
        -----------------------
        ${checkoutDetails}
        
        Total: ${totalCost} SEK

        Thank you for your purchase!`;
      
      alert(confirmationMessage);
      cartItems.length = 0; // Clear cart after checkout
      updateCartUI();
    });
  }

  // Add to Cart
  function addItemToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ name, price, quantity: 1 });
    }
    updateCartUI();
  }

  // Update Cart UI
  function updateCartUI() {
    cartList.innerHTML = "";
    cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (cartItems.length === 0) {
      cartList.innerHTML = "<p>Your cart is empty</p>";
      return;
    }

    let totalCost = 0;

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

    document.querySelectorAll(".increase").forEach(button => button.addEventListener("click", increaseQuantity));
    document.querySelectorAll(".decrease").forEach(button => button.addEventListener("click", decreaseQuantity));
    document.querySelectorAll(".remove-item").forEach(button => button.addEventListener("click", removeItem));

    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) {
      cartTotal.textContent = `Total: ${totalCost} SEK`;
    }
  }

  // Increase Item Quantity
  function increaseQuantity(event) {
    cartItems[event.target.dataset.index].quantity++;
    updateCartUI();
  }

  // Decrease Item Quantity
  function decreaseQuantity(event) {
    let item = cartItems[event.target.dataset.index];
    if (item.quantity > 1) item.quantity--;
    else cartItems.splice(event.target.dataset.index, 1);
    updateCartUI();
  }

  // Remove Item from Cart
  function removeItem(event) {
    const itemName = event.target.getAttribute('data-name');
    cartItems = cartItems.filter(item => item.name !== itemName);
    updateCartUI();
  }

  // Product Image Click to Show Details
  const productImages = document.querySelectorAll('.product-image');
  productImages.forEach(image => {
    image.addEventListener('click', function () {
      const productItem = this.closest('.product-item');
      const details = productItem.querySelector('.details');
      details.style.display = (details.style.display === 'none' || details.style.display === '') ? 'block' : 'none';
    });
  });

  // Add to Cart for Each Product Item
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (event) => {
      const productElement = event.target.closest(".product-item");
      const productName = productElement.querySelector(".product-name").textContent;
      const productPrice = parseFloat(productElement.querySelector(".product-price").textContent.replace('SEK', '').trim());
      addItemToCart(productName, productPrice);
    });
  });
});
