const products = [
  { id:1, title:'FG - CAMO YELLOW TRUCKER', price:25000, image:'images/fg_army1.jpg', rating:5 },
  { id:2, title:'FG - CLASSIC BLACK TRUCKER', price:25000, image:'images/fg_black1.jpg', rating:4.5 },
  { id:3, title:'FG- SKY BLUE TRUCKER', price:25000, image:'images/fg_blue1.jpg', rating:5 },
  { id:4, title:'FG - SILVER GREY TRUCKER', price:25000, image:'images/fg_grey1.jpg', rating:4 },
  { id:5, title:'FG - BURNT ORANGE TRUCKER', price:25000, image:'images/fg_orange1.jpg', rating:4.5 },
  { id:6, title:'FG - DEEP RED TRUCKER', price:25000, image:'images/fg_red1.jpg', rating:5 },
  { id:7, title:'FG - BURGUNDY CAMO TRUCKER', price:25000, image:'images/fg_violet1.jpg', rating:4 },
  { id:8, title:'FG - FOREST CAMO TRUCKER', price:25000, image:'images/fg_mili1.jpg', rating:4.5 },
  { id:9, title:'FG - ROYAL PURPLE TRUCKER', price:25000, image:'images/fg_bluee1.jpg', rating:5 },
  { id:10, title:'FG - BRIGHT RED TRUCKER', price:25000, image:'images/fg_red1.1.jpg', rating:4.5 },
  { id:11, title:'FG - CHARCOAL GREY BEANIE', price:28000, image:'images/bean_army1.jpg', rating:5 },
  { id:12, title:'FG - JET BLACK BEANIE', price:28000, image:'images/bean_black1.jpg', rating:4 },
  { id:13, title:'FG - EARTH BROWN BEANIE', price:28000, image:'images/bean_brown1.jpg', rating:4.5 },
  { id:14, title:'FG - LIGHT GREEN BEANIE', price:28000, image:'images/bean_green2.jpg', rating:5 },
  { id:15, title:'FG - LIGHT GREY BEANIE', price:28000, image:'images/bean_grey1.jpg', rating:4 },
  { id:16, title:'FG - NAVY BLUE BEANIE', price:28000, image:'images/bean_indigo1.jpg', rating:4.5 },
  { id:17, title:'FG - DEEP PURPLE BEANIE', price:28000, image:'images/bean_purple1.jpg', rating:5 },
  { id:18, title:'FG - WINE RED BEANIE', price:28000, image:'images/bean_red1.jpg', rating:4 }
];

// Expose products for other scripts (e.g. index.js search) where needed
try{ window.products = products; }catch(e){ /* ignore in non-browser contexts */ }
// Notify other scripts that products are available (so index.js can switch from fallback)
try{ document.dispatchEvent(new CustomEvent('products.loaded', { detail: { products } })); }catch(e){}



document.addEventListener('DOMContentLoaded', () => {
  // Select the grid container — prefer class (.shop-grid) or fall back to id (#items)
  const shopGrid = document.querySelector('.shop-grid') || document.getElementById('items');
  const sortSelect = document.getElementById('sortSelect');
  // Prefer the topbar cart element specifically
  const cartEl = document.querySelector('.topbar .cart') || document.querySelector('.cart');
  // Cart utilities: prefer the shared window.Cart if available to keep behaviour consistent
  const readCart = (window.Cart && window.Cart.readCart) ? window.Cart.readCart : function(){ try{ return JSON.parse(localStorage.getItem('cart') || '[]'); }catch(e){ return []; } };
  const writeCart = (window.Cart && window.Cart.writeCart) ? window.Cart.writeCart : function(c){ localStorage.setItem('cart', JSON.stringify(c)); };
  const formatPrice = (window.Cart && window.Cart.formatPrice) ? window.Cart.formatPrice : function(n){ return '₦' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  let cartCount = readCart().reduce((s, i) => s + (i.qty || 0), 0);
  // Update topbar badge using shared Cart util if present
  const topbarBadge = (cartEl && (cartEl.querySelector('.notif-badge') || document.querySelector('.topbar .notif-badge'))) || null;
  const cartSummaryTotal = readCart().reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0);
  if(window.Cart && typeof window.Cart.updateTopbarCart === 'function'){
    window.Cart.updateTopbarCart();
  } else {
    if(topbarBadge) topbarBadge.textContent = cartCount;
    if(cartEl) cartEl.setAttribute('title', `${cartCount} ITEM${cartCount > 1 ? 'S' : ''} | ${formatPrice(cartSummaryTotal)}`);
  }

  if(!shopGrid) return; // nothing to render to on this page

  // NOTE: formatPrice is defined above (either from window.Cart or fallback). Use that.

  function renderProducts(list){
    const frag = document.createDocumentFragment();
    list.forEach(p => {
      const wrap = document.createElement('div');
      wrap.className = 'product-wrap';
      wrap.setAttribute('data-product-id', p.id);
      // Card container — visual card but border will live on .card-content
      const el = document.createElement('article');
      el.className = 'shop-card';
      el.setAttribute('data-product-id', p.id);
      el.innerHTML = `
        <div class="card-content">
          <img class="thumb" src="${p.image}" alt="${p.title}" width="180" height="180" loading="lazy" decoding="async" />
          <div class="title">${p.title}</div>
          <div class="price">${formatPrice(p.price)}</div>
          <div class="stars" data-rating="${p.rating || 5}" role="img" aria-label="${p.rating || 5} out of 5 stars"></div>
        </div>`;

      // Add a black 'Add to cart' button positioned outside the bordered card
      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn-add';
      addBtn.textContent = 'Add to cart';
      // Click handler: persist to shared cart in localStorage and update UI
      addBtn.addEventListener('click', (e) => {
        // Avoid bubbling to the product card click (which shows a details alert)
        e.preventDefault();
        e.stopPropagation();
        // Prevent double-click while processing
        if(addBtn.disabled || addBtn.hasAttribute('data-adding')) return;
        addBtn.setAttribute('data-adding', 'true');
        try{ console.debug('Shop: add-to-cart clicked for', p.title); }catch(e){}
        const cart = readCart();
        // Prefer existing product id if present
        const itemId = p.id || Date.now();
        let item = cart.find(i => (i.id && i.id === itemId) || (i.title === p.title && i.image === p.image));
        if(item){ item.qty = (item.qty || 0) + 1; }
        else { item = { id: itemId, title: p.title, price: Number(p.price || 0), qty: 1, image: p.image }; cart.push(item); }
        writeCart(cart);
        // Update topbar immediately. Prefer shared helper but also update DOM directly to guarantee instant feedback.
        if(window.Cart && typeof window.Cart.updateTopbarCart === 'function'){
          try{ window.Cart.updateTopbarCart(); }catch(e){}
        }
        // Direct DOM update (defensive) so current tab sees immediate change even if shared helper fails
        try{
          const newCount = cart.reduce((s, i) => s + (i.qty || 0), 0);
          const newTotal = cart.reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0);
          if(topbarBadge) topbarBadge.textContent = newCount;
          if(cartEl){
            cartEl.setAttribute('title', `${newCount} ITEM${newCount > 1 ? 'S' : ''} | ${formatPrice(newTotal)}`);
            cartEl.setAttribute('aria-label', `Cart — ${newCount} ITEM${newCount > 1 ? 'S' : ''} | ${formatPrice(newTotal)}`);
          }
          try{ console.debug('Shop: topbar updated ->', newCount, formatPrice(newTotal)); }catch(e){}
        }catch(e){ console.error('Shop: failed to update topbar badge', e); }
        addBtn.textContent = 'Added';
        try{ if(window.debugAnimateToCart) console.debug('Shop: animateToCart called for', p.title, el); }catch(e){}
        try{ const imgEl = el.querySelector('.thumb'); if(typeof window.animateToCart === 'function') window.animateToCart(imgEl); }catch(e){}
        setTimeout(()=> { addBtn.textContent = 'Add to cart'; addBtn.removeAttribute('data-adding'); }, 1200);
      });
      // Make the whole card cursor pointer and add optional view behavior
      el.setAttribute('tabindex', 0);
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        // Redirect to dynamic product details page
        window.location.href = `dynamic.html?id=${p.id}`;
      });
      // Keyboard accessibility: Enter to view
      el.addEventListener('keydown', (e) => { if(e.key === 'Enter') el.click(); });

      // Insert into wrapper then into grid so button sits outside of the border
      wrap.appendChild(el);
      wrap.appendChild(addBtn);
      frag.appendChild(wrap);

      // Make sure the star element shows the correct percentage based on rating
      try{
        const starEl = el.querySelector('.stars');
        const r = parseFloat(p.rating) || 5;
        const percent = Math.max(0, Math.min(100, (r / 5) * 100));
        if(starEl){
          starEl.style.setProperty('--percent', percent + '%');
          if(typeof window.updateStarRatings === 'function') window.updateStarRatings(el);
        }
      }catch(e){ /* ignore */ }
    });
    // Replace current content with new fragment; keep scroll position stable
    shopGrid.innerHTML = '';
    shopGrid.appendChild(frag);
    try{ ensureImagesDecoded(); }catch(e){}
  }

  // Initial render — if on the index page, show a curated set:
  //  - 5 trucker caps (first five truckers) and 4 beanies (first four beanies)
  // This keeps the hero / new arrivals grid concise for the homepage.
  let productsToRender = products;
  try{
    if(document.body && document.body.classList.contains('index-page')){
      const truckers = products.filter(p => (p.id || 0) <= 10).slice(0, 5);
      const beanies = products.filter(p => (p.id || 0) >= 11).slice(0, 4);
      productsToRender = truckers.concat(beanies);
    }
  }catch(e){ /* defensive — if DOM not ready, fall back to full product list */ }
  renderProducts(productsToRender);

  // Aggressively preload images only on desktop to avoid hogging mobile bandwidth
  setTimeout(() => {
    const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth >= 769;
    if(!isDesktop()) return;
    document.querySelectorAll('img.thumb').forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        try{ fetch(src, { method: 'GET', mode: 'cors' }).catch(() => {}); }catch(e){}
        const preloadImg = new Image();
        preloadImg.src = src;
      }
    });
    console.debug('Shop: Preloaded all product images (desktop)');
  }, 100);

  // Ensure images are decoded and ready to paint (helps desktop browsers show images immediately)
  function ensureImagesDecoded() {
    const imgs = Array.from((document.querySelectorAll('.shop-grid img.thumb')) || []);
    if(!imgs.length) return;
    const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth >= 769;
    const promises = imgs.map(img => {
      return new Promise(resolve => {
        try{
          img.decoding = 'async';
          if(isDesktop()){ img.loading = 'eager'; img.setAttribute('importance', 'high'); img.setAttribute('fetchpriority', 'high'); }
          else { img.loading = 'lazy'; }
        }catch(e){}
        if(img.complete && img.naturalWidth > 0){
          // Already loaded and decoded
          return resolve({ img, status: 'cached' });
        }
        // Prefer the modern decode API where supported
        if(typeof img.decode === 'function'){
          img.decode().then(()=> resolve({ img, status: 'decoded' })).catch(()=> resolve({ img, status: 'decode-failed' }));
        } else {
          img.addEventListener('load', function onload(){ img.removeEventListener('load', onload); resolve({ img, status: 'loaded' }); });
          img.addEventListener('error', function onerr(){ img.removeEventListener('error', onerr); resolve({ img, status: 'error' }); });
        }
      });
    });
    Promise.allSettled(promises).then(results => {
      try{ console.debug('Shop: ensureImagesDecoded completed', results.map(r=>r.status)); }catch(e){}
    });
  }

  // Call immediately after render and on focus to ensure images are decoded
  setTimeout(ensureImagesDecoded, 150);
  // Desktop-only: force-load images to ensure they fetch immediately on desktop builds
  (function forceLoadDesktopImages(){
    const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth >= 769;
    if(!isDesktop()) return;
    try{
      document.querySelectorAll('.shop-grid img.thumb').forEach(img => {
        try{
          const src = img.getAttribute('src');
          if(!src) return;
          // ensure attributes are set for aggressive loading
          img.loading = 'eager';
          img.setAttribute('importance', 'high');
          img.setAttribute('fetchpriority', 'high');
          // Reassign src to nudge the browser to fetch if needed
          if(!img.complete){
            // create a new Image to avoid reassigning while it's used elsewhere
            const preload = new Image();
            preload.decoding = 'async';
            preload.loading = 'eager';
            preload.src = src;
            preload.addEventListener('load', () => {
              // Copy to the visible image if it still has no naturalWidth
              if(!img.complete || img.naturalWidth === 0){
                img.src = src;
              }
            });
            preload.addEventListener('error', () => {
              // Show a lightweight placeholder if the image fails to load
              img.classList.add('thumb-failed');
            });
          }
        }catch(e){ /* non-blocking */ }
      });
    }catch(e){ /* ignore */ }
  })();
  window.addEventListener('focus', () => setTimeout(ensureImagesDecoded, 50));
  document.addEventListener('visibilitychange', () => { if(!document.hidden) setTimeout(ensureImagesDecoded, 50); });

  // Observe the shopGrid for dynamic inserts and ensure decoded when product nodes are added
  try{
    const mo = new MutationObserver((mutations)=>{
      let added = false;
      mutations.forEach(m => { if(m.addedNodes && m.addedNodes.length) added = true; });
      if(added) setTimeout(ensureImagesDecoded, 50);
    });
    mo.observe(shopGrid, { childList: true, subtree: true });
  }catch(e){}

  // Check for product parameter and scroll to it
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  if(productId){
    setTimeout(() => {
      const productWrap = shopGrid.querySelector(`[data-product-id="${productId}"]`).closest('.product-wrap');
      if(productWrap){
        productWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Ensure wrapper is positioned so the badge can be placed absolutely
        let setInlinePosition = false;
        try{ if(getComputedStyle(productWrap).position === 'static'){ productWrap.style.position = 'relative'; setInlinePosition = true; } }catch(e){}
        // Add blinking border animation + badge
        productWrap.classList.add('highlight-product');
        let badge = productWrap.querySelector('.found-badge');
        if(!badge){
          badge = document.createElement('span');
          badge.className = 'found-badge';
          badge.textContent = 'FOUND';
          productWrap.appendChild(badge);
        }
        // Announce to screen readers and remove visual highlight after animation completes (6 blinks = 3.6 seconds)
        try{
          const titleText = (productWrap.querySelector('.title') && productWrap.querySelector('.title').textContent) || '';
          let announcer = document.getElementById('sr-announcer');
          if(!announcer){
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-9999px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
          }
          announcer.textContent = `Found ${titleText}`;
        }catch(e){ /* do not block UI updates */ }

        // Remove the class and badge after animation completes
        setTimeout(() => {
          productWrap.classList.remove('highlight-product');
          try{ if(badge && badge.parentNode) badge.parentNode.removeChild(badge); }catch(e){}
          try{ const announcer = document.getElementById('sr-announcer'); if(announcer) announcer.textContent = ''; }catch(e){}
          // revert inline position only if we set it
          try{ if(setInlinePosition) productWrap.style.position = ''; }catch(e){}
        }, 3600);
      } else {
        const productsSection = document.querySelector('.product-catalog') || shopGrid;
        if(productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Update on storage changes from other tabs (keeps topbar up-to-date)
  window.addEventListener('storage', function(e){
    if(e.key === 'cart'){
      if(window.Cart && typeof window.Cart.updateTopbarCart === 'function'){
        window.Cart.updateTopbarCart();
      } else {
        const cart = readCart();
        const newCount = cart.reduce((s, i) => s + (i.qty || 0), 0);
        const newTotal = cart.reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0);
        if(topbarBadge) topbarBadge.textContent = newCount;
        if(cartEl) cartEl.setAttribute('title', `${newCount} ITEM${newCount > 1 ? 'S' : ''} | ${formatPrice(newTotal)}`);
      }
    }
  });

  // Sorting (only attach if the select exists on the page)
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const copy = products.slice();
      if(val === 'price-asc') copy.sort((a,b) => a.price - b.price);
      if(val === 'price-desc') copy.sort((a,b) => b.price - a.price);
      renderProducts(copy);
    });
  }

  // Quick focus on search: uses header search with id 'search'
  document.addEventListener('keydown', function(e){
    if(e.key === '/' && document.activeElement.id !== 'search'){
      e.preventDefault(); document.getElementById('search').focus();
    }
  });

  // ============================================================
  // SEARCH AUTOCOMPLETE FOR SHOP PAGE
  // ============================================================
  const searchInput = document.getElementById('search');
  const resultsContainer = document.getElementById('searchResults');
  
  if(searchInput && resultsContainer){
    // Prevent double-binding if another script already attached a search handler
    if(searchInput.dataset.searchAttached === 'true') {
      /* Already attached by index.js; skip */
    } else {
    searchInput.addEventListener('input', function(e){
      const query = this.value.trim().toLowerCase();
      
      if(query.length < 1){
        resultsContainer.classList.remove('show');
        resultsContainer.innerHTML = '';
        return;
      }
      
      // Filter products based on query and prioritize prefix/word-start matches
      const filtered = products
        .map(product => {
          const titleLower = (product.title || '').toLowerCase();
          let score = 0;
          if(titleLower.startsWith(query)) score += 300;
          const words = titleLower.split(/\s+/).filter(Boolean);
          if(words.some(w => w.startsWith(query))) score += 200;
          if(titleLower.includes(query)) score += 100;
          return { product, score };
        })
        .filter(i => i.score > 0)
        .sort((a, b) => {
          if(a.score !== b.score) return b.score - a.score;
          const ra = (a.product.rating || 0), rb = (b.product.rating || 0);
          if(ra !== rb) return rb - ra;
          return (a.product.id || 0) - (b.product.id || 0);
        })
        .slice(0, 8)
        .map(i => i.product);
      
      if(filtered.length === 0){
        resultsContainer.classList.remove('show');
        resultsContainer.innerHTML = '';
        return;
      }
      
      // Render results
      resultsContainer.innerHTML = filtered.map(product => `
        <div class="result-item" data-product-id="${product.id}" data-product-title="${product.title}">
          <img src="${product.image}" alt="${product.title}" width="48" height="48" loading="lazy" decoding="async" />
          <div class="result-item-content">
            <div class="result-item-title">${product.title}</div>
            <div class="result-item-price">₦${Number(product.price).toLocaleString('en-NG')}</div>
          </div>
        </div>
      `).join('');
      
      resultsContainer.classList.add('show');
      
      // Add click handlers to result items and prevent touch scroll freeze
      resultsContainer.querySelectorAll('.result-item').forEach(item => {
        // Prevent touch-action from freezing scroll on mobile
        item.style.touchAction = 'manipulation';
        item.style.pointerEvents = 'auto';
        
        item.addEventListener('click', function(){
          const productTitle = this.dataset.productTitle;
          // Render filtered products and scroll
          const filtered = products.filter(p => 
            p.title.toLowerCase().includes(productTitle.toLowerCase())
          );
          if(filtered.length > 0){
            renderProducts(filtered);
            resultsContainer.classList.remove('show');
            searchInput.value = '';
            setTimeout(() => {
              if(shopGrid) shopGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        });
        
        // Prevent touchmove from blocking page scroll
        item.addEventListener('touchmove', function(e){
          // Allow natural touch scrolling - don't preventDefault
        }, { passive: true });
      });
    });
    
    // Close results when clicking outside
    document.addEventListener('click', function(e){
      if(!searchInput.contains(e.target) && !resultsContainer.contains(e.target)){
        resultsContainer.classList.remove('show');
      }
    });
    
    // Close on Escape key
    searchInput.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        resultsContainer.classList.remove('show');
      }
    });
    
    // Handle Enter key
    searchInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && this.value.trim().length > 0){
        e.preventDefault();
        const filtered = products.filter(p => 
          p.title.toLowerCase().includes(this.value.trim().toLowerCase())
        );
        if(filtered.length > 0){
          renderProducts(filtered);
          resultsContainer.classList.remove('show');
        }
      }
    });

    // Mark this input as having search behavior attached to avoid double-binding
    try{ searchInput.dataset.searchAttached = 'true'; }catch(e){}

    }

    // ==============================================
    // ABOUT US MODAL (footer) — open / close logic
    // ==============================================
    // Shared scroll-lock helper: preserve scroll position when overlays open
    const scrollLocker = (function(){
      let locked = false;
      let scrollY = 0;
      return {
        lock() {
          if(locked) return;
          scrollY = window.scrollY || window.pageYOffset || 0;
          // Prevent jump by fixing body in place
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.width = '100%';
          document.body.classList.add('no-scroll');
          locked = true;
        },
        unlock() {
          if(!locked) return;
          // Restore inline styles and scroll to saved position
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          document.body.classList.remove('no-scroll');
          window.scrollTo(0, scrollY);
          locked = false;
        }
      };
    })();

    (function(){
      const modal = document.getElementById('aboutModal');
      if(!modal) return;

      const closeBtn = modal.querySelector('.modal-close');
      const innerSurface = modal.querySelector('.modal-surface');
      let savedScrollPosition = 0;

      function openModal(){
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        // Focus on close button for accessibility
        if(closeBtn) closeBtn.focus();
        // Use shared scroll locker to preserve position
        try{ scrollLocker.lock(); }catch(e){ document.body.classList.add('no-scroll'); }
      }

      function closeModal(){
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        try{ scrollLocker.unlock(); }catch(e){ document.body.classList.remove('no-scroll'); }
      }

      // Attach to all About links within the page
      document.querySelectorAll('.js-about-link').forEach(a => {
        a.addEventListener('click', function(e){
          e.preventDefault();
          openModal();
        });
      });

      // Close when clicking overlay or close button
      modal.addEventListener('click', function(e){
        if(e.target === modal) closeModal();
      });
      if(closeBtn) closeBtn.addEventListener('click', closeModal);

      // Close on Escape key
      document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });
    })();

  // ==============================================
  // TERMS MODAL — open / close logic
  // ==============================================
  (function(){
    const modal = document.getElementById('termsModal');
    if(!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    let scrollPos = 0;

    function openModal(){
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      if(closeBtn) closeBtn.focus();
      try{ scrollLocker.lock(); }catch(e){ document.body.classList.add('no-scroll'); }
    }

    function closeModal(){
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      try{ scrollLocker.unlock(); }catch(e){ document.body.classList.remove('no-scroll'); }
    }

    document.querySelectorAll('.js-terms-link').forEach(a => {
      a.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal();
      }, true);
    });

    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
    if(closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });
  })();

  // ==============================================
  // PRIVACY MODAL — open / close logic
  // ==============================================
  (function(){
    const modal = document.getElementById('privacyModal');
    if(!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    let scrollPos = 0;

    function openModal(){
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      if(closeBtn) closeBtn.focus();
      try{ scrollLocker.lock(); }catch(e){ document.body.classList.add('no-scroll'); }
    }

    function closeModal(){
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      try{ scrollLocker.unlock(); }catch(e){ document.body.classList.remove('no-scroll'); }
    }

    document.querySelectorAll('.js-privacy-link').forEach(a => {
      a.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal();
      }, true);
    });

    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
    if(closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });
  })();

  // ==============================================
  // RETURNS MODAL — open / close logic
  // ==============================================
  (function(){
    const modal = document.getElementById('returnsModal');
    if(!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    let scrollPos = 0;

    function openModal(){
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      if(closeBtn) closeBtn.focus();
      try{ scrollLocker.lock(); }catch(e){ document.body.classList.add('no-scroll'); }
    }

    function closeModal(){
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      try{ scrollLocker.unlock(); }catch(e){ document.body.classList.remove('no-scroll'); }
    }

    document.querySelectorAll('.js-returns-link').forEach(a => {
      a.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal();
      }, true);
    });

    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
    if(closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });
  })();
  }
});

