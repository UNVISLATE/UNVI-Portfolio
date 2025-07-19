// Animate sections on scroll
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.content-block');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});
  