export function renderFooter(config) {
    return `<footer><p class="footer-script">${config.groom} <span>&amp;</span> ${config.bride}</p><p class="muted-caps">With love, duas &amp; blessings · ${new Date().getFullYear()}</p></footer>`;
}
