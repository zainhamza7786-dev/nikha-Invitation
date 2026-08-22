window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.rsvp = function (config, button, values) {
  if (!config || config.enabled === false || !button) return false;
  const url = window.InvitationEngine.whatsapp(config.whatsappNumber, config.message, values);
  if (!url) return false;
  button.href = url;
  return true;
};
