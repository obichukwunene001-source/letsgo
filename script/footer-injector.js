// Footer Injector - Injects footer and modals into all pages
(function() {
  const footerHTML = `
    <footer class="site-footer site-footer-modern">
      <div class="container footer-top">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo" aria-label="emmy — Home">
              <img src="images/foot.png" alt="emmy logo" />
            </a>
            <p class="brand-desc">
              Faith-inspired fashion for everyday wear. shop curated collections
              made with care.
            </p>
            <!-- Mobile-only: footer links (will be shown only on small screens to swap positions) -->
            <nav
              class="footer-links-mobile"
              aria-label="Footer navigation (mobile)"
            >
              <div class="col">
                <h4>SHOP</h4>
                <ul>
                  <li><a href="shop.html">All products</a></li>
                  <li>
                    <a href="shop.html?category=best-sellers">Best sellers</a>
                  </li>
                </ul>
              </div>
              <div class="col">
                <h4>COMPANY</h4>
                <ul>
                  <li><a href="#" class="js-about-link">About us</a></li>
                </ul>
              </div>
              <div class="col">
                <h4>SUPPORT</h4>
                <ul>
                  <li><a href="faq.html">FAQs</a></li>
                </ul>
              </div>
            </nav>

            <div class="footer-socials">
              <a
                class="social instagram"
                href="https://www.instagram.com/followgod.ng"
                aria-label="instagram"
                data-tooltip="Instagram"
              >
                <lottie-player
                  src="media%20icons/instagram%20(1).json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              </a>
              <a
                class="social tiktok"
                href="https://www.tiktok.com/@intro840?_r=1&_t=ZS-91ziswsgTLx"
                aria-label="tiktok"
                data-tooltip="TikTok"
              >
                <lottie-player
                  src="media%20icons/tiktok.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              </a>
              <a
                class="social snapchat"
                href="https://www.snapchat.com/add/nnebue2021?share_id=7YnRKIgbTnG3P9AJCCfNVQ&locale=en_001@rg=ngzzzz"
                aria-label="snapchat"
                data-tooltip="Snapchat"
              >
                <img
                  src="media%20icons/snapchat.svg"
                  alt="Snapchat"
                  width="36"
                  height="36"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          <nav class="footer-links" aria-label="Footer navigation">
            <div class="col">
              <h4>SHOP</h4>
              <ul>
                <li><a href="shop.html">All products</a></li>
                <li>
                  <a href="shop.html?category=best-sellers">Best sellers</a>
                </li>
              </ul>
            </div>
            <div class="col">
              <h4>COMPANY</h4>
              <ul>
                <li><a href="#" class="js-about-link">About us</a></li>
              </ul>
            </div>

            <div class="col">
              <h4>SUPPORT</h4>
              <ul>
                <li><a href="faq.html">FAQs</a></li>
              </ul>
            </div>
          </nav>

          <div class="footer-newsletter">
            <h4>STAY IN TOUCH</h4>
            <p class="small">Sign up for exclusive offers and new drops.</p>
            <form
              class="newsletter-form"
              action="#"
              method="post"
              onsubmit="event.preventDefault();"
            >
              <label for="newsletter-email" class="visually-hidden"
                >Email</label
              >
              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <button class="btn btn-subscribe" type="submit">Subscribe</button>
            </form>
            <div class="footer-contact">
              <div class="contact-item">
                <span class="icon">📍</span><span>Online store</span>
              </div>
              <div class="contact-item">
                <span class="icon">✉️</span
                ><a
                  href="mailto:followgodng01@gmail.com?subject=Reaching%20out%20from%20Follow%20God%20website&body=Reaching%20out%20from%20Follow%20God%20website"
                  style="text-transform: lowercase"
                  >followgodng01@gmail.com</a
                >
              </div>
              <div class="contact-item">
                <span class="icon">📞</span
                ><a href="tel:+2349031161058">+2349031161058</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="site-footer-bottom">
        <div class="container narrow bottom-inner">
          <nav class="footer-meta" aria-label="Footer links">
            <a href="javascript:void(0)" class="js-terms-link">Terms</a>
            <a href="javascript:void(0)" class="js-privacy-link">Privacy</a>
            <a href="javascript:void(0)" class="js-returns-link">Returns</a>
          </nav>
          <div class="copyright">
            &copy; FOLLOW GOD — <span class="year">2025</span>
          </div>
          <div class="made-with">
            Built with - <span class="byund"><img src="online/drone.svg" alt="Byund drone" class="byund-logo" /> Byund Technologies</span>
            <a class="reach-us-btn" href="https://wa.me/2349162919586?text=Good%20day%2C%20reaching%20out%20from%20web" aria-label="Open WhatsApp chat with +2349162919586" target="_blank" rel="noopener">Reach Us</a>
          </div>
        </div>
      </div>
    </footer>
    <!-- About company modal (hidden by default) -->
    <div
      id="aboutModal"
      class="app-modal hidden"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="aboutModalTitle"
    >
      <div class="modal-surface" role="document">
        <button class="modal-close" aria-label="Close about dialog">×</button>
        <header class="modal-head">
          <h2 id="aboutModalTitle">About FOLLOW GOD</h2>
        </header>
        <div class="modal-body">
          <p class="lead">
            <strong>Welcome to FOLLOW GOD</strong>, where faith meets fashion.
            We're a faith inspired apparel brand dedicated to creating high
            quality, thoughtfully designed pieces that celebrate purpose,
            identity, and self expression.
          </p>

          <p>
            Every collection we create is crafted with care and intention. From
            bold statement hoodies to timeless essentials, we prioritize
            <strong>ethical sourcing</strong>,
            <strong>transparent craftsmanship</strong>, and
            <strong>honest communication</strong>. We believe that fashion
            should uplift and inspire your community, and that's exactly what
            we're building here.
          </p>

          <p>
            Our vision is simple: create collections that resonate with people
            who value quality, meaning, and purpose in what they wear. We source
            responsibly, design thoughtfully, and craft every piece to last,
            because true style is timeless.
          </p>

          <p>
            <strong>Thank you</strong> for supporting our mission. Your trust
            helps us continue to grow, innovate, and serve a community that
            values more than just fashion.
          </p>

          <p>
            <strong>Questions? Let's connect.</strong><br />
            Email:
            <a href="mailto:followgodng01@gmail.com?subject=Reaching%20out%20from%20Follow%20God%20website&body=Reaching%20out%20from%20Follow%20God%20website">followgodng01@gmail.com</a
            ><br />
            Phone: <a href="tel:+2349162919586">+2349162919586</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Terms modal -->
    <div
      id="termsModal"
      class="app-modal hidden"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="termsModalTitle"
    >
      <div class="modal-surface" role="document">
        <button class="modal-close" aria-label="Close terms dialog">×</button>
        <header class="modal-head">
          <h2 id="termsModalTitle">Terms of Service</h2>
        </header>
        <div class="modal-body">
          <p class="lead">
            <strong>1. Agreement to Terms</strong><br />By accessing and using
            the FOLLOW GOD website and services, you accept and agree to be
            bound by the terms and provision of this agreement. If you do not
            agree to abide by the above, please do not use this service.
          </p>

          <p>
            <strong>2. Use License</strong><br />Permission is granted to
            temporarily download one copy of the materials (information or
            software) on our website for personal, non-commercial transitory
            viewing only. This is the grant of a license, not a transfer of
            title, and under this license you may not: modify or copy the
            materials; use the materials for any commercial purpose or for any
            public display; attempt to decompile, disassemble, or reverse
            engineer any software contained on the website; remove any copyright
            or other proprietary notations; or transfer the materials to another
            person or "mirror" the materials on any other server.
          </p>

          <p>
            <strong>3. Disclaimer</strong><br />The materials on our website are
            provided "as is". We make no warranties, expressed or implied, and
            hereby disclaim and negate all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>

          <p>
            <strong>4. Limitations</strong><br />In no event shall FOLLOW GOD or
            its suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business
            interruption) arising out of the use or inability to use the
            materials on our website, even if we or our authorized
            representative has been notified orally or in writing of the
            possibility of such damage.
          </p>

          <p>
            <strong>5. Accuracy of Materials</strong><br />The materials
            appearing on our website could include technical, typographical, or
            photographic errors. We do not warrant that any of the materials on
            our website are accurate, complete, or current. We may make changes
            to the materials contained on our website at any time without
            notice.
          </p>

          <p>
            <strong>6. Links</strong><br />We have not reviewed all of the sites
            linked to our website and are not responsible for the contents of
            any such linked site. The inclusion of any link does not imply
            endorsement by us of the site. Use of any such linked website is at
            the user's own risk.
          </p>
        </div>
      </div>
    </div>

    <!-- Privacy modal -->
    <div
      id="privacyModal"
      class="app-modal hidden"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="privacyModalTitle"
    >
      <div class="modal-surface" role="document">
        <button class="modal-close" aria-label="Close privacy dialog">×</button>
        <header class="modal-head">
          <h2 id="privacyModalTitle">Privacy Policy</h2>
        </header>
        <div class="modal-body">
          <p class="lead">
            <strong>1. Introduction</strong><br />FOLLOW GOD ("we", "our", or
            "us") operates the website. This page informs you of our policies
            regarding the collection, use, and disclosure of personal data when
            you use our service and the choices you have associated with that
            data.
          </p>

          <p>
            <strong>2. Information Collection and Use</strong><br />We collect
            several different types of information for various purposes to
            provide and improve our service to you.
          </p>

          <p>
            <strong>Types of Data Collected:</strong><br />• Personal Data:
            While using our service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you ("Personal Data"). This may include, but is not limited
            to: Email address, First name and last name, Phone number, Address,
            State, Province, ZIP/Postal code, City, Cookies and Usage Data.
          </p>

          <p>
            <strong>Usage Data:</strong><br />We may also collect information
            about how the service is accessed and used ("Usage Data"). This may
            include information such as your computer's IP address, browser
            type, browser version, pages you visit, the time and date of your
            visit, the time spent on those pages, and other diagnostic data.
          </p>

          <p>
            <strong>3. Use of Data</strong><br />FOLLOW GOD uses the collected
            data for various purposes: to provide and maintain our service, to
            notify you about changes to our service, to allow you to participate
            in interactive features of our service, to provide customer support,
            to gather analysis or valuable information so we can improve our
            service, to monitor the usage of our service, and to detect, prevent
            and address technical issues.
          </p>

          <p>
            <strong>4. Security of Data</strong><br />The security of your data
            is important to us but remember that no method of transmission over
            the Internet or method of electronic storage is 100% secure. While
            we strive to use commercially acceptable means to protect your
            Personal Data, we cannot guarantee its absolute security.
          </p>
        </div>
      </div>
    </div>

    <!-- Returns modal -->
    <div
      id="returnsModal"
      class="app-modal hidden"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="returnsModalTitle"
    >
      <div class="modal-surface" role="document">
        <button class="modal-close" aria-label="Close returns dialog">×</button>
        <header class="modal-head">
          <h2 id="returnsModalTitle">Returns & Refunds</h2>
        </header>
        <div class="modal-body">
          <p class="lead">
            <strong>1. Return Period</strong><br />Customers may return items
            within 14 days of purchase. Items must be unworn, unwashed, and in
            original packaging with all tags attached. After 14 days from the
            date of purchase, no returns will be accepted.
          </p>

          <p>
            <strong>2. Return Process</strong><br />To initiate a return,
            contact us at
            <a href="mailto:followgodng01@gmail.com?subject=Reaching%20out%20from%20Follow%20God%20website&body=Reaching%20out%20from%20Follow%20God%20website">followgodng01@gmail.com</a>
            with your order number and reason for return. We will provide you
            with return shipping instructions. Please note that customers are
            responsible for return shipping costs unless the return is due to a
            defect or our error.
          </p>

          <p>
            <strong>3. Inspection & Refunds</strong><br />Once we receive your
            return, we will inspect the item(s) within 5-7 business days. If
            approved, we will process your refund within 10 business days.
            Refunds will be issued to the original payment method.
          </p>

          <p>
            <strong>4. Non-Returnable Items</strong><br />Items marked as
            clearance or final sale cannot be returned. Undergarments and
            swimwear that have been tried on are not returnable for hygiene
            reasons.
          </p>

          <p>
            <strong>5. Defects & Damage</strong><br />If you receive a damaged
            or defective item, please contact us immediately with photos. We
            will replace the item or issue a full refund at no cost to you,
            including return shipping.
          </p>

          <p>
            <strong>6. Contact Us</strong><br />For any questions about our
            returns policy, please reach out to us at
            <a href="mailto:followgodng01@gmail.com?subject=Reaching%20out%20from%20Follow%20God%20website&body=Reaching%20out%20from%20Follow%20God%20website">followgodng01@gmail.com</a>
            or call <a href="tel:+2349162919586">+2349162919586</a>.
          </p>
        </div>
      </div>
    </div>
  `;

  // Function to inject footer into body
  function injectFooter() {
    // Check if footer already exists
    if (document.querySelector('.site-footer.site-footer-modern')) {
      return; // Footer already exists, don't inject
    }

    // Create temporary container to parse HTML string
    const temp = document.createElement('div');
    temp.innerHTML = footerHTML;

    // Insert footer and modals before closing body tag
    while (temp.firstChild) {
      document.body.appendChild(temp.firstChild);
    }

    // Initialize modal functionality
    setupModals();

    // Update year in copyright
    const yearSpan = document.querySelector('.site-footer.site-footer-modern .year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
    // Add floating WhatsApp button markup (global)
    // Only add the fallback floating WhatsApp button if neither the
    // `.floating-whatsapp` already exists nor the `whatsapp-float.js` script
    // is included on this page. We check for the script tag because the
    // dedicated float widget (`whatsapp-float.js`) may be deferred; the
    // element `.whatsapp-float` won't be present until DOMContentLoaded,
    // but the presence of the script tag indicates that it'll be injected
    // and we should avoid adding a duplicate.
    const whatsappFloatScriptTag = document.querySelector('script[src$="whatsapp-float.js"]');
    if (!document.querySelector('.floating-whatsapp') && !whatsappFloatScriptTag) {
      const waBtn = document.createElement('a');
      waBtn.className = 'floating-whatsapp';
      // Fallback href so the button still works if JS is disabled — open WhatsApp Web in a new tab
      waBtn.href = 'https://web.whatsapp.com/send?phone=2349031161058&text=Contacting%20from%20website%20%40followgod';
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
      waBtn.setAttribute('aria-label', 'Chat with us on WhatsApp Web');
      waBtn.setAttribute('title', 'Chat with us on WhatsApp Web');
      waBtn.innerHTML = '<img src="icons/whatsapp.svg" alt="WhatsApp" width="28" height="28" />';
      document.body.appendChild(waBtn);
      try{
        const css = `@media (max-width:680px){ .floating-whatsapp{display:none !important;} }`;
        const s = document.createElement('style'); s.textContent = css; document.body.appendChild(s);
      }catch(e){}
    }
    // Setup click handler for the floating WhatsApp button
    try{ setupFloatingWhatsApp(); }catch(e){ /* noop */ }
    // Setup mail link behavior: mobile -> mail app (mailto:), desktop -> Gmail web
    try{ setupMailLinks(); }catch(e){ /* noop */ }
  }

  // Modal functionality
  function setupModals() {
    const modals = {
      aboutModal: document.getElementById('aboutModal'),
      termsModal: document.getElementById('termsModal'),
      privacyModal: document.getElementById('privacyModal'),
      returnsModal: document.getElementById('returnsModal')
    };

    const triggers = {
      aboutModal: '.js-about-link',
      termsModal: '.js-terms-link',
      privacyModal: '.js-privacy-link',
      returnsModal: '.js-returns-link'
    };

    let savedScrollPosition = 0;

    // Open modal function
    function openModal(modal) {
      savedScrollPosition = window.scrollY;
      try{ document.body.dataset.scrollY = String(savedScrollPosition); }catch(e){}
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }

    // Close modal function
    function closeModal(modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      // Allow `index.js` global watcher to restore scroll position if available.
      // As a fallback, perform a direct restoration here without smooth scrolling.
      try{
        if(!document.body.dataset.scrollY){
          window.scrollTo({ top: savedScrollPosition, left: 0, behavior: 'auto' });
        }
      }catch(e){
        try{ window.scrollTo(0, savedScrollPosition); }catch(e){}
      }
    }

    // Setup trigger listeners
    Object.entries(triggers).forEach(([modalId, selector]) => {
      const modal = modals[modalId];
      if (!modal) return;

      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        // Use capture phase (true) to intercept before other handlers
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          openModal(modal);
        }, true);
      });

      // Close button
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
      }

      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal(modal);
        }
      });
    });
  }
  // Configure footer email links to open mail app on mobile or Gmail web on desktop
  function setupMailLinks(){
    function isMobileDevice(){
      try{
        if(navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean'){
          return navigator.userAgentData.mobile;
        }
      }catch(e){}
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
    }

    var email = 'followgodng01@gmail.com';
    var subject = 'Inquiry from shopfollowgod.com';
    var body = "Good day sir/ma'm, reaching out from shopfollowgod.com website.";
    var mailto = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    var gmail = 'https://mail.google.com/mail/u/0/?fs=1&to=' + encodeURIComponent(email) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    var links = document.querySelectorAll('a[href*="followgodng01@gmail.com"]');
    if(!links || !links.length) return;
    links.forEach(function(link){
      // Prevent duplicate handlers
      if(link.dataset.mailHandlerAttached === '1') return;
      link.dataset.mailHandlerAttached = '1';

      link.addEventListener('click', function(e){
        var mobile = isMobileDevice();
        if(mobile){
          // open native mail app via mailto
          e.preventDefault();
          window.location.href = mailto;
        } else {
          // open Gmail web in a new tab
          e.preventDefault();
          window.open(gmail, '_blank');
        }
      });
    });
  }

  // Setup floating WhatsApp click handler
  function setupFloatingWhatsApp() {
    const wa = document.querySelector('.floating-whatsapp');
    if(!wa) return;
    // Attach basic click behavior
    wa.addEventListener('click', function(e){
      // If we are dragging (pointerdown + movement), ignore the click
      if (wa.dataset.dragging === 'true') { wa.dataset.dragging = 'false'; return; }
      e.preventDefault();
      const number = '2349031161058';
      let message = 'Contacting from website @followgod';
      // Use the pre-existing build message function if provided on a page (checkout)
      try{
        if (typeof window.buildWhatsappOrderMessage === 'function'){
          message = window.buildWhatsappOrderMessage();
        } else if (typeof window.OPEN_WHATSAPP_MESSAGE === 'string'){
          message = window.OPEN_WHATSAPP_MESSAGE;
        }
      }catch(err){ /* ignore */ }
      // Prefer a global helper if available, else open robustly here
      try{ if(typeof window.openWhatsAppChat === 'function') return window.openWhatsAppChat(number, message); }catch(e){}
      // Robust open: try native app on mobile, fallback to wa.me, open web on desktop
      try{
        const encoded = encodeURIComponent(message || '');
        const waScheme = `whatsapp://send?phone=${number}&text=${encoded}`;
        const waMe = `https://wa.me/${number}?text=${encoded}`;
        const webWa = `https://web.whatsapp.com/send?phone=${number}&text=${encoded}`;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
        if(isMobile){
          window.location.href = waScheme;
          setTimeout(function(){ try{ window.location.href = waMe; }catch(_){} }, 1200);
        } else {
          try{ window.open(webWa, '_blank', 'noopener'); }catch(err){ window.open(waMe, '_blank', 'noopener'); }
        }
      }catch(err){
        try{ window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(message), '_blank'); }catch(e){}
      }
    });

    // --- Make WA button draggable using Pointer Events (mouse + touch) ---
    // Persist position in localStorage under key 'floating_wa_pos'
    const storageKey = 'floating_wa_pos';
    const doc = document.documentElement || document.body;
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0, pointerId = null;

    function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

    function setPositionFromObject(pos){
      if(!pos) return;
      // Use absolute left/top and remove right/bottom to ensure left/top takes effect
      wa.style.right = 'auto';
      wa.style.bottom = 'auto';
      wa.style.left = pos.left + 'px';
      wa.style.top = pos.top + 'px';
    }

    // Restore position if saved
    try{
      const saved = localStorage.getItem(storageKey);
      if(saved){
        const obj = JSON.parse(saved);
        setPositionFromObject(obj);
      }
    }catch(e){ /* ignore corrupted storage */ }

    // Reset to default position and clear stored position
    function resetFloatingPosition(){
      wa.style.left = '';
      wa.style.top = '';
      wa.style.right = '';
      wa.style.bottom = '';
      localStorage.removeItem(storageKey);
    }

    // Helper: persist current left/top values
    function persistPosition(){
      try{
        const rect = wa.getBoundingClientRect();
        const pos = { left: Math.round(rect.left), top: Math.round(rect.top) };
        localStorage.setItem(storageKey, JSON.stringify(pos));
      }catch(e){ /* ignore */ }
    }

    // When pointer down, start capture
    wa.addEventListener('pointerdown', function(e){
      // Only primary button
      if(e.button && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      wa.setPointerCapture(pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const rect = wa.getBoundingClientRect();
      // Ensure we are positioned via left/top to allow movement
      // Convert to left/top if currently right/bottom anchored
      if(getComputedStyle(wa).right && getComputedStyle(wa).right !== 'auto'){
        // convert to left by taking rect.left
        wa.style.left = rect.left + 'px';
        wa.style.right = 'auto';
      }
      if(getComputedStyle(wa).bottom && getComputedStyle(wa).bottom !== 'auto'){
        wa.style.top = rect.top + 'px';
        wa.style.bottom = 'auto';
      }
      startLeft = parseInt(wa.style.left || wa.getBoundingClientRect().left, 10);
      startTop = parseInt(wa.style.top || wa.getBoundingClientRect().top, 10);
      wa.classList.add('dragging');
      wa.setAttribute('aria-grabbed', 'true');
    });

    // Track movement
    wa.addEventListener('pointermove', function(e){
      if(!dragging || e.pointerId !== pointerId) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      // Clamp within the viewport
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const rect = wa.getBoundingClientRect();
      const w = rect.width; const h = rect.height;
      const minGap = 8;
      newLeft = clamp(newLeft, minGap, ww - w - minGap);
      newTop = clamp(newTop, minGap, wh - h - minGap);
      wa.style.left = newLeft + 'px';
      wa.style.top = newTop + 'px';
      // mark as dragging to suppress click event after movement
      wa.dataset.dragging = 'true';
    });

    // End drag
    function endDrag(e){
      if(!dragging) return; dragging = false;
      try{ wa.releasePointerCapture(pointerId); }catch(e){}
      pointerId = null;
      wa.classList.remove('dragging');
      wa.setAttribute('aria-grabbed', 'false');
      persistPosition();
    }
    wa.addEventListener('pointerup', endDrag);
    wa.addEventListener('pointercancel', endDrag);

    // Ensure persisted position stays within viewport on resize
    window.addEventListener('resize', function(){
      try{
        const saved = localStorage.getItem(storageKey);
        if(!saved) return;
        const obj = JSON.parse(saved);
        const ww = window.innerWidth; const wh = window.innerHeight;
        const rect = wa.getBoundingClientRect();
        const w = rect.width; const h = rect.height;
        const minGap = 8;
        let left = clamp(obj.left, minGap, ww - w - minGap);
        let top = clamp(obj.top, minGap, wh - h - minGap);
        setPositionFromObject({ left, top });
        persistPosition();
      }catch(e){ /* ignore */ }
    });

    // Double-click resets position to default
    wa.addEventListener('dblclick', function(e){
      e.preventDefault(); resetFloatingPosition();
    });
  }
  // Ensure floating whatsapp is set up after injection
  // We attach this to the public api and call after DOM load: the injector calls it.
  window.__setupFloatingWhatsApp = setupFloatingWhatsApp;

  // Inject footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }

  // Admin trigger - hidden admin link (triple-click logo in footer)
  let logoClickCount = 0;
  let logoClickTimeout;

  document.addEventListener('click', (e) => {
    // Check if clicked on footer logo
    const footerLogo = e.target.closest('.site-footer .logo img');
    
    if (footerLogo) {
      logoClickCount++;
      clearTimeout(logoClickTimeout);

      if (logoClickCount === 3) {
        // Show admin access message and redirect after 1 second
        console.log('%cAdmin Access Detected', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
        window.location.href = 'admin-login.html';
        logoClickCount = 0;
      } else {
        // Reset counter after 1 second
        logoClickTimeout = setTimeout(() => {
          logoClickCount = 0;
        }, 1000);
      }
    }
  });
})();
