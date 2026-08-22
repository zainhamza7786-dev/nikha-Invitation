window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.music = function (config, audio, button) {
  if (!config || config.enabled === false || !config.src || !audio || !button) return false;
  audio.src = config.src;
  button.addEventListener('click', () => audio.paused ? audio.play() : audio.pause());
  return true;
};
