   const lightbox = document.getElementById('lightbox');
   const lightboxImg = document.getElementById('lightbox-img');

   if (lightbox) {
     document.querySelectorAll('.gallery img').forEach(img => {
       img.addEventListener('click', () => {
         lightboxImg.src = img.src;
         lightboxImg.alt = img.alt;
         lightbox.hidden = false;
       });
     });

     const close = () => { lightbox.hidden = true; };
     document.getElementById('lightbox-close').addEventListener('click', close);
     lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
     document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
   }