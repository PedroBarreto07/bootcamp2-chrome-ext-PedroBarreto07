// Content script de exemplo: destaca links na devsite do Chrome se o usuário desejar.
// Pega a flag de storage 'highlightEnabled' (default: true).

(async () => {
  const { highlightEnabled = true } = await chrome.storage.local.get('highlightEnabled');
  if (!highlightEnabled) return;
  for (const a of document.querySelectorAll('a[href]')) {
    a.style.outline = '2px solid #f97316'; // laranja
    a.style.borderRadius = '4px';
  }
})();
