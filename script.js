// Cart State
let cart = [];
const WHATSAPP_NUMBER = '2349081560000';

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('blarark_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('blarark_cart', JSON.stringify(cart));
}

// Add to cart function
function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: itemName, price: price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Visual feedback
    const btn = event.target;
    btn.style.background = '#D4AF37';
    btn.style.color = '#0a0a0a';
    setTimeout(() => {
        btn.style.background = '';
        btn.style.color = '';
    }, 300);
}

// Update cart UI
function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartBar) return;
    
    if (cart.length === 0) {
        cartBar.classList.remove('show');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartTotal) cartTotal.textContent = '₦' + total.toLocaleString();
    if (cartCount) cartCount.textContent = `(${itemCount})`;
    cartBar.classList.add('show');
}

// Checkout function
function checkout() {
    if (cart.length === 0) return;
    
    // Get order type details
    const isDineIn = document.querySelector('.order-type-btn.active')?.innerText === 'Dine In';
    
    let message = 'Hello! I would like to place an order from Blarark VI:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${item.quantity}x ${item.name} - ₦${itemTotal.toLocaleString()}\n`;
    });
    
    message += `\nTotal: ₦${total.toLocaleString()}\n\n`;
    
    if (isDineIn) {
        const name = document.getElementById('dinein-name')?.value || 'Not provided';
        const phone = document.getElementById('dinein-phone')?.value || 'Not provided';
        const table = document.getElementById('dinein-table')?.value || 'Not provided';
        const time = document.getElementById('dinein-time')?.value || 'Not provided';
        message += `Order Type: Dine In\nName: ${name}\nPhone: ${phone}\nTable: ${table}\nTime: ${time}`;
    } else {
        const name = document.getElementById('delivery-name')?.value || 'Not provided';
        const phone = document.getElementById('delivery-phone')?.value || 'Not provided';
        const address = document.getElementById('delivery-address')?.value || 'Not provided';
        message += `Order Type: Delivery\nName: ${name}\nPhone: ${phone}\nAddress: ${address}`;
    }
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Set minimum date for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => input.min = today);
});
