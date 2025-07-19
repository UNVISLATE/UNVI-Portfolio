// add smooth scrolling to anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
  
        const targetID = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetID);
  
        if (targetEl) {
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });
    });
  });
  