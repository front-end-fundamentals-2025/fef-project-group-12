document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".icon-cart");
  const cartTab = document.querySelector(".cart-tab");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartList = document.querySelector(".cart-list");
  const addToCartButtons = document.querySelectorAll(".addCart");
  const cartCount = document.querySelector(".cart-count");

  let cart = [];

  cartIcon.addEventListener("click", () => cartTab.classList.toggle("show"));
  closeCartBtn.addEventListener("click", () =>
    cartTab.classList.remove("show")
  );

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
