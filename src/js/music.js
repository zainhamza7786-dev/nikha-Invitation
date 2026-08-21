export function setupMusic(config) {
    if (!config.music) return;
    const audio = document.querySelector('#wedding-music');
    const button = document.querySelector('[data-music-toggle]');
    audio.src = config.music;
    button.addEventListener('click', async () => {
        if (audio.paused) {
            await audio.play();
            button.textContent = 'Pause music';
            button.setAttribute('aria-label', 'Pause music');
        } else {
            audio.pause();
            button.textContent = 'Play music';
            button.setAttribute('aria-label', 'Play music');
        }
    });
}
