window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.maps = function (url, label = 'Get directions') {
  if (!url) return null;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = label;
  link.className = 'button';
  return link;
};
