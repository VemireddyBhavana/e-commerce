/* ─── LUXE E-Commerce Global JavaScript ───────────────────── */

// ── Dark/Light Mode ──────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleDarkMode() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ── CSRF ─────────────────────────────────────────────────────
function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all .3s ease';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// ── Global Loader ────────────────────────────────────────────
function hideLoader() {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);
  }
}

// ── Mobile Menu ───────────────────────────────────────────────
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  if (overlay) overlay.classList.toggle('open');
}

// ── Cart Drawer ───────────────────────────────────────────────
function toggleCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('open')) {
    overlay.classList.remove('open');
  } else {
    overlay.classList.add('open');
    loadCartDrawer();
  }
}

async function loadCartDrawer() {
  try {
    const res = await fetch('/api/cart/', { credentials: 'include' });
    if (!res.ok) return;
    const cart = await res.json();
    renderCartDrawer(cart);
  } catch (e) { /* silent */ }
}

function renderCartDrawer(cart) {
  const emptyEl   = document.getElementById('cartEmptyState');
  const listEl    = document.getElementById('cartItemsList');
  const footerEl  = document.getElementById('cartFooter');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl    = document.getElementById('cartTotal');

  if (!cart.items || cart.items.length === 0) {
    if (emptyEl)  emptyEl.style.display = 'flex';
    if (listEl)   listEl.innerHTML = '';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }
  if (emptyEl)  emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'flex';

  let html = '';
  cart.items.forEach(item => {
    html += `
    <div class="cart-item-row" id="citem-${item.id}">
      <div class="cart-item-img">
        <img src="${item.product_image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80'}" alt="${item.product_name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80';"/>
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.product_name}</div>
        <div class="cart-item-price">₹${item.product_price}</div>
        <div class="cart-item-qty-row">
          <button class="qty-btn" onclick="updateCart(${item.id},${item.quantity-1})" id="qMinus-${item.id}">–</button>
          <span class="qty-num" id="qNum-${item.id}">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCart(${item.id},${item.quantity+1})" id="qPlus-${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCart(${item.id})" id="qRemove-${item.id}" aria-label="Remove">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>`;
  });
  if (listEl) listEl.innerHTML = html;
  if (subtotalEl) subtotalEl.textContent = '₹' + cart.total_price;
  if (totalEl)    totalEl.textContent    = '₹' + cart.total_price;
}

// ── Cart Count Badge ──────────────────────────────────────────
async function refreshCartCount() {
  try {
    const res = await fetch('/api/cart/', { credentials: 'include' });
    if (!res.ok) return;
    const cart = await res.json();
    const count = cart.total_items || 0;
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  } catch (e) { /* silent */ }
}

// ── Add to Cart ───────────────────────────────────────────────
async function addToCart(productId, productName, quantity = 1) {
  try {
    const res = await fetch('/api/cart/add/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
      credentials: 'include',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (res.ok) {
      showToast(`🛍️ ${productName} added to cart!`, 'success');
      await refreshCartCount();
      if (document.getElementById('cartOverlay')?.classList.contains('open')) {
        await loadCartDrawer();
      }
    } else {
      showToast('Failed to add to cart.', 'error');
    }
  } catch {
    showToast('Network error. Please try again.', 'error');
  }
}

// ── Update Cart Item ──────────────────────────────────────────
async function updateCart(itemId, qty) {
  try {
    await fetch(`/api/cart/update/${itemId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
      credentials: 'include',
      body: JSON.stringify({ quantity: qty }),
    });
    await loadCartDrawer();
    await refreshCartCount();
  } catch { /* silent */ }
}

// ── Remove Cart Item ──────────────────────────────────────────
async function removeCart(itemId) {
  try {
    await fetch(`/api/cart/remove/${itemId}/`, {
      method: 'DELETE',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      credentials: 'include',
    });
    await loadCartDrawer();
    await refreshCartCount();
  } catch { /* silent */ }
}

// ── Wishlist (DB when logged in, localStorage fallback for guests) ──────────

// Internal cache of wishlist IDs (numbers)
let _wishlistIds = null;

async function fetchWishlistIds() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user) {
    // logged in — get from DB
    try {
      const res = await fetch('/api/wishlist/ids/', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        _wishlistIds = data.ids;
        localStorage.setItem('wishlist', JSON.stringify(_wishlistIds));
        return _wishlistIds;
      }
    } catch { /* fall through to localStorage */ }
  }
  // guest or API failure — use localStorage
  _wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
  return _wishlistIds;
}

function getWishlist() {
  return _wishlistIds || JSON.parse(localStorage.getItem('wishlist') || '[]');
}

async function toggleWishlist(productId) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user) {
    // DB toggle
    try {
      const res = await fetch('/api/wishlist/toggle/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!_wishlistIds) _wishlistIds = [];
        if (data.status === 'added') {
          if (!_wishlistIds.includes(productId)) _wishlistIds.push(productId);
          showToast('❤️ Added to wishlist!', 'success');
        } else {
          _wishlistIds = _wishlistIds.filter(id => id !== productId);
          showToast('Removed from wishlist.', 'info');
        }
        localStorage.setItem('wishlist', JSON.stringify(_wishlistIds));
        updateWishlistBtns();
        return;
      }
    } catch { /* fall through */ }
  }
  // Guest: localStorage toggle
  let wl = getWishlist();
  const idx = wl.indexOf(productId);
  if (idx > -1) { wl.splice(idx, 1); showToast('Removed from wishlist.', 'info'); }
  else { wl.push(productId); showToast('❤️ Added to wishlist!', 'success'); }
  _wishlistIds = wl;
  localStorage.setItem('wishlist', JSON.stringify(wl));
  updateWishlistBtns();
}

function updateWishlistBtns() {
  const wl = getWishlist();
  document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
    const id = parseInt(btn.id.replace('wBtn-', ''));
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = wl.includes(id) ? 'fas fa-heart' : 'far fa-heart';
      btn.style.color = wl.includes(id) ? 'var(--brand)' : '';
    }
  });
}

// ── Auth State ────────────────────────────────────────────
async function checkAuthState() {
  try {
    const res = await fetch('/accounts/api/me/', { credentials: 'include' });
    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      const navUserIcon = document.getElementById('navUserIcon');
      if (navUserIcon) {
        navUserIcon.href = '/accounts/profile/';
        navUserIcon.style.display = 'flex';
      }
      // sync wishlist from DB after auth
      await fetchWishlistIds();
      updateWishlistBtns();
    } else {
      localStorage.removeItem('user');
    }
  } catch { /* silent */ }
}

// ── Logout ────────────────────────────────────────────────────
async function handleLogout() {
  try {
    await fetch('/accounts/api/logout/', {
      method: 'POST',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      credentials: 'include',
    });
  } catch { /* silent */ }
  localStorage.removeItem('user');
  showToast('Logged out successfully.', 'info');
  setTimeout(() => window.location.href = '/', 600);
}

// ── Newsletter Subscribe ───────────────────────────────────────
async function handleNewsletterSubscribe(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput ? emailInput.value.trim() : '';
  if (!email) return;
  try {
    const res = await fetch('/api/newsletter/subscribe/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    showToast(data.message || 'Subscribed! 🎉', res.ok ? 'success' : 'error');
    if (res.ok && emailInput) emailInput.value = '';
  } catch {
    showToast('Network error. Please try again.', 'error');
  }
}

// ── Scroll Reveal Observer ───────────────────────────────────
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const revealTargets = document.querySelectorAll('.product-card, .category-card, .service-item, .order-card');
  revealTargets.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px) scale(0.97)';
    el.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index % 8 * 0.06}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index % 8 * 0.06}s`;
    observer.observe(el);
  });
}

// ── Navbar shadow on scroll ───────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.12)' : 'none';
});

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  checkAuthState();
  refreshCartCount();
  updateWishlistBtns();
  initScrollReveal();
  // Hide global loader after 800ms
  setTimeout(hideLoader, 800);
});
