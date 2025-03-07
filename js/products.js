document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".icon-cart");
  const cartTab = document.querySelector(".cart-tab");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartList = document.querySelector(".cart-list");
  const addToCartButtons = document.querySelectorAll(".addCart");
  const cartCount = document.querySelector(".cart-count");
  const closeCart = document.querySelector('.close-cart');
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  const productName = urlParams.get('product');

  let cart = [];

  cartIcon.addEventListener("click", () => {
    cartTab.classList.toggle("show");

    if (cart.length === 0) {
      emptyCartMessage.style.display = 'block'; 
    } else {
      emptyCartMessage.style.display = 'none';
    }
  });
  
  closeCartBtn.addEventListener("click", () => {
    cartTab.classList.remove("show");
  });

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

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", removeItem);
    });
  }

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
  }

  function increaseQuantity(event) {
    cart[event.target.dataset.index].quantity++;
    updateCartUI();
  }

  function decreaseQuantity(event) {
    let item = cart[event.target.dataset.index];
    if (item.quantity > 1) item.quantity--;
    else cart.splice(event.target.dataset.index, 1);
    updateCartUI();
  }

  addToCartButtons.forEach((button) =>
    button.addEventListener("click", addToCart)
  );
});

document.getElementById("addToCartBtn").addEventListener("click", function() {
  alert("Product added to cart!");
});


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

function displayProductDetails(product) {
  document.getElementById("product-name").innerText = product.name;
  document.getElementById("product-price").innerText = product.price;
  document.getElementById("product-description").innerText = product.description;
  document.getElementById("product-image").src = product.image;
}

// Add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} has been added to your cart.`);
}
