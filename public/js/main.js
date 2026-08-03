/* ─── LuxeStore Main JavaScript ─────────────────────────── */

'use strict';

function handleNavCategoryClick(e, catSlug) {
  if (window.location.pathname === '/products/' && typeof navigateCategory === 'function') {
    e.preventDefault();
    navigateCategory(catSlug);
  }
}

function getCsrfToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name + '=')) return decodeURIComponent(c.substring(name.length + 1));
  }
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (meta) return meta.getAttribute('content');
  const input = document.querySelector('[name=csrfmiddlewaretoken]');
  if (input) return input.value;
  return '';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'i';
  toast.innerHTML = `<span style="font-weight:700;">${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateCartBadge(count) {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.textContent = count;
  if (count > 0) {
    badge.classList.remove('nav-badge-hidden');
  } else {
    badge.classList.add('nav-badge-hidden');
  }
}

function updateWishlistBadge(count) {
  const badge = document.getElementById('wishlistBadge');
  if (!badge) return;
  badge.textContent = count;
  if (count > 0) {
    badge.classList.remove('nav-badge-hidden');
  } else {
    badge.classList.add('nav-badge-hidden');
  }
}

// ── Profile Dropdown ───────────────────────────────────────
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.nav-profile-wrap');
  const dropdown = document.getElementById('profileDropdown');
  if (wrap && dropdown && !wrap.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

// ── Auth State ─────────────────────────────────────────────
async function checkAuthState() {
  try {
    const resp = await fetch('/accounts/api/me/');
    const loggedInEl = document.getElementById('dropdownLoggedIn');
    const loggedOutEl = document.getElementById('dropdownLoggedOut');
    if (resp.ok) {
      if (loggedInEl) loggedInEl.style.display = 'block';
      if (loggedOutEl) loggedOutEl.style.display = 'none';
    } else {
      if (loggedInEl) loggedInEl.style.display = 'none';
      if (loggedOutEl) loggedOutEl.style.display = 'block';
    }
  } catch (e) {
    const loggedInEl = document.getElementById('dropdownLoggedIn');
    const loggedOutEl = document.getElementById('dropdownLoggedOut');
    if (loggedInEl) loggedInEl.style.display = 'none';
    if (loggedOutEl) loggedOutEl.style.display = 'block';
  }
}

async function handleLogout() {
  try {
    await fetch('/accounts/api/logout/', {
      method: 'POST',
      headers: {'X-CSRFToken': getCsrfToken()}
    });
    showToast('Logged out successfully', 'info');
    updateCartBadge(0);
    setTimeout(() => spaNavigate('/'), 400);
  } catch(e) {
    spaNavigate('/');
  }
}

// ── Cart ───────────────────────────────────────────────────
async function loadCartCount() {
  try {
    const resp = await fetch('/api/cart/');
    if (resp.ok) {
      const cart = await resp.json();
      updateCartBadge(cart.total_items || 0);
    }
  } catch(e) {}
}

async function addToCart(productId, productName, qty = 1) {
  try {
    const resp = await fetch('/api/cart/add/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken()},
      body: JSON.stringify({ product_id: productId, quantity: qty })
    });
    if (resp.ok) {
      const cart = await resp.json();
      updateCartBadge(cart.total_items || 0);
      showToast(`${productName} added to cart 🛍️`, 'success');
      return true;
    }
    return false;
  } catch(e) {
    showToast('Failed to add to cart', 'error');
    return false;
  }
}

async function handleAddCart(productId, productName, btn) {
  if (btn && btn.classList.contains('in-cart')) {
    spaNavigate('/cart/');
    return;
  }
  const success = await addToCart(productId, productName);
  if (success && btn) {
    btn.textContent = 'Go To Cart';
    btn.classList.add('in-cart');
    btn.onclick = (e) => {
      e.stopPropagation();
      spaNavigate('/cart/');
    };
  }
}

// ── Wishlist ───────────────────────────────────────────────
async function loadWishlistCount() {
  try {
    const resp = await fetch('/api/wishlist/ids/');
    if (resp.ok) {
      const data = await resp.json();
      updateWishlistBadge(data.ids ? data.ids.length : 0);
    }
  } catch(e) {}
}

async function toggleWishlist(productId) {
  try {
    const resp = await fetch('/api/wishlist/toggle/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken()},
      body: JSON.stringify({ product_id: productId })
    });
    if (resp.ok) {
      const data = await resp.json();
      showToast(data.status === 'added' ? 'Added to Wishlist ❤️' : 'Removed from Wishlist', data.status === 'added' ? 'success' : 'info');
      loadWishlistCount();
      return data.status;
    } else if (resp.status === 401 || resp.status === 403) {
      showToast('Please login to use Wishlist', 'error');
      setTimeout(() => spaNavigate('/accounts/login/?next=' + window.location.pathname), 1000);
    }
  } catch(e) {
    showToast('Something went wrong', 'error');
  }
}

function goToWishlist(e) {
  e.preventDefault();
  fetch('/accounts/api/me/').then(r => {
    if (r.ok) {
      showToast('Wishlist feature coming soon!', 'info');
    } else {
      spaNavigate('/accounts/login/');
    }
  });
}

// ── Newsletter ─────────────────────────────────────────────
async function handleNewsletterSubscribe() {
  const input = document.getElementById('newsletterEmail');
  if (!input || !input.value) {
    showToast('Please enter your email', 'error');
    return;
  }
  try {
    const resp = await fetch('/api/newsletter/subscribe/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken()},
      body: JSON.stringify({ email: input.value })
    });
    const data = await resp.json();
    showToast(data.message || 'Subscribed!', 'success');
    input.value = '';
  } catch(e) {
    showToast('Something went wrong', 'error');
  }
}

// ── SPA Router Engine (Zero Full-Page Reloads) ─────────────
async function spaNavigate(url, pushState = true) {
  const targetUrlStr = String(url);

  // If navigating to /products/ with category on products page, use instant AJAX if available
  if (targetUrlStr.includes('/products/') && window.location.pathname === '/products/' && typeof navigateCategory === 'function') {
    const searchIdx = targetUrlStr.indexOf('?');
    const queryString = searchIdx !== -1 ? targetUrlStr.slice(searchIdx + 1) : '';
    const params = new URLSearchParams(queryString);
    const cat = params.get('category') || '';
    const sort = params.get('sort') || '';
    navigateCategory(cat, sort, pushState);
    return;
  }

  const mainEl = document.querySelector('main');
  if (!mainEl) {
    window.location.href = url;
    return;
  }

  // Visual fade transition
  mainEl.style.opacity = '0.35';
  mainEl.style.transition = 'opacity .12s ease';

  try {
    const resp = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    if (!resp.ok) {
      window.location.href = url;
      return;
    }

    const text = await resp.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');

    // Update document title
    if (doc.title) {
      document.title = doc.title;
    }

    // Replace main content
    const newMain = doc.querySelector('main');
    if (newMain) {
      mainEl.innerHTML = newMain.innerHTML;
    }

    // Push state to browser history
    if (pushState && window.location.href !== newUrl(url)) {
      window.history.pushState({ url }, '', url);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Execute any script tags in the new main content
    if (newMain) {
      const scripts = newMain.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
      });
    }

    // Close profile dropdown if open
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.remove('open');

    // Re-trigger global app state updates
    checkAuthState();
    loadCartCount();
    loadWishlistCount();

  } catch(err) {
    console.error('SPA Navigation error:', err);
    window.location.href = url;
  } finally {
    mainEl.style.opacity = '1';
  }
}

function newUrl(url) {
  try {
    return new URL(url, window.location.origin).href;
  } catch(e) {
    return url;
  }
}

// Global click event listener for internal link interception
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Ignore external, anchor hash, javascript:, or special target links
  if (
    href.startsWith('#') ||
    href.startsWith('javascript:') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    link.getAttribute('target') === '_blank' ||
    e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
  ) {
    return;
  }

  // Check if internal origin
  try {
    const targetUrl = new URL(href, window.location.origin);
    if (targetUrl.origin === window.location.origin) {
      e.preventDefault();
      spaNavigate(targetUrl.pathname + targetUrl.search + targetUrl.hash);
    }
  } catch(err) {}
});

// Intercept search form submission in navbar
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form && form.action && form.action.includes('/products/')) {
    const input = form.querySelector('input[name="q"]');
    if (input) {
      e.preventDefault();
      const q = encodeURIComponent(input.value.trim());
      spaNavigate(`/products/?q=${q}`);
    }
  }
});

// Handle Browser Back / Forward buttons
window.addEventListener('popstate', (e) => {
  spaNavigate(window.location.pathname + window.location.search + window.location.hash, false);
});

// ── Global Loader ──────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 400);
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 900);
  }
});

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
  loadCartCount();
  loadWishlistCount();
});
