export function setupMusic(config) {
    if (!config.music) {
        document.querySelector('[data-music-toggle]')?.remove();
        return;
    }
    const audio = document.querySelector('#wedding-music');
    const button = document.querySelector('[data-music-toggle]');
    audio.src = config.music;
    audio.addEventListener('error', () => button.remove(), { once: true });
    button.addEventListener('click', async () => {
        try {
            if (audio.paused) {
                await audio.play();
                button.textContent = 'Pause music';
                button.setAttribute('aria-label', 'Pause music');
            } else {
                audio.pause();
                button.textContent = 'Play music';
                button.setAttribute('aria-label', 'Play music');
            }
        } catch {
            button.remove();
        }
    });
}
