const Checkout = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const modalOverlay = document.getElementById('checkoutModalOverlay');
        const closeBtn = document.getElementById('closeCheckoutModalBtn');
        const form = document.getElementById('checkoutForm');
        
        // Step buttons
        const btnNextPayment = document.getElementById('btnNextPayment');
        const btnBackAddress = document.getElementById('btnBackAddress');
        const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');
        
        // Panes
        const paneAddress = document.getElementById('checkoutPaneAddress');
        const panePayment = document.getElementById('checkoutPanePayment');
        const paneSuccess = document.getElementById('checkoutPaneSuccess');
        
        // Indicators
        const step1 = document.getElementById('stepIndicator1');
        const step2 = document.getElementById('stepIndicator2');
        const step3 = document.getElementById('stepIndicator3');

        if (closeBtn && modalOverlay) {
            closeBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
        }

        if (btnNextPayment) {
            btnNextPayment.addEventListener('click', () => {
                // Validate inputs
                const shipName = document.getElementById('shipName');
                const shipAddress = document.getElementById('shipAddress');
                const shipCity = document.getElementById('shipCity');
                const shipZip = document.getElementById('shipZip');
                
                if (!shipName.value.trim() || !shipAddress.value.trim() || !shipCity.value.trim() || !shipZip.value.trim()) {
                    API.showToast('Please fill out all shipping details.', 'error');
                    return;
                }
                
                // Show Pane 2
                paneAddress.classList.remove('active');
                panePayment.classList.add('active');
                
                step1.classList.remove('active');
                step1.classList.add('completed');
                step2.classList.add('active');
            });
        }

        if (btnBackAddress) {
            btnBackAddress.addEventListener('click', () => {
                panePayment.classList.remove('active');
                paneAddress.classList.add('active');
                
                step1.classList.add('active');
                step1.classList.remove('completed');
                step2.classList.remove('active');
            });
        }

        if (btnCloseSuccessModal) {
            btnCloseSuccessModal.addEventListener('click', () => {
                modalOverlay.classList.remove('open');
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.processOrder();
            });
        }
    },

    openModal() {
        const user = API.getUser();
        if (!user) {
            API.showToast('Please sign in to proceed to checkout.', 'error');
            document.getElementById('authModalOverlay').classList.add('open');
            return;
        }

        const modalOverlay = document.getElementById('checkoutModalOverlay');
        const shipName = document.getElementById('shipName');
        const payableAmount = document.getElementById('checkoutPayableAmount');
        
        // Reset panes and indicators
        document.getElementById('checkoutPaneAddress').classList.add('active');
        document.getElementById('checkoutPanePayment').classList.remove('active');
        document.getElementById('checkoutPaneSuccess').classList.remove('active');
        
        const step1 = document.getElementById('stepIndicator1');
        const step2 = document.getElementById('stepIndicator2');
        const step3 = document.getElementById('stepIndicator3');
        
        step1.className = 'checkout-step-indicator active';
        step2.className = 'checkout-step-indicator';
        step3.className = 'checkout-step-indicator';

        if (shipName) shipName.value = user.name;
        if (payableAmount) payableAmount.textContent = `₹${Cart.getSubtotal().toLocaleString('en-IN')}`;

        modalOverlay.classList.add('open');
    },

    async processOrder() {
        const user = API.getUser();
        if (!user) {
            API.showToast('Authentication required.', 'error');
            return;
        }

        const shippingName = document.getElementById('shipName').value;
        const shippingAddress = document.getElementById('shipAddress').value;
        const shippingCity = document.getElementById('shipCity').value;
        const shippingZip = document.getElementById('shipZip').value;
        const paymentMethod = document.getElementById('paymentMethod').value;

        const items = Cart.items.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        try {
            const data = await API.request('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    items,
                    shippingName,
                    shippingAddress,
                    shippingCity,
                    shippingZip,
                    paymentMethod
                })
            });

            // Transition indicator states
            const step2 = document.getElementById('stepIndicator2');
            const step3 = document.getElementById('stepIndicator3');
            step2.classList.remove('active');
            step2.classList.add('completed');
            step3.classList.add('active');
            
            document.getElementById('checkoutPanePayment').classList.remove('active');
            document.getElementById('checkoutPaneSuccess').classList.add('active');
            
            const successMsg = document.getElementById('checkoutSuccessMessage');
            if (successMsg) {
                successMsg.innerHTML = `Your order <strong>#${data.order.id}</strong> of <strong>₹${data.order.total_amount.toLocaleString('en-IN')}</strong> has been placed. You can view your purchase history in your dashboard.`;
            }

            Cart.clearCart();
            
            // Reload product catalog stock levels
            if (typeof Products !== 'undefined' && typeof Products.loadProducts === 'function') {
                Products.loadProducts();
            }
        } catch (err) {
            API.showToast(err.message, 'error');
        }
    }
};
