// script/image-preloader.js — Minimal preloader for images referenced with <link rel="preload"> or for "thumb" images
(function(){
  'use strict';
  function preloadUrls(urls){
    urls.forEach(u => {
      try{ const i = new Image(); i.decoding = 'async'; i.loading = 'eager'; i.src = u; }catch(e){}
    });
  }
  function run(){
    try{
      // Preload any link rel=preload as=image
      const links = Array.from(document.querySelectorAll('link[rel="preload"][as="image"]'));
      const urls = links.map(l => l.href).filter(Boolean);
      // Also find any .shop-grid img.thumb that appear in HTML and preload them
      const thumbs = Array.from(document.querySelectorAll('img.thumb'));
      thumbs.forEach(t => { const src = t.getAttribute('src'); if(src && !urls.includes(src)) urls.push(src); });
      if(urls.length) preloadUrls(urls);
    }catch(e){ /* ignore */ }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
