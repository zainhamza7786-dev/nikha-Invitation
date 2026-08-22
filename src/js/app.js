(function () {
  function setText(elementId, value) {
    const node = document.getElementById(elementId);
    if (node) {
      node.textContent = value || '';
    }
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
    const hero = document.querySelector('.hero');
    if (hero) {
      const backgroundUrl = design.background || 'images/creative-arabic-calligraphy-ashraf-masculine-260nw-1846598230.jpg.webp';
      hero.style.background = `linear-gradient(rgba(5, 15, 12, 0.45), rgba(5, 15, 12, 0.7)), url('${backgroundUrl}') center/cover no-repeat`;
    }

    document.body.dataset.design = config.design || 'burgundy-floral';
    document.documentElement.style.setProperty('--theme-accent', design.accent || '#c6a15b');
    document.documentElement.style.setProperty('--theme-surface', design.surface || '#071611');
    document.documentElement.style.setProperty('--theme-text', design.text || '#f7f0df');
  }

  function bindMusic(config) {
    const audio = document.getElementById('weddingMusic');
    const musicButton = document.getElementById('musicButton');

    if (!audio) {
      return;
    }

    if (config.music) {
      audio.innerHTML = `<source src="${config.music}" type="audio/mpeg">`;
      audio.load();
    }

    if (musicButton && !config.music) {
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

    setText('openingTitle', `${config.groom} & ${config.bride}`);
    setText('groomName', config.groom);
    setText('brideName', config.bride);
    setText('inviteGroom', config.groom);
    setText('inviteBride', config.bride);
    setText('displayDate', formatLocalDate(config.date || config.nikahDate));
    setText('displayHijri', formatHijri(config.date || config.nikahDate));
    setText('displayTime', new Date(config.date || config.nikahDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setText('displayVenue', config.venue);
    setText('displayAddress', config.address);

    const mapButton = document.getElementById('mapBtn');
    if (mapButton) {
      mapButton.href = config.googleMapsUrl || '#';
      mapButton.setAttribute('aria-label', 'Open location in Google Maps');
    }

    const rsvpButton = document.getElementById('rsvpBtn');
    if (rsvpButton) {
      const message = `Assalamu Alaikum,\n\nI would be honoured to attend the Nikah of ${config.groom} & ${config.bride}.\n\nInshaAllah, I will be there.`;
      rsvpButton.href = makeWhatsappUrl(config.whatsappNumberClean || config.whatsappNumber, message);
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

    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
