document.addEventListener("DOMContentLoaded", () => {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];  // Retrieve existing cart from localStorage
  const cartIcon = document.querySelector(".icon-cart");
  const cartTab = document.querySelector(".cart-tab");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartList = document.querySelector(".cart-list");
  const cartCount = document.querySelector(".cart-count");  // Declare here only once
  const emptyCartMessage = document.querySelector(".empty-cart-message");
  const checkoutButton = document.querySelector(".cart-footer .check-out");


  // Toggle cart visibility
  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");
    emptyCartMessage.style.display = cartItems.length === 0 ? "block" : "none";
  });

  closeCartBtn.addEventListener("click", () => cartTab.classList.remove("show"));

  // Checkout functionality
  checkoutButton?.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some products before checking out.");
      return;
    }

    const totalCost = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const checkoutDetails = cartItems
      .map(item => `${item.name} - ${item.quantity} x ${item.price} SEK = ${item.quantity * item.price} SEK`)
      .join("\n");

    alert(`Checkout Details:\n-----------------------\n${checkoutDetails}\n\nTotal: ${totalCost} SEK\n\nThank you for your purchase!`);
    cartItems = [];
    updateCartUI();
    localStorage.setItem("cart", JSON.stringify(cartItems));  // Clear cart in localStorage
  });

  // Add item to cart
  window.addToCart = (name, price, image) => {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ name, price: parseFloat(price), quantity: 1, image });
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));  // Save cart to localStorage
    updateCartUI();
  };

  // Update cart UI
function updateCartUI() {
  cartList.innerHTML = "";
  cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);  // Update here
  emptyCartMessage.style.display = cartItems.length === 0 ? "block" : "none";
  
  if (cartItems.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  let totalCost = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  document.querySelector(".cart-total").textContent = `Total: ${totalCost} SEK`;

  cartItems.forEach((item, index) => {
    cartList.innerHTML += `
      <div class="cart-item">
        <p>${item.name} x ${item.quantity} - ${item.price} SEK</p>
        <p>Total: ${item.quantity * item.price} SEK</p>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <button class="remove-item" data-name="${item.name}">Remove</button>
      </div>`;
  });

  document.querySelectorAll(".increase").forEach(btn => btn.addEventListener("click", modifyQuantity));
  document.querySelectorAll(".decrease").forEach(btn => btn.addEventListener("click", modifyQuantity));
  document.querySelectorAll(".remove-item").forEach(btn => btn.addEventListener("click", removeItem));
}


  // Modify item quantity
  function modifyQuantity(event) {
    const index = event.target.dataset.index;
    const action = event.target.classList.contains("increase") ? 1 : -1;
    cartItems[index].quantity += action;
    if (cartItems[index].quantity < 1) cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));  // Update cart in localStorage
    updateCartUI();
  }

  // Remove item from cart
  function removeItem(event) {
    const itemName = event.target.dataset.name;
    cartItems = cartItems.filter(item => item.name !== itemName);
    localStorage.setItem("cart", JSON.stringify(cartItems));  // Update cart in localStorage
    updateCartUI();
  }

  // Handle Add to Cart on detail page
  if (document.querySelector(".add-to-cart")) {
    document.querySelector(".add-to-cart").addEventListener("click", () => {
      const productName = document.getElementById("product-name").textContent;
      const productPrice = document.getElementById("product-price").textContent.replace(' SEK', '');
      const productImage = document.getElementById("product-image").src;
      addToCart(productName, productPrice, productImage);
    });
  }

  // Product details page
  function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const price = params.get("price");
    const imageUrl = params.get("image");
    const sizes = params.get("sizes")?.split(",");
    const material = params.get("material");
    const description = params.get("description");

    if (name && price && imageUrl) {
      document.getElementById("product-name").textContent = name;
      document.getElementById("product-price").textContent = `${price} SEK`;
      document.getElementById("product-image").src = imageUrl;
      document.getElementById("product-material").textContent = material;
      document.getElementById("product-description").textContent = description;
      document.getElementById("product-sizes").innerHTML = sizes.map(size => `<li>${size}</li>`).join("");
    }
  }

  loadProductDetails();

  cartCount.textContent = cartItems.length;
});
