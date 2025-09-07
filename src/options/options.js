// Persiste tempos e a flag do content script.
const form = document.getElementById('form');
const work = document.getElementById('work');
const brk = document.getElementById('break');
const highlight = document.getElementById('highlight');
const saved = document.getElementById('saved');

async function load() {
  const { workMinutes = 25, breakMinutes = 5, highlightEnabled = true } = await chrome.storage.local.get(['workMinutes','breakMinutes','highlightEnabled']);
  work.value = workMinutes;
  brk.value = breakMinutes;
  highlight.checked = !!highlightEnabled;
}
async function save(e) {
  e.preventDefault();
  await chrome.storage.local.set({
    workMinutes: Number(work.value),
    breakMinutes: Number(brk.value),
    highlightEnabled: highlight.checked
  });
  saved.textContent = 'Salvo!';
  setTimeout(() => (saved.textContent=''), 1500);
}
form.addEventListener('submit', save);
load();
