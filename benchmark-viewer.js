import { BenchmarkBrowser } from './benchmark-state.mjs';
const state = new BenchmarkBrowser(window.GAMEPILOT_BENCHMARK);
const get = id => document.getElementById(id);
const text = (id, value) => { get(id).textContent = value; };
const video = get('benchmark-video');
const gameButtons = [...document.querySelectorAll('[data-bench-game]')];
const mediaButtons = [...document.querySelectorAll('[data-bench-view]')];
let loadedId = state.selectedId;
let playRequest = 0;
function pause() { playRequest++; video.pause(); }
function announce() {
  const item = state.selected;
  text('bench-announcement', item ? `${state.filtered.length} matching examples. ${item.game}: ${item.title}. ${state.mode} view.` : 'No matching tasks. Clear filters to browse all examples.');
}
function renderMode() {
  const item = state.selected; if (!item) return;
  const recording = state.mode === 'recording';
  const outcomeLabel = item.outcomeLabel || 'Outcome';
  text('bench-tab-outcome', outcomeLabel);
  mediaButtons.forEach(button => {
    const active = button.dataset.benchView === state.mode;
    button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
  });
  get('bench-media').setAttribute('aria-labelledby', `bench-tab-${state.mode}`);
  video.hidden = !recording;
  get('bench-image-button').hidden = recording;
  get('bench-replay').disabled = !recording;
  if (!recording) {
    pause();
    const source = state.mode === 'start' ? item.poster : item.outcome;
    const caption = state.mode === 'start' ? `Start frame for ${item.title}.` : item.outcomeTime !== undefined ? `${outcomeLabel} at ${item.outcomeTime.toFixed(2)} seconds: ${item.title}.` : item.completion;
    get('bench-frame').src = source; get('bench-frame').alt = caption;
    const button = get('bench-image-button');
    button.dataset.demoImage = source;
    button.dataset.demoTitle = `${item.title} · ${state.mode === 'start' ? 'Start frame' : outcomeLabel}`;
    button.setAttribute('aria-label', `Enlarge ${state.mode} frame: ${item.title}`);
  }
  get('bench-media-error').hidden = !recording || !video.error;
}
function renderCase() {
  const item = state.selected;
  get('bench-viewer').hidden = !item; get('bench-empty').hidden = Boolean(item);
  if (!item) { pause(); return; }
  if (item.id !== loadedId) {
    pause(); video.poster = item.poster; video.src = item.video; video.load();
    loadedId = item.id; get('bench-media-error').hidden = true;
  }
  video.setAttribute('aria-label', `${item.title}, reference-player recording`);
  text('bench-task-meta', `${item.game} / ${item.ability}`);
  text('bench-task-title', item.title);
  text('bench-duration', `${item.duration.toFixed(2).replace(/0$/, '')} s · 1× speed`);
  const paired = Boolean(item.instructions.atomic && item.instructions.basic);
  get('bench-instructions').classList.toggle('bench-instructions-single', !paired);
  get('bench-basic-block').hidden = !paired;
  text('bench-instruction-title', paired ? 'Two ways to specify the same task' : ['editorial_clip_summary', 'visual_audit_clip_summary'].includes(item.descriptionSource) ? 'Clip description' : 'Task demonstration');
  text('bench-instruction-subtitle', paired ? 'Shared completion criterion' : 'Reference-player actions');
  const firstLabel = get('bench-instructions').querySelector('.atomic > span');
  firstLabel.replaceChildren(document.createTextNode(paired ? 'Atomic ' : ['editorial_clip_summary', 'visual_audit_clip_summary'].includes(item.descriptionSource) ? 'Recorded sequence ' : 'Task '));
  if (paired) { const small = document.createElement('small'); small.textContent = 'Visual or procedural cues'; firstLabel.append(small); }
  text('bench-atomic', paired ? item.instructions.atomic : item.description);
  text('bench-basic', paired ? item.instructions.basic : '');
  text('bench-completion', item.completion);
  get('bench-completion').previousElementSibling.textContent = item.completionLabel || 'Completion criterion';
  text('bench-show-outcome', item.outcomeLabel ? 'Inspect later frame ↗' : 'Inspect outcome ↗');
  text('bench-position', `Example ${state.index + 1} of ${state.filtered.length}`);
  get('bench-prev').disabled = state.index <= 0;
  get('bench-next').disabled = state.index >= state.filtered.length - 1;
  renderMode();
}
function renderLibrary() {
  text('bench-total', state.cases.length);
  text('bench-game-total', new Set(state.cases.map(item => item.game)).size);
  gameButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.benchGame === state.game));
    const game = button.dataset.benchGame;
    const count = game === 'all' ? state.cases.length : state.cases.filter(item => item.game === game).length;
    const badge = document.createElement('span'); badge.className = 'bench-game-count'; badge.textContent = count;
    button.replaceChildren(document.createTextNode(game === 'all' ? 'All games ' : game + ' '), badge);
  });
  get('bench-clear').hidden = !state.hasFilters;
  text('bench-count', `${state.filtered.length} example${state.filtered.length === 1 ? '' : 's'}`);
  const list = state.filtered.map(item => {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.benchTask = item.id;
    button.setAttribute('aria-pressed', String(item.id === state.selectedId));
    button.className = 'bench-task';
    const img = document.createElement('img'); img.src = item.poster; img.alt = ''; img.loading = 'lazy'; img.width = 96; img.height = 54;
    const body = document.createElement('span'); body.className = 'bench-task-copy';
    const meta = document.createElement('small'); meta.textContent = item.game;
    const title = document.createElement('b'); title.textContent = item.title;
    const ability = document.createElement('em'); ability.textContent = item.ability;
    body.append(meta, title, ability); button.append(img, body); return button;
  });
  get('bench-task-list').replaceChildren(...list);
  const picker = get('bench-task-select');
  picker.replaceChildren(...state.filtered.map(item => {
    const option = document.createElement('option');
    option.value = item.id; option.textContent = `${item.game} · ${item.title}`;
    return option;
  }));
  picker.disabled = state.filtered.length === 0;
  if (state.selectedId) picker.value = state.selectedId;
}
function render() { renderLibrary(); renderCase(); announce(); }
function choose(id, focus = false) {
  if (!state.select(id)) return;
  pause(); render();
  if (focus) get('bench-task-list').querySelector(`[data-bench-task="${id}"]`).focus();
}
gameButtons.forEach(button => button.addEventListener('click', () => { pause(); state.filter({ game: button.dataset.benchGame }); render(); }));
get('bench-task-select').addEventListener('change', event => choose(event.target.value));
get('bench-ability').addEventListener('change', event => { pause(); state.filter({ ability: event.target.value }); render(); });
get('bench-search').addEventListener('input', event => { pause(); state.filter({ query: event.target.value }); render(); });
function clear() { pause(); state.clear(); get('bench-search').value = ''; get('bench-ability').value = 'all'; render(); }
get('bench-clear').addEventListener('click', clear);
get('bench-empty-clear').addEventListener('click', () => { clear(); get('bench-search').focus(); });
get('bench-task-list').addEventListener('click', event => {
  const button = event.target.closest('[data-bench-task]'); if (button) choose(button.dataset.benchTask);
});
get('bench-task-list').addEventListener('keydown', event => {
  const button = event.target.closest('[data-bench-task]'); if (!button) return;
  const index = state.filtered.findIndex(item => item.id === button.dataset.benchTask);
  let next;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = Math.min(index + 1, state.filtered.length - 1);
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = Math.max(index - 1, 0);
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = state.filtered.length - 1;
  if (next === undefined) return;
  event.preventDefault(); choose(state.filtered[next].id, true);
});
function mode(value, focus = false) {
  state.setMode(value); renderMode(); announce();
  if (focus) get(`bench-tab-${value}`).focus();
}
mediaButtons.forEach((button, index) => {
  button.addEventListener('click', () => mode(button.dataset.benchView));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % mediaButtons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + mediaButtons.length) % mediaButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = mediaButtons.length - 1;
    if (next === undefined) return;
    event.preventDefault(); mode(mediaButtons[next].dataset.benchView, true);
  });
});
get('bench-show-outcome').addEventListener('click', () => mode('outcome', true));
get('bench-prev').addEventListener('click', () => { pause(); state.move(-1); render(); });
get('bench-next').addEventListener('click', () => { pause(); state.move(1); render(); });
get('bench-replay').addEventListener('click', async () => {
  if (!state.selected) return;
  mode('recording'); const request = ++playRequest;
  video.currentTime = 0;
  try { await video.play(); if (request !== playRequest) video.pause(); }
  catch { if (request === playRequest && video.error) get('bench-media-error').hidden = false; }
});
video.addEventListener('play', () => {
  document.dispatchEvent(new CustomEvent('gamepilot:focus-demo', { detail: 'benchmark' }));
  document.querySelectorAll('video:not([data-background-video])').forEach(other => { if (other !== video) other.pause(); });
});
video.addEventListener('error', () => { if (state.mode === 'recording') get('bench-media-error').hidden = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
document.addEventListener('gamepilot:focus-demo', event => { if (event.detail !== 'benchmark') pause(); });
window.addEventListener('pagehide', pause);
render();
