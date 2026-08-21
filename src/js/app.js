import { loadConfig, getNames, getEventDate } from './config.js';
import { startCountdown } from './countdown.js';
import { setupMusic } from './music.js';
import { setupRsvp } from './rsvp.js';
import { setupAnimations } from './animations.js';
import { renderGallery } from './gallery.js';
import { renderOpening } from '../components/opening.js';
import { renderHero } from '../components/hero.js';
import { renderInvitation } from '../components/invitation.js';
import { renderEvents } from '../components/events.js';
import { renderDua } from '../components/dua.js';
import { renderRsvp } from '../components/rsvp.js';
import { renderFooter } from '../components/footer.js';

const app = document.querySelector('#app');

loadConfig().then((config) => {
    document.title = `${getNames(config)} | Nikah Invitation`;
    document.body.dataset.theme = config.theme;
    app.innerHTML = `${renderOpening(config)}<audio id="wedding-music" loop></audio><button class="music-toggle" data-music-toggle aria-label="Play music">Play music</button><main>${renderHero(config)}${renderInvitation(config)}<section class="countdown-section" data-reveal><div class="section-wrap"><p class="eyebrow">Counting the moments</p><h2>Until our Nikah</h2><div class="gold-rule"></div><div class="countdown" data-countdown-root><div><strong data-countdown="days">00</strong><span>Days</span></div><div><strong data-countdown="hours">00</strong><span>Hours</span></div><div><strong data-countdown="minutes">00</strong><span>Minutes</span></div><div><strong data-countdown="seconds">00</strong><span>Seconds</span></div></div></div></section>${renderEvents(config)}<section class="gallery-section" data-reveal><div class="section-wrap"><p class="eyebrow">Our moments</p><h2>A few memories</h2><div class="gold-rule"></div><div class="gallery">${renderGallery(config.gallery)}</div></div></section>${renderDua()}${renderRsvp(config)}</main>${renderFooter(config)}`;
    const opening = document.querySelector('#opening');
    document.querySelector('[data-open]').addEventListener('click', () => {
        opening.classList.add('is-hidden');
        document.body.classList.remove('is-locked');
        const audio = document.querySelector('#wedding-music');
        audio.play().catch(() => {});
    });
    const eventDate = getEventDate(config);
    document.querySelector('[data-date]').textContent = eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    setupMusic(config);
    setupRsvp(config);
    startCountdown(config, document.querySelector('[data-countdown-root]'));
    setupAnimations();
}).catch((error) => {
    app.innerHTML = `<main class="error-state"><h1>Invitation unavailable</h1><p>${error.message}</p></main>`;
});
