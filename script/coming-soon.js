(function(){
  function initComingSoon(){
    const modal = document.getElementById('comingSoonModal');
    const closeBtn = modal ? modal.querySelector('#closeComingSoon') : null;
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;

    function showModal(){
      if(!modal) return;
      modal.setAttribute('aria-hidden','false');
      modal.classList.add('show');
      document.body.classList.add('no-scroll');
      try{ (modal.querySelector('#closeComingSoon') || modal).focus(); }catch(e){}
    }
    function hideModal(){
      if(!modal) return;
      modal.setAttribute('aria-hidden','true');
      modal.classList.remove('show');
      document.body.classList.remove('no-scroll');
    }

    if(closeBtn) closeBtn.addEventListener('click', hideModal);
    if(overlay) overlay.addEventListener('click', hideModal);
    if(modal) modal.addEventListener('keydown', function(e){ if(e.key === 'Escape') hideModal(); });

    // Attach click handlers to all collections links; show modal on click for both mobile and desktop
    document.querySelectorAll('.collections-link').forEach(link => {
      link.addEventListener('click', function(e){
        e.preventDefault();
        // Close mobile menu if open
        try{ document.querySelector('#mobileMenu')?.classList.remove('open'); }catch(e){}
        showModal();
        return;
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initComingSoon);
  } else {
    initComingSoon();
  }
})();
