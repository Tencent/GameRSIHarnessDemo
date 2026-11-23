import { WalkthroughState } from './walkthrough-state.mjs';

const state = new WalkthroughState(window.GAMEPILOT_DEMOS);
const byId = id => document.getElementById(id);
const cases = [...document.querySelectorAll('[data-case]')];
let timer;
const text = (id, value) => { byId(id).textContent = value; };

function stop() {
  clearTimeout(timer);
  state.stop();
  text('walkthrough-play', 'Auto play');
  byId('walkthrough-play').setAttribute('aria-pressed', 'false');
}
function render() {
  const example = state.example, view = state.view;
  cases.forEach((button, index) => {
    button.setAttribute('aria-selected', String(index === state.caseIndex));
    button.tabIndex = index === state.caseIndex ? 0 : -1;
  });
  byId('walkthrough-example').setAttribute('aria-labelledby', `case-tab-${state.caseIndex}`);
  text('walkthrough-task-title', example.title);
  text('walkthrough-task-text', example.task);
  text('walkthrough-scope', example.scope);
  text('walkthrough-count', `View ${state.viewIndex + 1} of ${example.views.length}`);
  byId('walkthrough-progress').max = example.views.length;
  byId('walkthrough-progress').value = state.viewIndex + 1;
  const steps = example.views.map((item, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.id = `view-tab-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', 'walkthrough-view');
    button.setAttribute('aria-selected', String(index === state.viewIndex));
    button.tabIndex = index === state.viewIndex ? 0 : -1;
    button.dataset.view = index;
    const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, document.createTextNode(item.title));
    return button;
  });
  byId('walkthrough-steps').replaceChildren(...steps);
  byId('walkthrough-view').setAttribute('aria-labelledby', `view-tab-${state.viewIndex}`);
  text('walkthrough-step-label', `Recorded step ${view.step}`);
  text('walkthrough-view-number', String(state.viewIndex + 1).padStart(2, '0'));
  text('walkthrough-tag', view.tag);
  text('walkthrough-view-title', view.title);
  const img = byId('walkthrough-image');
  img.src = view.image; img.alt = view.caption;
  img.removeAttribute('width'); img.removeAttribute('height');
  const zoom = byId('walkthrough-image-button');
  zoom.dataset.demoImage = view.image;
  zoom.dataset.demoTitle = `${view.title} · recorded step ${view.step}`;
  zoom.setAttribute('aria-label', `Enlarge: ${view.title}`);
  text('walkthrough-image-caption', view.caption);
  text('walkthrough-summary', view.summary);
  text('walkthrough-cue', view.cue || 'Refer to the recorded observation at left.');
  const plan = view.decision.length ? view.decision : ['No separate planning note in this action record.'];
  byId('walkthrough-plan').replaceChildren(...plan.map(value => {
    const item = document.createElement('li'); item.textContent = value; return item;
  }));
  byId('walkthrough-action-heading').replaceChildren();
  const index = document.createElement('span'); index.textContent = '03';
  byId('walkthrough-action-heading').append(index, document.createTextNode(view.delegation ? ' Delegated objective' : ' Dispatched action'));
  text('walkthrough-action', view.delegation ? view.delegation.goal : view.action);
  text('walkthrough-action-note', view.delegation ? `Recorded delegation type: ${view.delegation.type}.` : 'Action string from the execution record.');
  text('walkthrough-context', example.scope + '. ' + (example.views.length === 1 ? 'The observation and its corresponding action are shown together.' : example.id === 'combat' ? 'The two frames are nonconsecutive. No encounter outcome is inferred from them.' : 'The views explain the same recorded decision, rather than successive gameplay steps.'));
  byId('walkthrough-prev').disabled = state.viewIndex === 0;
  byId('walkthrough-next').disabled = state.atEnd;
  text('walkthrough-next', state.atEnd ? 'End of example' : 'Next view →');
  byId('walkthrough-play').disabled = example.views.length < 2;
  byId('walkthrough-reset').disabled = example.views.length < 2;
  text('walkthrough-play', state.playing ? 'Pause' : 'Auto play');
  byId('walkthrough-play').setAttribute('aria-pressed', String(state.playing));
  text('walkthrough-announcement', `${example.label}. View ${state.viewIndex + 1} of ${example.views.length}: ${view.title}. Recorded step ${view.step}.`);
}
function schedule() {
  clearTimeout(timer);
  if (state.playing) timer = setTimeout(() => { state.next(); render(); schedule(); }, 6500);
}
function selectView(index, focus = false) {
  stop(); state.selectView(index); render();
  if (focus) byId(`view-tab-${state.viewIndex}`).focus();
}
function arrowIndex(event, index, length) {
  if (event.key === 'ArrowRight') return (index + 1) % length;
  if (event.key === 'ArrowLeft') return (index - 1 + length) % length;
  if (event.key === 'Home') return 0;
  if (event.key === 'End') return length - 1;
  return null;
}
cases.forEach((button, index) => {
  const choose = next => { stop(); state.selectCase(next); render(); };
  button.addEventListener('click', () => choose(index));
  button.addEventListener('keydown', event => {
    const next = arrowIndex(event, index, cases.length);
    if (next === null) return;
    event.preventDefault(); choose(next); cases[next].focus();
  });
});
byId('walkthrough-steps').addEventListener('click', event => {
  const button = event.target.closest('[data-view]');
  if (button) selectView(Number(button.dataset.view), true);
});
byId('walkthrough-steps').addEventListener('keydown', event => {
  const next = arrowIndex(event, state.viewIndex, state.example.views.length);
  if (next === null) return;
  event.preventDefault(); selectView(next, true);
});
byId('walkthrough-prev').addEventListener('click', () => selectView(state.viewIndex - 1));
byId('walkthrough-next').addEventListener('click', () => { stop(); state.next(); render(); });
byId('walkthrough-reset').addEventListener('click', () => { stop(); state.reset(); render(); });
byId('walkthrough-play').addEventListener('click', () => {
  if (state.playing) stop();
  else { document.dispatchEvent(new CustomEvent('gamepilot:focus-demo', { detail: 'walkthrough' })); state.start(); document.querySelectorAll('video:not([data-background-video])').forEach(video => video.pause()); }
  render(); schedule();
});
byId('walkthrough-image-button').addEventListener('click', stop);
document.querySelectorAll('video:not([data-background-video])').forEach(video => video.addEventListener('play', stop));
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
document.addEventListener('gamepilot:focus-demo', event => { if (event.detail !== 'walkthrough') stop(); });
window.addEventListener('pagehide', stop);
render();
