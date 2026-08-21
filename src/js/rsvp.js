export function setupRsvp(config) {
    const button = document.querySelector('[data-rsvp]');
    if (!config.whatsappNumber) {
        button.hidden = true;
        return;
    }
    const message = `Assalamu Alaikum, I would be honoured to attend the Nikah of ${config.groom} & ${config.bride}. InshaAllah, I will be there.`;
    button.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
