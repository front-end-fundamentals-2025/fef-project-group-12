
document.addEventListener("DOMContentLoaded", function () {
    const cartIcon = document.querySelector('.icon-cart');
    const cartTab = document.querySelector('.cart-tab');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartList = document.querySelector('.cart-list');
    const addToCartButtons = document.querySelectorAll('.addCart');
    const cartCount = document.querySelector('.cart-count');

    let cart = []; // Stores cart items

    // Toggle shopping cart visibility
    cartIcon.addEventListener('click', () => {
        cartTab.classList.toggle('show');
    });

    // Close shopping cart when clicking "Close"
    closeCartBtn.addEventListener('click', () => {
        cartTab.classList.remove('show');
    });

    // Function to update the cart UI
    function updateCartUI() {
        cartList.innerHTML = ""; // Clear the cart display
        if (cart.length === 0) {
            cartList.innerHTML = "<p>Your cart is empty</p>";
            cartCount.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="details">
                    <p>${item.name}</p>
                    <p>${item.price} KR x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-index="${index}">X</button>
            `;

            cartList.appendChild(cartItem);
        });

        // Update cart count
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Function to add item to cart
    function addToCart(event) {
        const itemElement = event.target.closest('.item');
        const itemName = itemElement.dataset.name;
        const itemPrice = parseInt(itemElement.dataset.price);
        const itemImage = itemElement.dataset.image;

        // Check if item is already in cart
        const existingItem = cart.find(item => item.name === itemName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });
        }

        updateCartUI();
    }

    // Function to remove an item from the cart
    function removeItem(event) {
        const index = event.target.dataset.index;
        cart.splice(index, 1);
        updateCartUI();
    }

    // Attach event listeners to all "ADD TO CART" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    updateCartUI();
});
