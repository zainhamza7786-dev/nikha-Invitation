window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.validate = function (config) {
  const errors = [];
  if (!config || typeof config !== 'object') errors.push('Invitation data is missing.');
  if (config && !config.couple) errors.push('Couple data is missing.');
  if (config && config.events && !Array.isArray(config.events)) errors.push('Events must be an array.');
  if (config && config.gallery && !Array.isArray(config.gallery)) errors.push('Gallery must be an array.');
  errors.forEach((error) => console.warn('Invitation config:', error));
  return { valid: errors.length === 0, errors };
};
