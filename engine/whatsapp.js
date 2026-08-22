window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.whatsapp = function (number, message, values) {
  const cleanNumber = String(number || '').replace(/\D/g, '');
  if (!cleanNumber) return '';
  const body = String(message || '').replace(/\{\{(bride|groom|date|event)\}\}/g, (match, key) => values && values[key] || '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(body)}`;
};
