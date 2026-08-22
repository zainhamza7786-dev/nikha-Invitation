(function () {
  const DEFAULT_CONFIG = {
    groom: '',
    bride: '',
    date: '2026-09-12',
    time: '7:00 PM After Isha',
    timezone: 'Asia/Kolkata',
    venue: 'SFS Banquet Hall',
    address: 'Karimnagar, Telangana, India',
    googleMapsUrl: 'https://maps.app.goo.gl/pkDhQxeR1qY8Ww8Q6?g_st=ic',
    whatsappNumber: '+918919997879',
    music: 'music/NikhaSong.mp3',
    design: 'burgundy-floral',
    gallery: []
  };

  function normalizeNumber(value) {
    if (!value) return '';
    return String(value).replace(/\D/g, '');
  }

  function normalizeGallery(gallery) {
    if (!Array.isArray(gallery)) {
      return [];
    }

    return gallery.map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      return item && item.src ? item.src : item && item.path ? item.path : '';
    }).filter(Boolean);
  }

  function normalizeBackground(weddingConfig, designConfig) {
    const configuredBackground = weddingConfig.background;
    const background = configuredBackground && typeof configuredBackground === 'object'
      ? configuredBackground
      : { image: configuredBackground || designConfig.background || '' };

    return {
      image: background.image || '',
      overlay: background.overlay || 'rgba(20, 15, 13, 0.18)',
      position: background.position || 'center center',
      size: background.size || 'cover',
      opacity: typeof background.opacity === 'number' ? background.opacity : 1
    };
  }

  function normalizeEvents(config) {
    if (Array.isArray(config.events)) {
      return config.events.filter((event) => event && typeof event === 'object');
    }

    if (!config.date && !config.venue && !config.address) {
      return [];
    }

    return [{
      title: 'Nikah Ceremony',
      date: config.date || '',
      time: config.time || '',
      venue: config.venue || '',
      address: config.address || '',
      mapsUrl: config.googleMapsUrl || ''
    }];
  }

  function normalizeConfig(weddingConfig, designConfig, designName) {
    const couple = weddingConfig.couple || {};
    const wedding = weddingConfig.wedding || {};
    const groomName = couple.groom && couple.groom.name || weddingConfig.groom || DEFAULT_CONFIG.groom;
    const brideName = couple.bride && couple.bride.name || weddingConfig.bride || DEFAULT_CONFIG.bride;
    const merged = {
      ...DEFAULT_CONFIG,
      ...weddingConfig,
      groom: groomName,
      bride: brideName,
      date: wedding.date || weddingConfig.date || DEFAULT_CONFIG.date,
      time: wedding.time || weddingConfig.time || DEFAULT_CONFIG.time,
      timezone: wedding.timezone || weddingConfig.timezone || DEFAULT_CONFIG.timezone,
      design: weddingConfig.design || weddingConfig.theme || designName || DEFAULT_CONFIG.design,
      gallery: normalizeGallery(weddingConfig.gallery),
      music: weddingConfig.music || DEFAULT_CONFIG.music,
      whatsappNumber: weddingConfig.whatsappNumber || '',
      googleMapsUrl: weddingConfig.googleMapsUrl || ''
    };
    const rsvp = weddingConfig.rsvp || {};
    const music = weddingConfig.music && typeof weddingConfig.music === 'object'
      ? weddingConfig.music
      : { enabled: Boolean(merged.music), src: merged.music };
    const venue = weddingConfig.venue && typeof weddingConfig.venue === 'object'
      ? weddingConfig.venue
      : { name: merged.venue, address: merged.address, mapsUrl: merged.googleMapsUrl };

    return {
      ...merged,
      couple: {
        bride: { ...(couple.bride || {}), name: brideName },
        groom: { ...(couple.groom || {}), name: groomName }
      },
      invitation: weddingConfig.invitation || {},
      wedding: { ...wedding, date: wedding.date || merged.date, timezone: wedding.timezone || merged.timezone },
      background: normalizeBackground(weddingConfig, designConfig),
      events: normalizeEvents({ ...merged, events: weddingConfig.events }),
      venue,
      rsvp: {
        enabled: rsvp.enabled !== false,
        whatsappNumber: rsvp.whatsappNumber || merged.whatsappNumber,
        message: rsvp.message || ''
      },
      music: {
        enabled: music.enabled !== false && Boolean(music.src || merged.music),
        src: music.src || ''
      },
      themeConfig: weddingConfig.themeConfig || weddingConfig.theme || {},
      designConfig,
      designName,
      whatsappNumberClean: normalizeNumber(rsvp.whatsappNumber || merged.whatsappNumber)
    };
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
      const configRoot = window.location.pathname.includes('/templates/') ? '../../' : '';
      const configUrl = (file) => new URL(configRoot + 'config/' + file, document.baseURI).toString();
      const invitationId = new URLSearchParams(window.location.search).get('invitation');
      const weddingFile = invitationId ? `invitations/${encodeURIComponent(invitationId)}.json` : 'wedding.json';
      const [weddingConfig, designRegistry, templateRegistry, themeRegistry] = await Promise.all([
        fetchJson(configUrl(weddingFile)),
        fetchJson(configUrl('designs.json')),
        fetchJson(configUrl('templates.json')),
        fetchJson(configUrl('themes.json'))
      ]);

      const registry = designRegistry && designRegistry.designs ? designRegistry.designs : {};
      const selectedDesignName = weddingConfig.design || weddingConfig.theme || designRegistry.defaultDesign || 'burgundy-floral';
      const selectedDesign = registry[selectedDesignName] || registry[designRegistry.defaultDesign] || {
        name: selectedDesignName,
        background: '',
        accent: '#c6a15b'
      };

      const templates = templateRegistry && templateRegistry.templates ? templateRegistry.templates : {};
      const themes = themeRegistry && themeRegistry.themes ? themeRegistry.themes : {};
      const selectedTemplateName = weddingConfig.template || templateRegistry.defaultTemplate || 'legacy-invitation';
      const selectedThemeName = weddingConfig.theme || themeRegistry.defaultTheme || selectedDesignName;

      return {
        ...normalizeConfig(weddingConfig, selectedDesign, selectedDesignName),
        template: selectedTemplateName,
        templateConfig: templates[selectedTemplateName] || templates[templateRegistry.defaultTemplate] || null,
        theme: selectedThemeName,
        themeConfig: themes[selectedThemeName] || themes[selectedDesignName] || null
      };
    } catch (error) {
      console.warn('Falling back from dynamic config because loading failed:', error);

      const fallbackDesign = {
        name: 'Burgundy Floral',
        background: '',
        accent: '#c6a15b'
      };

      return {
        ...DEFAULT_CONFIG,
        design: DEFAULT_CONFIG.design,
        music: DEFAULT_CONFIG.music,
        gallery: DEFAULT_CONFIG.gallery,
        background: { image: fallbackDesign.background, overlay: 'rgba(20, 15, 13, 0.18)', position: 'center center', size: 'cover', opacity: 1 },
        designConfig: fallbackDesign,
        designName: DEFAULT_CONFIG.design,
        whatsappNumberClean: normalizeNumber(DEFAULT_CONFIG.whatsappNumber),
        couple: { bride: { name: DEFAULT_CONFIG.bride }, groom: { name: DEFAULT_CONFIG.groom } },
        events: normalizeEvents(DEFAULT_CONFIG),
        rsvp: { enabled: true, whatsappNumber: DEFAULT_CONFIG.whatsappNumber, message: '' },
        music: { enabled: true, src: DEFAULT_CONFIG.music }
      };
    }
  }

  window.InvitationConfig = {
    loadInvitationConfig,
    normalizeNumber,
    normalizeGallery
  };
})();
