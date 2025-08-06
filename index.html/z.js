// Data
let products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        description: "Premium sound quality with noise cancellation",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        description: "Track your fitness and stay connected",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 59.99,
        description: "Portable speaker with 20hr battery life",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

let cart = [];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const saveProductBtn = document.getElementById('saveProduct');

// Display Products
function displayProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';
        productCard.innerHTML = `
            <div class="card product-card animate__animated animate__fadeIn">
                <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="h5 text-primary">$${product.price.toFixed(2)}</p>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-danger btn-sm remove-product" data-id="${product.id}">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                            <i class="bi bi-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.remove-product').forEach(button => {
        button.addEventListener('click', removeProduct);
    });
}

// Cart Functions
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    animateCartBadge();
    showSuccessAlert('Added to cart!');
}

function updateCart() {
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" width="50" height="50" class="rounded me-3" alt="${item.name}">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${item.description}</small>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="input-group input-group-sm" style="width: 100px;">
                    <button class="btn btn-outline-secondary decrease-quantity" type="button" data-id="${item.id}">-</button>
                    <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" data-id="${item.id}">
                    <button class="btn btn-outline-secondary increase-quantity" type="button" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger remove-from-cart" data-id="${item.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        cartItems.appendChild(row);
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    updateCartBadge();
    setupCartEventListeners();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showSuccessAlert('Removed from cart!');
}

// Product Management
function removeProduct(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        products.splice(index, 1);
        cart = cart.filter(item => item.id !== productId);
        displayProducts();
        updateCart();
        showSuccessAlert('Product removed!');
    }
}

function addNewProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').value || 'https://via.placeholder.com/500x300?text=No+Image';
    
    if (name && !isNaN(price)) {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        products.push({
            id: newId,
            name,
            price,
            description,
            image
        });
        
        displayProducts();
        document.getElementById('productForm').reset();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        
        showSuccessAlert('Product added successfully!', 'center', 1500);
    } else {
        showErrorAlert('Please fill all required fields!');
    }
}

// Helper Functions
function animateCartBadge() {
    cartBadge.classList.add('pulse-animation');
    setTimeout(() => {
        cartBadge.classList.remove('pulse-animation');
    }, 500);
}

function updateCartBadge() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = itemCount;
}

function showSuccessAlert(title, position = 'top-end', timer = 1000) {
    Swal.fire({
        position: position,
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: timer
    });
}

function showErrorAlert(text) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: text,
    });
}

function setupCartEventListeners() {
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            const newQuantity = parseInt(e.target.value) || 1;
            
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
                updateCart();
            }
        });
    });
}

// Event Listeners
saveProductBtn.addEventListener('click', addNewProduct);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
});