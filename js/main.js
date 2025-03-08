document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".icon-cart");
  const cartTab = document.querySelector(".cart-tab");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartList = document.querySelector(".cart-list");
  const addToCartButtons = document.querySelectorAll(".addCart");
  const cartCount = document.querySelector(".cart-count");
  const emptyCartMessage = document.querySelector('.empty-cart-message');

  let cart = [];

  // Cart Icon Click (Show/Hide Cart)
  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");

    if (cart.length === 0) {
      emptyCartMessage.style.display = 'block'; 
    } else {
      emptyCartMessage.style.display = 'none';
    }
  });

  // Close Cart Button
  closeCartBtn.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });

  // Update Cart UI
  function updateCartUI() {
    cartList.innerHTML = "";
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
      cartList.innerHTML = "<p>Your cart is empty</p>";
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="details">
          <p>${item.name}</p>
          <p>${item.price} KR</p>
          <div class="quantity-controls">
            <button class="decrease" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-index="${index}">+</button>
          </div>
        </div>
      `;

      cartList.appendChild(cartItem);
    });

    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", increaseQuantity);
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", decreaseQuantity);
    });
  }

  // Add to Cart Function
  function addToCart(event) {
    const itemElement = event.target.closest(".item");
    const itemName = itemElement.dataset.name;
    const itemPrice = parseInt(itemElement.dataset.price);
    const itemImage = itemElement.dataset.image;

    const existingItem = cart.find((item) => item.name === itemName);
    if (existingItem) existingItem.quantity++;
    else
      cart.push({
        name: itemName,
        price: itemPrice,
        image: itemImage,
        quantity: 1,
      });

    updateCartUI();
    saveCartToLocalStorage();
  }

  // Save Cart to Local Storage
  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Load Cart from Local Storage
  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  }

  loadCartFromLocalStorage();

  // Increase Quantity
  function increaseQuantity(event) {
    cart[event.target.dataset.index].quantity++;
    updateCartUI();
    saveCartToLocalStorage();
  }

  // Decrease Quantity
  function decreaseQuantity(event) {
    let item = cart[event.target.dataset.index];
    if (item.quantity > 1) item.quantity--;
    else cart.splice(event.target.dataset.index, 1);
    updateCartUI();
    saveCartToLocalStorage();
  }

  // Add Event Listeners to All Add to Cart Buttons
  addToCartButtons.forEach((button) =>
    button.addEventListener("click", addToCart)
  );

  // Display Product Details Based on URL Parameter
  function getProductDetails(productName) {
    const products = {
      "SmoothRing": {
        name: "Smooth Ring",
        price: "2 000 KR",
        description: "A smooth and elegant silver ring.",
        image: "../img/SMOOTH.jpeg",
        id: "SmoothRing",
      },
      "RoundedSilverRing": {
        name: "Rounded │ Silver ring",
        price: "1 000 KR",
        description: "A classic silver ring with a rounded design.",
        image: "../img/rounded-ring-a.png",
        id: "RoundedSilverRing",
      },
      "SignetSilver": {
        name: "Signet │ Silver",
        price: "3 500 KR",
        description: "A stylish signet ring with an inset diamond.",
        image: "../img/diamond-signet-b.png",
        id: "SignetSilver",
      },
      "MouldedSilver": {
        name: "Moulded │ Silver",
        price: "1 800 KR",
        description: "A beautifully moulded silver ring with intricate detailing.",
        image: "../img/moulded-ring-c.png",
        id: "MouldedSilver",
      }
    };

    return products[productName];
  }

  // Display Product Details on the Page
  function displayProductDetails(product) {
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-price").innerText = product.price;
    document.getElementById("product-description").innerText = product.description;
    document.getElementById("product-image").src = product.image;
  }

  // Handle Add to Cart for Product Page
  function addProductToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart.`);
  }

  // Project Cards Toggle
  let projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });

  // Contact Form Submission
  let form = document.getElementById('contact-form');
  let confirmationMessage = document.getElementById('confirmation-message');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    form.style.display = 'none';
    confirmationMessage.style.display = 'block';
  });

});
