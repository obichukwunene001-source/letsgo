// Product variations database (truckers and beanies)
const productVariations = {
  // Truckers (IDs 1 - 10)
  1: {
    colors: ['Camo Yellow', 'Black', 'Olive', 'Khaki'],
    colorHex: { 'Camo Yellow': '#C9A227', 'Black': '#000', 'Olive': '#556B2F', 'Khaki': '#F0E68C' },
    description: 'Structured FG trucker cap with a breathable mesh back and a curved brim. Features an embroidered front patch and an adjustable snapback for a comfortable, one-size fit — durable and ready for daily wear.'
  },
  2: {
    colors: ['Black', 'Charcoal', 'White'],
    colorHex: { 'Black': '#000', 'Charcoal': '#36454f', 'White': '#fff' },
    description: 'Classic FG black trucker with a reinforced front panel and lightweight mesh to keep you cool. Clean embroidered branding and an adjustable snap closure for secure fit.'
  },
  3: {
    colors: ['Sky Blue', 'White', 'Navy'],
    colorHex: { 'Sky Blue': '#87CEEB', 'White': '#fff', 'Navy': '#001f3f' },
    description: 'FG sky-blue trucker featuring a soft front panel and airy mesh back. Embroidered branding and adjustable snapback combine style and function for everyday wear.'
  },
  4: {
    colors: ['Silver Grey', 'Black', 'White'],
    colorHex: { 'Silver Grey': '#C0C0C0', 'Black': '#000', 'White': '#fff' },
    description: 'Neutral silver-grey trucker with structured shape and breathable construction. Pairs effortlessly with layered streetwear looks.'
  },
  5: {
    colors: ['Burnt Orange', 'Beige'],
    colorHex: { 'Burnt Orange': '#CC5500', 'Beige': '#F5F5DC' },
    description: 'Bold burnt-orange trucker with a durable front panel and classic mesh back. Built to hold its shape while providing all-day comfort.'
  },
  6: {
    colors: ['Deep Red', 'Black'],
    colorHex: { 'Deep Red': '#8B0000', 'Black': '#000' },
    description: 'Deep-red FG trucker with premium embroidery and an adjustable snapback. Lightweight, breathable, and made to stand out.'
  },
  7: {
    colors: ['Burgundy Camo', 'Forest'],
    colorHex: { 'Burgundy Camo': '#6B2E2E', 'Forest': '#2E8B57' },
    description: 'Burgundy camo trucker — statement styling with a reinforced front and ventilated mesh for comfortable wear.'
  },
  8: {
    colors: ['Forest Camo', 'Olive'],
    colorHex: { 'Forest Camo': '#4B5320', 'Olive': '#556B2F' },
    description: 'Forest camo FG trucker, designed for breathability and lasting shape. A versatile cap for casual and outdoor looks.'
  },
  9: {
    colors: ['Royal Purple', 'Black'],
    colorHex: { 'Royal Purple': '#6A0DAD', 'Black': '#000' },
    description: 'Vibrant royal-purple trucker with a structured silhouette, embroidered logo, and adjustable snap for a personalized fit.'
  },
  10: {
    colors: ['Bright Red', 'Black'],
    colorHex: { 'Bright Red': '#FF0000', 'Black': '#000' },
    description: 'Bright-red FG trucker made for impact. Breathable mesh back and durable front deliver a standout everyday cap.'
  },

  // Beanies (IDs 11 - 18)
  11: {
    colors: ['Charcoal Grey', 'Black'],
    colorHex: { 'Charcoal Grey': '#36454f', 'Black': '#000' },
    description: 'FG charcoal beanie knitted from a soft acrylic blend with a folded cuff and subtle embroidered logo. Provides comfortable warmth and a snug fit.'
  },
  12: {
    colors: ['Jet Black', 'Graphite'],
    colorHex: { 'Jet Black': '#000', 'Graphite': '#2F4F4F' },
    description: 'Classic jet-black beanie with a ribbed knit and clean finish. Lightweight, insulating and easy to style.'
  },
  13: {
    colors: ['Earth Brown', 'Tan'],
    colorHex: { 'Earth Brown': '#8B5A2B', 'Tan': '#D2B48C' },
    description: 'Earth-brown FG beanie offering soft warmth and a relaxed silhouette. The folded cuff adds structure while keeping ears cozy.'
  },
  14: {
    colors: ['Light Green', 'Mint'],
    colorHex: { 'Light Green': '#90EE90', 'Mint': '#98FF98' },
    description: 'Light-green beanie with a soft handfeel and a close, comfortable fit. Ideal for layering under hoods or wearing solo.'
  },
  15: {
    colors: ['Light Grey', 'Heather'],
    colorHex: { 'Light Grey': '#D3D3D3', 'Heather': '#BEBEBE' },
    description: 'Light-grey beanie crafted for everyday warmth. The classic ribbed knit and moderate stretch ensure a secure, flattering fit.'
  },
  16: {
    colors: ['Navy Blue', 'Indigo'],
    colorHex: { 'Navy Blue': '#001f3f', 'Indigo': '#3F00FF' },
    description: 'Navy FG beanie combining a refined finish with insulating warmth. Subtle branding keeps the look clean and versatile.'
  },
  17: {
    colors: ['Deep Purple', 'Plum'],
    colorHex: { 'Deep Purple': '#4B0082', 'Plum': '#8E4585' },
    description: 'Deep-purple beanie with a rich knit texture and snug fit. Comfortable for daily wear and cooler evenings.'
  },
  18: {
    colors: ['Wine Red', 'Burgundy'],
    colorHex: { 'Wine Red': '#722F37', 'Burgundy': '#800020' },
    description: 'Wine-red FG beanie with a cozy ribbed knit and fold-over cuff. A stylish, warm accessory that complements fall and winter outfits.'
  }
};

// Extend variations for shoes (IDs 19+)
for (let i = 19; i <= 22; i++) {
  productVariations[i] = {
    colors: ['Black', 'White', 'Navy', 'Grey'],
    colorHex: { 'Black': '#000', 'White': '#fff', 'Navy': '#001f3f', 'Grey': '#999' },
    description: 'Premium footwear designed for comfort and style. Perfect for everyday wear with durable materials and modern design.'
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Get product ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;

  // Reference to elements
  const mainImage = document.getElementById('mainImage');
  const thumbsScroll = document.getElementById('thumbsScroll');
  const productTitle = document.getElementById('productTitle');
  const productPrice = document.getElementById('productPrice');
  const productDescription = document.getElementById('productDescription');
  const colorGrid = document.getElementById('colorGrid');
  const colorValue = document.getElementById('colorValue');
  const qtyInput = document.getElementById('qtyInput');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const wishlistBtn = document.getElementById('wishlistBtn');
  const backBtn = document.getElementById('backBtn');
  const relatedProductsGrid = document.getElementById('relatedProducts');
  const decreaseQtyBtn = document.getElementById('decreaseQty');
  const increaseQtyBtn = document.getElementById('increaseQty');
  const productStars = document.getElementById('productStars');
  const cartEl = document.querySelector('.topbar .cart');
  const topbarBadge = document.querySelector('.topbar .notif-badge');

  // Cart utilities
  const readCart = (window.Cart && window.Cart.readCart) ? window.Cart.readCart : function() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch(e) { return []; }
  };
  const writeCart = (window.Cart && window.Cart.writeCart) ? window.Cart.writeCart : function(c) {
    localStorage.setItem('cart', JSON.stringify(c));
  };
  const formatPrice = (window.Cart && window.Cart.formatPrice) ? window.Cart.formatPrice : function(n) {
    return '₦' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Get product from shop.js products array
  const product = products.find(p => p.id === productId);
  if (!product) {
    document.body.innerHTML = '<div class="error-message"><p>Product not found. <a href="shop.html">Return to shop</a></p></div>';
    return;
  }

  const variations = productVariations[productId] || productVariations[1];
  let selectedColor = variations.colors[0];
  let selectedQty = 1;

  // Image slider functionality
  let currentSlide = 1;
  const totalSlides = 4;
  let animating = false; // prevent double clicks while animating
  let productImages = [];
  let pendingSlide = null;
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const currentSlideEl = document.getElementById('currentSlide');
  const totalSlidesEl = document.getElementById('totalSlides');

  function updateSlideDisplay() {
    const activeIndex = (pendingSlide || currentSlide) - 1;
    currentSlideEl.textContent = (activeIndex + 1);
    // update active thumbnail (immediate using pendingSlide when present)
    // force remove then add to avoid intermediate :active pseudo-class state
    document.querySelectorAll('.thumb-btn').forEach((t, idx) => {
      t.classList.remove('active');
    });
    const activeThumbs = document.querySelectorAll('.thumb-btn');
    if (activeThumbs[activeIndex]) {
      activeThumbs[activeIndex].classList.add('active');
    }
  }

  // Generic image error handler: set fallback and styling
  const fallbackImage = 'images/foot.png';
  function handleImageError(e) {
    const img = e.target;
    try {
      if (img.dataset.fallbackTried) return;
      img.dataset.fallbackTried = '1';
      // use a neutral placeholder (footer logo), ensure we don't loop
      img.src = fallbackImage;
      img.classList.add('img-fallback');
    } catch (err) {
      // ignore
    }
  }

  prevSlideBtn.addEventListener('click', () => {
    const next = currentSlide === 1 ? totalSlides : currentSlide - 1;
    // IMMEDIATE visual feedback FIRST
    pendingSlide = next;
    currentSlideEl.textContent = next;
    // force remove from all then add to target thumb
    document.querySelectorAll('.thumb-btn').forEach((t) => t.classList.remove('active'));
    const targetThumb = document.querySelectorAll('.thumb-btn')[next - 1];
    if (targetThumb) targetThumb.classList.add('active');
    
    // NOW check if animating; skip flip if so
    if (animating) return;
    flipToSlide(next, 'prev');
  });

  nextSlideBtn.addEventListener('click', () => {
    const next = currentSlide === totalSlides ? 1 : currentSlide + 1;
    // IMMEDIATE visual feedback FIRST
    pendingSlide = next;
    currentSlideEl.textContent = next;
    // force remove from all then add to target thumb
    document.querySelectorAll('.thumb-btn').forEach((t) => t.classList.remove('active'));
    const targetThumb = document.querySelectorAll('.thumb-btn')[next - 1];
    if (targetThumb) targetThumb.classList.add('active');
    
    // NOW check if animating; skip flip if so
    if (animating) return;
    flipToSlide(next, 'next');
  });

  // Initialize total slides display
  totalSlidesEl.textContent = totalSlides;

  // Initialize product display
  function initProduct() {
    productTitle.textContent = product.title;
    productPrice.textContent = formatPrice(product.price);
    productDescription.textContent = variations.description;

    // Set random review count between 33-65
    const reviewCount = Math.floor(Math.random() * (65 - 33 + 1)) + 33;
    document.getElementById('reviewCount').textContent = reviewCount;

    // Prepare a 4-slide gallery with alternating images (original and variant with "2")
    function getImageVariant(imagePath, variant) {
      // Replace the number before .jpg/png with a variant
      // e.g., fg_army1.jpg -> fg_army2.jpg
      return imagePath.replace(/(\d)(\.(jpg|png|jpeg))$/i, variant + '$2');
    }
    
    const img1 = product.image;
    const img2 = getImageVariant(product.image, '2');
    productImages = [img1, img2, img1, img2]; // Alternate between original and variant
    mainImage.src = productImages[0];
    mainImage.alt = product.title;
    // Add performance attributes
    mainImage.setAttribute('loading', 'eager');
    mainImage.setAttribute('decoding', 'async');
    mainImage.setAttribute('width', '800');
    mainImage.setAttribute('height', '800');
    mainImage.addEventListener('error', handleImageError, { once: true });

    // Create thumbnails for each slide
    thumbsScroll.innerHTML = '';
    productImages.forEach((src, idx) => {
      const thumb = document.createElement('button');
      thumb.className = 'thumb-btn' + (idx === 0 ? ' active' : '');
      thumb.setAttribute('aria-label', `View ${product.title} (image ${idx + 1})`);
      const img = document.createElement('img');
      img.src = src;
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      img.setAttribute('width', '120');
      img.setAttribute('height', '120');
      img.alt = product.title + ` (image ${idx + 1})`;
      // thumbnail image fallback
      img.addEventListener('error', handleImageError);
      thumb.appendChild(img);
      thumb.addEventListener('click', () => {
        const target = idx + 1;
        const dir = target > currentSlide ? 'next' : (target < currentSlide ? 'prev' : null);
        if (!dir) return; // already current
        
        // IMMEDIATE visual feedback FIRST (do not check animating yet)
        pendingSlide = target;
        currentSlideEl.textContent = target;
        // force remove from all then add to target thumb
        document.querySelectorAll('.thumb-btn').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // NOW check if animating; if so, skip the flip but keep UI updated
        if (animating) return;
        
        flipToSlide(target, dir); // animate to selected
      });
      thumbsScroll.appendChild(thumb);
    });

    // ensure totalSlides matches productImages length
    // (keeps counter in sync if productImages changes later)
    totalSlidesEl.textContent = productImages.length;

    // Render color options
    renderColors();

    // Set star rating
    renderStars(product.rating || 5);

    // Update topbar cart
    updateCartBadge();
  }

  // Flip animation; direction is 'next' or 'prev', nextIndex is 1-based
  function flipToSlide(nextIndex, direction) {
    if (animating || nextIndex === currentSlide) return;
    animating = true;
    const wrapper = document.querySelector('.product-image-main');
    const overlay = document.createElement('div');
    overlay.className = 'flip-card';

    // Immediately update thumbnails (four images below) so UI matches intended slide
    const thumbBtns = Array.from(document.querySelectorAll('.thumb-btn'));
    thumbBtns.forEach((btn, i) => {
      const imgEl = btn.querySelector('img');
      if (imgEl && productImages[i]) imgEl.src = productImages[i];
      // remove active from all, then add only to target
      btn.classList.remove('active');
    });
    if (thumbBtns[nextIndex - 1]) {
      thumbBtns[nextIndex - 1].classList.add('active');
    }

    // front (current) and back (incoming)
    const front = document.createElement('div');
    front.className = 'side front';
    const frontImg = document.createElement('img');
    frontImg.src = productImages[currentSlide - 1] || mainImage.src;
    frontImg.alt = 'Current image';
    frontImg.addEventListener('error', handleImageError);
    front.appendChild(frontImg);

    const back = document.createElement('div');
    back.className = 'side back';
    const backImg = document.createElement('img');
    backImg.src = productImages[nextIndex - 1] || product.image; // pick the target slide image
    backImg.alt = 'Next image';
    backImg.addEventListener('error', handleImageError);
    back.appendChild(backImg);

    overlay.appendChild(front);
    overlay.appendChild(back);

    // For prev direction ensure back starts rotated -180deg before flip
    if (direction === 'prev') {
      back.style.transform = 'rotateY(-180deg)';
    }

    wrapper.appendChild(overlay);

    // Force paint then toggle CSS class that animates transforms
    requestAnimationFrame(() => {
      // toggle class - CSS will animate the transforms
      overlay.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');
    });

    // When transition ends on the back side (transform finished), finalize
    let finished = false;
    function finalize() {
      if (finished) return;
      finished = true;
      try { mainImage.src = backImg.src; } catch (e) {}
      currentSlide = nextIndex;
      pendingSlide = null;
      updateSlideDisplay();
      if (overlay && overlay.parentNode) overlay.remove();
      animating = false;
    }

    // Prefer listening on the back side for transform completion
    const transitionHandler = (e) => {
      if (e.propertyName && e.propertyName !== 'transform') return;
      finalize();
    };
    back.addEventListener('transitionend', transitionHandler, { once: true });

    // Fallback: if transitionend doesn't fire, finalize after a timeout slightly longer than CSS duration
    const fallbackTimeout = setTimeout(() => {
      finalize();
    }, 1200);

    // Ensure we clear timeout if finalize runs from event
    const originalFinalize = finalize;
    finalize = function() {
      if (finished) return;
      finished = true;
      clearTimeout(fallbackTimeout);
      try { mainImage.src = backImg.src; } catch (e) {}
      currentSlide = nextIndex;
      pendingSlide = null;
      updateSlideDisplay();
      if (overlay && overlay.parentNode) overlay.remove();
      animating = false;
    };
  }

  function renderColors() {
    colorGrid.innerHTML = '';
    variations.colors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      if (color === selectedColor) btn.classList.add('active');
      btn.setAttribute('aria-label', `Select color ${color}`);
      btn.setAttribute('data-color', color);
      btn.style.backgroundColor = variations.colorHex[color] || '#ccc';
      btn.style.borderColor = color === 'White' ? '#ccc' : variations.colorHex[color];
      btn.title = color;
      btn.addEventListener('click', () => {
        selectedColor = color;
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        colorValue.textContent = color;
      });
      colorGrid.appendChild(btn);
    });
    colorValue.textContent = selectedColor;
  }

  function renderStars(rating) {
    const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
    productStars.style.setProperty('--percent', percent + '%');
    productStars.setAttribute('aria-label', `${rating} out of 5 stars`);
  }

  function updateCartBadge() {
    const cart = readCart();
    const count = cart.reduce((s, item) => s + (item.qty || 0), 0);
    const total = cart.reduce((s, item) => s + ((item.price || 0) * (item.qty || 0)), 0);
    if (topbarBadge) topbarBadge.textContent = count;
    if (cartEl) {
      cartEl.setAttribute('title', `${count} ITEM${count > 1 ? 'S' : ''} | ${formatPrice(total)}`);
      cartEl.setAttribute('aria-label', `Cart — ${count} ITEM${count > 1 ? 'S' : ''} | ${formatPrice(total)}`);
    }
    // Update any checkout badges present in the UI (mobile menu and other pages)
    try{
      const checkoutBadges = Array.from(document.querySelectorAll('.checkout-count'));
      checkoutBadges.forEach(b => {
        b.textContent = (count || 0);
        if (count && count > 0) { b.style.display = 'inline-flex'; }
        else { b.style.display = 'none'; }
      });
      const checkoutLinks = Array.from(document.querySelectorAll('.checkout-link'));
      checkoutLinks.forEach(cl => {
        const clabel = (count || 0) + ' ITEM' + (count === 1 ? '' : 'S') + ' | ' + formatPrice(total || 0);
        cl.setAttribute('aria-label', 'Checkout — ' + clabel);
        cl.setAttribute('title', 'Checkout — ' + clabel);
      });
    }catch(e){/* nonblocking */}
  }

  function renderRelatedProducts() {
    const relatedIds = products
      .filter(p => p.id !== productId)
      .slice(0, 4)
      .map(p => p.id);

    relatedProductsGrid.innerHTML = '';
    relatedIds.forEach(id => {
      const relProduct = products.find(p => p.id === id);
      if (!relProduct) return;

      const wrap = document.createElement('div');
      wrap.className = 'related-product-card';

      const img = document.createElement('img');
      img.src = relProduct.image;
      img.alt = relProduct.title;
      // if image cannot load, skip this related product (don't append)
      img.addEventListener('error', function() {
        // remove card to avoid broken images in related products
        if (wrap && wrap.parentNode) wrap.remove();
      });

      const titleEl = document.createElement('h3');
      titleEl.textContent = relProduct.title;

      const priceEl = document.createElement('p');
      priceEl.className = 'related-price';
      priceEl.textContent = formatPrice(relProduct.price);

      const btn = document.createElement('button');
      btn.className = 'btn btn-small';
      btn.textContent = 'View Details';
      btn.addEventListener('click', () => {
        window.location.href = `dynamic.html?id=${id}`;
      });

      wrap.appendChild(img);
      wrap.appendChild(titleEl);
      wrap.appendChild(priceEl);
      wrap.appendChild(btn);
      relatedProductsGrid.appendChild(wrap);
    });
  }

  // Event listeners
  decreaseQtyBtn.addEventListener('click', () => {
    if (selectedQty > 1) {
      selectedQty--;
      qtyInput.value = selectedQty;
    }
  });

  increaseQtyBtn.addEventListener('click', () => {
    if (selectedQty < 99) {
      selectedQty++;
      qtyInput.value = selectedQty;
    }
  });

  qtyInput.addEventListener('change', () => {
    const val = parseInt(qtyInput.value) || 1;
    selectedQty = Math.max(1, Math.min(99, val));
    qtyInput.value = selectedQty;
  });

  let isAddingToCart = false; // Flag to prevent double-click additions

  addToCartBtn.addEventListener('click', () => {
    // Prevent multiple rapid clicks from adding items twice
    if(isAddingToCart) return;
    isAddingToCart = true;

    try {
      const cart = readCart();
      const itemKey = `${product.id}-${selectedColor}`;
      let item = cart.find(i => i.cartKey === itemKey);

      if (item) {
        item.qty = (item.qty || 0) + selectedQty;
      } else {
        item = {
          id: product.id,
          cartKey: itemKey,
          title: `${product.title} (${selectedColor})`,
          price: Number(product.price || 0),
          qty: selectedQty,
          image: product.image,
          color: selectedColor
        };
        cart.push(item);
      }
      writeCart(cart);

      // Update UI
      addToCartBtn.textContent = '✓ Added!';
      addToCartBtn.classList.add('added');
      updateCartBadge();

      setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.classList.remove('added');
        isAddingToCart = false; // Re-enable after UI animation completes
      }, 1500);
    } catch(e) {
      console.error('[dynamic] addToCart error:', e);
      isAddingToCart = false;
    }
  });

  buyNowBtn.addEventListener('click', () => {
    addToCartBtn.click();
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 500);
  });

  wishlistBtn.addEventListener('click', () => {
    wishlistBtn.classList.toggle('active');
    wishlistBtn.setAttribute('aria-pressed', wishlistBtn.classList.contains('active'));
  });

  backBtn.addEventListener('click', () => {
    const referrer = document.referrer;
    if (referrer && (referrer.includes('shop.html') || referrer.includes('index.html'))) {
      window.history.back();
    } else {
      window.location.href = 'shop.html';
    }
  });

  // Initialize
  initProduct();
  renderRelatedProducts();

  // Mobile menu initialization (mirrors index.js behavior)
  function initMobileMenu(){
    const burger = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if(!burger || !menu || !backdrop) return;

    // Clone desktop nav into mobile menu (if not present)
    try{
      const mobileBrand = menu.querySelector('.mobile-brand-links');
      const desktopBrand = document.querySelector('.brand .brand-links');
      if(mobileBrand && desktopBrand){
        mobileBrand.innerHTML = desktopBrand.innerHTML;
        // Remove links we don't want in the mobile quick links for dynamic page
        mobileBrand.querySelectorAll('a[href="shop.html"], a[href="login.html"], a[href*="category=men"], a[href*="category=women"]').forEach(el => el?.remove());
      }
      const mobileMain = menu.querySelector('.mobile-main-nav ul');
      const desktopMain = document.querySelector('.main-nav ul');
      if(mobileMain && desktopMain){
        mobileMain.innerHTML = desktopMain.innerHTML;

        // Insert mobile-only logo at top (force nano.png regardless of desktop logo)
        try{
          if(!menu.querySelector('.mobile-top')){
            const logoAnchor = document.createElement('a');
            logoAnchor.className = 'logo';
            logoAnchor.href = 'index.html';
            logoAnchor.setAttribute('aria-label', 'Emmy — Home');
            const logoImg = document.createElement('img');
            logoImg.src = 'images/nano.png';
            logoImg.alt = 'Emmy logo';
            logoAnchor.appendChild(logoImg);
            try{ logoAnchor.setAttribute('tabindex', '-1'); }catch(e){}
            const logoWrap = document.createElement('div');
            logoWrap.className = 'mobile-logo';
            logoWrap.appendChild(logoAnchor);
            const topRow = document.createElement('div');
            topRow.className = 'mobile-top';
            topRow.appendChild(logoWrap);
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
        // Update cart counts inside mobile menu
        updateCartBadge();

        // Insert mobile icons next to nav links
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
            if(a.querySelector('.nav-icon')) return; // already has icon
            let iconFile = null;
            if(a.classList.contains('collections-link')) iconFile = 'collections-add-24-filled.svg';
            else {
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
        }catch(e){}

        // Capitalize navigation link text
        try{
          mobileMain.querySelectorAll('a').forEach(a => {
            const textNode = Array.from(a.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if(textNode){
              const text = textNode.textContent.trim();
              if(a.classList.contains('collections-link')){
                if(text) textNode.textContent = 'Collections ';
              } else {
                if(text) textNode.textContent = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() + ' ';
              }
            }
          });
        }catch(e){}
      }
    }catch(e){/* ignore */}

    const openMenu = () => {
      document.querySelector('.search-wrap.open')?.classList.remove('open');
      menu.classList.add('open');
      backdrop.classList.remove('hidden');
      backdrop.classList.add('visible');
      burger.setAttribute('aria-expanded','true');
      menu.setAttribute('aria-hidden','false');
      document.body.classList.add('no-scroll');
      burger.classList.add('open');
      menu.querySelector('.mobile-main-nav a, .mobile-main-nav button')?.focus({preventScroll:true});
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      backdrop.classList.remove('visible');
      backdrop.classList.add('hidden');
      burger.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-hidden','true');
      document.body.classList.remove('no-scroll');
      burger.classList.remove('open');
      burger.focus({preventScroll:true});
    };

    burger.addEventListener('click', () => {
      const isOpen = burger.classList.contains('open');
      if(isOpen) closeMenu(); else openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && menu && menu.classList.contains('open')) closeMenu(); });
  }

  initMobileMenu();

  // Update cart on storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
      updateCartBadge();
    }
  });
});
