window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.countdown = function (target, render) {
  const date = new Date(target);
  if (!target || Number.isNaN(date.getTime())) {
    console.warn('Countdown disabled: wedding date is missing or invalid.');
    return () => {};
  }
  const update = () => {
    const distance = Math.max(0, date.getTime() - Date.now());
    render({
      days: Math.floor(distance / 86400000),
      hours: Math.floor(distance / 3600000) % 24,
      minutes: Math.floor(distance / 60000) % 60,
      seconds: Math.floor(distance / 1000) % 60
    });
  };
  update();
  const timer = window.setInterval(update, 1000);
  return () => window.clearInterval(timer);
};
