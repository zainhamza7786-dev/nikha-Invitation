import { getEventDate } from './config.js';

export function startCountdown(config, target) {
    const eventDate = getEventDate(config).getTime();
    const update = () => {
        const distance = eventDate - Date.now();
        if (distance <= 0) {
            target.innerHTML = '<p class="countdown-message">Today is the day. Alhamdulillah.</p>';
            return;
        }
        const values = {
            days: Math.floor(distance / 86400000),
            hours: Math.floor(distance / 3600000) % 24,
            minutes: Math.floor(distance / 60000) % 60,
            seconds: Math.floor(distance / 1000) % 60
        };
        target.querySelectorAll('[data-countdown]').forEach((element) => {
            element.textContent = String(values[element.dataset.countdown]).padStart(2, '0');
        });
    };
    update();
    return window.setInterval(update, 1000);
}
