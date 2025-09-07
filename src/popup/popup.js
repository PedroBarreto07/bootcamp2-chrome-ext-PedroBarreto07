// Comunica com o service worker para controlar o timer.
// O service worker guarda o estado (fase, endAt) e dispara alarms.

const timeEl = document.getElementById('time');
const phaseEl = document.getElementById('phase');
const statusEl = document.getElementById('status');

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

let rafId = null;

function fmt(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function getState() {
  return await chrome.runtime.sendMessage({ type: 'FOCUSFOX_GET_STATE' });
}

async function send(type) {
  const res = await chrome.runtime.sendMessage({ type });
  if (res && res.ok) {
    statusEl.textContent = res.msg ?? '';
    render();
  }
}

function renderLoop(state) {
  cancelAnimationFrame(rafId);
  function tick() {
    const now = Date.now();
    const remaining = (state.endAt ?? now) - now;
    timeEl.textContent = fmt(remaining);
    rafId = requestAnimationFrame(tick);
  }
  tick();
}

async function render() {
  const state = await getState();
  phaseEl.textContent = state.phase;
  if (state.phase === 'ocioso' || state.endAt == null) {
    timeEl.textContent = fmt((state.workMinutes ?? 25) * 60 * 1000);
    cancelAnimationFrame(rafId);
  } else {
    renderLoop(state);
  }
}

startBtn.addEventListener('click', () => send('FOCUSFOX_START'));
pauseBtn.addEventListener('click', () => send('FOCUSFOX_PAUSE'));
resetBtn.addEventListener('click', () => send('FOCUSFOX_RESET'));

render();
