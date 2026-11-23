import { RevisionReplay } from './revision-state.mjs';
const data = window.GAMEPILOT_REVISION;
const replay = new RevisionReplay();
const root = document.getElementById('harness-revision');
const get = id => document.getElementById(id);
const text = (id, value) => { get(id).textContent = value; };
const buttons = [...root.querySelectorAll('[data-revision-stage]')];
const scenes = [...root.querySelectorAll('[data-revision-scene]')];
let frame, previousTime;
function controls() {
  root.dataset.playing = String(replay.playing);
  get('revision-replay-progress').value = replay.progress * 100;
  text('revision-play', replay.playing ? 'Ⅱ Pause' : replay.complete ? '↺ Play again' : '▶ Play the case');
  get('revision-play').setAttribute('aria-pressed', String(replay.playing));
  get('revision-prev').disabled = replay.index === 0;
  get('revision-next').disabled = replay.index === data.stages.length - 1;
  text('revision-next', replay.index === data.stages.length - 1 ? 'Final stage' : 'Next stage →');
}
function renderStage() {
  const stage = data.stages[replay.index];
  scenes.forEach((scene, index) => { scene.hidden = index !== replay.index; });
  buttons.forEach((button, index) => {
    if (index === replay.index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
    button.classList.toggle('revision-stage-visited', index < replay.index);
  });
  get('revision-content').dataset.stage = replay.index;
  text('revision-visual-label', ['Recorded cues', 'Observation revision', 'Offline admission', 'Gameplay adoption'][replay.index]);
  text('revision-event-time', `${stage.elapsed} into the run`);
  text('revision-stage-label', `${String(replay.index + 1).padStart(2, '0')} / ${stage.label}`);
  text('revision-stage-title', stage.title);
  text('revision-stage-body', stage.body);
  get('revision-stage-evidence').replaceChildren(...stage.bullets.map(value => {
    const li = document.createElement('li'); li.textContent = value; return li;
  }));
  text('revision-event-name', stage.event);
  text('revision-event-sequence', stage.sequence);
  text('revision-event-elapsed', stage.elapsed);
  text('revision-view-count', `Stage ${replay.index + 1} of ${data.stages.length}`);
  text('revision-announcement', `${stage.label}. ${stage.title} ${stage.body}`);
  controls();
}
function pause() {
  replay.pause(); cancelAnimationFrame(frame); previousTime = undefined; controls();
}
function animate(now) {
  if (!replay.playing) return;
  const old = replay.index;
  replay.tick(previousTime === undefined ? 0 : Math.max(0, now - previousTime));
  previousTime = now;
  if (old !== replay.index) renderStage();
  else controls();
  if (replay.playing) frame = requestAnimationFrame(animate);
  else { previousTime = undefined; text('revision-announcement', 'Case replay complete. Candidate 000001 was selected for windows 5 and 6.'); }
}
function select(index) {
  pause(); replay.select(index); renderStage();
}
buttons.forEach((button, index) => {
  button.addEventListener('click', () => select(index));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next === undefined) return;
    event.preventDefault(); select(next); buttons[next].focus();
  });
});
get('revision-play').addEventListener('click', () => {
  if (replay.playing) { pause(); return; }
  document.dispatchEvent(new CustomEvent('gamepilot:focus-demo', { detail: 'revision' }));
  document.querySelectorAll('video:not([data-background-video])').forEach(video => video.pause());
  replay.play(); previousTime = undefined; renderStage(); frame = requestAnimationFrame(animate);
});
get('revision-restart').addEventListener('click', () => select(0));
get('revision-prev').addEventListener('click', () => select(replay.index - 1));
get('revision-next').addEventListener('click', () => select(replay.index + 1));
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
document.addEventListener('gamepilot:focus-demo', event => { if (event.detail !== 'revision') pause(); });
document.querySelectorAll('video:not([data-background-video])').forEach(video => video.addEventListener('play', pause));
document.querySelectorAll('[data-demo-image], #expand-method').forEach(button => button.addEventListener('click', pause));
window.addEventListener('pagehide', pause);
renderStage();
