const Cart = {
    items: [],

    init() {
        this.loadCart();
        this.bindEvents();
        this.render();
    },

    loadCart() {
        const saved = localStorage.getItem('aura_cart');
        this.items = saved ? JSON.parse(saved) : [];
    },

    saveCart() {
        localStorage.setItem('aura_cart', JSON.stringify(this.items));
        this.render();
    },

    bindEvents() {
        const cartToggleBtn = document.getElementById('cartToggleBtn');
        const overlay = document.getElementById('cartDrawerOverlay');
        const closeBtn = document.getElementById('closeCartBtn');
        const checkoutBtn = document.getElementById('proceedCheckoutBtn');

        if (cartToggleBtn) {
            cartToggleBtn.addEventListener('click', () => overlay.classList.add('open'));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('open');
                }
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) {
                    API.showToast('Your shopping bag is empty!', 'error');
                    return;
                }
                overlay.classList.remove('open');
                Checkout.openModal();
            });
        }
    },

    addItem(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image_url: product.image_url,
                quantity: quantity
            });
        }
        this.saveCart();
        API.showToast(`Added "${product.title}" to bag.`);
    },

    updateQuantity(productId, qty) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            item.quantity = qty;
            if (item.quantity <= 0) {
                this.removeItem(productId);
                return;
            }
            this.saveCart();
        }
    },

    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);
        const title = item ? item.title : '';
        this.items = this.items.filter(i => i.id !== productId);
        this.saveCart();
        if (title) {
            API.showToast(`Removed "${title}" from bag.`);
        }
    },

    clearCart() {
        this.items = [];
        this.saveCart();
    },

    getTotalCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    render() {
        const badgeCount = document.getElementById('cartBadgeCount');
        const mobileBadgeCount = document.getElementById('mobileCartBadgeCount');
        const container = document.getElementById('cartItemsContainer');
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');

        const totalCount = this.getTotalCount();
        if (badgeCount) badgeCount.textContent = totalCount;
        if (mobileBadgeCount) mobileBadgeCount.textContent = totalCount;

        const subtotal = this.getSubtotal();
        if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <h3>Your bag is empty</h3>
                    <p style="font-size: 0.85rem; margin-top: 0.4rem;">Explore our catalog to add items.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image_url}" class="cart-item-img" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    <div class="cart-qty-controls" style="margin-top: 10px;">
                        <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button onclick="Cart.removeItem(${item.id})" style="color: var(--text-muted); padding: 0.4rem; height: 32px;" aria-label="Remove item">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }
};
