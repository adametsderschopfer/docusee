document.addEventListener('DOMContentLoaded', () => {
  ;(() => {
      const search = document.querySelector('.js-search');
      const content = document.querySelector('.js-search-content');

      if (!search || !content) return;

      search.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          
        }
      })
  })();

  ;(() => {
      const menuBtn = document.querySelector('.js-menu-btn');
      const menu = document.querySelector('.js-menu');
      
      if (!menu) reutrn;
      menu.style.display = "block";
      menuBtn.addEventListener('click', () => {
        const isActive = !menu.classList.contains('active');
        menu.classList[isActive ? 'add' : 'remove']('active');
      })
  })();
})