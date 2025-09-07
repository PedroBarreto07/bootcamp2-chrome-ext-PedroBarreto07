// Service Worker (MV3) — controla o estado do Pomodoro via chrome.alarms + chrome.storage.

const DEFAULTS = { workMinutes: 25, breakMinutes: 5, phase: 'ocioso', endAt: null, minuteAlarm: null };

async function getState() {
  const st = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return Object.assign({}, DEFAULTS, st);
}

async function setState(partial) {
  await chrome.storage.local.set(partial);
  return getState();
}

function mins(n) { return n * 60 * 1000; }

async function updateBadge(remainingMs, phase) {
  const minutes = Math.ceil(Math.max(0, remainingMs) / 60000);
  const text = minutes > 0 ? String(minutes) : '';
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: phase === 'foco' ? '#f97316' : '#16a34a' });
}

async function scheduleMinuteTick() {
  await chrome.alarms.create('focusfox-minute', { periodInMinutes: 1 });
}

async function clearMinuteTick() {
  await chrome.alarms.clear('focusfox-minute');
}

chrome.runtime.onInstalled.addListener(async () => {
  await setState(DEFAULTS);
  console.log('FocusFox instalado');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    const state = await getState();
    if (msg.type === 'FOCUSFOX_START') {
      const duration = state.phase === 'pausado' && state.endAt
        ? Math.max(0, state.endAt - Date.now())
        : mins(state.workMinutes);
      const endAt = Date.now() + duration;
      await setState({ phase: 'foco', endAt });
      await chrome.alarms.create('focusfox-finish', { when: endAt });
      await scheduleMinuteTick();
      await updateBadge(duration, 'foco');
      sendResponse({ ok: true, msg: 'Foco iniciado' });
    } else if (msg.type === 'FOCUSFOX_PAUSE') {
      const remaining = Math.max(0, (state.endAt ?? Date.now()) - Date.now());
      await setState({ phase: 'pausado', endAt: Date.now() + remaining });
      await chrome.alarms.clear('focusfox-finish');
      await clearMinuteTick();
      await updateBadge(remaining, 'pausado');
      sendResponse({ ok: true, msg: 'Pausado' });
    } else if (msg.type === 'FOCUSFOX_RESET') {
      await setState({ phase: 'ocioso', endAt: null });
      await chrome.alarms.clearAll();
      await chrome.action.setBadgeText({ text: '' });
      sendResponse({ ok: true, msg: 'Resetado' });
    } else if (msg.type === 'FOCUSFOX_GET_STATE') {
      sendResponse(await getState());
    }
  })();
  return true; // manter sendResponse assíncrono
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const state = await getState();
  if (alarm.name === 'focusfox-finish') {
    // alterna para descanso
    const endAt = Date.now() + mins(state.breakMinutes);
    await setState({ phase: 'descanso', endAt });
    await chrome.alarms.create('focusfox-finish', { when: endAt });
    await scheduleMinuteTick();
    await updateBadge(mins(state.breakMinutes), 'descanso');
    chrome.notifications?.create?.('focusfox', {
      type: 'basic',
      iconUrl: '../../icons/icon128.png',
      title: 'FocusFox',
      message: 'Hora do descanso!'
    });
  } else if (alarm.name === 'focusfox-minute') {
    const remaining = Math.max(0, (state.endAt ?? Date.now()) - Date.now());
    await updateBadge(remaining, state.phase);
  }
});
