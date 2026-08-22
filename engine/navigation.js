window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.navigation = function (opening, openButton, content) {
  if (!opening || !openButton) return;
  openButton.addEventListener('click', () => {
    opening.classList.add('is-hidden');
    if (content) content.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'auto';
  });
};
