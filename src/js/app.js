(function () {
  function setText(elementId, value) {
    const node = document.getElementById(elementId);
    if (node) {
      node.textContent = value || '';
    }
  }

  function capitalizeName(value) {
    return String(value || '').trim().toLocaleLowerCase().replace(/(^|[\s-])([^\s-])/g, (match, separator, initial) => separator + initial.toLocaleUpperCase());
  }

  function formatLocalDate(iso) {
    try {
      const value = new Date(iso);
      if (Number.isNaN(value.getTime())) {
        return '[DATE]';
      }
      return value.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '[DATE]';
    }
  }

  function formatHijri(iso) {
    try {
      const value = new Date(iso);
      if (Number.isNaN(value.getTime())) {
        return '[HIJRI DATE]';
      }
      return new Intl.DateTimeFormat('en-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(value);
    } catch (error) {
      return '[HIJRI DATE]';
    }
  }

  function makeWhatsappUrl(number, message) {
    const base = `https://wa.me/${String(number || '').replace(/\D/g, '')}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  function setGallery(entries) {
    const galleryContainer = document.querySelector('.gallery');
    if (!galleryContainer) {
      return;
    }

    galleryContainer.innerHTML = '';

    entries.forEach((src) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      const image = document.createElement('img');
      image.src = src;
      image.alt = 'Wedding memory';
      image.loading = 'lazy';

      item.appendChild(image);
      galleryContainer.appendChild(item);
    });
  }

  function applyDesign(config) {
    const design = config.designConfig || {};
    const backgroundUrl = (config.background && config.background.image) || design.background || '';
    const backgroundOverlay = design.heroOverlay || (config.background && config.background.overlay) || 'rgba(5, 15, 12, 0.45)';
    const backgroundPosition = (config.background && config.background.position) || 'center center';
    const backgroundSize = (config.background && config.background.size) || 'cover';
    const hero = document.querySelector('.hero');
    if (hero) {
      if (!backgroundUrl) {
        console.warn('Invitation background is not configured; keeping the neutral page background.');
      }
      hero.style.background = backgroundUrl
        ? `linear-gradient(${backgroundOverlay}, ${backgroundOverlay}), url('${backgroundUrl}') ${backgroundPosition}/${backgroundSize} no-repeat`
        : 'none';
    }

    document.body.dataset.design = config.design || 'burgundy-floral';
    document.documentElement.style.setProperty('--theme-accent', design.accent || '#c6a15b');
    document.documentElement.style.setProperty('--theme-surface', design.surface || '#071611');
    document.documentElement.style.setProperty('--theme-text', design.text || '#f7f0df');
    document.documentElement.style.setProperty('--invitation-background-image', backgroundUrl ? `url("${backgroundUrl}")` : 'none');
    document.documentElement.style.setProperty('--invitation-background-position', (config.background && config.background.position) || 'center center');
    document.documentElement.style.setProperty('--invitation-background-size', (config.background && config.background.size) || 'cover');
    document.documentElement.style.setProperty('--invitation-background-opacity', String(config.background && typeof config.background.opacity === 'number' ? config.background.opacity : 1));
  }

  function bindMusic(config) {
    const audio = document.getElementById('weddingMusic');
    const musicButton = document.getElementById('musicButton');

    if (!audio) {
      return;
    }

    const musicSource = typeof config.music === 'object' ? config.music.src : config.music;
    if (musicSource) {
      audio.innerHTML = `<source src="${musicSource}" type="audio/mpeg">`;
      audio.load();
    }

    if (musicButton && (!musicSource || (typeof config.music === 'object' && config.music.enabled === false))) {
      musicButton.style.display = 'none';
    }
  }

  function initializeCountdown(isoDate) {
    const nikahDate = new Date(isoDate).getTime();

    function updateCountdown() {
      const now = Date.now();
      const distance = nikahDate - now;
      const container = document.querySelector('.countdown');
      if (!container) {
        return;
      }

      if (distance <= 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 30px; font-family: ' + "'Cormorant Garamond', serif" + '; color: #f3e7ca; font-size: 1.4rem;">Today is the day. Alhamdulillah.</div>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setText('days', String(days).padStart(2, '0'));
      setText('hours', String(hours).padStart(2, '0'));
      setText('minutes', String(minutes).padStart(2, '0'));
      setText('seconds', String(seconds).padStart(2, '0'));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function openInvitation() {
    const opening = document.getElementById('opening');
    if (opening) {
      opening.classList.add('hide');
    }
    document.body.style.overflow = 'auto';

    const music = document.getElementById('weddingMusic');
    if (music && music.querySelector('source')) {
      music.play().then(() => {
        const button = document.getElementById('musicButton');
        if (button) {
          button.innerHTML = '❚❚';
        }
      }).catch(() => {});
    }
  }

  function toggleMusic() {
    const music = document.getElementById('weddingMusic');
    const button = document.getElementById('musicButton');
    if (!music || !music.querySelector('source')) {
      alert('No music file found. Add the wedding song to enable background music.');
      return;
    }

    if (music.paused) {
      music.play().catch(() => {});
      if (button) {
        button.innerHTML = '❚❚';
      }
    } else {
      music.pause();
      if (button) {
        button.innerHTML = '♪';
      }
    }
  }

  async function init() {
    const config = await window.InvitationConfig.loadInvitationConfig();
    const isRootPage = !window.location.pathname.includes('/templates/');
    const templateEntry = config.templateConfig && config.templateConfig.entry;
    if (isRootPage && config.template && config.template !== 'legacy-invitation' && templateEntry) {
      window.location.replace(`${templateEntry}${window.location.search}`);
      return;
    }
    const groom = capitalizeName(config.groom);
    const bride = capitalizeName(config.bride);
    const coupleName = groom && bride ? `${groom} & ${bride}` : groom || bride;
    document.title = coupleName === '&' ? 'Nikah Invitation' : `${coupleName} | Nikah Invitation`;
    const description = document.querySelector('meta[name="description"]');
    const socialTitle = document.querySelector('meta[property="og:title"]');
    if (description) description.content = coupleName === '&' ? 'A digital Nikah invitation' : `Nikah Invitation of ${coupleName}`;
    if (socialTitle) socialTitle.content = document.title;

    setText('openingTitle', coupleName);
    setText('groomName', groom);
    setText('brideName', bride);
    setText('inviteGroom', groom);
    setText('inviteBride', bride);
    setText('displayDate', formatLocalDate(config.date || config.nikahDate));
    setText('displayHijri', formatHijri(config.date || config.nikahDate));
    setText('displayTime', new Date(config.date || config.nikahDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setText('displayVenue', typeof config.venue === 'object' ? config.venue.name : config.venue);
    setText('displayAddress', typeof config.venue === 'object' ? config.venue.address : config.address);

    const mapButton = document.getElementById('mapBtn');
    if (mapButton) {
      if (config.googleMapsUrl) {
        mapButton.href = config.googleMapsUrl;
      } else {
        mapButton.style.display = 'none';
      }
      mapButton.setAttribute('aria-label', 'Open location in Google Maps');
    }

    const rsvpButton = document.getElementById('rsvpBtn');
    if (rsvpButton) {
      const whatsappNumber = config.whatsappNumberClean || config.whatsappNumber;
      if (!whatsappNumber || (config.rsvp && config.rsvp.enabled === false)) {
        rsvpButton.style.display = 'none';
      } else {
        const message = `Assalamu Alaikum,\n\nI would be honoured to attend the Nikah of ${groom} & ${bride}.\n\nInshaAllah, I will be there.`;
        rsvpButton.href = makeWhatsappUrl(whatsappNumber, message);
      }
      rsvpButton.setAttribute('aria-label', 'RSVP on WhatsApp');
    }

    setGallery(config.gallery);
    applyDesign(config);
    bindMusic(config);

    const eventDateValue = config.date || config.nikahDate;
    if (eventDateValue) {
      initializeCountdown(eventDateValue);
    }

    const openingButton = document.querySelector('.open-btn');
    if (openingButton) {
      openingButton.onclick = openInvitation;
    }

    const musicButton = document.getElementById('musicButton');
    if (musicButton) {
      musicButton.onclick = toggleMusic;
    }

    const scrollCue = document.getElementById('scrollCue');
    const invitationSection = document.querySelector('.invitation');
    const welcomePopup = document.getElementById('welcomePopup');
    const welcomePopupClose = document.getElementById('welcomePopupClose');
    let welcomePopupTimer;
    const closeWelcomePopup = () => {
      if (!welcomePopup) return;
      welcomePopup.classList.remove('visible');
      welcomePopup.setAttribute('aria-hidden', 'true');
      window.clearTimeout(welcomePopupTimer);
    };
    const showWelcomePopup = () => {
      if (!welcomePopup) return;
      welcomePopup.classList.add('visible');
      welcomePopup.setAttribute('aria-hidden', 'false');
      window.clearTimeout(welcomePopupTimer);
      welcomePopupTimer = window.setTimeout(closeWelcomePopup, 3500);
    };
    if (welcomePopupClose) {
      welcomePopupClose.onclick = closeWelcomePopup;
    }
    if (scrollCue && invitationSection) {
      scrollCue.onclick = () => {
        invitationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showWelcomePopup();
      };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
