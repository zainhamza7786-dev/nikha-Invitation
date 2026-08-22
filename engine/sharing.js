window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.share = function (data) {
  if (navigator.share) return navigator.share(data);
  return Promise.resolve(false);
};
