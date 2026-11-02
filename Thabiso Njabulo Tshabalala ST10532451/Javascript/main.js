// ===== Modal =====
const modal = document.getElementById('modal');
if (modal) {
    document.getElementById('open-modal').addEventListener('click', () => {
        modal.hidden = false;
    });
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.hidden = true;
    });
    modal.addEventListener('click', e  => { if (e.target === modal) modal.hidden = true; });
    document.addEventListener('keydown', e => { 
        if (e.key === 'Escape') modal.hidden = true; 

    });
}
   document.querySelectorAll('.faq details').forEach(item => {
     item.addEventListener('toggle', () => {
       if (item.open) {
         document.querySelectorAll('.faq details').forEach(other => {
           if (other !== item) other.open = false;
         });
       }
     });
   });