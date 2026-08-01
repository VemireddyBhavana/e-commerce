const Products = {
    currentCategory: '',
    searchQuery: '',
    sortBy: 'newest',
    maxPrice: 25000,
    minRating: 0,
    carouselIndex: 0,
    carouselInterval: null,

    init() {
        this.initTheme();
        this.loadCategories();
        this.loadProducts();
        this.bindEvents();
        this.initCarousel();
        this.initCountdownTimer();
    },

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const headerSearchBtn = document.getElementById('headerSearchBtn');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        
        const closeBtn = document.getElementById('closeProductModalBtn');
        const modalOverlay = document.getElementById('productModalOverlay');
        const homeLogoBtn = document.getElementById('homeLogoBtn');
        const priceRangeInput = document.getElementById('priceRangeInput');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const ratingCheckboxes = document.querySelectorAll('.rating-filter-checkbox');
        const sortPills = document.querySelectorAll('.sort-pill');

        // Theme Toggle Buttons
        const themeBtn = document.getElementById('themeToggleBtn');
        const mobileThemeBtn = document.getElementById('mobileThemeToggleBtn');
        if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());
        if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', () => this.toggleTheme());

        // Home logo click
        if (homeLogoBtn) {
            homeLogoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetAllFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Header Navigation Links click (Home, Men, Women, Kids, Sale %)
        const headerNavLinks = document.querySelectorAll('.navbar .nav-link');
        headerNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.id === 'homeNavBtn') {
                    e.preventDefault();
                    this.resetAllFilters();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                
                const catSlug = link.getAttribute('data-category-link');
                if (catSlug !== null) {
                    e.preventDefault();
                    this.currentCategory = catSlug;
                    this.updateActiveCategoryUI(catSlug);
                    this.loadProducts();
                    
                    const storeEl = document.getElementById('storeLayout');
                    if (storeEl) {
                        storeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Footer Collection Links click
        const footerCatLinks = document.querySelectorAll('.footer-column a[href="#storeLayout"]');
        footerCatLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const txt = link.textContent.toLowerCase();
                let catSlug = '';
                if (txt.includes('men')) catSlug = 'men';
                else if (txt.includes('women')) catSlug = 'women';
                else if (txt.includes('kid')) catSlug = 'kids';
                else if (txt.includes('accessor')) catSlug = 'accessories';
                
                if (catSlug) {
                    e.preventDefault();
                    this.currentCategory = catSlug;
                    this.updateActiveCategoryUI(catSlug);
                    this.loadProducts();
                    
                    const storeEl = document.getElementById('storeLayout');
                    if (storeEl) {
                        storeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Search Input (Desktop & Mobile)
        let searchTimeout;
        const handleSearch = (val) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = val.trim();
                this.loadProducts();
            }, 300);
        };

        if (searchInput) {
            searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        }
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        }

        if (headerSearchBtn && searchInput) {
            headerSearchBtn.addEventListener('click', () => {
                this.searchQuery = searchInput.value.trim();
                this.loadProducts();
            });
        }

        // Category Cards Clicks
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const catSlug = card.getAttribute('data-category');
                this.currentCategory = catSlug;
                this.updateActiveCategoryUI(catSlug);
                this.loadProducts();
                
                // Scroll to storefront layout
                const storeEl = document.getElementById('storeLayout');
                if (storeEl) {
                    storeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Price Slider
        if (priceRangeInput) {
            priceRangeInput.addEventListener('input', (e) => {
                const val = e.target.value;
                const valueLabel = document.getElementById('priceSliderValue');
                if (valueLabel) valueLabel.textContent = `Under ₹${Number(val).toLocaleString('en-IN')}`;
                
                // Debounce load products on slider
                clearTimeout(this.priceTimeout);
                this.priceTimeout = setTimeout(() => {
                    this.maxPrice = Number(val);
                    this.loadProducts();
                }, 250);
            });
        }

        // Rating Filter checkboxes
        ratingCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                let selectedRating = 0;
                document.querySelectorAll('.rating-filter-checkbox:checked').forEach(checkedCb => {
                    const val = parseFloat(checkedCb.value);
                    if (val > selectedRating) selectedRating = val;
                });
                this.minRating = selectedRating;
                this.loadProducts();
            });
        });

        // Sorting Pills
        sortPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                sortPills.forEach(p => p.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.sortBy = e.currentTarget.getAttribute('data-sort');
                this.loadProducts();
            });
        });

        // Clear filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.resetAllFilters();
            });
        }

        // Modal close
        if (closeBtn && modalOverlay) {
            closeBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) modalOverlay.classList.remove('open');
            });
        }

        // Mobile Menu Drawer Toggles
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
        
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('open');
            });
        }
        if (closeMobileMenuBtn) {
            closeMobileMenuBtn.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('open');
            });
        }
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
            });
        }

        // Mobile Bottom Navigation Buttons
        const mobileHomeBtn = document.getElementById('mobileHomeBtn');
        const mobileShopBtn = document.getElementById('mobileShopBtn');
        const mobileCartBtn = document.getElementById('mobileCartBtn');
        const mobileProfileBtn = document.getElementById('mobileProfileBtn');

        if (mobileHomeBtn) {
            mobileHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetAllFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.updateMobileBottomNavUI('mobileHomeBtn');
            });
        }
        if (mobileShopBtn) {
            mobileShopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const storeEl = document.getElementById('storeLayout');
                if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
                this.updateMobileBottomNavUI('mobileShopBtn');
            });
        }
        if (mobileCartBtn) {
            mobileCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('cartDrawerOverlay').classList.add('open');
            });
        }
        if (mobileProfileBtn) {
            mobileProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const user = API.getUser();
                if (user) {
                    Auth.openOrdersModal();
                } else {
                    document.getElementById('authModalOverlay').classList.add('open');
                }
            });
        }

        // Header Wishlist Button Click
        const headerWishlistBtn = document.getElementById('headerWishlistBtn');
        if (headerWishlistBtn) {
            headerWishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const user = API.getUser();
                if (user) {
                    Auth.openOrdersModal();
                    // Switch to wishlist tab
                    const tabBtn = document.getElementById('accountTabWishlistBtn');
                    if (tabBtn) tabBtn.click();
                } else {
                    document.getElementById('authModalOverlay').classList.add('open');
                }
            });
        }
    },

    updateMobileBottomNavUI(activeId) {
        ['mobileHomeBtn', 'mobileShopBtn', 'mobileCartBtn', 'mobileProfileBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                if (id === activeId) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });
    },

    resetAllFilters() {
        this.currentCategory = '';
        this.searchQuery = '';
        this.sortBy = 'newest';
        this.maxPrice = 25000;
        this.minRating = 0;

        const searchInput = document.getElementById('searchInput');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        if (searchInput) searchInput.value = '';
        if (mobileSearchInput) mobileSearchInput.value = '';

        const priceRangeInput = document.getElementById('priceRangeInput');
        if (priceRangeInput) {
            priceRangeInput.value = 25000;
            const valueLabel = document.getElementById('priceSliderValue');
            if (valueLabel) valueLabel.textContent = `Under ₹25,000`;
        }

        document.querySelectorAll('.rating-filter-checkbox').forEach(cb => cb.checked = false);
        
        const sortPills = document.querySelectorAll('.sort-pill');
        sortPills.forEach(p => {
            if (p.getAttribute('data-sort') === 'newest') p.classList.add('active');
            else p.classList.remove('active');
        });

        this.updateActiveCategoryUI('');
        this.loadProducts();
    },

    async loadCategories() {
        try {
            const data = await API.request('/categories');
            
            // Populate Left Sidebar category list
            const sidebarList = document.getElementById('sidebarCategoryList');
            const mobileSidebarList = document.getElementById('mobileSidebarCategoryList');
            
            const renderCategoryBtns = (container) => {
                if (!container) return;
                const categoriesHtml = [
                    `<button class="sidebar-cat-btn active" data-category="">All Categories</button>`,
                    ...data.categories.map(cat => `
                        <button class="sidebar-cat-btn" data-category="${cat.slug}">
                            ${cat.name} (${cat.product_count})
                        </button>
                    `)
                ].join('');
                container.innerHTML = categoriesHtml;

                // Bind click events
                container.querySelectorAll('.sidebar-cat-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const catSlug = e.currentTarget.getAttribute('data-category');
                        this.currentCategory = catSlug;
                        this.updateActiveCategoryUI(catSlug);
                        this.loadProducts();
                        
                        // If it's the mobile side drawer, close it on click
                        const mobileOverlay = document.getElementById('mobileMenuOverlay');
                        if (mobileOverlay) mobileOverlay.classList.remove('open');
                        
                        const storeEl = document.getElementById('storeLayout');
                        if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
                    });
                });
            };

            renderCategoryBtns(sidebarList);
            renderCategoryBtns(mobileSidebarList);
            
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    },

    updateActiveCategoryUI(catSlug) {
        // Desktop Sidebar categories
        document.querySelectorAll('#sidebarCategoryList .sidebar-cat-btn').forEach(btn => {
            if (btn.getAttribute('data-category') === catSlug) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Mobile Sidebar categories
        document.querySelectorAll('#mobileSidebarCategoryList .sidebar-cat-btn').forEach(btn => {
            if (btn.getAttribute('data-category') === catSlug) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Desktop Top Links Highlight
        document.querySelectorAll('.navbar .nav-link').forEach(link => {
            const path = link.getAttribute('data-category-link');
            if (path !== null && path === catSlug) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    async loadProducts() {
        const grid = document.getElementById('productsGrid');
        const resultsCount = document.getElementById('resultsCount');

        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--accent);"></i>
                    <p style="margin-top: 1rem;">Loading Luxe Catalog...</p>
                </div>
            `;
        }

        try {
            let url = `/products?sortBy=${this.sortBy}&limit=100`;
            if (this.currentCategory) url += `&category=${encodeURIComponent(this.currentCategory)}`;
            if (this.searchQuery) url += `&q=${encodeURIComponent(this.searchQuery)}`;
            url += `&maxPrice=${this.maxPrice}`;
            if (this.minRating > 0) url += `&minRating=${this.minRating}`;

            const data = await API.request(url);

            let filteredProducts = data.products;
            if (this.minRating > 0) {
                filteredProducts = filteredProducts.filter(p => p.rating >= this.minRating);
            }

            if (resultsCount) {
                resultsCount.textContent = `Showing ${filteredProducts.length} products`;
            }

            if (!grid) return;

            if (filteredProducts.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                        <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.4;"></i>
                        <h3>No products match your filters</h3>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem;">Try adjusting your price slider or search term.</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = filteredProducts.map(p => {
                const originalPrice = p.original_price || Math.round(p.price * 1.3);
                const discount = Math.round(((originalPrice - p.price) / originalPrice) * 100);
                const isWishlisted = typeof Wishlist !== 'undefined' && Wishlist.hasItem(p.id);

                return `
                    <div class="product-card">
                        <div class="product-image-wrap">
                            <img src="${p.image_url}" class="product-image" alt="${p.title}" loading="lazy">
                            <span class="product-badge">${p.category_slug}</span>
                            <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick='Wishlist.toggleItem(${JSON.stringify(p).replace(/'/g, "&apos;")})' title="Save to Wishlist" aria-label="Add to wishlist">
                                <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
                            </button>
                            <button class="quick-view-btn" onclick="Products.openProductModal(${p.id})" title="Quick View">
                                <i class="fa-solid fa-eye"></i> Quick View
                            </button>
                        </div>
                        <div class="product-info">
                            <span class="product-category">${p.category_name}</span>
                            <h3 class="product-title" title="${p.title}">${p.title}</h3>
                            <div class="product-rating">
                                <div class="rating-stars">
                                    ${this.renderRatingStars(p.rating)}
                                </div>
                                <span class="product-rating-count">(${p.rating})</span>
                            </div>
                            <div class="product-footer">
                                <div class="price-row-flip">
                                    <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
                                    <span class="original-price-flip">₹${originalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <button class="btn-add-cart" onclick='Cart.addItem(${JSON.stringify(p).replace(/'/g, "&apos;")})' title="Add to Bag">
                                    <i class="fa-solid fa-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            if (grid) {
                grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--accent); font-weight: 700;">Error: ${err.message}</div>`;
            }
        }
    },

    renderRatingStars(rating) {
        let starsHtml = '';
        const rounded = Math.round(rating * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            if (i <= rounded) {
                starsHtml += '<i class="fa-solid fa-star"></i>';
            } else if (i - 0.5 === rounded) {
                starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star"></i>';
            }
        }
        return starsHtml;
    },

    async openProductModal(productId) {
        const modalOverlay = document.getElementById('productModalOverlay');
        const modalBody = document.getElementById('productModalBody');

        modalBody.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Loading details...</p>';
        modalOverlay.classList.add('open');

        try {
            const data = await API.request(`/products/${productId}`);
            const p = data.product;

            const originalPrice = p.original_price || Math.round(p.price * 1.3);
            const discount = Math.round(((originalPrice - p.price) / originalPrice) * 100);
            const isWishlisted = typeof Wishlist !== 'undefined' && Wishlist.hasItem(p.id);

            modalBody.innerHTML = `
                <div class="product-detail-grid">
                    <div style="position: relative;">
                        <img src="${p.image_url}" class="product-detail-img" alt="${p.title}">
                        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick='Wishlist.toggleItem(${JSON.stringify(p).replace(/'/g, "&apos;")}); Products.openProductModal(${p.id});' style="top: 16px; right: 16px; width: 40px; height: 40px; font-size: 18px;" title="Save to Wishlist">
                            <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div>
                        <span class="product-category">${p.category_name}</span>
                        <h2 class="product-detail-title">${p.title}</h2>
                        
                        <div class="product-rating" style="margin-bottom: 1rem;">
                            <div class="rating-stars" style="font-size: 14px;">
                                ${this.renderRatingStars(p.rating)}
                            </div>
                            <span class="product-rating-count">(${p.rating} / 5.0 Star Rating)</span>
                        </div>

                        <div class="stock-badge ${p.stock > 0 ? 'in-stock' : 'out-stock'}">
                            <i class="fa-solid ${p.stock > 0 ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                            <span>${p.stock > 0 ? `In Stock (${p.stock} units available)` : 'Out of Stock'}</span>
                        </div>

                        <div style="margin-bottom: 1.5rem; display: flex; align-items: baseline; gap: 12px;">
                            <span class="product-detail-price">₹${p.price.toLocaleString('en-IN')}</span>
                            <span class="original-price-flip" style="font-size: 16px;">₹${originalPrice.toLocaleString('en-IN')}</span>
                            <span class="discount-badge-flip" style="font-size: 14px; font-weight: 700;">(${discount}% off)</span>
                        </div>

                        <p class="product-detail-desc">${p.description}</p>

                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button class="btn-primary" style="flex: 1; height: 48px;" onclick='Cart.addItem(${JSON.stringify(p).replace(/'/g, "&apos;")}); document.getElementById("productModalOverlay").classList.remove("open");'>
                                <i class="fa-solid fa-cart-plus"></i>
                                <span>ADD TO BAG</span>
                            </button>
                            <button class="btn-secondary" style="flex: 1; height: 48px;" onclick='Cart.addItem(${JSON.stringify(p).replace(/'/g, "&apos;")}); document.getElementById("productModalOverlay").classList.remove("open"); setTimeout(() => document.getElementById("cartToggleBtn").click(), 200);'>
                                <i class="fa-solid fa-bolt"></i>
                                <span>BUY NOW</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            modalBody.innerHTML = `<p style="color: var(--accent); text-align: center;">${err.message}</p>`;
        }
    },

    /* Hero Banner Carousel Slider Logic */
    initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        const prevBtn = document.getElementById('carouselPrevBtn');
        const nextBtn = document.getElementById('carouselNextBtn');

        if (slides.length === 0) return;

        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            indicators.forEach(i => i.classList.remove('active'));

            this.carouselIndex = (index + slides.length) % slides.length;
            slides[this.carouselIndex].classList.add('active');
            if (indicators[this.carouselIndex]) indicators[this.carouselIndex].classList.add('active');
        };

        const nextSlide = () => showSlide(this.carouselIndex + 1);
        const prevSlide = () => showSlide(this.carouselIndex - 1);

        if (prevBtn) prevBtn.addEventListener('click', () => { this.resetCarouselTimer(); prevSlide(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { this.resetCarouselTimer(); nextSlide(); });

        indicators.forEach(ind => {
            ind.addEventListener('click', (e) => {
                this.resetCarouselTimer();
                const index = parseInt(e.currentTarget.getAttribute('data-slide'));
                showSlide(index);
            });
        });

        this.carouselInterval = setInterval(nextSlide, 6000);
    },

    resetCarouselTimer() {
        clearInterval(this.carouselInterval);
        this.carouselInterval = setInterval(() => {
            const slides = document.querySelectorAll('.carousel-slide');
            if (slides.length > 0) {
                const nextIndex = (this.carouselIndex + 1) % slides.length;
                document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.carousel-indicators .indicator').forEach(i => i.classList.remove('active'));
                this.carouselIndex = nextIndex;
                slides[nextIndex].classList.add('active');
                const indicators = document.querySelectorAll('.carousel-indicators .indicator');
                if (indicators[nextIndex]) indicators[nextIndex].classList.add('active');
            }
        }, 6000);
    },

    /* Live Countdown Timer Logic */
    initCountdownTimer() {
        let targetTime = localStorage.getItem('luxe_countdown_target');
        if (!targetTime) {
            const now = new Date();
            // Set end date to be 23 hours, 45 minutes, 30 seconds from now
            targetTime = new Date(now.getTime() + (23 * 3600 + 45 * 60 + 30) * 1000).getTime();
            localStorage.setItem('luxe_countdown_target', targetTime);
        } else {
            targetTime = parseInt(targetTime);
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = targetTime - now;

            if (diff <= 0) {
                // reset to new 24h cycle
                const cleanNow = new Date();
                const newTarget = new Date(cleanNow.getTime() + 24 * 3600 * 1000).getTime();
                localStorage.setItem('luxe_countdown_target', newTarget);
                targetTime = newTarget;
                return;
            }

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const hrEl = document.getElementById('timerHours');
            const minEl = document.getElementById('timerMinutes');
            const secEl = document.getElementById('timerSeconds');

            if (hrEl) hrEl.textContent = hours.toString().padStart(2, '0');
            if (minEl) minEl.textContent = minutes.toString().padStart(2, '0');
            if (secEl) secEl.textContent = seconds.toString().padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    },

    /* Dark Mode Settings */
    initTheme() {
        const savedTheme = localStorage.getItem('aura_theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        this.updateThemeToggleIcon();
    },

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('aura_theme', isDark ? 'dark' : 'light');
        this.updateThemeToggleIcon();
    },

    updateThemeToggleIcon() {
        const iconBtn = document.getElementById('themeToggleBtn');
        const mobileIconBtn = document.getElementById('mobileThemeToggleBtn');
        
        const isDark = document.body.classList.contains('dark-mode');
        const iconHtml = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        
        if (iconBtn) iconBtn.innerHTML = iconHtml;
        if (mobileIconBtn) mobileIconBtn.innerHTML = iconHtml;
    }
};
