window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.gallery = function (entries, container, asset) {
  if (!container || !Array.isArray(entries) || !entries.length) return 0;
  entries.forEach((entry, index) => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = asset ? asset(entry) : entry;
    image.alt = `Wedding memory ${index + 1}`;
    image.loading = 'lazy';
    image.onerror = () => figure.remove();
    figure.appendChild(image);
    container.appendChild(figure);
  });
  return entries.length;
};
