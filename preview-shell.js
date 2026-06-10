// Renderer for the in-app preview window. Drives the <webview> that hosts the user's
// page/app and wires the slim toolbar (back · forward · reload · open-in-browser).
const params = new URLSearchParams(location.search);
const target = params.get('url') || 'about:blank';
const name = params.get('name') || 'Preview';

const view = document.getElementById('view');
const urlEl = document.getElementById('url');
document.getElementById('name').textContent = name;
document.title = name + ' — Preview';
view.setAttribute('src', target);

view.addEventListener('did-navigate', (e) => { urlEl.textContent = e.url || ''; });
view.addEventListener('did-navigate-in-page', (e) => { urlEl.textContent = e.url || ''; });
view.addEventListener('page-title-updated', (e) => { if (e.title) document.title = e.title + ' — Preview'; });

document.getElementById('reload').addEventListener('click', () => view.reload());
document.getElementById('back').addEventListener('click', () => { if (view.canGoBack()) view.goBack(); });
document.getElementById('fwd').addEventListener('click', () => { if (view.canGoForward()) view.goForward(); });
document.getElementById('pop').addEventListener('click', () => {
  const url = (view.getURL && view.getURL()) || target;
  if (window.previewBridge) window.previewBridge.openExternal(url);
});

// re-launching a project while its window is open navigates the existing webview
if (window.previewBridge && window.previewBridge.onNavigate) {
  window.previewBridge.onNavigate((url) => { if (url) view.setAttribute('src', url); });
}
