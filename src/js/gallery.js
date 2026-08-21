export function renderGallery(gallery) {
    return (gallery || []).map((image, index) => {
        const source = typeof image === 'string' ? image : image.src;
        const alt = typeof image === 'string' ? `Memory ${index + 1}` : image.alt || `Memory ${index + 1}`;
        return `<figure class="gallery-card" data-reveal><img src="${source}" alt="${alt}" loading="lazy"></figure>`;
    }).join('');
}
