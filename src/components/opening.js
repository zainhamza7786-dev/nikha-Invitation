export function renderOpening(config) {
    return `<div id="opening"><div class="opening-panel"><p class="arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p><p class="eyebrow">A blessed beginning</p><h1>${config.groom}<span>&amp;</span>${config.bride}</h1><p class="opening-subtitle">A Nikah invitation</p><button class="button button-primary" data-open>Open invitation</button></div></div>`;
}
