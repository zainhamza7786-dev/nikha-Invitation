(function () {
  const root = document.documentElement;

  const byId = (id) => document.getElementById(id);

  const text = (id, value) => {
    const node = byId(id);
    if (node) node.textContent = value || '';
  };

  const hide = (id) => {
    const node = byId(id);
    if (node) node.hidden = true;
  };

  const asset = (path) =>
    path ? new URL(`../../${path}`, document.baseURI).toString() : '';


  /* =========================================================
     NAME FORMATTING
     ========================================================= */

  function capitalizeName(value) {
    return String(value || '')
      .trim()
      .toLocaleLowerCase()
      .replace(
        /(^|[\s-])([^\s-])/g,
        (match, separator, initial) =>
          separator + initial.toLocaleUpperCase()
      );
  }


  /* =========================================================
     DATE / TIME HELPERS
     ========================================================= */

  function validDate(value) {
    const date = new Date(value);

    return value && !Number.isNaN(date.getTime())
      ? date
      : null;
  }

  function formatDate(value) {
    const date = validDate(value);

    return date
      ? date.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';
  }

  function formatTime(value) {
    const date = validDate(value);

    return date
      ? date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : '';
  }


  /* =========================================================
     COUPLE
     ========================================================= */

  function renderCouple(config) {
    const couple = config.couple || {};

    const groomData = couple.groom || {};
    const brideData = couple.bride || {};

    const groom = capitalizeName(groomData.name);
    const bride = capitalizeName(brideData.name);

    const formattedCouple = `${groom} & ${bride}`;

    /*
     * Keep all names data-driven.
     * The configuration remains the source of truth.
     */
    text('openingCouple', formattedCouple);
    text('groomName', groom);
    text('brideName', bride);
    text('footerCouple', formattedCouple);

    document.title = `${formattedCouple} | Nikah Invitation`;
  }


  /* =========================================================
     HERO
     ========================================================= */

  function renderHero(config) {
    const invitation = config.invitation || {};
    const couple = config.couple || {};

    const groomName = couple.groom?.name || '';
    const brideName = couple.bride?.name || '';

    text(
      'heroEyebrow',
      invitation.eyebrow || 'With the blessings of Allah'
    );

    text(
      'heroArabic',
      invitation.arabicText ||
        'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا'
    );

    text(
      'heroTranslation',
      invitation.englishTranslation ||
        'In the Name of Allah, the Most Gracious, the Most Merciful'
    );

    text(
      'heroSubtitle',
      invitation.subtitle || 'A Nikah Invitation'
    );

    text(
      'heroJourney',
      invitation.journeyText ||
        'Are beginning a beautiful journey together'
    );

    text(
      'openingArabic',
      invitation.arabicText ||
        'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ'
    );

    text(
      'openingTranslation',
      invitation.englishTranslation ||
        'In the Name of Allah, the Most Gracious, the Most Merciful'
    );

    text(
      'openingSubtitle',
      invitation.subtitle || 'A Nikah Invitation'
    );

    text(
      'bismillah',
      invitation.arabicText ||
        'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ'
    );

    text(
      'invitationText',
      invitation.message ||
        `Together with their families, ${groomName} and ${brideName} joyfully invite you to join them as they begin their journey through the blessed bond of Nikah.`
    );
  }


  /* =========================================================
     DUA
     ========================================================= */

  function renderDua(config) {
    const dua = config.dua || {};

    if (!dua.arabic && !dua.translation && !dua.title) {
      hide('duaSection');
      return;
    }

    text(
      'duaTitle',
      dua.title || 'May Allah Bless This Union'
    );

    text(
      'duaArabic',
      dua.arabic || ''
    );

    text(
      'duaTranslation',
      dua.translation || ''
    );
  }


  /* =========================================================
     BACKGROUND
     ========================================================= */

  function renderBackground(config) {
    const background = config.background || {};
    const image = background.image || '';

    root.style.setProperty(
      '--background-overlay',
      background.overlay || 'rgba(36, 27, 22, .18)'
    );

    root.style.setProperty(
      '--background-position',
      background.position || 'center center'
    );

    root.style.setProperty(
      '--background-size',
      background.size || 'cover'
    );

    root.style.setProperty(
      '--background-opacity',
      String(
        typeof background.opacity === 'number'
          ? background.opacity
          : 1
      )
    );

    if (!image) {
      console.warn(
        'Nikah calligraphy background is not configured; using neutral paper background.'
      );
      return;
    }

    const probe = new Image();

    probe.onload = () => {
      root.style.setProperty(
        '--background-image',
        `url("${asset(image).replace(/"/g, '%22')}")`
      );
    };

    probe.onerror = () => {
      console.warn(
        'Nikah calligraphy background could not be loaded:',
        image
      );
    };

    probe.src = asset(image);
  }


  /* =========================================================
     EVENTS
     ========================================================= */

  function renderEvents(config) {
    const events = Array.isArray(config.events)
      ? config.events
      : [];

    const grid = byId('eventsGrid');

    if (!grid || events.length === 0) {
      hide('eventsSection');
      return;
    }

    events.forEach((event) => {
      const card = document.createElement('article');
      card.className = 'event-card';

      const title = document.createElement('h3');
      title.textContent = event.title || 'Celebration';

      card.appendChild(title);

      [
        [
          'Date',
          event.date
            ? formatDate(event.date) || event.date
            : ''
        ],
        [
          'Time',
          event.time || formatTime(event.date) || ''
        ],
        [
          'Venue',
          event.venue || ''
        ],
        [
          'Address',
          event.address || ''
        ]
      ].forEach(([label, value]) => {
        if (!value) return;

        const paragraph = document.createElement('p');
        paragraph.textContent = `${label}: ${value}`;

        card.appendChild(paragraph);
      });

      if (event.mapsUrl) {
        const link = document.createElement('a');

        link.className = 'button';
        link.href = event.mapsUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Get directions';

        card.appendChild(link);
      }

      grid.appendChild(card);
    });
  }


  /* =========================================================
     COUNTDOWN
     ========================================================= */

  function renderCountdown(config) {
    const section = byId('countdownSection');

    const wedding = config.wedding || {};

    const target = validDate(
      wedding.date || config.date
    );

    if (!target) {
      console.warn(
        'Countdown hidden because the wedding date is missing or invalid.'
      );

      hide('countdownSection');
      return;
    }

    if (
      window.InvitationEngine &&
      window.InvitationEngine.countdown
    ) {
      const stop =
        window.InvitationEngine.countdown(
          target.toISOString(),
          (values) => {
            ['days', 'hours', 'minutes', 'seconds']
              .forEach((id) => {
                text(
                  id,
                  String(values[id]).padStart(2, '0')
                );
              });
          }
        );

      if (section) {
        section.hidden = false;
      }

      return stop;
    }

    const update = () => {
      const distance = Math.max(
        0,
        target.getTime() - Date.now()
      );

      const values = [
        Math.floor(distance / 86400000),
        Math.floor(distance / 3600000) % 24,
        Math.floor(distance / 60000) % 60,
        Math.floor(distance / 1000) % 60
      ];

      [
        'days',
        'hours',
        'minutes',
        'seconds'
      ].forEach((id, index) => {
        text(
          id,
          String(values[index]).padStart(2, '0')
        );
      });
    };

    if (section) {
      section.hidden = false;
    }

    update();

    window.setInterval(update, 1000);
  }


  /* =========================================================
     VENUE
     ========================================================= */

  function renderVenue(config) {
    const venue = config.venue || {};

    const source =
      venue.name ||
      config.venue ||
      '';

    const address =
      venue.address ||
      config.address ||
      '';

    const mapsUrl =
      venue.mapsUrl ||
      config.googleMapsUrl ||
      '';

    if (!source && !address) {
      return;
    }

    const eventGrid = byId('eventsGrid');

    if (
      Array.isArray(config.events) &&
      config.events.length
    ) {
      return;
    }

    if (!eventGrid) {
      return;
    }

    const card = document.createElement('article');
    card.className = 'event-card';

    const title = document.createElement('h3');
    title.textContent = 'Venue';

    card.appendChild(title);

    if (source) {
      const paragraph = document.createElement('p');
      paragraph.textContent = source;
      card.appendChild(paragraph);
    }

    if (address) {
      const paragraph = document.createElement('p');
      paragraph.textContent = address;
      card.appendChild(paragraph);
    }

    if (mapsUrl) {
      const link = document.createElement('a');

      link.className = 'button';
      link.href = mapsUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Get directions';

      card.appendChild(link);
    }

    eventGrid.appendChild(card);

    const eventsSection = byId('eventsSection');

    if (eventsSection) {
      eventsSection.hidden = false;
    }
  }


  /* =========================================================
     GALLERY
     ========================================================= */

  function renderGallery(config) {
    const gallery = Array.isArray(config.gallery)
      ? config.gallery
      : [];

    const container = byId('gallery');

    if (!container || gallery.length === 0) {
      hide('gallerySection');
      return;
    }

    gallery.forEach((src, index) => {
      const figure = document.createElement('figure');

      const image = document.createElement('img');

      image.src = asset(src);
      image.alt = `Wedding memory ${index + 1}`;
      image.loading = 'lazy';

      image.onerror = () => {
        figure.remove();

        if (!container.children.length) {
          hide('gallerySection');
        }
      };

      figure.appendChild(image);
      container.appendChild(figure);
    });
  }


  /* =========================================================
     RSVP / WHATSAPP
     ========================================================= */

  function renderRsvp(config) {
    const rsvp = config.rsvp || {};

    const number = String(
      rsvp.whatsappNumber ||
      config.whatsappNumber ||
      ''
    ).replace(/\D/g, '');

    const button = byId('rsvpButton');

    if (!rsvp.enabled || !number || !button) {
      hide('rsvpButton');
      return;
    }

    const couple = config.couple || {};

    const groomName =
      couple.groom?.name || '';

    const brideName =
      couple.bride?.name || '';

    const message =
      rsvp.message ||
      `Assalamu Alaikum, I would be honoured to attend the Nikah of ${groomName} & ${brideName}.`;

    const firstEvent =
      Array.isArray(config.events)
        ? config.events[0]
        : null;

    button.href =
      window.InvitationEngine &&
      window.InvitationEngine.whatsapp
        ? window.InvitationEngine.whatsapp(
            number,
            message,
            {
              bride: brideName,
              groom: groomName,
              date:
                (firstEvent && firstEvent.date) ||
                (config.wedding &&
                  config.wedding.date),
              event:
                (firstEvent &&
                  firstEvent.title) ||
                ''
            }
          )
        : `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    text(
      'rsvpText',
      'Your presence, prayers and blessings will make this occasion even more meaningful for us.'
    );
  }


  /* =========================================================
     MUSIC
     ========================================================= */

  function initializeMusic(config) {
    const music = config.music || {};

    const audio = byId('weddingMusic');
    const button = byId('musicButton');

    if (
      !music.enabled ||
      !music.src ||
      !audio ||
      !button
    ) {
      hide('musicButton');
      return;
    }

    audio.src = asset(music.src);

    audio.addEventListener(
      'error',
      () => {
        console.warn(
          'Invitation music could not be loaded:',
          music.src
        );

        hide('musicButton');
      },
      { once: true }
    );

    button.addEventListener('click', () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            button.textContent = '||';
          })
          .catch(() => {});
      } else {
        audio.pause();
        button.textContent = '♪';
      }
    });

    const openInvitation = byId('openInvitation');

    if (openInvitation) {
      openInvitation.addEventListener(
        'click',
        () => {
          audio
            .play()
            .then(() => {
              button.textContent = '||';
            })
            .catch(() => {});
        },
        { once: true }
      );
    }
  }


  /* =========================================================
     WELCOME POPUP
     ========================================================= */

  function initializeWelcomePopup() {
    const popup = byId('welcomePopup');
    const closePopupButton =
      byId('welcomePopupClose');

    if (!popup) {
      return;
    }

    let popupTimer = null;

    function hidePopup() {
      if (!popup) return;

      popup.classList.remove('visible');
      popup.classList.remove('is-visible');

      popup.setAttribute(
        'aria-hidden',
        'true'
      );

      if (popupTimer) {
        window.clearTimeout(popupTimer);
        popupTimer = null;
      }
    }

    function showPopup() {
      if (!popup) return;

      if (popupTimer) {
        window.clearTimeout(popupTimer);
      }

      /*
       * Keep both class names supported.
       * This makes the popup work with either the
       * existing .visible CSS or the new .is-visible CSS.
       */
      popup.classList.add('visible');
      popup.classList.add('is-visible');

      popup.setAttribute(
        'aria-hidden',
        'false'
      );

      popupTimer = window.setTimeout(() => {
        hidePopup();
      }, 3500);
    }

    if (closePopupButton) {
      closePopupButton.addEventListener(
        'click',
        hidePopup
      );
    }

    return {
      show: showPopup,
      hide: hidePopup
    };
  }


  /* =========================================================
     SCROLL TO DISCOVER
     ========================================================= */

  function initializeScrollToDiscover(
    welcomePopup
  ) {
    const scrollCue = byId('scrollCue');
    const nextSection =
      byId('invitationSection');

    if (!scrollCue || !nextSection) {
      console.warn(
        'Scroll to discover could not be initialized because the required elements are missing.'
      );

      return;
    }

    scrollCue.addEventListener('click', () => {
      /*
       * First move to the actual next invitation section.
       * No page reload and no URL modification.
       */
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      /*
       * Show the existing welcome popup after
       * initiating the scroll.
       */
      if (
        welcomePopup &&
        typeof welcomePopup.show === 'function'
      ) {
        welcomePopup.show();
      }
    });
  }


  /* =========================================================
     OPEN INVITATION / HERO ANIMATIONS
     ========================================================= */

  function initializeAnimations() {
    const opening = byId('opening');
    const openInvitation =
      byId('openInvitation');

    if (openInvitation) {
      openInvitation.addEventListener(
        'click',
        () => {
          if (opening) {
            opening.classList.add('is-hidden');
          }

          document.body.style.overflow = 'auto';
        }
      );
    }

    /*
     * Initialize popup exactly once.
     */
    const welcomePopup =
      initializeWelcomePopup();

    /*
     * Initialize scroll navigation exactly once.
     */
    initializeScrollToDiscover(
      welcomePopup
    );
  }


  /* =========================================================
     LOAD INVITATION
     ========================================================= */

  async function loadInvitation() {
    try {
      if (
        !window.InvitationConfig ||
        typeof window.InvitationConfig.loadInvitationConfig !==
          'function'
      ) {
        throw new Error(
          'InvitationConfig.loadInvitationConfig is not available.'
        );
      }

      const config =
        await window.InvitationConfig.loadInvitationConfig();

      /*
       * Existing rendering pipeline.
       * No existing sections/functionality removed.
       */
      renderCouple(config);

      renderHero(config);

      renderDua(config);

      renderBackground(config);

      renderEvents(config);

      renderVenue(config);

      renderCountdown(config);

      renderGallery(config);

      renderRsvp(config);

      initializeMusic(config);

      initializeAnimations();

    } catch (error) {
      console.error(
        'Nikah calligraphy template could not initialize:',
        error
      );

      document.body.style.overflow = 'auto';

      const opening = byId('opening');

      if (opening) {
        opening.classList.add('is-hidden');
      }
    }
  }


  /* =========================================================
     START
     ========================================================= */

  document.addEventListener(
    'DOMContentLoaded',
    loadInvitation
  );

})();