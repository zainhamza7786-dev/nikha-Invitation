window.InvitationEngine = window.InvitationEngine || {};
window.InvitationEngine.events = function (events, container, render) {
  if (!container || !Array.isArray(events) || !events.length) return 0;
  events.forEach((event, index) => render(event, container, index));
  return events.length;
};
