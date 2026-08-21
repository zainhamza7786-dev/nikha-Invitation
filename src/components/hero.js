export function renderHero(config) {
    return `<section class="hero" style="--hero-image: url('${config.background}')"><div class="hero-copy" data-reveal><p class="eyebrow">With the blessings of Allah</p><p class="arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p><p class="hero-script">${config.groom}</p><span class="ampersand">&amp;</span><p class="hero-script">${config.bride}</p><p class="hero-date">Together with their families, they invite you to celebrate</p><a class="scroll-cue" href="#invitation">Explore the invitation <span>↓</span></a></div></section>`;
}
