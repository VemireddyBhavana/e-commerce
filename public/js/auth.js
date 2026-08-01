const Auth = {
    init() {
        this.bindEvents();
        this.listenAuthState();
    },

    /**
     * Listen to Firebase auth state changes.
     * When user logs in/out, sync token and update UI.
     */
    listenAuthState() {
        auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get fresh Firebase ID Token and store it
                    const idToken = await firebaseUser.getIdToken();
                    API.setToken(idToken);
                    API.setUser({
                        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email,
                        uid: firebaseUser.uid
                    });
                } catch (err) {
                    console.error('Failed to get ID token:', err);
                }
            } else {
                // User signed out
                API.setToken(null);
                API.setUser(null);
            }
            this.updateNavUI();
        });
    },

    bindEvents() {
        const openBtn = document.getElementById('openAuthModalBtn');
        const authModal = document.getElementById('authModalOverlay');
        const closeBtn = document.getElementById('closeAuthModalBtn');
        const tabLogin = document.getElementById('tabLogin');
        const tabRegister = document.getElementById('tabRegister');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const ordersModal = document.getElementById('ordersModalOverlay');
        const closeOrdersBtn = document.getElementById('closeOrdersModalBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        // Account tab selectors
        const tabOrdersBtn = document.getElementById('accountTabOrdersBtn');
        const tabWishlistBtn = document.getElementById('accountTabWishlistBtn');
        const tabAddressBtn = document.getElementById('accountTabAddressBtn');
        const paneOrders = document.getElementById('paneOrders');
        const paneWishlist = document.getElementById('paneWishlist');
        const paneAddress = document.getElementById('paneAddress');

        const switchTab = (activeBtn, activePane) => {
            [tabOrdersBtn, tabWishlistBtn, tabAddressBtn].forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
            [paneOrders, paneWishlist, paneAddress].forEach(pane => {
                if (pane) pane.classList.remove('active');
            });
            if (activeBtn) activeBtn.classList.add('active');
            if (activePane) activePane.classList.add('active');

            if (activePane === paneWishlist && typeof Wishlist !== 'undefined') {
                Wishlist.renderWishlistTab();
            }
        };

        if (tabOrdersBtn) tabOrdersBtn.addEventListener('click', () => switchTab(tabOrdersBtn, paneOrders));
        if (tabWishlistBtn) tabWishlistBtn.addEventListener('click', () => switchTab(tabWishlistBtn, paneWishlist));
        if (tabAddressBtn) tabAddressBtn.addEventListener('click', () => switchTab(tabAddressBtn, paneAddress));

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                const user = API.getUser();
                if (user) {
                    this.openOrdersModal();
                } else {
                    authModal.classList.add('open');
                }
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', () => authModal.classList.remove('open'));
        if (closeOrdersBtn) closeOrdersBtn.addEventListener('click', () => ordersModal.classList.remove('open'));

        if (tabLogin && tabRegister) {
            tabLogin.addEventListener('click', () => {
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            });

            tabRegister.addEventListener('click', () => {
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
            });
        }

        // --- Login with Firebase ---
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;
                const submitBtn = loginForm.querySelector('button[type="submit"]');

                try {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Signing in...</span>';

                    await auth.signInWithEmailAndPassword(email, password);
                    // onAuthStateChanged handles token storage and UI update
                    API.showToast('Welcome back!');
                    authModal.classList.remove('open');
                } catch (err) {
                    API.showToast(this.formatFirebaseError(err.code), 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Sign In</span>';
                }
            });
        }

        // --- Register with Firebase ---
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('regName').value.trim();
                const email = document.getElementById('regEmail').value.trim();
                const password = document.getElementById('regPassword').value;
                const submitBtn = registerForm.querySelector('button[type="submit"]');

                try {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Creating Account...</span>';

                    // Create user in Firebase Auth
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);

                    // Set display name in Firebase
                    await userCredential.user.updateProfile({ displayName: name });

                    // Force token refresh so displayName is included
                    const idToken = await userCredential.user.getIdToken(true);
                    API.setToken(idToken);
                    API.setUser({ name, email, uid: userCredential.user.uid });

                    API.showToast(`Account created! Welcome, ${name}.`);
                    authModal.classList.remove('open');
                    this.updateNavUI();
                } catch (err) {
                    API.showToast(this.formatFirebaseError(err.code), 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Create Account</span>';
                }
            });
        }

        // --- Logout ---
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
                API.showToast('Signed out successfully.');
                ordersModal.classList.remove('open');
                this.updateNavUI();

                if (typeof Wishlist !== 'undefined') {
                    Wishlist.items = [];
                    localStorage.removeItem('aura_wishlist');
                    Wishlist.render();
                }

                if (typeof Products !== 'undefined') {
                    Products.loadProducts();
                }
            });
        }
    },

    updateNavUI() {
        const navContainer = document.getElementById('userNavContainer');
        const user = API.getUser();

        if (!navContainer) return;

        if (user) {
            navContainer.innerHTML = `
                <button class="nav-icon-btn" id="openAuthModalBtn" title="Account Dashboard (${user.name})" style="border: 1.5px solid var(--accent); color: var(--accent);">
                    <i class="fa-solid fa-user-check"></i>
                </button>
            `;

            const mobileProfileBtn = document.getElementById('mobileProfileBtn');
            if (mobileProfileBtn) {
                mobileProfileBtn.innerHTML = `
                    <i class="fa-solid fa-user-check"></i>
                    <span>${user.name.split(' ')[0]}</span>
                `;
            }
        } else {
            navContainer.innerHTML = `
                <button class="nav-icon-btn" id="openAuthModalBtn" title="Sign In">
                    <i class="fa-regular fa-user"></i>
                </button>
            `;

            const mobileProfileBtn = document.getElementById('mobileProfileBtn');
            if (mobileProfileBtn) {
                mobileProfileBtn.innerHTML = `
                    <i class="fa-regular fa-user"></i>
                    <span>Profile</span>
                `;
            }
        }

        // Rebind click listener
        const btn = document.getElementById('openAuthModalBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                if (API.getUser()) {
                    this.openOrdersModal();
                } else {
                    document.getElementById('authModalOverlay').classList.add('open');
                }
            });
        }
    },

    async openOrdersModal() {
        const user = API.getUser();
        if (!user) return;

        const modal = document.getElementById('ordersModalOverlay');
        document.getElementById('profileUserName').textContent = user.name;
        document.getElementById('profileUserEmail').textContent = user.email;

        // Make sure Orders pane is shown by default
        const tabOrdersBtn = document.getElementById('accountTabOrdersBtn');
        if (tabOrdersBtn) tabOrdersBtn.click();

        modal.classList.add('open');
        this.loadOrderHistory();
    },

    async loadOrderHistory() {
        const container = document.getElementById('ordersListContainer');
        container.innerHTML = '<p style="color: var(--text-muted);">Loading orders...</p>';

        try {
            const data = await API.request('/orders');

            // Populate default Address Tab with latest order's address
            const addressSummaryText = document.getElementById('addressSummaryText');
            if (data.orders && data.orders.length > 0) {
                const latest = data.orders[0];
                if (addressSummaryText) {
                    addressSummaryText.innerHTML = `
                        <strong>${latest.shipping_name}</strong><br>
                        ${latest.shipping_address}<br>
                        ${latest.shipping_city} - ${latest.shipping_zip}<br>
                        <span style="font-size: 10px; color: var(--accent); font-weight: 700; display: inline-block; margin-top: 8px;">DELIVERED IN ORDER #${latest.id}</span>
                    `;
                }
            } else {
                if (addressSummaryText) {
                    addressSummaryText.textContent = 'Address details not filled yet. Complete your first order to store default shipping details.';
                }
            }

            if (!data.orders || data.orders.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); padding: 1rem 0; font-size: 13px;">No order history found. Start shopping!</p>';
                return;
            }

            container.innerHTML = data.orders.map(order => `
                <div class="order-card">
                    <div class="order-card-header">
                        <div>
                            <span class="order-id">Order #${order.id}</span>
                            <span class="order-date"> • ${new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span class="order-status">${order.status}</span>
                            <span style="font-weight: 800; margin-left: 0.8rem; color: var(--accent);">₹${order.total_amount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <div>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.8rem;">
                            <strong>Delivery Address:</strong> ${order.shipping_name}, ${order.shipping_address}, ${order.shipping_city} (${order.shipping_zip})
                        </p>
                        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                            ${order.items.map(item => `
                                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                                        <img src="${item.image_url}" style="width: 40px; height: 50px; border-radius: 4px; object-fit: cover; background-color: var(--bg-main);">
                                        <span>${item.product_title} × ${item.quantity}</span>
                                    </div>
                                    <strong style="color: var(--text-main);">₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = `<p style="color: var(--accent);">${err.message}</p>`;
        }
    },

    /**
     * Convert Firebase error codes to user-friendly messages
     */
    formatFirebaseError(code) {
        const messages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password must be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Check your internet connection.',
            'auth/invalid-credential': 'Invalid email or password. Please try again.',
        };
        return messages[code] || 'Something went wrong. Please try again.';
    }
};
