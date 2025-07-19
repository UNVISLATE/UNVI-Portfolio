export async function apply(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => el.classList.add('i18n-loading'));

  let data;
  try {
    const response = await fetch(`/static/data/lang/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    data = await response.json();
    if (typeof data !== 'object') throw new Error('Invalid translation file structure');
  } catch (error) {
    console.error('[i18n] Failed to load lang JSON:', error);
    elements.forEach(el => el.classList.remove('i18n-loading'));
    return;
  }

  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translated = key.split('.').reduce((obj, i) => obj?.[i], data);
    if (typeof translated === 'string') {
      el.innerHTML = translated;
    }
    el.classList.remove('i18n-loading');
  });
}

// OLD CODE
/* document.addEventListener('DOMContentLoaded', () => {
  const supportedLangs = ['EN_en', 'RU_ru'];
  const defaultLang = 'EN_en';

  const langButtons = document.querySelectorAll('#lang-toggle');
  const i18nElements = document.querySelectorAll('[data-i18n]');
  let currentLang = localStorage.getItem('lang') || defaultLang;
  let hasRetried = false;

  function markLoading() {
    i18nElements.forEach(el => el.classList.add('i18n-loading'));
  }

  function clearLoading() {
    i18nElements.forEach(el => el.classList.remove('i18n-loading'));
  }

  function loadLang(lang) {
    markLoading();

    fetch(`/static/data/lang/${lang}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load JSON: ${lang}`);
        return res.json();
      })
      .then(data => {
        i18nElements.forEach(el => {
          const key = el.dataset.i18n;
          const value = key.split('.').reduce((o, i) => o?.[i], data);
          if (value !== undefined) el.innerHTML = value;
        });

        const nextLang = lang === 'EN_en' ? 'RU_ru' : 'EN_en';
        langButtons.forEach(btn => {
          btn.setAttribute('lang-data', nextLang);
          btn.innerHTML = data.header?.lang_toggle || nextLang;
        });

        localStorage.setItem('lang', lang);
        clearLoading();
        hasRetried = false;
      })
      .catch(err => {
        console.error("Error loading lang file:", err);

        if (!hasRetried && lang !== defaultLang) {
          console.warn(`Falling back to default language: ${defaultLang}`);
          hasRetried = true;
          loadLang(defaultLang);
        } else {
          clearLoading();
          console.error("Failed to load both current and default language files. No further attempts.");
        }
      });
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.getAttribute('lang-data');
      loadLang(newLang);
    });
  });

  loadLang(currentLang);
}); */