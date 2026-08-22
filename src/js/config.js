(function () {
  const DEFAULT_CONFIG = {
    groom: 'Ashraf Ali',
    bride: 'Zohra Firdous',
    date: '2026-09-12',
    time: '7:00 PM After Isha',
    timezone: 'Asia/Kolkata',
    venue: 'SFS Banquet Hall',
    address: 'Karimnagar, Telangana, India',
    googleMapsUrl: 'https://maps.app.goo.gl/pkDhQxeR1qY8Ww8Q6?g_st=ic',
    whatsappNumber: '+918919997879',
    music: 'music/NikhaSong.mp3',
    design: 'burgundy-floral',
    gallery: [
      'images/nikhatemplate.jpeg',
      'images/nikhatemplate.jpeg'
    ]
  };

  function normalizeNumber(value) {
    if (!value) return '';
    return String(value).replace(/\D/g, '');
  }

  function normalizeGallery(gallery) {
    if (!Array.isArray(gallery) || gallery.length === 0) {
      return DEFAULT_CONFIG.gallery;
    }

    return gallery.map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      return item && item.src ? item.src : item && item.path ? item.path : '';
    }).filter(Boolean);
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error('Unable to load ' + url + ': ' + response.status);
    }
    return response.json();
  }

  async function loadInvitationConfig() {
    try {
      const [weddingConfig, designRegistry] = await Promise.all([
        fetchJson('config/wedding.json'),
        fetchJson('config/designs.json')
      ]);

      const merged = {
        ...DEFAULT_CONFIG,
        ...weddingConfig,
        design: weddingConfig.design || weddingConfig.theme || designRegistry.defaultDesign || DEFAULT_CONFIG.design,
        gallery: normalizeGallery(weddingConfig.gallery || DEFAULT_CONFIG.gallery),
        music: weddingConfig.music || DEFAULT_CONFIG.music,
        whatsappNumber: weddingConfig.whatsappNumber || DEFAULT_CONFIG.whatsappNumber,
        googleMapsUrl: weddingConfig.googleMapsUrl || DEFAULT_CONFIG.googleMapsUrl
      };

      const registry = designRegistry && designRegistry.designs ? designRegistry.designs : {};
      const selectedDesignName = merged.design || designRegistry.defaultDesign || 'burgundy-floral';
      const selectedDesign = registry[selectedDesignName] || registry[designRegistry.defaultDesign] || {
        name: selectedDesignName,
        background: DEFAULT_CONFIG.gallery[0],
        accent: '#c6a15b'
      };

      return {
        ...merged,
        designConfig: selectedDesign,
        designName: selectedDesignName,
        whatsappNumberClean: normalizeNumber(merged.whatsappNumber)
      };
    } catch (error) {
      console.warn('Falling back from dynamic config because loading failed:', error);

      const fallbackDesign = {
        name: 'Burgundy Floral',
        background: DEFAULT_CONFIG.gallery[0],
        accent: '#c6a15b'
      };

      return {
        ...DEFAULT_CONFIG,
        design: DEFAULT_CONFIG.design,
        music: DEFAULT_CONFIG.music,
        gallery: DEFAULT_CONFIG.gallery,
        designConfig: fallbackDesign,
        designName: DEFAULT_CONFIG.design,
        whatsappNumberClean: normalizeNumber(DEFAULT_CONFIG.whatsappNumber)
      };
    }
  }

  window.InvitationConfig = {
    loadInvitationConfig,
    normalizeNumber,
    normalizeGallery
  };
})();
