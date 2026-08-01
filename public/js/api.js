// API Client & Utility Helper
const API = {
    baseUrl: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '3001'
        ? '/api'
        : 'http://localhost:3001/api',

    getToken() {
        return localStorage.getItem('aura_token');
    },

    setToken(token) {
        if (token) {
            localStorage.setItem('aura_token', token);
        } else {
            localStorage.removeItem('aura_token');
        }
    },

    getUser() {
        const userJson = localStorage.getItem('aura_user');
        return userJson ? JSON.parse(userJson) : null;
    },

    setUser(user) {
        if (user) {
            localStorage.setItem('aura_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('aura_user');
        }
    },

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred during API request.');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let icon = 'fa-circle-check';
        let color = 'var(--accent)';
        if (type === 'error') {
            icon = 'fa-circle-exclamation';
            color = 'var(--accent-danger)';
        }

        toast.innerHTML = `
            <i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.1rem;"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = '0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
};
