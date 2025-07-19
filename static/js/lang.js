document.addEventListener('DOMContentLoaded', async () => {
  const langButtons = document.querySelectorAll('#lang-toggle');
  const defaultLang = 'EN_en';
  const currentLang = localStorage.getItem('lang') || defaultLang;

  async function applyLang(lang) {
    try {
      const [defaultModule, servicesModule] = await Promise.all([
        import('./lang/default.js'),
        import('./lang/services.js'),
      ]);

      await Promise.all([
        defaultModule.apply(lang),
        servicesModule.apply(lang),
      ]);

      const nextLang = lang === 'EN_en' ? 'RU_ru' : 'EN_en';
      langButtons.forEach(btn => btn.setAttribute('lang-data', nextLang));

      localStorage.setItem('lang', lang);
    } catch (err) {
      console.error('[lang.js] Failed to apply language modules:', err);
    }
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.getAttribute('lang-data');
      applyLang(newLang);
    });
  });

  applyLang(currentLang);
});
