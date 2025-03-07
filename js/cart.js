let cartItems = [];

function addItemToCart(name, price) {
  const existingItem = cartItems.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name, price, quantity: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const cartList = document.querySelector('.cart-list');
  cartList.innerHTML = '';
  let totalCost = 0;
  cartItems.forEach(item => {
    const listItem = document.createElement('div');
    listItem.classList.add('cart-item');
    listItem.innerHTML = `
      <p>${item.name} x ${item.quantity} - ${item.price} SEK</p>
      <p>Total: ${item.quantity * item.price} SEK</p>
      <button class="remove-item" data-name="${item.name}">Remove</button>
    `;
    cartList.appendChild(listItem);
    totalCost += item.quantity * item.price;
  });
  const cartTotal = document.querySelector('.cart-total');
  cartTotal.textContent = `Total: ${totalCost} SEK`;
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('remove-item')) {
    const itemName = event.target.getAttribute('data-name');
    cartItems = cartItems.filter(item => item.name !== itemName);
    updateCartUI();
  }
});

document.querySelectorAll('.addCart').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    const name = item.getAttribute('data-name');
    const price = parseInt(item.getAttribute('data-price'), 10);
    addItemToCart(name, price);
  });
});

document.querySelector('.cart-footer .check-out').addEventListener('click', () => {
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

    Thank you for your purchase!
  `;
  alert(confirmationMessage);
  cartItems = [];
  updateCartUI();
});
