const servicesContainer = document.querySelector('.services-list');

const SKELETON_COUNT = 3;

function showSkeletons() {
  servicesContainer.innerHTML = '';

  for (let i = 0; i < SKELETON_COUNT; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'service skeleton';
    skeleton.innerHTML = `
      <h3 class="skeleton-box" style="width: 60%; height: 1.5em;"></h3>
      <p class="skeleton-box" style="width: 80%; height: 1.3em;"></p>
      <div class="service-items">
        ${Array.from({ length: 5 }).map(() => `
          <div class="item">
            <div class="skeleton-icon"></div>
            <span class="skeleton-box" style="width: 60%; height: 1.2em;"></span>
          </div>
        `).join('')}
      </div>
      <div class="price">
        <p class="skeleton-box" style="width: 40%; height: 1.5em;"></p>
      </div>
      <div class="service-button">
        <div class="skeleton-box" style="width: 50%; height: 2.5em;"></div>
      </div>
    `;
    servicesContainer.appendChild(skeleton);
  }
}

function renderServices(services) {
  servicesContainer.innerHTML = '';

  services.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service';
    card.innerHTML = `
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-items">
        ${service.list.map(item => `
          <div class="item">
            <img src="/static/img/icons/done-ring.svg" alt="done">
            <span>${item}</span>
          </div>
        `).join('')}
      </div>
      <div class="price">
        <p>${service.price}</p>
      </div>
      <div class="service-button">
        <a href="#contacts">Contact Me</a>
      </div>
    `;
    servicesContainer.appendChild(card);
  });
}

export async function apply(lang) {
  showSkeletons();

  try {
    const response = await fetch(`/static/data/lang/services.${lang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const servicesData = await response.json();
    if (!Array.isArray(servicesData)) throw new Error('Invalid services data format');

    await new Promise(res => setTimeout(res, 400));

    renderServices(servicesData);
  } catch (error) {
    console.error('[lang/services.js] Failed to load or render services:', error);
    servicesContainer.innerHTML = '<p class="error">Ошибка загрузки услуг</p>';
  }
}
