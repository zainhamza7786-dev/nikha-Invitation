export function renderGallery(gallery) {
    return gallery.map((image, index) => `<figure class="gallery-card" data-reveal><img src="${image}" alt="Memory ${index + 1}" loading="lazy"></figure>`).join('');
}
