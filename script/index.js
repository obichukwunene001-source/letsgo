document.addEventListener('DOMContentLoaded', function(){
  // Fix for mobile viewport 100vh inconsistency (dynamic toolbars)
  // Sets a CSS variable `--vh` such that calc(var(--vh) * 100) equals the innerHeight.
  (function setVhVar(){
    const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    setVh();
    let scheduled = false;
    window.addEventListener('resize', () => {
      if(scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { setVh(); scheduled = false; });
    }, { passive: true });
  })();
  // Suppress non-error console output on desktop for index.html to avoid noisy logs
  (function suppressConsoleOnDesktop(){
    const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth >= 769;
    const orig = { log: console.log.bind(console), warn: console.warn.bind(console), info: console.info.bind(console), debug: console.debug ? console.debug.bind(console) : console.log.bind(console) };
    let isSilent = false;
    function setSilent(silent){
      if(silent === isSilent) return;
      isSilent = silent;
      if(silent){
        console.log = console.info = console.warn = console.debug = function(){};
      } else {
        console.log = orig.log;
        console.info = orig.info;
        console.warn = orig.warn;
        console.debug = orig.debug;
      }
    }
    function evaluate(){
      const page = (window.location.pathname.split('/').pop() || 'index.html');
      const shouldBeSilent = isDesktop() && (page === 'index.html' || page === '');
      setSilent(shouldBeSilent);
    }
    window.addEventListener('resize', evaluate);
    evaluate();
  })();
  // Set active link in main navigation based on current page
  let currentPage = window.location.pathname.split('/').pop();
  if(!currentPage || currentPage === '') {
    currentPage = 'index.html';
  }
  const mainNavLinks = document.querySelectorAll('.main-nav a:not(.collections-link)[href]');
  mainNavLinks.forEach(link => {
    const hrefRaw = link.getAttribute('href') || '';
    const href = hrefRaw.split('?')[0].split('#')[0];
    // Match if href equals current page (strip query/hash), or if both are index.html variants
    if(href === currentPage || (href === 'index.html' && currentPage === 'index.html')) {
      link.classList.add('active');
    }

    // Keep search input focused on desktop so caret remains visible even when clicking elsewhere.
    (function keepHeaderSearchFocused(){
      const search = document.getElementById('search');
      const topbar = document.querySelector('.topbar');
      const searchWrap = topbar ? topbar.querySelector('.top-actions .search-wrap') : null;
      if(!search) return;
      let allowRefocus = true;

      // Only enable this behavior on desktop widths
      function isDesktop(){ return window.innerWidth >= 769; }

      // When the input blurs, refocus it immediately on desktop unless user explicitly pressed Escape
      search.addEventListener('blur', (e) => {
        if(!isDesktop()) return;
        if(!allowRefocus) return;
        // Only re-focus the search if the next active element is inside the search wrap
        const nextEl = e.relatedTarget || document.activeElement;
        const isInsideSearchArea = nextEl && searchWrap && searchWrap.contains(nextEl);
        if(!isInsideSearchArea) {
          // do not re-focus when the user clicked a non-input/header element
          return;
        }
        // small timeout to allow any click handlers to run first
        setTimeout(() => {
          try{ if(document.activeElement !== search) search.focus(); }catch(err){}
        }, 0);
      });

      // If user presses Escape while focused, temporarily allow blur
      search.addEventListener('keydown', (e) => {
        if(e.key === 'Escape'){
          allowRefocus = false;
          search.blur();
          // Re-enable after a short delay so normal behavior resumes
          setTimeout(()=> allowRefocus = true, 400);
        }
      });

      // Re-apply behavior on resize (no-op for now but keeps future-proof)
      window.addEventListener('resize', () => {
        // if user resizes from mobile to desktop, ensure caret behavior resumes
        if(isDesktop() && document.activeElement !== search){
          try{ search.focus(); }catch(e){}
        }
      });
    })();
  });

  // Global watcher for .no-scroll class so all scripts that toggle it preserve scroll position.
  (function watchNoScrollClass(){
    if(!document.body) return;
    const body = document.body;
    const applyLock = () => {
      if(body.classList.contains('no-scroll') && !body.dataset.scrollY){
        const scrollY = window.scrollY || window.pageYOffset || 0;
        body.dataset.scrollY = scrollY;
        body.style.top = `-${scrollY}px`;
        body.style.position = 'fixed';
      }
    };
    const removeLock = () => {
      if(!body.classList.contains('no-scroll') && body.dataset.scrollY){
        const saved = parseInt(body.dataset.scrollY || '0', 10);
        body.style.position = '';
        body.style.top = '';
        delete body.dataset.scrollY;
        try{ window.scrollTo({ top: saved, left: 0, behavior: 'auto' }); }catch(e){ window.scrollTo(0, saved); }
      }
    };
    // MutationObserver ensures that any script toggling the `no-scroll` class will get stable behaviour
    try{
      const observer = new MutationObserver(() => {
        if(body.classList.contains('no-scroll')) applyLock();
        else removeLock();
      });
      observer.observe(body, { attributes: true, attributeFilter: ['class'] });
    }catch(e){
      // Fallback: listen to click events that open/close menus; already handled in per-menu code
      window.addEventListener('resize', () => { if(body.classList.contains('no-scroll')) applyLock(); else removeLock(); }, { passive: true });
    }
  })();

  const search = document.getElementById('search');
  const ctas = Array.from(document.querySelectorAll('.cta'));
  const arrivals = document.querySelector('.product-catalog');

  // Press / to focus search
  document.addEventListener('keydown', function(e){
    const target = e.target;
    if(e.key === '/' && document.activeElement !== search){
      e.preventDefault();
      search.focus();
    }
  });

  // Smooth scroll from CTA(s) to new arrivals; but skip hero CTAs which can be wired to control the hero
  if(ctas.length && arrivals){
    // Only bind the smooth scroll for CTAs that have an href="#" placeholder
    ctas.filter(c => !c.hasAttribute('data-hero-nav') && c.getAttribute('href') === '#').forEach(ctaEl => {
      ctaEl.addEventListener('click', function(e){
        e.preventDefault();
        // Scroll into view then offset by topbar height so the top of the element is not hidden
        arrivals.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(()=>{
          const topbar = document.querySelector('.topbar');
          const h = topbar ? topbar.getBoundingClientRect().height : 0;
          if(h) window.scrollBy({ top: -h - 8, left: 0, behavior: 'smooth' });
        }, 200);
      });
    });
    // Initialize autocomplete using fallback product list
    initSearchAutocomplete();
  }

  // Initialize search autocomplete for header and hero (mobile + desktop)
  // Uses `window.products` when available; will wait for `products.loaded` if not.
  function initSearchAutocomplete(){
    const headerInput = document.getElementById('search');
    const headerResults = document.getElementById('searchResults');
    const heroInput = document.getElementById('hero-search');
    const heroResults = document.getElementById('heroSearchResults');

    const bindWhenReady = (cb) => {
      const hasProducts = (window.products && Array.isArray(window.products) && window.products.length > 0);
      if(hasProducts) return cb(window.products);
      // wait for shop.js to dispatch products.loaded
      const handler = function(e){
        try{ const list = (e && e.detail && e.detail.products) || window.products || []; cb(list); }catch(err){}
      };
      document.addEventListener('products.loaded', handler, { once: true });
    };

    function renderResults(container, items){
      if(!container) return;
      if(!items || !items.length){ container.classList.remove('show'); container.innerHTML = ''; return; }
      container.innerHTML = items.map(p => `
        <div class="result-item" data-product-id="${p.id}" data-product-title="${p.title}">
          <img src="${p.image}" alt="${p.title}" width="48" height="48" loading="lazy" decoding="async" />
          <div class="result-item-content">
            <div class="result-item-title">${p.title}</div>
            <div class="result-item-price">₦${Number(p.price).toLocaleString('en-NG')}</div>
          </div>
        </div>
      `).join('');
      container.classList.add('show');
      // click handlers
      container.querySelectorAll('.result-item').forEach(item => {
        // Prevent touch-action from freezing scroll on mobile
        item.style.touchAction = 'manipulation';
        item.style.pointerEvents = 'auto';
        
        item.addEventListener('click', function(){
          const id = this.dataset.productId;
          if(id) window.location.href = `dynamic.html?id=${id}`;
        });
        
        // Prevent touchmove from blocking page scroll
        item.addEventListener('touchmove', function(e){
          // Allow natural touch scrolling - don't preventDefault
        }, { passive: true });
      });
    }

    function attachInput(input, resultsContainer, products){
      if(!input || !resultsContainer) return;
      if(input.dataset.searchAttached === 'true') return;
      input.addEventListener('input', function(){
        const q = this.value.trim().toLowerCase();
        if(q.length < 1){ resultsContainer.classList.remove('show'); resultsContainer.innerHTML = ''; return; }
        const filtered = (products || []).map(p => ({ product: p, score: 0 }))
          .map(obj => {
            const title = (obj.product.title || '').toLowerCase();
            if(title.startsWith(q)) obj.score += 300;
            const words = title.split(/\s+/).filter(Boolean);
            if(words.some(w => w.startsWith(q))) obj.score += 200;
            if(title.includes(q)) obj.score += 100;
            return obj;
          })
          .filter(o => o.score > 0)
          .sort((a,b) => b.score - a.score)
          .slice(0,8)
          .map(o => o.product);

        renderResults(resultsContainer, filtered);
      });

      input.addEventListener('keydown', function(e){
        if(e.key === 'Escape') resultsContainer.classList.remove('show');
        if(e.key === 'Enter' && this.value.trim().length > 0){
          e.preventDefault();
          const q = this.value.trim();
          // fall back to search results page
          window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
        }
      });

      document.addEventListener('click', function(e){
        if(!input.contains(e.target) && !resultsContainer.contains(e.target)){
          resultsContainer.classList.remove('show');
        }
      });

      try{ input.dataset.searchAttached = 'true'; }catch(e){}
    }

    bindWhenReady(function(products){
      attachInput(headerInput, headerResults, products);
      attachInput(heroInput, heroResults, products);
    });
  }

  // If `shop.js` loads later and dispatches 'products.loaded', update searchProducts and keep the currently attached handlers working
  document.addEventListener('products.loaded', function(e){
    try{ searchProducts = window.products || (e && e.detail && e.detail.products) || searchProducts; }catch(ex){}
  });
  // CART: Add-to-cart behavior
  const topbarCart = document.querySelector('.topbar .cart');

  function formatPrice(n){ return '₦' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function readCart(){
    try{ return JSON.parse(localStorage.getItem('cart') || '[]'); } catch(e){ return []; }
  }

  function writeCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }

  function getCartSummary(){
    const cart = readCart();
    let totalQty = 0, subtotal = 0;
    cart.forEach(i => { totalQty += i.qty; subtotal += (i.price * i.qty); });
    return { totalQty, subtotal };
  }

  function updateTopbarCart(){
    if(!topbarCart) return;
    const { totalQty, subtotal } = getCartSummary();
    // if we have a badge, update count there; otherwise fall back to previous text-only layout
    const badge = topbarCart.querySelector('.notif-badge');
    const label = (totalQty || 0) + ' ITEM' + (totalQty === 1 ? '' : 'S') + ' | ' + formatPrice(subtotal || 0);
    if(badge){
      badge.textContent = (totalQty || 0);
      // Add tooltip for subtotal and items
      topbarCart.setAttribute('title', label);
      topbarCart.setAttribute('aria-label', 'Cart — ' + label);
    } else {
      topbarCart.textContent = label;
    }
    // Update any checkout badges present in the UI
    try{
      const checkoutBadges = Array.from(document.querySelectorAll('.checkout-count'));
      checkoutBadges.forEach(b => {
        b.textContent = (totalQty || 0);
        // toggle visibility
        if(totalQty && totalQty > 0) { b.style.display = 'inline-flex'; }
        else { b.style.display = 'none'; }
      });
      const checkoutLinks = Array.from(document.querySelectorAll('.checkout-link'));
      checkoutLinks.forEach(cl => {
        const clabel = (totalQty || 0) + ' ITEM' + (totalQty === 1 ? '' : 'S') + ' | ' + formatPrice(subtotal || 0);
        cl.setAttribute('aria-label', 'Checkout — ' + clabel);
        // also set title for hover
        cl.setAttribute('title', 'Checkout — ' + clabel);
      });
    }catch(e){ /* nonblocking */ }
  }
  // Expose cart utilities globally for other pages/scripts to use
  window.Cart = {
    readCart: readCart,
    writeCart: writeCart,
    getCartSummary: getCartSummary,
    updateTopbarCart: updateTopbarCart,
    formatPrice: formatPrice
  };

  // Initialize count from localStorage on load
  updateTopbarCart();

  // Preload Shop page images aggressively when user hovers or presses the Shop navigation link
  (function attachShopPrefetch(){
    // Match either shop.html or shop.html?category=... links to start preloading early
    const shopLinks = Array.from(document.querySelectorAll('a[href*="shop.html"]'));
    if(!shopLinks.length) return;
    const triggerPrefetch = () => { try{ if(typeof window.preloadProductImages === 'function') window.preloadProductImages(); }catch(e){} };
    shopLinks.forEach(link => {
      link.addEventListener('pointerenter', triggerPrefetch, { passive: true });
      link.addEventListener('mousedown', triggerPrefetch, { passive: true });
      link.addEventListener('touchstart', triggerPrefetch, { passive: true });
      // Desktop only: small delay on click to allow prefetch to start before navigation
      link.addEventListener('click', function(e){
        if(window.innerWidth >= 769){
          try{ e.preventDefault(); }catch(err){}
          const href = this.getAttribute('href');
          triggerPrefetch();
          // Small delay (150ms) - keep under 300ms to avoid perceived slowness
          setTimeout(() => { window.location.href = href; }, 150);
        }
      });
    });
  })();

  // If the logo is focused after load on touch devices, blur it to avoid the mobile focus ring
  (function blurLogoOnMobileIfFocused(){
    const logoEl = document.querySelector('.brand .logo');
    if(!logoEl) return;
    const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window || window.innerWidth <= 768;
    try{ if(isTouch && document.activeElement === logoEl) logoEl.blur(); }catch(e){}
    window.addEventListener('pageshow', () => { try{ if(isTouch && document.activeElement === logoEl) logoEl.blur(); }catch(e){} });
  })();

  // Initialize star percentage fills based on data-rating attributes
  function updateStarRatings(scope=document){
    const starEls = Array.from(scope.querySelectorAll('.stars'));
    if(!starEls.length) return;
    starEls.forEach(el => {
      const raw = el.dataset.rating;
      const rating = parseFloat(raw);
      if(isNaN(rating)) return; // silently skip
      const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
      el.style.setProperty('--percent', percent + '%');
      // Ensure accessible text exists
      const label = (rating % 1 === 0) ? rating + ' out of 5 stars' : rating + ' out of 5 stars';
      el.setAttribute('aria-label', label);
      el.setAttribute('title', label);
      el.setAttribute('role', 'img');
      // Numeric rating value text to show beside stars
      const display = (Math.round(rating * 10) / 10).toFixed(1);
      // Prefer to update an existing .rating-value or create one
      let rv = el.nextElementSibling;
      if(!rv || !rv.classList || !rv.classList.contains('rating-value')){
        rv = document.createElement('span');
        rv.className = 'rating-value';
        rv.setAttribute('aria-hidden', 'true');
        el.parentNode && el.parentNode.insertBefore(rv, el.nextSibling);
      }
      rv.textContent = display;
    });
  }
  // Expose for dynamic updates (e.g. the shop page when elements are rendered)
  window.updateStarRatings = updateStarRatings;
  // Initialize for any existing DOM elements on load
  updateStarRatings();

  // Performance hint: Detect low-end devices and enable a simplified hero layout
  (function heroPerformanceHint(){
    try{
      const hasLowCores = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const saveData = (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g')));
      const lowMemory = (navigator.deviceMemory && navigator.deviceMemory <= 1);
      const ua = navigator.userAgent || '';
      const likelyLowEndUA = /Android\s[1-7]|Windows NT 6\.1|Windows NT 6\.0|iPhone OS 10_|iPhone OS 11_/i.test(ua);
      if(prefersReducedMotion || hasLowCores || saveData || lowMemory || likelyLowEndUA){
        try{ document.body.classList.add('hero-optimized'); }catch(e){}
      }
      // Also for desktop, ensure hero backgrounds do not use fixed attachment which triggers repaints
      document.querySelectorAll('.hero.premium .hero-pane').forEach(p => { try{ p.style.backgroundAttachment = 'scroll'; }catch(e){} });
    }catch(e){ /* non-fatal */ }
  })();

  // Animate an image flying to the cart icon
  function animateToCart(imgEl){
    try{
      if(window.debugAnimateToCart) console.debug('animateToCart called', imgEl);
      if(!imgEl) return;
      const cart = document.querySelector('.topbar .cart') || document.querySelector('.cart');
      if(!cart) console.debug('animateToCart: cart element not found, using fallback');
      let startRect = imgEl.getBoundingClientRect();
      // If dimensions are zero (image not loaded or hidden), try to use parent or defaults
      if(!startRect || startRect.width <= 0){
        const p = imgEl.closest('.product-card') || imgEl.closest('.shop-card') || imgEl.parentElement;
        startRect = (p && p.getBoundingClientRect()) || { left: window.innerWidth/2 - 30, top: window.innerHeight/2 - 30, width: 60, height: 60 };
      }
      const endRect = cart ? cart.getBoundingClientRect() : { left: window.innerWidth - 40, top: 20, width: 24, height: 24 };
      // Clone the image
      const clone = imgEl.cloneNode(true);
      clone.classList.add('flying-clone');
      // Debug visibility if clone appears invisible
      // clone.style.outline = '2px solid rgba(255,0,0,0.18)';
      // Set initial style from startRect
      clone.style.width = Math.max(40, startRect.width) + 'px';
      clone.style.height = Math.max(40, startRect.height) + 'px';
      clone.style.left = (startRect.left) + 'px';
      clone.style.top = (startRect.top) + 'px';
      clone.style.opacity = '1';
      // Use fixed position so transforms are relative to viewport
      clone.style.position = 'fixed';
      clone.style.margin = 0;
      document.body.appendChild(clone);

      // Compute translation to cart center
      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;
      const endX = endRect.left + endRect.width / 2;
      const endY = endRect.top + endRect.height / 2;
      const translateX = endX - startX;
      const translateY = endY - startY;
      // Normalize duration so movement appears consistent regardless of distance
      const distance = Math.hypot(translateX, translateY);
      // pixels per second - tune to feel natural; 1200px/s is a good start
      const pxPerSec = 1200;
      const minDuration = 0.5;
      const maxDuration = 1.6;
      const computedDuration = Math.min(maxDuration, Math.max(minDuration, distance / pxPerSec));
      // Respect CSS fly easing variable when present
      const rootStyles = getComputedStyle(document.documentElement);
      const easing = rootStyles.getPropertyValue('--fly-easing') || 'cubic-bezier(.22,.8,.28,1)';
      const opacityDuration = Math.max(0.12, computedDuration - 0.06);
      clone.style.transition = `transform ${computedDuration}s ${easing}, opacity ${opacityDuration}s ease`;
      // Slight overshoot then settle scale
      if(window.debugAnimateToCart) console.debug('animateToCart: startRect', startRect, 'endRect', endRect, 'translate', translateX, translateY);
      // Give the browser a moment to paint before animating so the motion feels smoother
      setTimeout(()=>{
        requestAnimationFrame(()=>{
          clone.style.transform = `translate(0px, 0px) scale(1)`;
          clone.style.opacity = '1';
          requestAnimationFrame(()=>{
            clone.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(0.22)`;
            clone.style.opacity = '0.92';
          });
        });
      }, 60);

      // Add pop to cart
      const popped = () => {
        cart.classList.add('cart-pop');
        setTimeout(()=> cart.classList.remove('cart-pop'), 220);
      };

      // When transition ends, remove clone and pop cart
      clone.addEventListener('transitionend', function handler(e){
        clone.removeEventListener('transitionend', handler);
        try{ clone.parentNode && clone.parentNode.removeChild(clone); }catch(e){}
        popped();
        if(window.debugAnimateToCart) console.debug('animateToCart: transitionend', e);
      });
    }catch(e){ /* ignore safely */ }
  }
  window.animateToCart = animateToCart;

  // Add-to-cart on product card click
  const productCards = document.querySelectorAll('.product-card, .shop-card');
  productCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e){
      // Redirect to dynamic product details page
      const wrap = card.closest('.product-wrap');
      const productId = wrap ? wrap.getAttribute('data-product-id') : null;
      if(productId) {
        window.location.href = `dynamic.html?id=${productId}`;
      }
    });
  });

  // Add-to-cart handlers for catalog buttons (product-wrap buttons)
  const catalogAddBtns = document.querySelectorAll('.product-wrap .btn-add');
  catalogAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // avoid firing card click handler
      // Prevent double-click while processing
      if(btn.disabled || btn.hasAttribute('data-adding')) return;
      btn.setAttribute('data-adding', 'true');
      const wrap = btn.closest('.product-wrap');
      if(!wrap) return;
      const card = wrap.querySelector('.product-card, .shop-card');
      if(!card) return;
      const titleEl = card.querySelector('.meta .title') || card.querySelector('.card-content .title') || card.querySelector('.title');
      const priceEl = card.querySelector('.meta .price') || card.querySelector('.card-content .price') || card.querySelector('.price');
      const imgEl = card.querySelector('img');
      const title = titleEl ? titleEl.textContent.trim() : 'Product';
      const priceText = priceEl ? priceEl.textContent.trim() : '₦0.00';
      const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')) || 0;
      const image = imgEl ? imgEl.src : '';

      const cart = readCart();
      let item = cart.find(i => i.title === title && i.image === image);
      if(item){ item.qty += 1; }
      else { item = { id: Date.now(), title, price, qty: 1, image }; cart.push(item); }
      writeCart(cart);
      updateTopbarCart();

      // Visual feedback
      card.classList.add('added-to-cart');
      if(imgEl && typeof window.animateToCart === 'function') {
        if(window.debugAnimateToCart) console.debug('Index: animateToCart called for catalog add button', title);
        window.animateToCart(imgEl);
      }
      setTimeout(() => { card.classList.remove('added-to-cart'); btn.removeAttribute('data-adding'); }, 750);
      // Update button state briefly
      const oldText = btn.textContent;
      btn.textContent = 'Added';
      setTimeout(()=> btn.textContent = oldText, 1200);
    });
  });

  /* Ensure header is fixed and apply top padding so content isn't hidden */
  function fixTopbarPosition(){
    try{
      const topbar = document.querySelector('.topbar');
      if(!topbar) return;
      // compute the height
      const h = Math.ceil(topbar.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--topbar-height', h + 'px');
      // Apply padding to body so content starts below header
      document.body.style.paddingTop = h + 'px';
    }catch(e){ /* ignore */ }
  }
  window.addEventListener('resize', fixTopbarPosition);
  // set on load
  fixTopbarPosition();

  // Mobile hamburger/off-canvas menu
  function initMobileMenu(){
    const burger = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if(!burger || !menu || !backdrop) return;

    // Clone desktop nav into mobile menu
    try{
      const mobileBrand = menu.querySelector('.mobile-brand-links');
      const desktopBrand = document.querySelector('.brand .brand-links');
      if(mobileBrand && desktopBrand){
        mobileBrand.innerHTML = desktopBrand.innerHTML;
        mobileBrand.querySelectorAll('a[href="shop.html"], a[href="login.html"]').forEach(el => el?.remove());
      }
      const mobileMain = menu.querySelector('.mobile-main-nav ul');
      const desktopMain = document.querySelector('.main-nav ul');
      if(mobileMain && desktopMain){
        mobileMain.innerHTML = desktopMain.innerHTML;
        // Inject the brand logo and a small avatar at the top of the mobile menu (use nano.png for mobile)
        try{
          const desktopLogo = document.querySelector('.brand .logo');
          if(desktopLogo && !menu.querySelector('.mobile-top')){
            const logoClone = desktopLogo.cloneNode(true);
            // Replace src with nano.png for mobile menu
            const logoImg = logoClone.querySelector('img');
            if(logoImg){
              logoImg.src = 'images/nano.png';
            }
            // prevent the cloned logo in the mobile menu from being focusable
            try{ logoClone.setAttribute('tabindex', '-1'); }catch(e){/* ignore */}
            const logoWrap = document.createElement('div');
            logoWrap.className = 'mobile-logo';
            logoWrap.appendChild(logoClone);

            const topRow = document.createElement('div');
            topRow.className = 'mobile-top';
            topRow.appendChild(logoWrap);
            // Insert before the existing mobile-main-nav
            const mobileNav = menu.querySelector('.mobile-main-nav');
            if(mobileNav && mobileNav.parentNode) mobileNav.parentNode.insertBefore(topRow, mobileNav);
          }
        }catch(e){}
        const faqLi = mobileMain.querySelector('li > a[href="faq.html"]');
        if(faqLi && !mobileMain.querySelector('a.checkout-link')){
          const li = document.createElement('li');
          li.innerHTML = '<a href="checkout.html" class="checkout-link">Checkout <span class="checkout-count" aria-hidden="true">0</span></a>';
          faqLi.closest('li').parentNode.insertBefore(li, faqLi.closest('li').nextSibling);
        }
        updateTopbarCart();

        // Insert mobile-only icons from the svg/ folder for each mobile nav link
        try{
          const iconMap = {
            'index.html': 'home.svg',
            'shop.html': 'shop.svg',
            'faq.html': 'faq.svg',
            'checkout.html': 'twotone-shopping-cart-checkout.svg'
          };
          mobileMain.querySelectorAll('li').forEach(li => {
            const a = li.querySelector('a');
            if(!a) return;
            // Don't duplicate icons if already inserted
            if(a.querySelector('.nav-icon')) return;

            let iconFile = null;
            if(a.classList.contains('collections-link')){
              iconFile = 'collections-add-24-filled.svg';
            } else {
              const href = a.getAttribute('href') || '';
              if(iconMap[href]) iconFile = iconMap[href];
            }
            if(iconFile){
              const span = document.createElement('span');
              span.className = 'nav-icon';
              const img = document.createElement('img');
              img.setAttribute('width','18');
              img.setAttribute('height','18');
              img.setAttribute('alt', (a.textContent || '').trim() + ' icon');
              img.src = 'svg/' + iconFile;
              span.appendChild(img);
              a.insertBefore(span, a.firstChild);
            }
          });
        }catch(e){ /* ignore icon injection errors */ }
        
        // Capitalize first letter of nav link text (text will be lowercase via CSS)
        try{
          mobileMain.querySelectorAll('a').forEach(a => {
            const textNode = Array.from(a.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if(textNode){
              const text = textNode.textContent.trim();
              // For collections-link, capitalize it and keep it; for others, capitalize first letter only
              if(a.classList.contains('collections-link')){
                if(text) textNode.textContent = 'Collections ';
              } else {
                if(text) textNode.textContent = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() + ' ';
              }
            }
          });
        }catch(e){}
      }
    }catch(e){}

    const openMenu = () => {
      document.querySelector('.search-wrap.open')?.classList.remove('open');
      menu.classList.add('open');
      backdrop.classList.remove('hidden');
      backdrop.classList.add('visible');
      burger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      // Lock background scroll while menu is open and preserve current scroll position
      const scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.dataset.scrollY = scrollY;
      document.body.classList.add('no-scroll');
      burger.classList.add('open');
      // focus the first actual nav link in the mobile nav so the brand/logo isn't focused
      menu.querySelector('.mobile-main-nav a, .mobile-main-nav button')?.focus({preventScroll:true});
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      backdrop.classList.remove('visible');
      backdrop.classList.add('hidden');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      // Restore scroll position and remove fixed positioning
      const saved = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.classList.remove('no-scroll');
      document.body.style.position = '';
      document.body.style.top = '';
      delete document.body.dataset.scrollY;
      try{ window.scrollTo({ top: saved, left: 0, behavior: 'auto' }); }catch(e){ window.scrollTo(0, saved); }
      burger.classList.remove('open');
      burger.focus({preventScroll:true});
    };

    burger.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Collections toggle (mobile): show Coming Soon modal instead of expanding the sub-menu
    menu.querySelectorAll('.mobile-main-nav .has-mega').forEach(item => {
      const link = item.querySelector('.collections-link');
      if(link){
        link.addEventListener('click', e => {
          e.preventDefault();
          // If a modal exists, show it rather than toggling the submenu
          const modalEl = document.getElementById('comingSoonModal');
          if(modalEl){
            modalEl.setAttribute('aria-hidden', 'false');
            modalEl.classList.add('show');
            // Prevent page scroll while modal is open (use no-scroll class)
            document.body.classList.add('no-scroll');
            // Close the mobile menu to make sure the modal is clickable/visible
            try{ closeMenu(); }catch(e){}
            // Move focus to the close button for accessibility (if present)
            const closeBtn = modalEl.querySelector('#closeComingSoon');
            if(closeBtn) { try { closeBtn.focus(); } catch(e){} }
            return;
          }
          // Fallback: toggle the submenu if modal isn't found
          item.classList.toggle('open');
        });
      }
    });

    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => e.key === 'Escape' && menu.classList.contains('open') && closeMenu());

    // Hook up Coming Soon modal controls (close button, overlay, Escape) for mobile
    const mobileModalEl = document.getElementById('comingSoonModal');
    if(mobileModalEl){
      const overlayEl = mobileModalEl.querySelector('.modal-overlay');
      const closeBtn = mobileModalEl.querySelector('#closeComingSoon');
      const closeModalFn = () => {
        mobileModalEl.setAttribute('aria-hidden', 'true');
        mobileModalEl.classList.remove('show');
        document.body.classList.remove('no-scroll');
        try{ menu.querySelector('.mobile-main-nav a')?.focus(); }catch(e){}
      };
      if(overlayEl) overlayEl.addEventListener('click', closeModalFn);
      if(closeBtn) closeBtn.addEventListener('click', closeModalFn);
      mobileModalEl.addEventListener('keydown', e => e.key === 'Escape' && closeModalFn());
    }

    // Set Home as default active and handle navigation
    const mobileLinks = Array.from(menu.querySelectorAll('.mobile-main-nav > ul > li > a:not(.collections-link)'));
    const setActiveLink = (link) => {
      // Remove from all links
      mobileLinks.forEach(l => {
        l.classList.remove('clicked-active');
      });
      // Add only to the clicked link
      if(link) {
        link.classList.add('clicked-active');
      }
    };
    
    // Set Home as default active
    const homeLink = mobileLinks.find(l => l.getAttribute('href') === 'index.html');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentLink = mobileLinks.find(l => {
      const hrefRaw = l.getAttribute('href') || '';
      const href = hrefRaw.split('?')[0].split('#')[0];
      return href === currentPage || (currentPage === '' && href === 'index.html');
    });
    if(currentLink) {
      setActiveLink(currentLink);
    }

    // Close on navigation and set active
    mobileLinks.forEach(l => {
      l.addEventListener('click', (e) => {
        setActiveLink(l);
        closeMenu();
        // remove focus from the clicked item to prevent blue focus ring on some devices/browsers
        try{ l.blur(); }catch(e){}
      });
    });
  }
  initMobileMenu();

  // Mobile Search button: toggle a compact search overlay on small screens
  function initMobileSearch(){
    const searchBtn = document.getElementById('mobileSearchBtn');
    const topbar = document.querySelector('.topbar');
    const searchWrap = topbar ? topbar.querySelector('.top-actions .search-wrap') : null;
    const searchInput = searchWrap ? searchWrap.querySelector('input[type="search"]') : null;
    if(!searchBtn || !searchWrap) return;

    function openSearch(){
      searchWrap.classList.add('open');
      searchBtn.setAttribute('aria-expanded', 'true');
      // allow focusing after rendering
      setTimeout(()=>{ if(searchInput) searchInput.focus(); }, 40);
    }
    function closeSearch(){
      searchWrap.classList.remove('open');
      searchBtn.setAttribute('aria-expanded', 'false');
      try{ searchBtn.focus(); }catch(e){}
    }

    searchBtn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      const isOpen = searchWrap.classList.contains('open');
      if(isOpen) closeSearch(); else openSearch();
    });

    // Close when clicking outside
    document.addEventListener('click', function(e){
      if(!searchWrap.classList.contains('open')) return;
      const inside = searchWrap.contains(e.target) || searchBtn.contains(e.target);
      if(!inside) closeSearch();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && searchWrap.classList.contains('open')) closeSearch();
    });

    // Close overlay on resize past breakpoints
    window.addEventListener('resize', function(){
      if(window.innerWidth > 640 && searchWrap.classList.contains('open')) {
        closeSearch();
      }
    });
  }
  initMobileSearch();

  // Universal fallback: Clicking any Collections link should show the Coming Soon modal
  document.querySelectorAll('.collections-link').forEach(link => {
    link.addEventListener('click', function(e){
      // Prevent other handlers from trying to open submenus or navigate
      e.preventDefault();
      const modalEl = document.getElementById('comingSoonModal');
      if(modalEl){
        modalEl.setAttribute('aria-hidden','false');
        modalEl.classList.add('show');
        document.body.classList.add('no-scroll');
        const closeBtn = modalEl.querySelector('#closeComingSoon');
        if(closeBtn) { try{ closeBtn.focus(); }catch(e){} }
      }
    });
  });

  // If cart is changed in other tab/page, update local topbar too
  window.addEventListener('storage', function(e){
    if(e.key === 'cart') updateTopbarCart();
  });


  // Hero sliders removed - now using single images per pane

  // Hero CTA wiring removed (manual hero navigation removed) - no bindings here
  
  // Hero nav removed: programmatic prev/next controls and button wiring deleted per request
  });
  

  // Play/Pause toggle for hero animation (only affects CSS scroller)
  (function initHeroToggle(){
    const hero = document.querySelector('.hero');
    const toggle = document.querySelector('.hero-toggle');
    if(!hero || !toggle) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stored = localStorage.getItem('heroPlaying');
    let isPlaying = stored === null ? true : stored === 'true';
    // If reduced motion prefered, force pause and disable toggle
    if(prefersReduced){
      isPlaying = false;
      toggle.setAttribute('disabled', 'true');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.textContent = 'Play';
    }
    function setPlaying(state){
      isPlaying = !!state;
      if(isPlaying){
        hero.classList.remove('paused');
        toggle.textContent = 'Pause';
        toggle.setAttribute('aria-pressed', 'false');
        localStorage.setItem('heroPlaying','true');
      } else {
        hero.classList.add('paused');
        toggle.textContent = 'Play';
        toggle.setAttribute('aria-pressed', 'true');
        localStorage.setItem('heroPlaying','false');
      }
    }
    // initialize
    setPlaying(isPlaying);
    toggle.addEventListener('click', ()=> setPlaying(!isPlaying));
  })();

    // Logo shake: add a small click / keyboard trigger that toggles the existing CSS animation
    (function initLogoShake(){
      const logo = document.querySelector('.brand .logo');
      if(!logo) return;

      function triggerShake(){
        // restart animation by removing and re-adding the class
        logo.classList.remove('shake');
        void logo.offsetWidth; // force reflow
        logo.classList.add('shake');

        // remove the class once animation completes to keep DOM tidy
        function cleanup(){
          logo.classList.remove('shake');
          logo.removeEventListener('animationend', cleanup);
        }
        logo.addEventListener('animationend', cleanup);

        // remove focus to avoid persistent focus outline in some browsers
        if(document.activeElement === logo) logo.blur();
      }

      // Click to shake
      logo.addEventListener('click', triggerShake);
      // Keyboard activation (Enter / Space)
      logo.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
          e.preventDefault();
          triggerShake();
        }
      });
    // Make the map available for other code if needed (keeps internal pane control mapping)
    })();

  // Highlight current main-nav link by adding `.active` so the nav dot stays visible
  (function markActiveNav(){
    try{
      const mainNav = document.querySelector('.main-nav');
      const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
      if(!navLinks.length) return;

      const loc = window.location;
      function normalizeUrlToKey(urlStr){
        // Resolve relative hrefs against current origin when possible
        try{
          const resolved = new URL(urlStr, loc.href);
          // Normalize index paths to '/'
          let path = resolved.pathname.replace(/\/index\.html$/i, '/');
          // include hash if present
          return path + (resolved.hash || '');
        }catch(e){
          return urlStr || '/';
        }
      }

      const currentKey = (loc.pathname.replace(/\/index\.html$/i, '/') || '/') + (loc.hash || '');

      // Helper to clear existing .active and set one single active link
      function setSingleActive(link){
        navLinks.forEach(l => l.classList.remove('active'));
        if(link) link.classList.add('active');
        // mark the nav container so CSS can decide hover behavior (only one dot at a time)
        if(mainNav) mainNav.classList.toggle('has-active', !!link);
        // ensure moving indicator updates to the active link
        if(typeof moveIndicatorToLink === 'function') moveIndicatorToLink(link, true);
      }

      // First, try to find a link that exactly matches current (path + hash)
      let matched = null;
      for(const a of navLinks){
        const href = a.getAttribute('href') || '';
        const key = normalizeUrlToKey(href);
        if(key === currentKey){ matched = a; break; }
      }

      // if none matched exactly, try matching by pathname only
      if(!matched){
        const currentPath = loc.pathname.replace(/\/index\.html$/i, '/') || '/';
        for(const a of navLinks){
          try{
            const url = new URL(a.getAttribute('href') || '', loc.href);
            const path = url.pathname.replace(/\/index\.html$/i, '/') || '/';
            if(path === currentPath){ matched = a; break; }
          }catch(e){ /* ignore */ }
        }
      }

      setSingleActive(matched);

      // Update on click for in-page navigation (hash links) so the active dot moves immediately
      navLinks.forEach(a => {
        a.addEventListener('click', function(e){
          // If this link navigates within the page (same path but different hash), allow default navigation
          // but still update the active marker immediately for UX
          setSingleActive(a);
        });
      });

      /* ---------- Moving indicator logic ---------- */
      // Create a single dot indicator and animate it between links on hover/click
      let indicator = null;
      function createIndicator(){
        if(!mainNav) return null;
        indicator = mainNav.querySelector('.nav-indicator');
        if(!indicator){
          indicator = document.createElement('div');
          indicator.className = 'nav-indicator';
          mainNav.appendChild(indicator);
        }
        // show via class
        mainNav.classList.add('show-indicator');
        return indicator;
      }

      function getCenterOfLink(link){
        const rect = link.getBoundingClientRect();
        const navRect = mainNav.getBoundingClientRect();
        // center relative to mainNav left
        return (rect.left - navRect.left) + (rect.width / 2);
      }

      function moveIndicatorToLink(link, immediate){
        if(!mainNav) return;
        if(!indicator) createIndicator();
        if(!link){
          // hide indicator if no link
          mainNav.classList.remove('show-indicator');
          return;
        }
        const center = getCenterOfLink(link);
        // set left in pixels; indicator uses translateX(-50%) to center itself
        if(immediate){
          indicator.style.transition = 'none';
          indicator.style.left = center + 'px';
          // force reflow then restore transition
          void indicator.offsetWidth;
          indicator.style.transition = '';
        } else {
          indicator.style.left = center + 'px';
        }
        mainNav.classList.add('show-indicator');
      }

      // initialize indicator and wire hover/mouse events
      createIndicator();
      // We intentionally do NOT move the indicator on hover or focus to
      // satisfy the request to remove hover interactions. The indicator
      // only moves when a link is set active (via click) or on initial load.
      // position indicator to the initially matched active link
      if(matched) moveIndicatorToLink(matched, true);

    }catch(e){ /* silent */ }
  })();

  // Mega menu: collections dropdown (prevent link navigation and enable click toggle on mobile)
  (function initMegaMenu(){
    const menuParents = Array.from(document.querySelectorAll('.main-nav .has-mega'));
    const mainNavEl = document.querySelector('.main-nav');
    if(!menuParents.length) return;

    function closeAll(){
      menuParents.forEach(li => {
        const link = li.querySelector('.collections-link');
        const menu = li.querySelector('.mega-menu');
        if(link) link.setAttribute('aria-expanded','false');
        if(menu) menu.setAttribute('aria-hidden','true');
        li.classList.remove('open');
      });
      if(mainNavEl) mainNavEl.classList.remove('mega-open');
    }

    // Coming Soon Modal Handler
    const comingSoonModal = document.getElementById('comingSoonModal');
    const closeComingSoonBtn = document.getElementById('closeComingSoon');
    const modalOverlay = comingSoonModal ? comingSoonModal.querySelector('.modal-overlay') : null;

    function showComingSoon() {
      if(!comingSoonModal) return;
      comingSoonModal.setAttribute('aria-hidden', 'false');
      comingSoonModal.classList.add('show');
      document.body.classList.add('no-scroll');
    }

    function hideComingSoon() {
      if(!comingSoonModal) return;
      comingSoonModal.setAttribute('aria-hidden', 'true');
      comingSoonModal.classList.remove('show');
      document.body.classList.remove('no-scroll');
    }

    if(closeComingSoonBtn) {
      closeComingSoonBtn.addEventListener('click', hideComingSoon);
    }
    if(modalOverlay) {
      modalOverlay.addEventListener('click', hideComingSoon);
    }
    if(comingSoonModal) {
      comingSoonModal.addEventListener('keydown', function(e) {
        if(e.key === 'Escape') hideComingSoon();
      });
    }

    // Capture clicks on the Collections link; prevent navigation
    menuParents.forEach(li => {
      const link = li.querySelector('.collections-link');
      const menu = li.querySelector('.mega-menu');
      if(!link || !menu) return;
      // keep a per-li close timer so we can delay closing the menu
      let closeTimer = null;

      // Prevent the link from navigating and toggle the menu on click
      link.addEventListener('click', function(e){
        e.preventDefault();
        // Check if this is in the mobile menu
        const mobileMenu = link.closest('.mobile-menu');
        if(mobileMenu) {
          showComingSoon();
          return;
        }
        const open = !li.classList.contains('open');
        closeAll();
        li.classList.toggle('open', open);
        if(mainNavEl) mainNavEl.classList.toggle('mega-open', open);
        link.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        // clear any pending close operations if opening
        if(open && closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
      });

      // Keep the menu open for 2s when mouse leaves the li area; clear the timer on re-enter
      li.addEventListener('mouseenter', function(){
        if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
        li.classList.add('open');
        if(mainNavEl) mainNavEl.classList.add('mega-open');
        link.setAttribute('aria-expanded','true');
        menu.setAttribute('aria-hidden','false');
      });
      li.addEventListener('mouseleave', function(){
        if(closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(function(){
          li.classList.remove('open');
          if(mainNavEl) mainNavEl.classList.remove('mega-open');
          link.setAttribute('aria-expanded','false');
          menu.setAttribute('aria-hidden','true');
          closeTimer = null;
        }, 2000);
      });

      // Keyboard: open on focusin, close after delay on focusout
      li.addEventListener('focusin', function(){ if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; } li.classList.add('open'); link.setAttribute('aria-expanded','true'); menu.setAttribute('aria-hidden','false'); if(mainNavEl) mainNavEl.classList.add('mega-open'); });
      li.addEventListener('focusout', function(){ if(closeTimer) clearTimeout(closeTimer); closeTimer = setTimeout(function(){ li.classList.remove('open'); link.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); if(mainNavEl) mainNavEl.classList.remove('mega-open'); closeTimer = null; }, 2000); });

      // Close when clicking outside
      document.addEventListener('click', function(e){
        if(!li.contains(e.target)){
          li.classList.remove('open');
          link.setAttribute('aria-expanded','false');
          menu.setAttribute('aria-hidden','true');
          if(mainNavEl) mainNavEl.classList.remove('mega-open');
        }
      });

      // Close when pressing Escape
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){
          li.classList.remove('open');
          link.setAttribute('aria-expanded','false');
          menu.setAttribute('aria-hidden','true');
          if(mainNavEl) mainNavEl.classList.remove('mega-open');
        }
      });
    });

    // Add hover behaviour: when the mega menu is open and a different nav link is hovered,
    // close the menu and follow that link automatically.
    try{
      const mainNav = document.querySelector('.main-nav');
      if(mainNav){
        const allNavLinks = Array.from(mainNav.querySelectorAll('a')).filter(a => !a.classList.contains('collections-link'));
        allNavLinks.forEach(a => {
          // Use pointerenter to avoid event bubbling issues with mouseover
          a.addEventListener('pointerenter', function(e){
            // If any mega-menu parent is open, close it (but do NOT follow the hovered link)
            const openMega = mainNav.querySelector('.has-mega.open');
            if(openMega){
              closeAll();
              // We intentionally DO NOT auto-navigate here to avoid accidental page loads on hover.
              // Navigation will only occur on click as usual.
            }
          });
        });
      }
    }catch(e){ /* ignore if something breaks here */ }

    // On window resize, close any open menus (avoid stuck open state)
    window.addEventListener('resize', function(){ closeAll(); });
  })();

  // ============================================================
  // SEARCH AUTOCOMPLETE FUNCTIONALITY FOR ALL SEARCH INPUTS
  // ============================================================
  
  // Product database from shop.js - we'll fetch it dynamically
  let searchProducts = [];
  
  // Initialize search autocomplete for all search inputs
  function initSearchAutocomplete(){
    // Get all search inputs
    // Find all inputs inside .search-wrap containers so we cover topbar, hero, and other areas
    const inputs = Array.from(document.querySelectorAll('.search-wrap input[type="search"]'));
    const searchInputs = inputs.map(input => {
      const wrap = input.closest('.search-wrap');
      const resultsContainer = wrap ? wrap.querySelector('.search-results') : null;
      return { input, resultsContainer };
    });
    
    // Attach search autocomplete on all devices. Mobile and desktop will both show suggestions.

    searchInputs.forEach(({ input, resultsContainer }) => {
      if(!input) return;
      // Prevent double-binding if another script already attached a search handler
      if(input.dataset.searchAttached === 'true') return;
      // Ensure we have a results container element; create one if necessary and attach it to the wrap
      let resultsEl = resultsContainer;
      if(!resultsEl){
        try{
          const wrap = input.closest('.search-wrap');
          if(wrap){
            resultsEl = wrap.querySelector('.search-results');
            if(!resultsEl){
              resultsEl = document.createElement('div');
              resultsEl.className = 'search-results';
              wrap.appendChild(resultsEl);
            }
          }
        }catch(e){/* ignore */}
      }
      if(!resultsEl) return; // give up if no container can be found or created
      
      // Handle input event (debounced to avoid excessive work on each keystroke)
      let searchTimer = null;
      input.addEventListener('input', function(e){
        if(searchTimer) clearTimeout(searchTimer);
        const that = this;
        searchTimer = setTimeout(() => {
        const query = this.value.trim().toLowerCase();
        
        if(query.length < 1){
          resultsEl.classList.remove('show');
          resultsEl.innerHTML = '';
          return;
        }
        
        // Filter products based on query and prioritize prefix/word-start matches
        const filtered = searchProducts
          .map(product => {
            const titleLower = (product.title || '').toLowerCase();
            // Score to rank matches: prefix match > word-start match > substring
            let score = 0;
            if(titleLower.startsWith(query)) score += 300;
            // word-start match: any word in the title starts with query
            const words = titleLower.split(/\s+/).filter(Boolean);
            if(words.some(w => w.startsWith(query))) score += 200;
            if(titleLower.includes(query)) score += 100;
            return { product, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => {
            // Higher score first; tie-breaker: rating desc, then id asc
            if(a.score !== b.score) return b.score - a.score;
            const ra = (a.product.rating || 0), rb = (b.product.rating || 0);
            if(ra !== rb) return rb - ra;
            return (a.product.id || 0) - (b.product.id || 0);
          })
          .slice(0, 8)
          .map(i => i.product);
        
        if(filtered.length === 0){
          resultsEl.classList.remove('show');
          resultsEl.innerHTML = '';
          return;
        }
        
        // Render results
        resultsEl.innerHTML = filtered.map(product => `
          <div class="result-item" data-product-id="${product.id}" data-product-title="${product.title}">
            <img src="${product.image}" alt="${product.title}" loading="eager" importance="high" fetchpriority="high" decoding="async" />
            <div class="result-item-content">
              <div class="result-item-title">${product.title}</div>
              <div class="result-item-price">₦${Number(product.price).toLocaleString('en-NG')}</div>
            </div>
          </div>
        `).join('');
        
        resultsEl.classList.add('show');
        
        // Add click handlers to result items and prevent touch scroll freeze
        resultsEl.querySelectorAll('.result-item').forEach(item => {
          // Prevent touch-action from freezing scroll on mobile
          item.style.touchAction = 'manipulation';
          item.style.pointerEvents = 'auto';
          
          item.addEventListener('click', function(){
            const productId = this.dataset.productId;
            // Navigate to shop page with all products, scroll to the product
            window.location.href = `shop.html?product=${encodeURIComponent(productId)}`;
          });
          
          // Prevent touchmove from blocking page scroll
          item.addEventListener('touchmove', function(e){
            // Allow natural touch scrolling - don't preventDefault
          }, { passive: true });
        });
        }, 150);
      });
      
      // Close results when clicking outside
      document.addEventListener('click', function(e){
        if(!input.contains(e.target) && !resultsEl.contains(e.target)){
          resultsEl.classList.remove('show');
        }
      });
      
      // Close on Escape key
      input.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){
          resultsEl.classList.remove('show');
        }
      });
      
      // Handle Enter key to navigate to shop
      input.addEventListener('keydown', function(e){
        if(e.key === 'Enter' && this.value.trim().length > 0){
          e.preventDefault();
          window.location.href = `shop.html`;
        }
      });

      // Mark this input as having search behavior attached to avoid double-binding
      try{ input.dataset.searchAttached = 'true'; }catch(e){}

      // Wire hero search button (if present) to focus or navigate
      if(input.id === 'hero-search'){
        const heroBtn = document.getElementById('hero-search-btn');
        if(heroBtn){
          heroBtn.addEventListener('click', function(e){
            e.preventDefault();
            const q = input.value.trim();
            if(q.length > 0){
              // Quick-navigate to shop page and allow user to search there
              window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
            } else {
              input.focus();
              input.select();
            }
          });
        }
      }
    });
  }
  
  // Load product data and initialize search
  // This checks if window.products exists (from shop.js) or fetches dynamically
  if(typeof window.products !== 'undefined'){
    searchProducts = window.products;
    initSearchAutocomplete();
  } else {
    // Fallback: create inline product list for search (matches shop.js products)
    searchProducts = [
      { id:1, title:'FOLLOW GOD - ATELIERS SLEEVE', price:80000, image:'images/p1.jpeg', rating:5 },
      { id:3, title:'FOLLOW GOD - ANGEL TEE', price:70000, image:'images/p3.jpeg', rating:4.5 },
      { id:4, title:'FOLLOW GOD - RARE ARMLESS TEE', price:60000, image:'images/p4.jpeg', rating:5 },
      { id:5, title:'FOLLOW GOD - SUMMER TEE', price:70000, image:'images/p5.jpeg', rating:4 },
      { id:6, title:'FOLLOW GOD - -234 TEE', price:70000, image:'images/p6.jpeg', rating:4.5 },
      { id:7, title:'FOLLOW GOD - RARE TEE', price:70000, image:'images/p7.jpeg', rating:5 },
      { id:8, title:'FOLLOW GOD - RIDE ON ARMLESS', price:60000, image:'images/p8.jpeg', rating:4 }
    ];
    // Add shoe products
    const shoeImages = [
      'sho1.jpg','sho2.jpg','sho3.jpg','sho4.jpg','sho5.png','sho6.jpg','sho7.jpg','sho8.jpg',
      'sho9.jpg','sho10.jpg','sho11.jpg','sho12.jpg','sho13.jpg','sho14.jpg'
    ];
    let nextId = 9;
    shoeImages.forEach((file, i) => {
      searchProducts.push({
        id: nextId + i,
        title: `FOLLOW GOD - SHOES ${i + 1}`,
        price: 70000,
        image: `images/${file}`,
        rating: Math.round((Math.random() * 1 + 4) * 2) / 2
      });
    });
    initSearchAutocomplete();
  }
