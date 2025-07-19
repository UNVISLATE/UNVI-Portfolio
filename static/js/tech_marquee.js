document.addEventListener('DOMContentLoaded', () => {
  fetch('/static/data/tech-stack.json')
    .then(response => response.json())
    .then(data => {
      initMarqueeLoop(data);
    });
});

function initMarqueeLoop(items) {
  const track = document.getElementById('tech-track');
  const container = track.parentElement;

  // Создаем DOM элементы
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'marquee-item';

    const img = document.createElement('img');
    img.src = item.logo;
    img.alt = item.text;

    const span = document.createElement('span');
    span.textContent = item.text;

    div.appendChild(img);
    div.appendChild(span);
    track.appendChild(div);
  });

  const trackWidth = track.scrollWidth;
  const containerWidth = container.offsetWidth;
  const speed = 100;

  function animate() {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      let offset = containerWidth - (elapsed / 1000) * speed;

      if (offset <= -trackWidth) {
        startTime = timestamp;
        offset = containerWidth;
      }

      track.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  animate();
}
