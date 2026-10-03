import { EVENT, REGISTRATIONS } from './event-config.js';
import { registrationState } from './registration.js';

function updateRegistration() {
  for (const control of document.querySelectorAll('[data-registration]')) {
    const state = registrationState(REGISTRATIONS[control.dataset.registration], EVENT.deadline);
    const disabled = control.querySelector('[data-registration-disabled]');
    const link = control.querySelector('[data-registration-link]');
    control.dataset.state = state.kind;
    disabled.querySelector('[data-registration-label]').textContent = state.label;
    if (state.url && ['announced', 'open'].includes(state.kind)) {
      link.href = state.url;
      link.hidden = false;
      disabled.hidden = true;
    } else {
      link.hidden = true;
      link.removeAttribute('href');
      disabled.hidden = false;
    }
  }
}
updateRegistration();
setInterval(updateRegistration, 30_000);
window.addEventListener('pageshow', updateRegistration);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateRegistration(); });

// Optional presentation loads only after the core announcement/deadline logic is running.
import('./motion.js').then(({ installMotion }) => installMotion()).catch(() => {
  document.documentElement.dataset.motion = 'unavailable';
});
