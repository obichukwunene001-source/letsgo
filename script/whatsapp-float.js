(function(){
  'use strict';
  const phone = (function(){
    try{
      // Look for a meta tag or a script dataset override
      const el = document.querySelector('script[src$="whatsapp-float.js"]');
      if(el && el.dataset && el.dataset.phone) return el.dataset.phone.replace(/[^0-9]/g, '');
      const meta = document.querySelector('meta[name="whatsapp-phone"]');
      if(meta && meta.content) return meta.content.replace(/[^0-9]/g, '');
    }catch(e){}
    return '2349031161058';
  })();

  // Build markup
  const wrapper = document.createElement('div');
  wrapper.className = 'whatsapp-float';
  wrapper.setAttribute('aria-hidden','false');

  const link = document.createElement('a');
  link.className = 'whatsapp-float-btn';
  // Build a prefilled message matching footer behavior
  const defaultMessage = 'Contacting from website @followgod';
  const encodedMessage = encodeURIComponent(defaultMessage);
  const waMeHref = `https://wa.me/${phone}?text=${encodedMessage}`;
  // Put a sensible default href so right-click/new-tab works
  link.setAttribute('href', waMeHref);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('title', 'Chat with us on WhatsApp');
  link.setAttribute('aria-label', 'Chat with us on WhatsApp');

  const img = document.createElement('img');
  img.src = 'icons/whatsapp.svg';
  img.alt = 'WhatsApp';
  img.width = 28;
  img.height = 28;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = 'whatsapp-float-icon';

  link.appendChild(img);

  // Robust open behavior: prefer native app on mobile via whatsapp://, fallback to wa.me;
  // on desktop open web.whatsapp.com in a new tab immediately.
  function openWhatsAppFromFloat(e){
    try{
      e.preventDefault();
      const message = defaultMessage;
      const encoded = encodeURIComponent(message || '');
      const waScheme = `whatsapp://send?phone=${phone}&text=${encoded}`;
      const waMe = `https://wa.me/${phone}?text=${encoded}`;
      const webWa = `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
      
      if(isMobile){
        // Mobile: attempt native app then fallback to wa.me
        window.location.href = waScheme;
        setTimeout(function(){ try{ window.location.href = waMe; }catch(_){} }, 1200);
      } else {
        // Desktop: open WhatsApp Web immediately in a new tab
        window.open(webWa, '_blank', 'noopener');
      }
    }catch(err){
      try{ window.open(waMeHref, '_blank', 'noopener'); }catch(e){}
    }
  }

  link.addEventListener('click', openWhatsAppFromFloat);

  // Close (hide) control
  const closeBtn = document.createElement('button');
  closeBtn.className = 'whatsapp-float-close';
  closeBtn.setAttribute('type','button');
  closeBtn.setAttribute('aria-label', 'Close WhatsApp chat button');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', function(e){
    e.preventDefault();
    wrapper.style.display = 'none';
    try{ localStorage.setItem('whatsappFloatHidden', '1'); } catch(e){}
  });

  wrapper.appendChild(link);
  wrapper.appendChild(closeBtn);

  // Styles injected to keep everything self-contained
  const style = document.createElement('style');
  style.textContent = `
  .whatsapp-float{position:fixed; right:18px; bottom:20px; z-index:9999; display:flex; align-items:center; gap:8px; touch-action:none; -webkit-user-drag:none; user-select:none}
  .whatsapp-float-btn{display:inline-flex; align-items:center; justify-content:center; width:54px; height:54px; border-radius:999px; box-shadow:0 6px 22px rgba(8, 56, 30, 0.22); background:#25d366; border: none; padding:12px; transition:transform .12s ease, box-shadow .12s ease}
  .whatsapp-float-btn img{display:block; width:28px; height:28px}
  .whatsapp-float-btn:focus{outline:2px solid rgba(0,0,0,0.12); outline-offset:3px}
  .whatsapp-float-btn:hover{transform:translateY(-2px); box-shadow:0 8px 26px rgba(8, 56, 30, 0.3)}
  .whatsapp-float-close{display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:8px; background:rgba(0,0,0,0.08); border: none; color:#fff; font-size:16px; line-height:1; cursor:pointer}
  .whatsapp-float-close:focus{outline:2px solid rgba(0,0,0,0.12); outline-offset:3px}
  @media (max-width:680px){
    .whatsapp-float{right:12px; bottom:16px}
    .whatsapp-float-btn{width:48px; height:48px}
    .whatsapp-float-close{display:none}
  }
  `;

  // If user previously hid the float, do nothing
  try{
    if(localStorage.getItem('whatsappFloatHidden') === '1') return; 
  }catch(e){}

  document.addEventListener('DOMContentLoaded', function(){
    // Avoid injecting multiple buttons
    if(document.querySelector('.whatsapp-float')) return;

    // Remove any old fallback floating-whatsapp element inserted by footer-injector
    try{ const old = document.querySelector('.floating-whatsapp'); if(old) old.remove(); }catch(e){}
    document.body.appendChild(style);
    document.body.appendChild(wrapper);

    // --- Desktop-only WhatsApp floating button ---
    // Create separate desktop float that opens WhatsApp Web in new tab
    try{
      // Do not create desktop button if the mobile float is the only desired element
      const desktopWrapper = document.createElement('div');
      desktopWrapper.className = 'floating-whatsapp';
      desktopWrapper.setAttribute('aria-hidden','false');

      const desktopLink = document.createElement('a');
      desktopLink.className = 'floating-whatsapp-btn';
      // WhatsApp Web link (click opens a new tab)
      const webWaHref = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
      desktopLink.setAttribute('href', webWaHref);
      desktopLink.setAttribute('target', '_blank');
      desktopLink.setAttribute('rel', 'noopener noreferrer');
      desktopLink.setAttribute('title', 'Chat with us on WhatsApp Web');
      desktopLink.setAttribute('aria-label', 'Chat with us on WhatsApp Web');

      const desktopImg = document.createElement('img');
      desktopImg.src = 'icons/whatsapp.svg';
      desktopImg.alt = 'WhatsApp';
      desktopImg.width = 28; desktopImg.height = 28; desktopImg.loading = 'lazy'; desktopImg.decoding = 'async';
      desktopImg.className = 'whatsapp-float-icon';

      desktopLink.appendChild(desktopImg);
      desktopWrapper.appendChild(desktopLink);
      document.body.appendChild(desktopWrapper);

      // Desktop-specific style: show only on wider screens and position above mobile float
      const desktopCss = `
      .floating-whatsapp{position:fixed; right:18px; bottom:86px; z-index:9999; display:none; align-items:center; gap:8px}
      .floating-whatsapp .floating-whatsapp-btn{display:inline-flex; align-items:center; justify-content:center; width:54px; height:54px; border-radius:999px; box-shadow:0 6px 22px rgba(8, 56, 30, 0.22); background:#25d366; border: none; padding:12px}
      /* Show floating-wa only on desktop and hide mobile's whatsapp-float on desktop so they don't duplicate */
      @media (min-width:681px){
        .floating-whatsapp{display:flex !important}
        .whatsapp-float{display:none !important}
      }
      /* Hide desktop floating WA on small screens to avoid showing both */
      @media (max-width:680px){ .floating-whatsapp{display:none !important} }
      `;
      const desktopStyle = document.createElement('style');
      desktopStyle.textContent = desktopCss;
      document.body.appendChild(desktopStyle);

      // Click handler: open new tab for WhatsApp Web (preventDefault to avoid weird behavior)
      desktopLink.addEventListener('click', function(e){
        try{ e.preventDefault(); window.open(this.href, '_blank', 'noopener'); }catch(err){ window.location.href = this.href; }
      });
    }catch(err){ /* ignore */ }

    // Handle keyboard access: open on Enter/Space when focused
    link.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') {
        // Open link in new tab
        e.preventDefault();
        window.open(this.href, '_blank', 'noopener');
      }
    });

    // Draggable support (touch + pointer). Keep minimal behavior, don't persist position.
    (function enableDrag(){
      let dragging = false;
      let startX = 0, startY = 0;
      let origLeft = 0, origTop = 0;
      let moved = false;
      let suppressClick = false;

      const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

      function getEventPoint(e){
        if(e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if(e.clientX !== undefined) return { x: e.clientX, y: e.clientY };
        return { x: 0, y: 0 };
      }

      function start(e){
        try{
          const p = getEventPoint(e);
          const rect = wrapper.getBoundingClientRect();
          startX = p.x; startY = p.y;
          origLeft = rect.left; origTop = rect.top;
          dragging = true; moved = false;
          // Use pointer capture if available
          if(e.pointerId && wrapper.setPointerCapture) try{ wrapper.setPointerCapture(e.pointerId); }catch(er){}
          // Convert to explicit left/top so moving is predictable
          wrapper.style.left = origLeft + 'px';
          wrapper.style.top = origTop + 'px';
          wrapper.style.right = 'auto';
          wrapper.style.bottom = 'auto';
          // prevent accidental text selection while dragging
          e.preventDefault && e.preventDefault();
        }catch(err){ /* swallow */ }
      }

      let pendingRaf = false;
      let nextLeft = null, nextTop = null;
      function applyMove() {
        if(nextLeft === null || nextTop === null) { pendingRaf = false; return; }
        wrapper.style.left = nextLeft + 'px';
        wrapper.style.top = nextTop + 'px';
        pendingRaf = false;
      }
      function move(e){
        if(!dragging) return;
        const p = getEventPoint(e);
        const dx = p.x - startX; const dy = p.y - startY;
        if(!moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) moved = true;
        if(!moved) return; // don't jump position until intentional
        const elW = wrapper.offsetWidth; const elH = wrapper.offsetHeight;
        const minX = 4; const minY = 4;
        const maxX = window.innerWidth - elW - 4; const maxY = window.innerHeight - elH - 4;
        const newLeft = clamp(origLeft + dx, minX, maxX);
        const newTop = clamp(origTop + dy, minY, maxY);
        // schedule update via rAF to reduce layout thrashing for high-frequency pointer events
        nextLeft = newLeft; nextTop = newTop;
        if(!pendingRaf) { pendingRaf = true; requestAnimationFrame(applyMove); }
        e.preventDefault && e.preventDefault();
      }

      function end(e){
        if(!dragging) return;
        dragging = false;
        // Release pointer capture
        if(e.pointerId && wrapper.releasePointerCapture) try{ wrapper.releasePointerCapture(e.pointerId); }catch(er){}
        // If we moved, suppress the click that might follow
        if(moved){
          suppressClick = true;
          setTimeout(()=> suppressClick = false, 200);
        }
      }

      // Attach handlers: pointer events preferred
      if(window.PointerEvent){
        wrapper.addEventListener('pointerdown', start, { passive: false });
        window.addEventListener('pointermove', move, { passive: false });
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);
      } else {
        // Touch fallback
        wrapper.addEventListener('touchstart', start, { passive: false });
        wrapper.addEventListener('touchmove', move, { passive: false });
        wrapper.addEventListener('touchend', end);
        wrapper.addEventListener('touchcancel', end);
        // Mouse fallback too
        wrapper.addEventListener('mousedown', function(e){
          // left click only
          if(e.button !== 0) return;
          start(e);
          function mm(ev){ move(ev); }
          function mu(ev){ end(ev); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); }
          window.addEventListener('mousemove', mm, { passive: false });
          window.addEventListener('mouseup', mu);
        }, { passive: false });
      }

      // Prevent accidental click after drag
      link.addEventListener('click', function(e){ if(suppressClick) e.preventDefault(); });

      // Ensure the float remains in view on resize
      window.addEventListener('resize', function(){
        try{
          const rect = wrapper.getBoundingClientRect();
          const elW = rect.width; const elH = rect.height;
          const minX = 4; const minY = 4;
          const maxX = window.innerWidth - elW - 4; const maxY = window.innerHeight - elH - 4;
          let left = rect.left; let top = rect.top;
          if(left > maxX) left = maxX;
          if(top > maxY) top = maxY;
          if(left < minX) left = minX;
          if(top < minY) top = minY;
          wrapper.style.left = left + 'px'; wrapper.style.top = top + 'px';
          wrapper.style.right = 'auto'; wrapper.style.bottom = 'auto';
        }catch(er){}
      });
    })();
  });
})();
