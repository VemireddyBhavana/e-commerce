const Wishlist = {
    items: [],

    init() {
        this.loadWishlist();
        this.render();
    },

    loadWishlist() {
        const saved = localStorage.getItem('aura_wishlist');
        this.items = saved ? JSON.parse(saved) : [];
    },

    saveWishlist() {
        localStorage.setItem('aura_wishlist', JSON.stringify(this.items));
        this.render();
    },

    toggleItem(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index > -1) {
            // Remove from wishlist
            this.items.splice(index, 1);
            API.showToast(`Removed "${product.title}" from wishlist.`);
        } else {
            // Add to wishlist
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                original_price: product.original_price,
                image_url: product.image_url,
                category_name: product.category_name || product.category_slug,
                rating: product.rating,
                stock: product.stock
            });
            API.showToast(`Added "${product.title}" to wishlist.`);
        }
        this.saveWishlist();
        
        // Reload catalog to refresh heart button icons
        if (typeof Products !== 'undefined' && typeof Products.loadProducts === 'function') {
            Products.loadProducts();
        }
    },

    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    },

    getTotalCount() {
        return this.items.length;
    },

    render() {
        // Update header count badge
        const badgeCount = document.getElementById('wishlistBadgeCount');
        const mobileBadgeCount = document.getElementById('mobileWishlistBadgeCount');
        
        const count = this.getTotalCount();
        if (badgeCount) {
            badgeCount.textContent = count;
            badgeCount.style.display = count > 0 ? 'flex' : 'none';
        }
        if (mobileBadgeCount) {
            mobileBadgeCount.textContent = count;
            mobileBadgeCount.style.display = count > 0 ? 'flex' : 'none';
        }

        // Render in user profile account dashboard if active
        this.renderWishlistTab();
    },

    renderWishlistTab() {
        const container = document.getElementById('wishlistItemsContainer');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <i class="fa-regular fa-heart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.4;"></i>
                    <h3>Your Wishlist is Empty</h3>
                    <p style="margin-top: 0.5rem; font-size: 0.88rem;">Explore the catalog to save your favorite items.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(p => {
            const originalPrice = p.original_price || Math.round(p.price * 1.3);
            const discount = Math.round(((originalPrice - p.price) / originalPrice) * 100);
            
            return `
                <div class="product-card">
                    <div class="product-image-wrap">
                        <img src="${p.image_url}" class="product-image" alt="${p.title}" loading="lazy">
                        <span class="product-badge">${p.category_name}</span>
                        <button class="btn-wishlist active" onclick="Wishlist.toggleItem({id: ${p.id}, title: '${p.title.replace(/'/g, "\\'")}'})" aria-label="Remove Wishlist">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <span class="product-category">${p.category_name}</span>
                        <h3 class="product-title" title="${p.title}" onclick="Products.openProductModal(${p.id}); document.getElementById('ordersModalOverlay').classList.remove('open');" style="cursor:pointer;">${p.title}</h3>
                        <div class="product-rating">
                            <span style="background-color: var(--accent); color: white; padding: 1px 6px; border-radius: 3px; font-weight: 700; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 3px;">
                                ${p.rating} <i class="fa-solid fa-star" style="font-size: 0.65rem;"></i>
                            </span>
                        </div>
                        <div class="product-footer">
                            <div class="price-row-flip">
                                <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
                            </div>
                            <button class="btn-add-cart" onclick='Cart.addItem(${JSON.stringify(p).replace(/'/g, "&apos;")}); document.getElementById("ordersModalOverlay").classList.remove("open");' title="Add to Bag">
                                <i class="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
